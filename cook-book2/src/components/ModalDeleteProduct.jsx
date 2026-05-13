/* eslint-disable react-hooks/rules-of-hooks */
// import { useState } from 'react'
import styles from './scss/ModalDeleteProduct.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'

export function ModalDeleteProduct({ isVisible, onClose, productId }) {
    if (!isVisible) return null;

    const handleDelete = async () => {
        if (!productId) {
            alert("Error: Product ID is missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5254/api/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*'
                }
            });

            if (response.ok) {
                alert("Product deleted successfully!");
                onClose();
            } else if (response.status === 400) {

              const errorJson = await response.json();
                if (errorJson.errors) {
                    let friendlyMessage = "Validation errors occurred:\n";
                    Object.keys(errorJson.errors).forEach(field => {
                        friendlyMessage += `\n• ${field}: ${errorJson.errors[field].join(", ")}`;
                    });
                    alert(friendlyMessage);
                } else {
                    alert("Delete error: " + (errorJson.title || "Invalid request"));
                }
            } else {
                const errorText = await response.text();
                alert(`Server error (${response.status}): ${errorText || "Could not delete product. It might be used in a dish."}`);
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Сервер недоступен! Не удалось удалить продукт. Убедитесь, что бэкенд и Docker-контейнер с MSSQL запущены.");
        }
    };

    return (
        <div id={styles.mainModal} className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog">
                <div id={styles.modalContent} className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">Delete "<span>Product</span>"</h3>
                        <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h4>Do you really want to delete this product?</h4>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-warning" onClick={onClose}>Close</button>
                        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
