/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef } from 'react'
import styles from './scss/ModalEditProduct.module.scss'

export function ModalEditProduct({ isVisible, onClose, product }) {
  if (!isVisible || !product) return null;

  const fileInputRef = useRef(null)
  const [fileNames, setFileNames] = useState([]);

  const [formData, setFormData] = useState({
    name: product.name || "",
    calories: product.calories?.toString() || "0",
    proteins: product.proteins?.toString() || "0",
    fats: product.fats?.toString() || "0",
    carbohydrates: product.carbohydrates?.toString() || "0",
    ingredients: product.ingredients || "",
    category: product.category?.toString() ?? "0",
    cookingNecessity: product.cookingNecessity ?? 0,
    flags: product.flags && product.flags !== 0 ? [product.flags] : [],
    images: product.images && product.images.length > 0
      ? product.images.map(img => ({
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
    category: ""
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
    const categoryRegex = /^[0-8]$/;

    if (['calories', 'proteins', 'fats', 'carbohydrates'].includes(name)) {
      if (value === "") return "This field is required";

      if (isNaN(value)) return "Only numbers are allowed";

      if (!strictNumberRegex.test(value)) {
        return "Leading zeros are not allowed (e.g. use 92 instead of 092)";
      }
      if (parseFloat(value) < 0) return "Value cannot be negative";
    }

    if (name === 'category') {
      if (value === "") return "Category is required";
      if (!categoryRegex.test(value)) return "Category must be a single digit from 0 to 8";
    }

    return "";
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

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
      finalValue = value !== "" && !isNaN(value) ? parseInt(value, 10) : value;
    }

    setFormData(prev => ({ ...prev, [fieldName]: finalValue }));
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
  };


  const handleSubmit = async () => {
    const newErrors = {
      calories: validateField('calories', formData.calories.toString()),
      proteins: validateField('proteins', formData.proteins.toString()),
      fats: validateField('fats', formData.fats.toString()),
      carbohydrates: validateField('carbohydrates', formData.carbohydrates.toString()),
      category: validateField('category', formData.category.toString())
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      alert("Please fix validation errors before saving.");
      return;
    }

    const payload = {
      name: formData.name,
      ingredients: formData.ingredients,
      calories: parseFloat(formData.calories),
      proteins: parseFloat(formData.proteins),
      fats: parseFloat(formData.fats),
      carbohydrates: parseFloat(formData.carbohydrates),
      category: parseInt(formData.category, 10),
      cookingNecessity: formData.cookingNecessity,
      flags: formData.flags && formData.flags.length > 0 ? parseInt(formData.flags[0], 10) : 0,
      images: formData.images
    };

    // const firstFlag = formData.flags.length > 0 ? formData.flags[0] : 0;
    // const firstFlag = formData.flags.length > 0 ? formData.flags[0] : 0;
    const firstFlag = formData.flags.length > 0 ? parseInt(formData.flags[0], 10) : 0;

    try {
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
                    <label htmlFor="exampleInput1">Product name</label>
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
                    <label htmlFor="exampleInput7">Category</label>
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
                  {/* <div id={styles.checkInput} className="form-check col-lg-12">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={formData.cookingNecessity === 1} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="exampleCheck1">Needs cooking</label>
                  </div> */}
                  <div id={styles.checkInput} className="row col-lg-12 my-3">
                    <label className="d-block mb-2" style={{ fontWeight: 'bold' }}>Cooking Necessity:</label>
                    <br />
                    <br />
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
