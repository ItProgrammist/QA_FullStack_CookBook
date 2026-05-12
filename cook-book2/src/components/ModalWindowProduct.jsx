/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef } from 'react'
import styles from './scss/ModalWindowProduct.module.scss'

export function ModalWindowProduct({ isVisible, onClose }) {
  if (!isVisible) return null;

  const fileInputRef = useRef(null)

  // 1. ИЗМЕНЕНИЕ: Храним массив имен файлов для отображения
  const [fileNames, setFileNames] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    calories: 0,
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    ingredients: "",
    category: 0,
    cookingNecessity: 0,
    flags: 0,
    images: [] // Сюда будет складываться массив объектов { base64Data, contentType }
  });

  const [errors, setErrors] = useState({
    calories: "",
    proteins: "",
    fats: "",
    carbohydrates: "",
    category: ""
  });

  const openDialog = () => {
    fileInputRef.current.click()
  }

  // Функция конвертации ОДНОГО файла в Base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

  // 2. ИЗМЕНЕНИЕ: Обработка МАССИВА файлов через Promise.all
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files); // Превращаем FileList в обычный массив C# style
    if (files.length > 0) {
      // Сохраняем имена всех выбранных файлов через запятую
      setFileNames(files.map(f => f.name));

      try {
        // Читаем все файлы параллельно
        const uploadPromises = files.map(async (file) => {
          const base64 = await toBase64(file);
          return {
            base64Data: base64,
            contentType: file.type
          };
        });

        const mappedImages = await Promise.all(uploadPromises);

        // Записываем весь массив картинок в formData
        setFormData(prev => ({
          ...prev,
          images: mappedImages
        }));
      } catch (error) {
        console.error("Error processing files:", error);
        alert("Failed to process one or more images.");
      }
    }
  };

  const validateField = (name, value) => {
    const strictNumberRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
    const categoryRegex = /^[0-8]$/;

    if (['calories', 'proteins', 'fats', 'carbohydrates'].includes(name)) {
      if (value === "") return "This field is required";
      if (!strictNumberRegex.test(value)) return "Enter a valid decimal number without leading zeros (e.g. 10, 5.5)";
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

    const fieldName = fieldMap[id] || id;

    if (['calories', 'proteins', 'fats', 'carbohydrates', 'category'].includes(fieldName)) {
      const errorMsg = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
    }

    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = checked ? 1 : 0;
    } else if (fieldName === 'category') {
      finalValue = value !== "" && !isNaN(value) ? parseInt(value, 10) : value;
    } else if (['calories', 'proteins', 'fats', 'carbohydrates'].includes(fieldName)) {
      finalValue = value !== "" && !isNaN(value) ? parseFloat(value) : value;
    }

    setFormData(prev => ({ ...prev, [fieldName]: finalValue }));
  };

  const handleFlagSelect = (flagValue) => {
    setFormData(prev => ({ ...prev, flags: flagValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      calories: validateField('calories', formData.calories.toString()),
      proteins: validateField('proteins', formData.proteins.toString()),
      fats: validateField('fats', formData.fats.toString()),
      carbohydrates: validateField('carbohydrates', formData.carbohydrates.toString()),
      category: validateField('category', formData.category.toString())
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5254/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Product added successfully!");
        onClose();
      } else {
        alert("Error: " + await response.text());
      }
    } catch (error) {
      console.error("Connection error:", error);
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
            <h5 className="modal-title">Add a product</h5>
            <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="container">
                <div id={styles.formGroups} className="row">
                  <div className="form-group">
                    <label htmlFor="exampleInput1">Product name</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="e.g. Apples" onChange={handleInputChange} required />
                  </div>
                  <div id={styles.selectSearch} className="form-group col-lg-12">
                    <label htmlFor="exampleInput2">Ingredients</label>
                    <input placeholder="Ingredients" type="text" className="form-control" id="exampleInput2" list="brow" onChange={handleInputChange} />
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
                    <input type="text" className="form-control" id="exampleInput3" placeholder="420" onChange={handleInputChange} />
                    {errors.calories && <small style={errorStyle}>{errors.calories}</small>}
                  </div>
                  <div className="form-group col-lg-3">
                    <label htmlFor="exampleInput4">Proteins</label>
                    <input type="text" className="form-control" id="exampleInput4" placeholder="8" onChange={handleInputChange} />
                    {errors.proteins && <small style={errorStyle}>{errors.proteins}</small>}
                  </div>
                  <div className="form-group col-lg-3">
                    <label htmlFor="exampleInput5">Fats</label>
                    <input type="text" className="form-control" id="exampleInput5" placeholder="12" onChange={handleInputChange} />
                    {errors.fats && <small style={errorStyle}>{errors.fats}</small>}
                  </div>
                  <div className="form-group col-lg-3">
                    <label htmlFor="exampleInput6">Carbs.</label>
                    <input type="text" className="form-control" id="exampleInput6" placeholder="54" onChange={handleInputChange} />
                    {errors.carbohydrates && <small style={errorStyle}>{errors.carbohydrates}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInput7">Category</label>
                    <input placeholder="Category ID (0-8)" type="text" className="form-control" id="brow2_input" list="brow2" onChange={handleInputChange} />
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
                  <div id={styles.checkInput} className="form-check col-lg-12">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="exampleCheck1">Needs cooking</label>
                  </div>

                  <div className={`${styles.flagsField} col-lg-12 row`}>
                    <div className={`${styles.flagCard} col-lg-3`} style={formData.flags === 1 ? activeFlagStyle : {}} onClick={() => handleFlagSelect(1)}>#vegan</div>
                    <div className={`${styles.flagCard} col-lg-3`} style={formData.flags === 2 ? activeFlagStyle : {}} onClick={() => handleFlagSelect(2)}>#glutenFree</div>
                    <div className={`${styles.flagCard} col-lg-3`} style={formData.flags === 3 ? activeFlagStyle : {}} onClick={() => handleFlagSelect(3)}>#sugarFree</div>
                    <div className={`${styles.flagClear} col-lg-3`} onClick={() => handleFlagSelect(0)}>Clear</div>
                  </div>

                  <br /><br />
                  <div className="col-lg-2">
                    <img onClick={openDialog} src="../pin.png" alt="upload" style={{ cursor: 'pointer' }} />
                    {/* 3. ИЗМЕНЕНИЕ: Добавлен атрибут multiple */}
                    <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} accept="image/*" multiple />
                  </div>
                  <div className="col-lg-10">
                    <button id={styles.submitBtn} type="submit" className="btn btn-warning" disabled={isFormInvalid}>Submit</button>
                  </div>
                  <div className='col-lg-12'>
                    {/* 4. ИЗМЕНЕНИЕ: Выводим список всех выбранных файлов через запятую */}
                    {fileNames.length > 0 && <p id={styles.fileCaption}>Selected files: {fileNames.join(", ")}</p>}
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
