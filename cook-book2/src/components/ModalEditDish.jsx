/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'
import styles from './scss/ModalEditDish.module.scss'
import { calculateDishMacros } from '../utils/dishCalculator';

export function ModalEditDish({ isVisible, onClose, dish }) {
    const DISH_MACROS_MAP = {
        "десерт": 0,
        "первое": 1,
        "второе": 2,
        "напиток": 3,
        "салат": 4,
        "суп": 5,
        "закуска": 6
    };

    const fileInputRef = useRef(null);
    const [fileNames, setFileNames] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");

    const [errors, setErrors] = useState({
        calories: "", proteins: "", fats: "", carbohydrates: "", portionSize: "", category: "", ingredients: ""
    });

    const [chosenIngredients, setChosenIngredients] = useState(() => {
        if (!dish || !dish.ingredients) return [];
        return dish.ingredients.map(i => ({
            productId: i.productId,
            name: i.productName || "Product",
            amount: parseFloat(i.amount) || 0
        }));
    });

    const [formData, setFormData] = useState(() => {
        if (!dish) return {
            name: "", calories: "0", proteins: "0", fats: "0", carbohydrates: "0",
            portionSize: "0", category: "0", flags: [], ingredients: [], images: []
        };

        const caloriesVal = dish.calories ?? dish.Calories ?? "0";
        const proteinsVal = dish.proteins ?? dish.Proteins ?? "0";
        const fatsVal = dish.fats ?? dish.Fats ?? "0";
        const carbsVal = dish.carbohydrates ?? dish.Carbohydrates ?? "0";
        const portionVal = dish.portionSize ?? dish.PortionSize ?? "0";
        const categoryVal = dish.category ?? dish.Category ?? "0";

        const serverFlags = dish.flags || dish.Flags || [];
        const safeFlags = Array.isArray(serverFlags) ? serverFlags.map(f => parseInt(f, 10)).filter(f => !isNaN(f)) : [];

        return {
            name: dish.name || dish.Name || "",
            calories: caloriesVal.toString(),
            proteins: proteinsVal.toString(),
            fats: fatsVal.toString(),
            carbohydrates: carbsVal.toString(),
            portionSize: portionVal.toString(),
            category: categoryVal.toString(),
            flags: safeFlags,
            ingredients: dish.ingredients ? dish.ingredients.map(i => ({ productId: i.productId, amount: i.amount })) : [],
            images: dish.images && dish.images.length > 0
                ? dish.images.map(img => ({
                    base64Data: img.base64Data || img.data || "",
                    contentType: img.contentType || "image/jpeg"
                }))
                : []
        };
    });

    const filteredProducts = searchQuery.length >= 2
        ? allProducts.filter(p => p.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
        : [];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length >= 2) {
            const nextFiltered = allProducts.filter(p => p.name.toLowerCase().startsWith(value.toLowerCase()));
            if (nextFiltered.length > 0) {
                setSelectedProductId(nextFiltered[0].id);
            } else {
                setSelectedProductId("");
            }
        } else {
            setSelectedProductId("");
        }
    };

    const recalculateMacros = (ingredientsList, productsSnapshot = null) => {
        const targetProductsList = productsSnapshot || allProducts;
        if (!targetProductsList || targetProductsList.length === 0) return;

        if (!ingredientsList || ingredientsList.length === 0) {
            setFormData(prev => ({ ...prev, calories: "0", proteins: "0", fats: "0", carbohydrates: "0" }));
            return;
        }

        const calculatedResult = calculateDishMacros(ingredientsList, targetProductsList);

        setFormData(prev => ({
            ...prev,
            ...calculatedResult
        }));

        setErrors(prev => ({ ...prev, calories: "", proteins: "", fats: "", carbohydrates: "" }));
    };

    useEffect(() => {
        fetch('http://localhost:5254/api/product')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
                if (chosenIngredients && chosenIngredients.length > 0) {
                    recalculateMacros(chosenIngredients, data);
                }
            })
            .catch(err => console.error("Failed to load products:", err));
    }, []);

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newNames = files.map(f => f.name);
            setFileNames(prev => [...prev, ...newNames]);
            try {
                const uploadPromises = files.map(async (file) => {
                    const base64 = await toBase64(file);
                    return { base64Data: base64, contentType: file.type };
                });
                const newMappedImages = await Promise.all(uploadPromises);
                setFormData(prev => ({ ...prev, images: [...prev.images, ...newMappedImages] }));
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
            if (!strictNumberRegex.test(value.toString())) return "Enter a valid decimal number without leading zeros (e.g. 10, 5.5)";
            if (parseFloat(value) < 0) return "Value cannot be negative";
        }

        if (name === 'category') {
            if (value === "") return "Category is required";
            if (!categoryRegex.test(value.toString())) return "Category must be a single digit from 0 to 6";
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
    };

    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (!selectedProductId) {
            alert("Please select a product first!");
            return;
        }
        const amountInput = prompt("Enter amount in grams:", "100");
        const amountNum = parseFloat(amountInput);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert("Please enter a valid amount greater than 0!");
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
            const currentFlags = prev.flags || [];
            const numericFlag = Number(flagValue);
            const isAlreadySelected = currentFlags.includes(numericFlag);
            const nextFlags = isAlreadySelected
                ? currentFlags.filter(f => f !== numericFlag)
                : [...currentFlags, numericFlag];
            return { ...prev, flags: nextFlags };
        });
    };

    const handleClearFlags = () => {
        setFormData(prev => ({ ...prev, flags: [] }));
    };

    const parseNameAndCategory = (rawName, defaultCategory) => {
        if (!rawName) return { cleanName: "", categoryId: defaultCategory === "" ? null : parseInt(defaultCategory, 10) };

        const macroRegex = /!([а-яА-Яa-zA-Z0-9_]+)/g;
        const matches = [...rawName.matchAll(macroRegex)];

        if (matches.length === 0) {
            return { cleanName: rawName.trim(), categoryId: defaultCategory === "" ? null : parseInt(defaultCategory, 10) };
        }

        const firstMacroWord = matches[0][1].toLowerCase();
        let categoryId = DISH_MACROS_MAP[firstMacroWord];

        if (categoryId === undefined) {
            categoryId = defaultCategory === "" ? null : parseInt(defaultCategory, 10);
        }

        const cleanName = rawName.replace(macroRegex, "").replace(/\s+/g, ' ').trim();
        return { cleanName, categoryId };
    };

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
            alert("Please fix validation errors before submitting.");
            return;
        }

        const { cleanName, categoryId } = parseNameAndCategory(formData.name, formData.category);

        const payload = {
            name: cleanName,
            calories: parseFloat(formData.calories) || 0,
            proteins: parseFloat(formData.proteins) || 0,
            fats: parseFloat(formData.fats) || 0,
            carbohydrates: parseFloat(formData.carbohydrates) || 0,
            portionSize: parseFloat(formData.portionSize) || 0,
            category: categoryId,
            flags: Array.isArray(formData.flags) ? formData.flags.map(f => parseInt(f, 10)) : [],
            ingredients: formData.ingredients,
            images: Array.isArray(formData.images) ? formData.images.filter(img => img.base64Data && img.base64Data !== "") : []
        };

        try {
            const response = await fetch(`http://localhost:5254/api/dish/${dish.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Dish updated successfully!");
                onClose();
            } else {
                alert("Error: " + await response.text());
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Сервер недоступен! Не удалось обновить блюдо.");
        }
    };

    if (!isVisible || !dish) return null;

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
                                        <label htmlFor="exampleInputEmail1">Dish name</label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" value={formData.name} onChange={handleInputChange} required />
                                    </div>

                                    <div id={styles.selectSearch} className="form-group col-lg-9">
                                        <label htmlFor="exampleInput2">Ingredients</label>
                                        <input placeholder="Type 2+ letters to search..." type="text" className="form-control" id="exampleInput2" value={searchQuery} onChange={handleSearchChange} />
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
                                        <input type="text" className="form-control" id="exampleInput3" value={formData.calories} onChange={handleInputChange} />
                                        {errors.calories && <small style={errorStyle}>{errors.calories}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput4">Proteins</label>
                                        <input type="text" className="form-control" id="exampleInput4" value={formData.proteins} onChange={handleInputChange} />
                                        {errors.proteins && <small style={errorStyle}>{errors.proteins}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput5">Fats</label>
                                        <input type="text" className="form-control" id="exampleInput5" value={formData.fats} onChange={handleInputChange} />
                                        {errors.fats && <small style={errorStyle}>{errors.fats}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput6">Carbs.</label>
                                        <input type="text" className="form-control" id="exampleInput6" value={formData.carbohydrates} onChange={handleInputChange} />
                                        {errors.carbohydrates && <small style={errorStyle}>{errors.carbohydrates}</small>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="brow2_input">Category</label>
                                        <input value={formData.category} placeholder="Category ID (0-6)" type="text" className="form-control" id="brow2_input" list="brow2" onChange={handleInputChange} />
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
                                        <input type="text" className="form-control" id="exampleInputPortion" value={formData.portionSize} onChange={handleInputChange} />
                                        {errors.portionSize && <small style={errorStyle}>{errors.portionSize}</small>}
                                    </div>

                                    <div className={`${styles.flagsField} col-lg-12 row my-2`}>
                                        <div className={`${styles.flagCard} col-lg-3`} style={formData.flags.includes(1) ? activeFlagStyle : {}} onClick={() => handleFlagSelect(1)}>#vegan</div>
                                        <div className={`${styles.flagCard} col-lg-3`} style={formData.flags.includes(2) ? activeFlagStyle : {}} onClick={() => handleFlagSelect(2)}>#glutenFree</div>
                                        <div className={`${styles.flagCard} col-lg-3`} style={formData.flags.includes(3) ? activeFlagStyle : {}} onClick={() => handleFlagSelect(3)}>#sugarFree</div>
                                        <div className={`${styles.flagClear} col-lg-3`} onClick={handleClearFlags}>Clear</div>
                                    </div>

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
