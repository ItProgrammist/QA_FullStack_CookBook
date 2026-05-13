/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import styles from './scss/FiltersModalProducts.module.scss'

export function FiltersModalProducts({ isVisible, onClose, currentFilters, onFiltersChange }) {
  if (!isVisible) return null;

  const [category, setCategory] = useState(currentFilters?.category ?? "");
  const [flags, setFlags] = useState(currentFilters?.flags ?? "");
  const [cookingNecessity, setNeedsCooking] = useState(currentFilters?.cookingNecessity ?? "");

  const handleSave = (e) => {
    e.preventDefault();

    onFiltersChange({
      category: category !== "" ? parseInt(category, 10) : "",
      flags: flags !== "" ? parseInt(flags, 10) : "",
      cookingNecessity: cookingNecessity !== "" ? parseInt(cookingNecessity, 10) : ""
    });

    onClose();
  };

  return (
    <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className="modal-dialog">
        <div id={styles.modalContent} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Filters for products</h5>
            <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSave}>
              <div className="container">
                <div id={styles.formGroups} className="row">

                  {/* Селект категории с числовыми привязками Enum бэкенда */}
                  <div id={styles.selectSearch} className="form-group col-lg-12 mb-3">
                    <label>Category</label>
                    <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} >
                      <option value="">All Categories</option>
                      <option value="0">Frozen</option>
                      <option value="1">Meat</option>
                      <option value="2">Vegetables</option>
                      <option value="3">Greens</option>
                      <option value="4">Spices</option>
                      <option value="5">Cereals</option>
                      <option value="6">Canned</option>
                      <option value="7">Liquid</option>
                      <option value="8">Sweets</option>
                    </select>
                  </div>

                  {/* Селект флагов с числовыми привязками Enum бэкенда */}
                  <div id={styles.selectSearch} className="form-group col-lg-12 mb-3">
                    <label>Flags</label>
                    <select className="form-control" value={flags} onChange={(e) => setFlags(e.target.value)} >
                      <option value="">No/Any flags</option>
                      <option value="1">Vegan</option>
                      <option value="2">Gluten Free</option>
                      <option value="3">Sugar Free</option>
                    </select>
                  </div>

                  {/* Необходимость готовки — мапится на cookingNecessity */}
                  <div id={styles.cookingNecessityFilters} className="row col-lg-12 mb-4">
                    <br />
                    <label id={styles.labelCaption} className="d-block mb-2" style={{ fontWeight: 'bold' }}>Filter by Cooking State:</label>

                    <div className="form-check mb-1">
                      <input className="form-check-input" type="radio" name="filterCooking" id="filterAllCooking" value="" checked={cookingNecessity === ""} onChange={(e) => setNeedsCooking(e.target.value)} />
                      <label className="form-check-label" htmlFor="filterAllCooking" style={{ marginLeft: '5px' }}>All States</label>
                    </div>

                    {/* Безопасное сравнение через абстрактное равенство == вместо падения .toString() */}
                    <div className="form-check mb-1">
                      <input className="form-check-input" type="radio" name="filterCooking" id="filterReadyToEat" value="0" checked={cookingNecessity !== "" && cookingNecessity == 0} onChange={(e) => setNeedsCooking(parseInt(e.target.value, 10))} />
                      <label className="form-check-label" htmlFor="filterReadyToEat" style={{ marginLeft: '5px' }}>Ready To Eat</label>
                    </div>
                    <div className="form-check mb-1">
                      <input className="form-check-input" type="radio" name="filterCooking" id="filterSemiFinished" value="1" checked={cookingNecessity !== "" && cookingNecessity == 1} onChange={(e) => setNeedsCooking(parseInt(e.target.value, 10))} />
                      <label className="form-check-label" htmlFor="filterSemiFinished" style={{ marginLeft: '5px' }}>Semi Finished</label>
                    </div>
                    <div className="form-check mb-1">
                      <input className="form-check-input" type="radio" name="filterCooking" id="filterRequiresCooking" value="2" checked={cookingNecessity !== "" && cookingNecessity == 2} onChange={(e) => setNeedsCooking(parseInt(e.target.value, 10))} />
                      <label className="form-check-label" htmlFor="filterRequiresCooking" style={{ marginLeft: '5px' }}>Requires Cooking</label>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <button id={styles.submitBtn} type="submit" className="btn btn-warning w-100">Save</button>
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
