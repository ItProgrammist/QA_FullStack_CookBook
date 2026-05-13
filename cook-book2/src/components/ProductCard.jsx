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

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasImages = product.images && product.images.length > 0;

    const currentImage = hasImages ? product.images[currentImageIndex] : null;

    const imageSrc = currentImage
        ? `data:${currentImage.contentType};base64,${currentImage.base64Data}`
        : "../placeholder.png";

    const handleNextImage = (e) => {
        e.stopPropagation();
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
        0: "ReadyToEat",
        1: "SemiFinished",
        2: "RequiresCooking"
    };

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

                {/* Контейнер карусели картинок */}
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                    {hasImages && product.images.length > 1 && (
                        <button style={{ ...arrowButtonStyle, left: '10px' }} onClick={handlePrevImage}>&#10094;</button>
                    )}

                    <img src={imageSrc} alt={product.name} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />

                    {hasImages && product.images.length > 1 && (
                        <button style={{ ...arrowButtonStyle, right: '10px' }} onClick={handleNextImage}>&#10095;</button>
                    )}

                    {hasImages && product.images.length > 1 && (
                        <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', zIndex: 2 }}>
                            {currentImageIndex + 1} / {product.images.length}
                        </span>
                    )}
                </div>

                <div className={`${styles.content} d-flex flex-column flex-grow-1 p-3`}>
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-0">

                        <div className="flex-grow-1">
                            <div className="row align-items-center mb-2">
                                <div className="col-8">
                                    <h5 className="m-0" style={{ wordBreak: 'break-word' }}><b>{product.name}</b></h5>
                                </div>
                                <div id={styles.deleteSection} className="col-2 text-end">
                                    <img src="./edit.png" alt="edit" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer', width: '20px' }} />
                                    <ModalEditProduct product={product} isVisible={modalOpen} onClose={() => setModalOpen(false)} />
                                </div>
                                <div id={styles.editSection} className="col-2 text-end">
                                    <img src="./trash.png" alt="delete" onClick={() => setModalOpen2(true)} style={{ cursor: 'pointer', width: '20px' }} />
                                    <ModalDeleteProduct productId={product.id} isVisible={modalOpen2} onClose={() => setModalOpen2(false)} />
                                </div>
                            </div>

                            <p className="mb-1"><b>cal.: </b> <span id={styles.caloriesCount}>{product.calories}</span></p>
                            <p className="mb-1"><b>Category:</b> <span id={styles.productCategory}>{categories[product.category] || "Unknown"}</span></p>

                            <p className="mb-3"><b>Cooking state:</b> <span id={styles.cookingState}>{cookingStates[product.cookingNecessity] || "Unknown"}</span></p>
                            {product.flags && (
                                <p id={styles.productFlags} className="mb-1" style={{ minHeight: '24px' }}>
                                    {flags[product.flags]}
                                </p>
                            ) || <p style={{ minHeight: '24px' }}>&nbsp;</p>}
                            <br />
                        </div>

                        <button
                            id={styles.buttonSeeMore}
                            className="btn btn-warning mt-auto w-100"
                            onClick={() => setModalOpen3(true)}
                        >
                            See more
                        </button>
                        <ProductDetails product={product} isVisible={modalOpen3} onClose={() => setModalOpen3(false)} />

                    </div>
                </div>
            </div>
        </div>
    )
}
