import { useState, useRef } from 'react'
import styles from './scss/ModalDeleteDish.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function ModalDeleteDish({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div id={styles.mainModal} className="modal fade show" tabIndex="-1">
      <div className="modal-dialog">
        <div id={styles.modalContent} className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Delete "<span></span>"</h3>
            <button data-bs-theme="dark" type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h4>Do you really want to delete this dish?</h4>
          </div>
          <div className="modal-footer">
            <button className="btn btn-warning" onClick={onClose}>Close</button>
            <button className="btn btn-danger" onClick={onClose}>Delete</button>

          </div>
        </div>
      </div>
    </div>
  );
};