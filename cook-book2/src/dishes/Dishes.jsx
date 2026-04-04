import { useState } from 'react'
import styles from './Dishes.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { DishCard } from '../components/DishCard'
import { SearchPanel } from '../components/SearchPanel'
import { ModalWindowDish } from '../components/ModalWindowDish'

export function Dishes() {

    const [modalOpenDish, setModalOpenDish] = useState(false)

    return (
        <div>
            <Header />
            <div className={styles.createDish}>
                <button className='btn btn-warning' onClick={() => setModalOpenDish(true)}>Create a dish</button>
            </div>
            <ModalWindowDish
                isVisible={modalOpenDish}
                onClose={() => setModalOpenDish(false)}
            />
            <SearchPanel />
            <div className={styles.dishesBody}>
                <div className="container">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-4">
                                <DishCard />
                            </div>
                            <div className="col-lg-4">
                                <DishCard />
                            </div>
                            <div className="col-lg-4">
                                <DishCard />
                            </div>
                            <div className="col-lg-4">
                                <DishCard />
                            </div>
                            <div className="col-lg-4">
                                <DishCard />
                            </div>
                            <div className="col-lg-4">
                                <DishCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 