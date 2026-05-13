// import { useState, useRef } from 'react'
import styles from './scss/DishDetails.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function DishDetails({ dish, isVisible, onClose }) {
    if (!isVisible) return null;
    console.log(dish)
    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1">
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">"<span>{dish.name}</span>"</h5>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="container">
                                <div id={styles.formGroups} className="row">

                                    {/* <div className={styles.calories}>
                                        <h5>Cal.: <span>{dish.calories}</span></h5>
                                    </div> */}

                                    <div className={styles.ingredients}>
                                        <h5>Ingredients:
                                                <br />
                                            
                                            <span>
                                                {dish.ingredients.map((x, index) => (
                                                    <div id={styles.dishIngredients} key={index}>
                                                        <span >{x.productName}, {x.amount}g.</span>
                                                        {/* <br /> */}
                                                    </div>
                                                ))}
                                            </span>
                                        </h5>
                                    </div>

                                    <div className={styles.macros}>
                                        <h5>Proteins: <span>{dish.proteins}</span></h5>
                                        <h5>Fats: <span>{dish.fats}</span></h5>
                                        <h5>Carbs: <span>{dish.carbohydrates}</span></h5>
                                    </div>

                                    {/* <div className={styles.portionSize}>
                                        <h5>Portion size (g.) : <span>{dish.portionSize}</span></h5>
                                    </div> */}

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