import { useState, useRef } from 'react'
import styles from './scss/ProductDetails.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function ProductDetails({ isVisible, onClose }) {
    if (!isVisible) return null;

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1">
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">"<span></span>"</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="container">
                                <div id={styles.formGroups} className="row">

                                    <div className={styles.ingredients}>
                                        <h5>Ingredients:</h5>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, possimus. Placeat debitis non esse quod consectetur aliquid? Alias ab totam architecto beatae iusto aliquid maiores, consequatur mollitia rerum eaque iste.</p>
                                    </div>

                                    <div className={styles.macros}>
                                        <h5>Proteins: <span></span></h5>
                                        <h5>Fats: <span></span></h5>
                                        <h5>Carbs: <span></span></h5>
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