/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react'
import styles from './scss/ModalEditProduct.module.scss'

export function ModalEditProduct({ isVisible, onClose, product }) {
    const PRODUCT_MACROS_MAP = {
        "замороженный": 0,
        "мясной": 1,
        "овощи": 2,
        "зелень": 3,
        "специи": 4,
        "крупы": 5,
        "консервы": 6,
        "жидкость": 7,
        "сладости": 8,
    };

    const fileInputRef = useRef(null);
    const [fileNames, setFileNames] = useState([]);
    const [errors, setErrors] = useState({
        calories: "",
        proteins: "",
        fats: "",
        carbohydrates: "",
        category: ""
    });

    const [formData, setFormData] = useState(() => {
        if (!product) return {
            name: "", calories: "0", proteins: "0", fats: "0", carbohydrates: "0",
            ingredients: "", category: "0", cookingNecessity: 0, flags: [], images: []
        };

        const caloriesVal = product.calories ?? product.Calories ?? "0";
        const proteinsVal = product.proteins ?? product.Proteins ?? "0";
        const fatsVal = product.fats ?? product.Fats ?? "0";
        const carbsVal = product.carbohydrates ?? product.Carbohydrates ?? "0";
        const categoryVal = product.category ?? product.Category ?? "0";
        const cookingVal = product.cookingNecessity ?? product.CookingNecessity ?? 0;

        const serverFlags = product.flags || product.Flags || [];
        const safeFlags = Array.isArray(serverFlags)
            ? serverFlags.map(f => parseInt(f, 10)).filter(f => !isNaN(f))
            : [];

        return {
            name: product.name || product.Name || "",
            calories: caloriesVal.toString(),
            proteins: proteinsVal.toString(),
            fats: fatsVal.toString(),
            carbohydrates: carbsVal.toString(),
            ingredients: product.ingredients || product.Ingredients || "",
            category: categoryVal.toString(),
            cookingNecessity: parseInt(cookingVal, 10),
            flags: safeFlags,
            images: product.images && product.images.length > 0 
                ? product.images.map(img => ({ base64Data: img.base64Data, contentType: img.contentType })) 
                : []
        };
    });

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
            setFileNames(newNames);
            try {
                const uploadPromises = files.map(async (file) => {
                    const base64 = await toBase64(file);
                    return { base64Data: base64, contentType: file.type };
                });
                const newMappedImages = await Promise.all(uploadPromises);
                setFormData(prev => ({ ...prev, images: newMappedImages }));
                event.target.value = "";
            } catch (error) {
                console.error("Error processing files:", error);
            }
        }
    };

    const validateField = (name, value) => {
        const strictNumberRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
        const categoryRegex = /^[0-8]$/;
        const stringValue = value !== null && value !== undefined ? value.toString() : "";

        if (['calories', 'proteins', 'fats', 'carbohydrates'].includes(name)) {
            if (stringValue === "") return "This field is required";
            if (isNaN(stringValue)) return "Only numbers are allowed";
            if (!strictNumberRegex.test(stringValue)) {
                return "Leading zeros are not allowed (e.g. use 92 instead of 092)";
            }
            if (parseFloat(stringValue) < 0) return "Value cannot be negative";
        }

        if (name === 'category') {
            if (stringValue === "") return "Category is required";
            if (!categoryRegex.test(stringValue)) return "Category must be a single digit from 0 to 8";
        }

        return "";
    };

    const handleInputChange = (e) => {
        const { id, value, type } = e.target;
        
        const fieldMap = {
            'exampleInputEmail1': 'name',
            'exampleInput2': 'ingredients',
            'exampleInput3': 'calories',
            'exampleInput4': 'proteins',
            'exampleInput5': 'fats',
            'exampleInput6': 'carbohydrates',
            'brow2_input': 'category',
            'exampleCheck1': 'cookingNecessity'
        };

        let fieldName = fieldMap[id] || id;
        let finalValue = value;

        if (['calories', 'proteins', 'fats', 'carbohydrates', 'category'].includes(fieldName)) {
            const errorMsg = validateField(fieldName, value);
            setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
        }

        if (type === 'radio') {
            fieldName = 'cookingNecessity';
            finalValue = parseInt(value, 10);
        } else if (fieldName === 'category') {
            finalValue = value !== "" && !isNaN(value) ? value.toString() : value;
        }

        setFormData(prev => ({ ...prev, [fieldName]: finalValue }));
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
        let categoryId = PRODUCT_MACROS_MAP[firstMacroWord];

        if (categoryId === undefined) {
            categoryId = defaultCategory === "" ? null : parseInt(defaultCategory, 10);
        }

        const cleanName = rawName.replace(macroRegex, "").replace(/\s+/g, ' ').trim();
        return { cleanName, categoryId };
    };

    const handleSubmit = async () => {
        const newErrors = {
            calories: validateField('calories', formData.calories),
            proteins: validateField('proteins', formData.proteins),
            fats: validateField('fats', formData.fats),
            carbohydrates: validateField('carbohydrates', formData.carbohydrates),
            category: validateField('category', formData.category)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== "")) {
            alert("Please fix validation errors before saving.");
            return;
        }

        const { cleanName, categoryId } = parseNameAndCategory(formData.name, formData.category);

        const payload = {
            name: cleanName,
            ingredients: formData.ingredients,
            calories: parseFloat(formData.calories) || 0,
            proteins: parseFloat(formData.proteins) || 0,
            fats: parseFloat(formData.fats) || 0,
            carbohydrates: parseFloat(formData.carbohydrates) || 0,
            category: categoryId,
            cookingNecessity: formData.cookingNecessity,
            flags: Array.isArray(formData.flags) 
                ? formData.flags.map(f => parseInt(f, 10)).filter(f => !isNaN(f)) 
                : [],
            images: formData.images
        };

        try {
            console.log("SENDING PAYLOAD TO SERVER:", JSON.stringify(payload));
            
            const response = await fetch(`http://localhost:5254/api/product/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Product updated successfully!");
                onClose();
            } else {
                alert("Error: " + await response.text());
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Сервер недоступен! Не удалось обновить продукт.");
        }
    };

    const errorStyle = { color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' };
    const isFormInvalid = Object.values(errors).some(error => error !== "");
    const activeFlagStyle = { backgroundColor: '#ffc107', color: 'black' };

    if (!isVisible || !product) return null;

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit "<span>{product.name}</span>"</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="container">
                                <div id={styles.formGroups} className="row">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Product name</label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" value={formData.name} placeholder="e.g. Apples" onChange={handleInputChange} required />
                                    </div>
                                    <div id={styles.selectSearch} className="form-group col-lg-12">
                                        <label htmlFor="exampleInput2">Ingredients</label>
                                        <input value={formData.ingredients || ""} placeholder="Ingredients" type="text" className="form-control" id="exampleInput2" list="brow" onChange={handleInputChange} />
                                        <datalist id="brow">
                                            <option value="Internet Explorer"></option>
                                            <option value="Firefox"></option>
                                            <option value="Chrome"></option>
                                            <option value="Opera"></option>
                                            <option value="Safari"></option>
                                        </datalist>
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput3">Cal.</label>
                                        <input type="text" className="form-control" id="exampleInput3" value={formData.calories} placeholder="420" onChange={handleInputChange} />
                                        {errors.calories && <small style={errorStyle}>{errors.calories}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput4">Proteins</label>
                                        <input type="text" className="form-control" id="exampleInput4" value={formData.proteins} placeholder="8" onChange={handleInputChange} />
                                        {errors.proteins && <small style={errorStyle}>{errors.proteins}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput5">Fats</label>
                                        <input type="text" className="form-control" id="exampleInput5" value={formData.fats} placeholder="12" onChange={handleInputChange} />
                                        {errors.fats && <small style={errorStyle}>{errors.fats}</small>}
                                    </div>
                                    <div className="form-group col-lg-3">
                                        <label htmlFor="exampleInput6">Carbs.</label>
                                        <input type="text" className="form-control" id="exampleInput6" value={formData.carbohydrates} placeholder="54" onChange={handleInputChange} />
                                        {errors.carbohydrates && <small style={errorStyle}>{errors.carbohydrates}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="brow2_input">Category</label>
                                        <input value={formData.category} placeholder="Category ID (0-8)" type="text" className="form-control" id="brow2_input" list="brow2" onChange={handleInputChange} />
                                        {errors.category && <small style={errorStyle}>{errors.category}</small>}
                                        <datalist id="brow2">
                                            <option value="0">Frozen</option>
                                            <option value="1">Meat</option>
                                            <option value="2">Vegetables</option>
                                            <option value="3">Greens</option>
                                            <option value="4">Spices</option>
                                            <option value="5">Cereals</option>
                                            <option value="6">Canned</option>
                                            <option value="7">Liquid</option>
                                            <option value="8">Sweets</option>
                                        </datalist>
                                    </div>

                                    <div id={styles.checkInput} className="row col-lg-12 my-3">
                                        <label className="d-block mb-2" style={{ fontWeight: 'bold' }}>Cooking Necessity:</label>
                                        <div className="form-check form-check-inline me-3" style={{ display: 'inline-block', marginRight: '15px' }}>
                                            <input className="form-check-input" type="radio" name="cookingNecessity" id="editRadioReadyToEat" value="0" checked={formData.cookingNecessity.toString() === "0"} onChange={handleInputChange} />
                                            <label className="form-check-label" htmlFor="editRadioReadyToEat" style={{ marginLeft: '5px' }}>Ready To Eat</label>
                                        </div>
                                        <div className="form-check form-check-inline me-3" style={{ display: 'inline-block', marginRight: '15px' }}>
                                            <input className="form-check-input" type="radio" name="cookingNecessity" id="editRadioSemiFinished" value="1" checked={formData.cookingNecessity.toString() === "1"} onChange={handleInputChange} />
                                            <label className="form-check-label" htmlFor="editRadioSemiFinished" style={{ marginLeft: '5px' }}>Semi Finished</label>
                                        </div>
                                        <div className="form-check form-check-inline" style={{ display: 'inline-block' }}>
                                            <input className="form-check-input" type="radio" name="cookingNecessity" id="editRadioRequiresCooking" value="2" checked={formData.cookingNecessity.toString() === "2"} onChange={handleInputChange} />
                                            <label className="form-check-label" htmlFor="editRadioRequiresCooking" style={{ marginLeft: '5px' }}>Requires Cooking</label>
                                        </div>
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
