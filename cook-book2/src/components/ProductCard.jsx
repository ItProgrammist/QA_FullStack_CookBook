import { useState } from 'react'
import styles from './scss/ProductCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { ModalEditProduct } from './ModalEditProduct'
import { ModalDeleteProduct } from './ModalDeleteProduct'


export function ProductCard() {

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)

    return (
        <div >
            <div className={styles.cardBody}>
                <img src="../placeholder.png" alt="" />
                <div className={styles.content}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <h5>Title Sample</h5>

                            </div>
                            <div id={styles.deleteSection} className="col-lg-2">
                                <img src="./edit.png" onClick={() => setModalOpen(true)} />
                                <ModalEditProduct
                                    isVisible={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                />
                            </div>
                            <div id={styles.editSection} className="col-lg-2">
                                <img src="./trash.png" onClick={() => setModalOpen2(true)} />
                                <ModalDeleteProduct
                                    isVisible={modalOpen2}
                                    onClose={() => setModalOpen2(false)}
                                />
                            </div>
                            <p><span id='caloriesCount'></span> cal.</p>
                            <p>Category: <span id='productCategory'></span></p>
                            <p id='productFlags'>#flag1 #flag2 #flag3</p>

                            {/* <p>
                                proteins: <p id='proteinsCount'></p>
                                fats: <p id='fatsCount'></p>
                                carbs: <p id='carbsCount'></p>
                            </p> */}
                            <p>Cooking state: <span id='cookingState'>Raw / Ready-to-heat / Ready-to-eat</span></p>
                        </div>
                        <button id={styles.buttonSeeMore} className="btn btn-warning">See more</button>
                    </div>
                </div>

            </div>
        </div>
    )
} 