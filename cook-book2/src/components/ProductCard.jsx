/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import styles from './scss/ProductCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { ModalEditProduct } from './ModalEditProduct'
import { ModalDeleteProduct } from './ModalDeleteProduct'
import { ProductDetails } from './ProductDetails'

export function ProductCard({ product }) {
    if (!product) return null;

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)
    const [modalOpen3, setModalOpen3] = useState(false)

    // 1. Стейт для отслеживания текущего индекса картинки в карусели
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasImages = product.images && product.images.length > 0;
    
    // Получаем текущую активную картинку из массива
    const currentImage = hasImages ? product.images[currentImageIndex] : null;

    // Собираем data-url строку из бинарных данных текущего элемента
    const imageSrc = currentImage 
        ? `data:${currentImage.contentType};base64,${currentImage.base64Data}`
        : "../placeholder.png";

    // Функции для перелистывания карусели (зацикленные)
    const handleNextImage = (e) => {
        e.stopPropagation(); // Предотвращаем случайные клики по карточке
        setCurrentImageIndex((prevIndex) => 
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    const categories = {
        0: "Frozen",
        1: "Meat",
        2: "Vegetables",
        3: "Greens",
        4: "Spices",
        5: "Cereals",
        6: "Canned",
        7: "Liquid",
        8: "Sweets"
    };

    const flags = {
        0: "",
        1: "#vegan",
        2: "#glutenFree",
        3: "#sugarFree"
    };

    const cookingStates = {
        0: "Raw",
        1: "Ready-to-heat",
        2: "Ready-to-eat"
    };

    // Инлайн-стили для стрелочек поверх картинки
    const arrowButtonStyle = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        zIndex: 2,
        userSelect: 'none'
    };

    return (
        <div>
            <div className={styles.cardBody}>
                
                {/* 2. Контейнер для картинки с относительным позиционированием для стрелочек */}
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                    
                    {/* Стрелочка НАЗАД (показывается только если картинок больше 1) */}
                    {hasImages && product.images.length > 1 && (
                        <button 
                            style={{ ...arrowButtonStyle, left: '10px' }} 
                            onClick={handlePrevImage}
                        >
                            &#10094;
                        </button>
                    )}

                    <img 
                        src={imageSrc} 
                        alt={product.name} 
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                    />

                    {/* Стрелочка ВПЕРЕД (показывается только если картинок больше 1) */}
                    {hasImages && product.images.length > 1 && (
                        <button 
                            style={{ ...arrowButtonStyle, right: '10px' }} 
                            onClick={handleNextImage}
                        >
                            &#10095;
                        </button>
                    )}

                    {/* Индикатор количества картинок в углу (например: 1 / 3) */}
                    {hasImages && product.images.length > 1 && (
                        <span style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            zIndex: 2
                        }}>
                            {currentImageIndex + 1} / {product.images.length}
                        </span>
                    )}
                </div>
                
                <div className={styles.content}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <h5>{product.name}</h5>
                            </div>
                            <div id={styles.deleteSection} className="col-lg-2">
                                <img src="./edit.png" alt="edit" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }} />
                                <ModalEditProduct product={product} isVisible={modalOpen} onClose={() => setModalOpen(false)} />
                            </div>
                            <div id={styles.editSection} className="col-lg-2">
                                <img src="./trash.png" alt="delete" onClick={() => setModalOpen2(true)} style={{ cursor: 'pointer' }} />
                                <ModalDeleteProduct productId={product.id} isVisible={modalOpen2} onClose={() => setModalOpen2(false)} />
                            </div>
                            
                            <p><span id='caloriesCount'>{product.calories}</span> cal.</p>
                            <p>Category: <span id='productCategory'>{categories[product.category] || "Unknown"}</span></p>
                            
                            <p id='productFlags'>{flags[product.flags] || ""}</p>
                            
                            <p>Cooking state: <span id='cookingState'>{cookingStates[product.cookingNecessity] || "Unknown"}</span></p>
                        </div>
                        
                        <button id={styles.buttonSeeMore} className="btn btn-warning" onClick={() => setModalOpen3(true)}>
                            See more
                        </button>
                        <ProductDetails product={product} isVisible={modalOpen3} onClose={() => setModalOpen3(false)} />
                    </div>
                </div>
            </div>
        </div>
    )
}
