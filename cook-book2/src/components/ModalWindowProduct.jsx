import { useState } from 'react'
import styles from './scss/ModalWindowProduct.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function ModalWindowProduct({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div id={styles.mainModal} className="modal fade show" tabIndex="-1">
      <div className="modal-dialog">
        <div id={styles.modalContent} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add a product</h5>
            <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="container">
                <div id={styles.formGroups} className="row">

                  <div class="form-group">
                    <label for="exampleInput1">Product name</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="e.g. Apples"></input>
                    {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                  </div>
                  <div class="form-group">
                    <label for="exampleInput2">Ingredients</label>
                    <input type="text" class="form-control" id="exampleInput2" placeholder="Ingredients"></input>
                  </div>
                  <div class="form-group col-lg-3">
                    <label for="exampleInput3">Cal.</label>
                    <input type="number" class="form-control" id="exampleInput3" placeholder="Calories"></input>
                  </div>

                  <div class="form-group col-lg-3">
                    <label for="exampleInput4">Proteins</label>
                    <input type="number" class="form-control" id="exampleInput4" placeholder="Proteins"></input>
                  </div>

                  <div class="form-group col-lg-3">
                    <label for="exampleInput5">Fats</label>
                    <input type="number" class="form-control" id="exampleInput5" placeholder="Fats"></input>
                  </div>

                  <div class="form-group col-lg-3">
                    <label for="exampleInput6">Carbs.</label>
                    <input type="number" class="form-control" id="exampleInput6" placeholder="Carbs"></input>
                  </div>

                  <div class="form-group">
                    <label for="exampleInput7">Category</label>
                    <input type="text" class="form-control" id="exampleInput7" placeholder="Category"></input>
                  </div>

                  <div id={styles.checkInput} class="form-check col-lg-6">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
                    <label class="form-check-label" for="exampleCheck1">Needs cooking</label>
                  </div>
                  <br />
                  <br />
                  <button id={styles.submitBtn} type="submit" class="btn btn-warning">Submit</button>

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