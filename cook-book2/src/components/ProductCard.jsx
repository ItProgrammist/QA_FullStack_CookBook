import { useState } from 'react'
import styles from './scss/ProductCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function ProductCard() {

    const [details, setDetails] = useState({
        title: 'Null',
        description: 'LEGENDARY Description',
        buttonText: "John Cena's CLICK"
    })

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
                                <img src="./trash.png" />
                            </div>
                            <p><p id='caloriesCount'></p> kcal</p>
                            <p>Category: <p id='productCategory'></p></p>
                            <p id='productFlags'>#flag1 #flag2 #flag3</p>

                            {/* <p>
                                proteins: <p id='proteinsCount'></p>
                                fats: <p id='fatsCount'></p>
                                carbs: <p id='carbsCount'></p>
                            </p> */}
                            <p>Cooking state: <p id='cookingState'>Raw / Ready-to-heat / Ready-to-eat</p></p>
                        </div>
                        <button id={styles.buttonSeeMore} className="btn btn-warning">See more</button>
                    </div>
                </div>

            </div>
        </div>
    )
} 