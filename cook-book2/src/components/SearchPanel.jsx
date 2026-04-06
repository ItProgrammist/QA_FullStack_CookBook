import { useState, useRef } from 'react'
import styles from './scss/SearchPanel.module.scss'
import { Link } from 'react-router-dom'
import { ModalWindowProduct } from './ModalWindowProduct'
import { FiltersModalDishes } from './FiltersModalDishes'
import { FiltersModalProducts } from './FiltersModalProducts'


export function SearchPanel({ isProduct }) {

    const [modalOpen, setModalOpen] = useState(false)

    let CurrentModal = FiltersModalDishes
    const СurrentPanel = isProduct ? (
        <div id={styles.sorting} className="col-lg-2">
            <select>
                <option>По названию (А-Я)</option>
                <option>По калориям</option>
                <option>По белка́м</option>
                <option>По жирам</option>
                <option>По углеводам</option>
            </select>
        </div>
    ) : null;
    let SearchTabSize = 'col-lg-6'

    if (isProduct) {
        CurrentModal = FiltersModalProducts
        SearchTabSize = 'col-lg-4'
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

                    <div id={styles.searchTab} className={SearchTabSize}>
                        <input type="text" name="query" placeholder="Search..."></input>
                    </div>





                    {/* <img src="../sort.png" alt="" /> */}
                    {СurrentPanel}

                    <button id={styles.searchButton} className='btn btn-danger col-lg-2'>
                        Show
                    </button>

                </div>
            </div>
        </div>

    )
} 