import { useState } from 'react'
import styles from './scss/DishCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { ModalDeleteDish } from './ModalDeleteDish'


export function DishCard() {

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
                                <img src="./edit.png" />
                            </div>
                            <div id={styles.editSection} className="col-lg-2">
                                <img src="./trash.png" onClick={() => setModalOpen2(true)} />
                                <ModalDeleteDish
                                    isVisible={modalOpen2} 
                                    onClose={() => setModalOpen2(false)}
                                />
                            </div>
                            <p>Lorem ipsum dolor sit amet consectetur, arrupti corporis natus ut voluptatem, dolor modi quis libero fugit sed vel ex, ad non?</p>
                            <div className={styles.flags}>#vegan, #ecofriendly, #sugarfree</div>
                        </div>
                        <button id={styles.buttonSeeMore} className="btn btn-warning">See more</button>

                    </div>

                </div>
            </div>
        </div>
    )
} 