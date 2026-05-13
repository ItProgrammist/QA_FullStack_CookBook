import { useState, useEffect } from 'react'
import styles from './Dishes.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { DishCard } from '../components/DishCard'
import { SearchPanel } from '../components/SearchPanel'
import { ModalWindowDish } from '../components/ModalWindowDish'

export function Dishes() {
    const [modalOpenDish, setModalOpenDish] = useState(false)
    
    const [dishes, setDishes] = useState([])

    const loadDishes = () => {
        fetch('http://localhost:5254/api/dish')
            .then(res => {
                if (!res.ok) throw new Error("Server communication fault");
                return res.json();
            })
            .then(data => {
                setDishes(data);
            })
            .catch(err => console.error("Error pulling dishes snapshot:", err));
    };

    useEffect(() => {
        loadDishes();
    }, []);

    const handleCloseModal = () => {
        setModalOpenDish(false);
        loadDishes();
    };

    return (
        <div>
            <Header />
            <div className={styles.createDish}>
                <button className='btn btn-warning' onClick={() => setModalOpenDish(true)}>
                    Create a dish
                </button>
            </div>
            
            <ModalWindowDish isVisible={modalOpenDish} onClose={handleCloseModal} />
            
            <SearchPanel isProduct={false} />
            
            <div className={styles.dishesBody}>
                <div className="container">
                    <div className="col-lg-12">
                        <div className="row">
                            
                            {dishes.length > 0 ? (
                                dishes.map(item => (
                                    <div key={item.id} className="col-lg-4 d-flex mb-4">
                                        <DishCard dish={item} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-lg-12 text-center py-5">
                                    <p style={{ color: '#6c757d' }}>No dishes created yet. Hit "Create a dish" to build your first recipe!</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
