import { useState, useRef } from 'react'
import styles from './scss/FiltersModalDishes.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function FiltersModalDishes({ isVisible, onClose }) {
    if (!isVisible) return null;

    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState("");

    const openDialog = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1">
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Filters for dishes</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="container">
                                <div id={styles.formGroups} className="row">

                                    <div id={styles.selectSearch} className="form-group col-lg-12">
                                        <label htmlFor="exampleInput2">Category</label>
                                        <input placeholder="Category" type="text" className="form-control" list="brow"></input>
                                        <datalist id="brow">
                                            <option value="Десерт"></option>
                                            <option value="Первое"></option>
                                            <option value="Второе"></option>
                                            <option value="Напиток"></option>
                                            <option value="Салат"></option>
                                            <option value="Суп"></option>
                                            <option value="Перекус"></option>
                                        </datalist>
                                    </div>
                                    <div id={styles.selectSearch} className="form-group col-lg-9">
                                        <label htmlFor="exampleInput2">Flags</label>
                                        <input placeholder="Flags" type="text" className="form-control" list="brow2"></input>
                                        <datalist id="brow2">
                                            <option value="Веган"></option>
                                            <option value="Без глютена"></option>
                                            <option value="Без сахара"></option>
                                        </datalist>
                                    </div>
                                    <div className="col-lg-3">
                                        <button id={styles.addBtn} className="btn btn-warning">Add</button>
                                    </div>

                                    <div className="col-lg-12">
                                        <button id={styles.submitBtn} type="submit" className="btn btn-warning">Save</button>
                                    </div>

                                    <div className='col-lg-12'>
                                        {fileName && <p id={styles.fileCaption}>Selected file: {fileName}</p>}
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
};