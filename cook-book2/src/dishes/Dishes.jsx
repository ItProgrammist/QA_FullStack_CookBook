import { useState, useEffect } from 'react'
import styles from './Dishes.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { DishCard } from '../components/DishCard'
import { SearchPanel } from '../components/SearchPanel'
import { ModalWindowDish } from '../components/ModalWindowDish'
import { ModalEditDish } from '../components/ModalEditDish'
import { ModalDeleteDish } from '../components/ModalDeleteDish'
import { DishDetails } from '../components/DishDetails'

export function Dishes() {
    const [activeFilters, setActiveFilters] = useState({
        search: "",
        category: "",
        flags: []
    });

    const [modalOpenDish, setModalOpenDish] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    
    const [selectedDish, setSelectedDish] = useState(null)
    const [deleteDishId, setDeleteDishId] = useState("")
    const [dishes, setDishes] = useState([])

    const loadDishes = (searchParams = {}) => {
        const currentQuery = { ...activeFilters, ...searchParams };
        let url = 'http://localhost:5254/api/dish?';

        if (currentQuery.search) {
            url += `search=${encodeURIComponent(currentQuery.search)}&`;
        }

        if (currentQuery.category !== undefined && currentQuery.category !== "") {
            url += `category=${currentQuery.category}&`;
        }

        if (currentQuery.flags && Array.isArray(currentQuery.flags)) {
            currentQuery.flags.forEach(flagId => {
                url += `flags=${flagId}&`;
            });
        } else if (currentQuery.flags !== undefined && currentQuery.flags !== "") {
            url += `flags=${currentQuery.flags}&`;
        }

        if (url.endsWith('&') || url.endsWith('?')) {
            url = url.slice(0, -1);
        }

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Server communication fault");
                return res.json();
            })
            .then(data => {
                setDishes(data);
                if (selectedDish) {
                    const updatedDish = data.find(d => d.id === selectedDish.id);
                    if (updatedDish) setSelectedDish(updatedDish);
                }
            })
            .catch(err => console.error("Error pulling dishes snapshot:", err));
    };

    const handleSearchSubmit = (searchAndSortParams) => {
        const updated = { ...activeFilters, ...searchAndSortParams };
        setActiveFilters(updated);
        loadDishes(updated);
    };

    const handleFiltersChange = (newFilters) => {
        const updated = { ...activeFilters, ...newFilters };
        setActiveFilters(updated);
        loadDishes(updated);
    };

    useEffect(() => {
        loadDishes();
    }, []);

    const handleCloseModal = () => {
        setModalOpenDish(false);
        loadDishes();
    };

    const handleOpenEdit = (dishObj) => {
        setSelectedDish(dishObj);
        setEditModalOpen(true);
    };

    const handleOpenSeeMore = (dishObj) => {
        setSelectedDish(dishObj);
        setDetailsModalOpen(true);
    };

    const handleOpenDelete = (id) => {
        setDeleteDishId(id);
        setDeleteModalOpen(true);
    };

    return (
        <div>
            <Header />
            <div className={styles.createDish}>
                <button className='btn btn-warning' onClick={() => setModalOpenDish(true)}>
                    Create a dish
                </button>
            </div>

            <SearchPanel 
                isProduct={false} 
                onSearchSubmit={handleSearchSubmit} 
                currentFilters={activeFilters} 
                onFiltersChange={handleFiltersChange} 
            />

            <ModalWindowDish isVisible={modalOpenDish} onClose={handleCloseModal} />

            {/* Ваш корректный вызов с динамическим key */}
            <ModalEditDish 
                isVisible={editModalOpen} 
                dish={selectedDish} 
                key={selectedDish ? selectedDish.id : 'empty-dish-edit'} 
                onClose={() => { 
                    setEditModalOpen(false); 
                    loadDishes(); 
                }} 
            />

            {/* ДОБАВЛЕН КЛЮЧ: предотвращает отображение старого состава ингредиентов при переключении блюд */}
            <DishDetails 
                isVisible={detailsModalOpen} 
                dish={selectedDish} 
                key={selectedDish ? `details-${selectedDish.id}` : 'empty-dish-details'}
                onClose={() => setDetailsModalOpen(false)} 
            />

            <ModalDeleteDish 
                isVisible={deleteModalOpen} 
                dishId={deleteDishId} 
                onClose={() => { 
                    setDeleteModalOpen(false); 
                    loadDishes(); 
                }} 
            />

            <div className={styles.dishesBody}>
                <div className="container">
                    <div className="col-lg-12">
                        <div className="row">
                            {dishes.length > 0 ? (
                                dishes.map(item => (
                                    <div key={item.id} className="col-lg-4 d-flex mb-4">
                                        <DishCard 
                                            dish={item} 
                                            onEdit={handleOpenEdit} 
                                            onDelete={handleOpenDelete} 
                                            onSeeMore={handleOpenSeeMore} 
                                        />
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
