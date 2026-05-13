/* eslint-disable no-unused-vars */
import styles from './scss/ProductDetails.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'

export function ProductDetails({ product, isVisible, onClose }) {
   
    if (!isVisible || !product) return null;

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        {/* Динамическое имя продукта */}
                        <h5 className="modal-title">"<span>{product.name}</span>"</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div id={styles.modalBody} className="modal-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="container">
                                <div id={styles.formGroups} className="row">
                                    <div className={`${styles.ingredients} col-lg-12`}>
                                        <h5>Ingredients:</h5>
                                        <p>{product.ingredients || "===---=== No ingredients specified for this product. ===---==="}</p>
                                    </div>
                                    <div className={`${styles.macros} col-lg-12 mt-3`}>
                                        {/* Отображение актуальных БЖУ */}
                                        <h5>Proteins: <span>{product.proteins}g</span></h5>
                                        <h5>Fats: <span>{product.fats}g</span></h5>
                                        <h5>Carbs: <span>{product.carbohydrates}g</span></h5>
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
