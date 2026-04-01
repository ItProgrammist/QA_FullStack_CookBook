import { useState } from 'react'
import styles from './scss/DishCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function DishCard() {

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
                    <h5>Title Sample</h5>
                    <p>Lorem ipsum dolor sit amet consectetur, arrupti corporis natus ut voluptatem, dolor modi quis libero fugit sed vel ex, ad non?</p>
                    <div className={styles.flags}>#vegan, #ecofriendly, #sugarfree</div>
                </div>
                <button id={styles.buttonSeeMore} className="btn btn-warning">See more</button>
            </div>
        </div>
    )
} 