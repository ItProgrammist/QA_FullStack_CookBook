import { useState } from 'react'
import styles from './scss/DishCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { ModalEditDish } from './ModalEditDish'
import { ModalDeleteDish } from './ModalDeleteDish'
import { DishDetails } from './DishDetails'


export function DishCard() {

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)
    const [modalOpen3, setModalOpen3] = useState(false)

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
                                <ModalEditDish
                                    isVisible={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                />
                            </div>
                            <div id={styles.editSection} className="col-lg-2">
                                <img src="./trash.png" onClick={() => setModalOpen2(true)} />
                                <ModalDeleteDish
                                    isVisible={modalOpen2}
                                    onClose={() => setModalOpen2(false)}
                                />
                            </div>
                            <p>Lorem ipsum dolor sit amet consectetur, arrupti corporis natus ut voluptatem, dolor modi quis libero fugit sed vel ex, ad non?</p>
                            <p>Category: <span></span></p>
                            <div className={styles.flags}>#vegan, #ecofriendly, #sugarfree</div>
                        </div>
                        <button
                            id={styles.buttonSeeMore}
                            className="btn btn-warning"
                            onClick={() => setModalOpen3(true)}
                        >
                            See more
                        </button>
                        <DishDetails
                            isVisible={modalOpen3}
                            onClose={() => setModalOpen3(false)}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
} 