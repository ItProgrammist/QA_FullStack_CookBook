/* eslint-disable no-unused-vars */
import styles from './scss/DishDetails.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'

export function DishDetails({ dish, isVisible, onClose }) {
    if (!isVisible || !dish) return null;

    console.log(dish);

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">"<span>{dish.name}</span>"</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="container">
                                <div id={styles.formGroups} className="row">

                                    <div className={styles.ingredients}>
                                        <h5>Ingredients: <br />
                                            <span>
                                                {/* Безопасная проверка существования массива ингредиентов блюда */}
                                                {dish.ingredients && dish.ingredients.length > 0 ? (
                                                    dish.ingredients.map((x, index) => (
                                                        <div id={styles.dishIngredients} key={index}>
                                                            <span>{x.productName || "Product"}, {x.amount}g.</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ fontSize: '14px', color: '#6c757d', fontWeight: 'normal', marginTop: '5px' }}>
                                                        No ingredients added to this dish.
                                                    </div>
                                                )}
                                            </span>
                                            <br />
                                        </h5>
                                    </div>

                                    <div className={styles.macros}>
                                        <h5>Proteins: <span>{dish.proteins}g.</span></h5>
                                        <h5>Fats: <span>{dish.fats}g.</span></h5>
                                        <h5>Carbs: <span>{dish.carbohydrates}g.</span></h5>
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
