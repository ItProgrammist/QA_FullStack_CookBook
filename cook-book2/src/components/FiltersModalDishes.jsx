/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import styles from './scss/FiltersModalDishes.module.scss'

export function FiltersModalDishes({ isVisible, onClose, currentFilters, onFiltersChange }) {
    const [category, setCategory] = useState("");
    
    const [flags, setFlags] = useState([]);

    useEffect(() => {
        if (isVisible && currentFilters) {
            setCategory(currentFilters.category !== undefined && currentFilters.category !== null ? currentFilters.category.toString() : "");
            
            const activeFlags = currentFilters.flags || [];
            setFlags(Array.isArray(activeFlags) ? activeFlags.map(String) : (activeFlags ? [activeFlags.toString()] : []));
        }
    }, [isVisible, currentFilters]);

    const handleFlagsSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        
        if (selectedOptions.includes("")) {
            setFlags([]);
        } else {
            setFlags(selectedOptions);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        onFiltersChange({
            category: category !== "" ? parseInt(category, 10) : "",
            flags: flags.map(f => parseInt(f, 10))
        });
        
        onClose();
    };

    if (!isVisible) return null;

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
                                    
                                    <div id={styles.selectSearch} className="form-group col-lg-12 mb-3">
                                        <label>Category</label>
                                        <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
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

                                    <div id={styles.selectSearch} className="form-group col-lg-12 mb-4">
                                        <label>Flags (Hold Ctrl to select multiple)</label>
                                        <select 
                                            className="form-control" 
                                            value={flags} 
                                            onChange={handleFlagsSelectChange}
                                        >
                                            {/* Если зажат этот пункт, остальные сбросятся */}
                                            <option value="0">No/Any flags</option>
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
