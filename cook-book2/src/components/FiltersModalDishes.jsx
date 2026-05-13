/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState } from 'react'
import styles from './scss/FiltersModalDishes.module.scss'

export function FiltersModalDishes({ isVisible, onClose, currentFilters, onFiltersChange }) {
    if (!isVisible) return null;

    const [category, setCategory] = useState(currentFilters?.category ?? "");
    const [flags, setFlags] = useState(currentFilters?.flags ?? "");

    const handleSave = (e) => {
        e.preventDefault();
        
        onFiltersChange({
            category: category !== "" ? parseInt(category, 10) : "",
            flags: flags !== "" ? parseInt(flags, 10) : ""
        });
        
        onClose();
    };

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Filters for dishes</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSave}>
                            <div className="container">
                                <div id={styles.formGroups} className="row">
                                    
                                    {/* Селект категории с числовыми привязками Enum твоего бэкенда для Dish */}
                                    <div id={styles.selectSearch} className="form-group col-lg-12 mb-3">
                                        <label>Category</label>
                                        <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} >
                                            <option value="">All Categories</option>
                                            <option value="0">Dessert</option>
                                            <option value="1">FirstCourse</option>
                                            <option value="2">SecondCourse</option>
                                            <option value="3">Drink</option>
                                            <option value="4">Salad</option>
                                            <option value="5">Soup</option>
                                            <option value="6">Snack</option>
                                        </select>
                                    </div>

                                    {/* Селект флагов с числовыми привязками Enum бэкенда */}
                                    <div id={styles.selectSearch} className="form-group col-lg-12 mb-4">
                                        <label>Flags</label>
                                        <select className="form-control" value={flags} onChange={(e) => setFlags(e.target.value)} >
                                            <option value="">No/Any flags</option>
                                            <option value="1">Vegan</option>
                                            <option value="2">Gluten Free</option>
                                            <option value="3">Sugar Free</option>
                                        </select>
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
