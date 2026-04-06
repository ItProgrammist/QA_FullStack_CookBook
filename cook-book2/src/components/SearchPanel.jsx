import { useState, useRef } from 'react'
import styles from './scss/SearchPanel.module.scss'
import { Link } from 'react-router-dom'
import { ModalWindowProduct } from './ModalWindowProduct'
import { FiltersModalDishes } from './FiltersModalDishes'
import { FiltersModalProducts } from './FiltersModalProducts'


export function SearchPanel({ isProduct }) {

    const [modalOpen, setModalOpen] = useState(false)

    let CurrentModal = FiltersModalDishes

    if (isProduct) {
        CurrentModal = FiltersModalProducts
    }

    return (
        <div>
            <CurrentModal
                isVisible={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            <div className='container'>
                <div id={styles.searchPanel} className="row">

                    <div id={styles.filters} className="col-lg-4" onClick={() => setModalOpen(true)}>
                        <img id={styles.filtersImage} src="../filter.png" alt="" />
                        <p id={styles.filtersText}>Filters</p>
                        <img id={styles.dropDownArrow} src="../down-chevron.png" alt="" />
                    </div>

                    <div id={styles.searchTab} className="col-lg-4">
                        <input type="text" name="query" placeholder="Search..."></input>
                    </div>





                    {/* <img src="../sort.png" alt="" /> */}
                    <div id={styles.sorting} className="col-lg-2">
                        <select>
                            <option>Пункт 1</option>
                            <option>Пункт 2</option>
                        </select>
                    </div>

                    <button id={styles.searchButton} className='btn btn-danger col-lg-2'>
                        Show
                    </button>

                </div>
            </div>
        </div>

    )
} 