/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef, useEffect } from 'react'
import styles from './scss/ModalEditDish.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'

export function ModalEditDish({ isVisible, onClose, dish }) {
    if (!isVisible || !dish) return null;

    const fileInputRef = useRef(null)
    const [fileNames, setFileNames] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");

    const [chosenIngredients, setChosenIngredients] = useState(
        dish.ingredients ? dish.ingredients.map(i => ({
            productId: i.productId,
            name: i.productName || "Product",
            amount: i.amount
        })) : []
    );

    const [formData, setFormData] = useState({
        name: dish.name || "",
        calories: dish.calories?.toString() || "0",
        proteins: dish.proteins?.toString() || "0",
        fats: dish.fats?.toString() || "0",
        carbohydrates: dish.carbohydrates?.toString() || "0",
        portionSize: dish.portionSize?.toString() || "0",
        category: dish.category?.toString() ?? "0",
        flags: dish.flags && dish.flags !== 0 ? [dish.flags] : [],
        ingredients: dish.ingredients ? dish.ingredients.map(i => ({
            productId: i.productId,
            amount: i.amount
        })) : [],
        images: dish.images && dish.images.length > 0
            ? dish.images.map(img => ({
                base64Data: img.base64Data,
                contentType: img.contentType
            }))
            : []
    });

    const [errors, setErrors] = useState({
        calories: "",
        proteins: "",
        fats: "",
        carbohydrates: "",
        portionSize: "",
        category: "",
        ingredients: ""
    });

    useEffect(() => {
        fetch('http://localhost:5254/api/product')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);

                if (chosenIngredients && chosenIngredients.length > 0) {
                    recalculateMacros(chosenIngredients, null, data);
                }
            })
            .catch(err => console.error("Failed to load products:", err));
    }, [dish]);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
            if (filtered.length > 0) setSelectedProductId(filtered[0].id);
        } else {
            setFilteredProducts([]);
            setSelectedProductId("");
        }
    }, [searchQuery, allProducts]);

    const recalculateMacros = (ingredientsList, forcedPortion = null, productsSnapshot = null) => {
        let totalCalories = 0;
        let totalProteins = 0;
        let totalFats = 0;
        let totalCarbohydrates = 0;
        let totalDishWeight = 0;

        const targetProductsList = productsSnapshot || allProducts;

        if (!ingredientsList || ingredientsList.length === 0 || targetProductsList.length === 0) {
            setFormData(prev => ({
                ...prev,
                calories: "0", proteins: "0", fats: "0", carbohydrates: "0"
            }));
            return;
        }

        ingredientsList.forEach(item => {
            const origProduct = allProducts.find(p => p.id === item.productId);
            if (origProduct) {
                totalDishWeight += item.amount;

                totalCalories += (origProduct.calories * item.amount) / 100;
                totalProteins += (origProduct.proteins * item.amount) / 100;
                totalFats += (origProduct.fats * item.amount) / 100;
                totalCarbohydrates += (origProduct.carbohydrates * item.amount) / 100;
            }
        });

        // const currentPortion = parseFloat(formData.portionSize) || 0;
        const currentPortion = forcedPortion !== null ? forcedPortion : (parseFloat(formData.portionSize) || 0);

        if (totalDishWeight > 0 && currentPortion > 0) {
            totalCalories = (totalCalories / totalDishWeight) * currentPortion;
            totalProteins = (totalProteins / totalDishWeight) * currentPortion;
            totalFats = (totalFats / totalDishWeight) * currentPortion;
            totalCarbohydrates = (totalCarbohydrates / totalDishWeight) * currentPortion;
        } else {
            totalCalories = 0;
            totalProteins = 0;
            totalFats = 0;
            totalCarbohydrates = 0;
        }

        setFormData(prev => ({
            ...prev,
            calories: (Math.round(totalCalories * 100) / 100).toString(),
            proteins: (Math.round(totalProteins * 100) / 100).toString(),
            fats: (Math.round(totalFats * 100) / 100).toString(),
            carbohydrates: (Math.round(totalCarbohydrates * 100) / 100).toString()
        }));

        setErrors(prev => ({
            ...prev,
            calories: "", proteins: "", fats: "", carbohydrates: ""
        }));
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(','));
        reader.onerror = (error) => reject(error);
    });

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newNames = files.map(f => f.name);
            setFileNames(newNames);

            try {
                const uploadPromises = files.map(async (file) => {
                    const base64 = await toBase64(file);
                    return { base64Data: base64, contentType: file.type };
                });

                const newMappedImages = await Promise.all(uploadPromises);
                setFormData(prev => ({
                    ...prev,
                    images: newMappedImages
                }));
                event.target.value = "";
            } catch (error) {
                console.error("Error processing files:", error);
            }
        }
    };

    const validateField = (name, value) => {
        const strictNumberRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
        const categoryRegex = /^[0-6]$/;

        if (['calories', 'proteins', 'fats', 'carbohydrates', 'portionSize'].includes(name)) {
            if (value === "") return "This field is required";
            if (isNaN(value)) return "Only numbers are allowed";
            if (!strictNumberRegex.test(value)) return "Leading zeros are not allowed";
            if (parseFloat(value) < 0) return "Value cannot be negative";
        }

        if (name === 'category') {
            if (value === "") return "Category is required";
            if (!categoryRegex.test(value)) return "Category must be a single digit from 0 to 8";
        }

        return "";
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        const fieldMap = {
            'exampleInputEmail1': 'name',
            'exampleInput3': 'calories',
            'exampleInput4': 'proteins',
            'exampleInput5': 'fats',
            'exampleInput6': 'carbohydrates',
            'brow2_input': 'category',
            'exampleInputPortion': 'portionSize'
        };

        const fieldName = fieldMap[id] || id;

        if (['calories', 'proteins', 'fats', 'carbohydrates', 'portionSize', 'category'].includes(fieldName)) {
            const errorMsg = validateField(fieldName, value);
            setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
        }

        setFormData(prev => ({ ...prev, [fieldName]: value }));

        if (fieldName === 'portionSize') {
            const parsedPortion = parseFloat(value) || 0;
            recalculateMacros(chosenIngredients, parsedPortion);
        }
    };

    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (!selectedProductId) {
            alert("Please select a product first!");
            return;
        }

        const amountInput = prompt("Enter amount in grams:", "100");
        const amountNum = parseFloat(amountInput);

        if (isNaN(amountNum) || amountNum <= 0 || !/^(0|[1-9]\d*)(\.\d+)?$/.test(amountInput)) {
            alert("Please enter a valid amount greater than 0 without leading zeros!");
            return;
        }

        if (chosenIngredients.some(i => i.productId === selectedProductId)) {
            alert("This ingredient is already added!");
            return;
        }

        const targetProduct = allProducts.find(p => p.id === selectedProductId);
        const newIngredient = {
            productId: selectedProductId,
            name: targetProduct ? targetProduct.name : "Unknown product",
            amount: amountNum
        };

        const updatedIngredients = [...chosenIngredients, newIngredient];
        setChosenIngredients(updatedIngredients);
        setFormData(prev => ({
            ...prev,
            ingredients: updatedIngredients.map(i => ({ productId: i.productId, amount: i.amount }))
        }));

        recalculateMacros(updatedIngredients);

        setSearchQuery("");
        setErrors(prev => ({ ...prev, ingredients: "" }));
    };

    const handleRemoveIngredient = (productId) => {
        const updatedIngredients = chosenIngredients.filter(i => i.productId !== productId);
        setChosenIngredients(updatedIngredients);
        setFormData(prev => ({
            ...prev,
            ingredients: updatedIngredients.map(i => ({ productId: i.productId, amount: i.amount }))
        }));

        recalculateMacros(updatedIngredients);
    };

    const handleFlagSelect = (flagValue) => {
        setFormData(prev => {
            const currentFlags = prev.flags;
            const isAlreadySelected = currentFlags.includes(flagValue);
            const nextFlags = isAlreadySelected
                ? currentFlags.filter(f => f !== flagValue)
                : [...currentFlags, flagValue];
            return { ...prev, flags: nextFlags };
        });
    };

    const handleClearFlags = () => {
        setFormData(prev => ({ ...prev, flags: [] }));
    };;

    const handleSubmit = async () => {
        const newErrors = {
            calories: validateField('calories', formData.calories.toString()),
            proteins: validateField('proteins', formData.proteins.toString()),
            fats: validateField('fats', formData.fats.toString()),
            carbohydrates: validateField('carbohydrates', formData.carbohydrates.toString()),
            portionSize: validateField('portionSize', formData.portionSize.toString()),
            category: validateField('category', formData.category.toString()),
            ingredients: formData.ingredients.length === 0 ? "Dish must have at least one ingredient" : ""
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== "")) {
            alert("Please fix validation errors before saving.");
            return;
        }

        const payload = {
            name: formData.name,
            calories: parseFloat(formData.calories),
            proteins: parseFloat(formData.proteins),
            fats: parseFloat(formData.fats),
            carbohydrates: parseFloat(formData.carbohydrates),
            portionSize: parseFloat(formData.portionSize),
            category: parseInt(formData.category, 10),
            flags: formData.flags && formData.flags.length > 0 ? parseInt(formData.flags[0], 10) : 0,
            ingredients: formData.ingredients,
            images: formData.images
        };

        // const firstFlag = formData.flags.length > 0 ? formData.flags[0] : 0;

        // const firstFlag = formData.flags.length > 0 ? formData.flags[0] : 0;

        const firstFlag = formData.flags.length > 0 ? parseInt(formData.flags[0], 10) : 0;

        try {
            const response = await fetch(`http://localhost:5254/api/dish/${dish.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Dish updated successfully!");
                onClose();
            } else if (response.status === 400) {
                const errorJson = await response.json();
                if (errorJson.errors) {
                    let friendlyMessage = "Validation errors occurred:\n";
                    Object.keys(errorJson.errors).forEach(field => {
                        friendlyMessage += `\n• ${field}: ${errorJson.errors[field].join(", ")}`;
                    });
                    alert(friendlyMessage);
                } else {
                    alert("Validation error: " + (errorJson.title || "Invalid data"));
                }
            } else {
                alert(`Server error (${response.status}): ` + await response.text());
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Сервер недоступен! Не удалось обновить блюдо.");
        }
    };

    const errorStyle = { color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' };
    const isFormInvalid = Object.values(errors).some(error => error !== "");
    const activeFlagStyle = { backgroundColor: '#ffc107', color: 'black' };

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit "<span>{dish.name}</span>"</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="container">
                                <div id={styles.formGroups} className="row">
                                    <div className="form-group">
                                        <label htmlFor="exampleInput1">Dish name</label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" value={formData.name} placeholder="e.g. Apple pie" onChange={handleInputChange} required />
                                    </div>

                                    {/* Блок добавления ингредиентов */}
                                    <div id={styles.selectSearch} className="form-group col-lg-9">
                                        <label htmlFor="exampleInput2">Ingredients</label>
                                        <input placeholder="Type 2+ letters to search..." type="text" className="form-control" id="exampleInput2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                        {filteredProducts.length > 0 && (
                                            <select multiple className="form-control mt-2" style={{ height: '90px' }} value={[selectedProductId]} onChange={(e) => setSelectedProductId(e.target.value)}>
                                                {filteredProducts.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <div className="col-lg-3 d-flex align-items-start pt-4">
                                        <button type="button" id={styles.addBtn} className="btn btn-warning w-100" onClick={handleAddIngredient}>Add</button>
                                    </div>

                                    {/* Визуальные плашки ингредиентов */}
                                    <div className={`${styles.flagsField} col-lg-12 row my-2`}>
                                        {chosenIngredients.map(i => (
                                            <div key={i.productId} className={`${styles.ingredientsCard} col-lg-4 d-flex justify-content-between align-items-center`} style={{ backgroundColor: '#5a6268', marginBottom: '5px', marginRight: '5px' }}>
                                                <span>{i.name} ({i.amount}g)</span>
                                                <span style={{ cursor: 'pointer', marginLeft: '8px', fontWeight: 'bold' }} onClick={() => handleRemoveIngredient(i.productId)}>×</span>
                                            </div>
                                        ))}
                                        {errors.ingredients && <small style={errorStyle}>{errors.ingredients}</small>}
                                    </div>

                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput3">Cal.</label>
                                        {/* ДОБАВЛЕН value={formData.calories} */}
                                        <input type="text" className="form-control" id="exampleInput3" value={formData.calories} placeholder="420" onChange={handleInputChange} />
                                        {errors.calories && <small style={errorStyle}>{errors.calories}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput4">Proteins</label>
                                        {/* ДОБАВЛЕН value={formData.proteins} */}
                                        <input type="text" className="form-control" id="exampleInput4" value={formData.proteins} placeholder="8" onChange={handleInputChange} />
                                        {errors.proteins && <small style={errorStyle}>{errors.proteins}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput5">Fats</label>
                                        {/* ДОБАВЛЕН value={formData.fats} */}
                                        <input type="text" className="form-control" id="exampleInput5" value={formData.fats} placeholder="12" onChange={handleInputChange} />
                                        {errors.fats && <small style={errorStyle}>{errors.fats}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput6">Carbs.</label>
                                        {/* ДОБАВЛЕН value={formData.carbohydrates} */}
                                        <input type="text" className="form-control" id="exampleInput6" value={formData.carbohydrates} placeholder="54" onChange={handleInputChange} />
                                        {errors.carbohydrates && <small style={errorStyle}>{errors.carbohydrates}</small>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInput7">Category</label>
                                        <input value={formData.category} placeholder="Category ID (0-8)" type="text" className="form-control" id="brow2_input" list="brow2" onChange={handleInputChange} />
                                        {errors.category && <small style={errorStyle}>{errors.category}</small>}
                                        <datalist id="brow2">
                                            <option value="0">Dessert</option>
                                            <option value="1">FirstCourse</option>
                                            <option value="2">SecondCourse</option>
                                            <option value="3">Drink</option>
                                            <option value="4">Salad</option>
                                            <option value="5">Soup</option>
                                            <option value="6">Snack</option>
                                        </datalist>
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <label htmlFor="exampleInputPortion">Portion, g.</label>
                                        <input type="text" className="form-control" id="exampleInputPortion" value={formData.portionSize} placeholder="120" onChange={handleInputChange} />
                                        {errors.portionSize && <small style={errorStyle}>{errors.portionSize}</small>}
                                    </div>
                                    <br /><br />

                                    <div className={`${styles.flagsField} col-lg-12 row my-2`}>
                                        <div className={`${styles.flagCard} col-lg-3`} style={formData.flags.includes(1) ? activeFlagStyle : {}} onClick={() => handleFlagSelect(1)}>#vegan</div>
                                        <div className={`${styles.flagCard} col-lg-3`} style={formData.flags.includes(2) ? activeFlagStyle : {}} onClick={() => handleFlagSelect(2)}>#glutenFree</div>
                                        <div className={`${styles.flagCard} col-lg-3`} style={formData.flags.includes(3) ? activeFlagStyle : {}} onClick={() => handleFlagSelect(3)}>#sugarFree</div>
                                        <div className={`${styles.flagClear} col-lg-3`} onClick={handleClearFlags}>Clear</div>
                                    </div>

                                    <br /><br />
                                    <div className="col-lg-2">
                                        <img onClick={() => fileInputRef.current.click()} src="../pin.png" alt="upload" style={{ cursor: 'pointer' }} />
                                        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} accept="image/*" multiple />
                                    </div>
                                    <div className="col-lg-10">
                                        <button id={styles.submitBtn} type="button" className="btn btn-warning" onClick={handleSubmit} disabled={isFormInvalid}>Save</button>
                                    </div>
                                    <div className='col-lg-12'>
                                        {fileNames.length > 0 && <p id={styles.fileCaption}>New files selected: {fileNames.join(", ")}</p>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
