import { useState, useRef } from 'react'
import styles from './scss/ModalWindowDish.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function ModalWindowDish({ isVisible, onClose }) {
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
                        <h5 className="modal-title">Add a dish</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="container">
                                <div id={styles.formGroups} className="row">

                                    <div class="form-group">
                                        <label for="exampleInput1">Dish name</label>
                                        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="e.g. Apple pie"></input>
                                        {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                    </div>
                                    <div id={styles.selectSearch} className="form-group col-lg-9">
                                        <label for="exampleInput2">Ingredients</label>
                                        <input placeholder="Ingredients" type="text" class="form-control" list="brow"></input>
                                        <datalist id="brow">
                                            <option value="Internet Explorer"></option>
                                            <option value="Firefox"></option>
                                            <option value="Chrome"></option>
                                            <option value="Opera"></option>
                                            <option value="Safari"></option>
                                        </datalist>
                                    </div>
                                    <div className="col-lg-3">
                                        <button id={styles.addBtn} className="btn btn-warning">Add</button>
                                    </div>

                                    <div class="form-group col-lg-3">
                                        <label for="exampleInput3">Cal.</label>
                                        <input type="number" class="form-control" id="exampleInput3" placeholder="420"></input>
                                    </div>

                                    <div class="form-group col-lg-3">
                                        <label for="exampleInput4">Proteins</label>
                                        <input type="number" class="form-control" id="exampleInput4" placeholder="8"></input>
                                    </div>

                                    <div class="form-group col-lg-3">
                                        <label for="exampleInput5">Fats</label>
                                        <input type="number" class="form-control" id="exampleInput5" placeholder="12"></input>
                                    </div>

                                    <div class="form-group col-lg-3">
                                        <label for="exampleInput6">Carbs.</label>
                                        <input type="number" class="form-control" id="exampleInput6" placeholder="54"></input>
                                    </div>

                                    <div class="form-group">
                                        <label for="exampleInput7">Category</label>
                                        <input placeholder="Category" type="text" class="form-control" list="brow2"></input>
                                        <datalist id="brow2">
                                            <option value="Internet Explorer"></option>
                                            <option value="Firefox"></option>
                                            <option value="Chrome"></option>
                                            <option value="Opera"></option>
                                            <option value="Safari"></option>
                                        </datalist>
                                    </div>

                                    <div class="form-group col-lg-12">
                                        <label for="exampleInput6">Portion, g.</label>
                                        <input type="number" class="form-control" id="exampleInput6" placeholder="120"></input>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="col-lg-2">
                                        <img onClick={openDialog} src="../pin.png" alt="" />

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="col-lg-10">
                                        <button id={styles.submitBtn} type="submit" class="btn btn-warning">Submit</button>
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
            </div >
        </div >
    );
};