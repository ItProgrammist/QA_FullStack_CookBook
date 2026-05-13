/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import styles from './scss/DishCard.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { ModalEditDish } from './ModalEditDish'
import { ModalDeleteDish } from './ModalDeleteDish'
import { DishDetails } from './DishDetails'

export function DishCard({ dish }) {
    if (!dish) return null;

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)
    const [modalOpen3, setModalOpen3] = useState(false)

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasImages = dish.images && dish.images.length > 0;
    const currentImage = hasImages ? dish.images[currentImageIndex] : null;
    let imageSrc = currentImage
        ? `data:${currentImage.contentType};base64,${currentImage.base64Data}`
        : "../placeholder.png";
    if (currentImage.base64Data === "") {
        imageSrc = "../placeholder.png";
    }
    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => prevIndex === dish.images.length - 1 ? 0 : prevIndex + 1);
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => prevIndex === 0 ? dish.images.length - 1 : prevIndex - 1);
    };

    const categories = {
        0: "Dessert",
        1: "FirstCourse",
        2: "SecondCourse",
        3: "Drink",
        4: "Salad",
        5: "Soup",
        6: "Snack"
    };

    const flags = {
        0: "",
        1: "#vegan",
        2: "#glutenFree",
        3: "#sugarFree"
    };

    const ingredientsText = dish.ingredients && dish.ingredients.length > 0
        ? dish.ingredients.map(i => `${i.productName || "Product"} (${i.amount}g)`).join(", ")
        : "No ingredients specified";

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
        <div className="w-100 d-flex flex-column" style={{ height: '100%' }}>
            <div className={`${styles.cardBody} d-flex flex-column flex-grow-1`} style={{ height: '100%' }}>
                
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                    {hasImages && dish.images.length > 1 && (
                        <button style={{ ...arrowButtonStyle, left: '10px' }} onClick={handlePrevImage}>❮</button>
                    )}
                    <img src={imageSrc} alt={dish.name} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    {hasImages && dish.images.length > 1 && (
                        <button style={{ ...arrowButtonStyle, right: '10px' }} onClick={handleNextImage}>❯</button>
                    )}
                    {hasImages && dish.images.length > 1 && (
                        <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', zIndex: 2 }}>
                            {currentImageIndex + 1} / {dish.images.length}
                        </span>
                    )}
                </div>

                <div className={`${styles.content} d-flex flex-column flex-grow-1 p-3`}>
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-0">
                        <div className="flex-grow-1">
                            
                            <div className="row align-items-center mb-2">
                                <div className="col-8">
                                    <h5 className="m-0" style={{ wordBreak: 'break-word' }}><b>{dish.name}</b></h5>
                                </div>
                                <div id={styles.deleteSection} className="col-2 text-end">
                                    <img src="./edit.png" alt="edit" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer', width: '20px' }} />
                                    <ModalEditDish dish={dish} isVisible={modalOpen} onClose={() => setModalOpen(false)} />
                                </div>
                                <div id={styles.editSection} className="col-2 text-end">
                                    <img src="./trash.png" alt="delete" onClick={() => setModalOpen2(true)} style={{ cursor: 'pointer', width: '20px' }} />
                                    <ModalDeleteDish dishId={dish.id} isVisible={modalOpen2} onClose={() => setModalOpen2(false)} />
                                </div>
                            </div>

                            <p className="mb-1"><b>cal.: </b> <span id={styles.caloriesCount}>{dish.calories}</span></p>
                            <p className="mb-1"><b>Category:</b> <span id={styles.dishCategory}>{categories[dish.category] || "Unknown"}</span></p>
                            <p className="mb-1"><b>Portion, g.:</b> <span id={styles.dishPortion}>{dish.portionSize}</span></p>
                            
                            <br />
                            {dish.flags && (
                                <p id={styles.dishFlags} className="mb-1" style={{ minHeight: '24px' }}>
                                    {flags[dish.flags]}
                                </p>
                            ) || <p style={{ minHeight: '24px' }}>&nbsp;</p>}
                            <br />
                        </div>

                            <button id={styles.buttonSeeMore} className="btn btn-warning mt-auto w-100" onClick={() => setModalOpen3(true)}>
                            See more
                        </button>
                        <DishDetails dish={dish} isVisible={modalOpen3} onClose={() => setModalOpen3(false)} />

                    </div>
                </div>
            </div>
        </div>
    )
}
