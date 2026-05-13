import { useState } from 'react'
import styles from './scss/SearchPanel.module.scss'
import { Link } from 'react-router-dom'
import { FiltersModalDishes } from './FiltersModalDishes'
import { FiltersModalProducts } from './FiltersModalProducts'

export function SearchPanel({ isProduct, onSearchSubmit, currentFilters, onFiltersChange }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [searchText, setSearchText] = useState("");
    const [sortBy, setSortBy] = useState("name"); // Дефолтная сортировка бэкенда

    let CurrentModal = FiltersModalDishes;
    let SearchTabSize = 'col-lg-6';

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
    };

    // При клике на кнопку Show собираем все активные фильтры и передаем их родителю
    const handleShowClick = () => {
        onSearchSubmit({
            search: searchText,
            sortBy: isProduct ? sortBy : null
        });
    };

    const CurrentPanel = isProduct ? (
        <div id={styles.sorting} className="col-lg-2">
            <select className="form-control" value={sortBy} onChange={handleSortChange}>
                <option value="name">По названию (А-Я)</option>
                <option value="calories">По калориям</option>
                <option value="proteins">По белка́м</option>
                <option value="fats">По жирам</option>
                <option value="carbohydrates">По углеводам</option>
            </select>
        </div>
    ) : null;

    if (isProduct) {
        CurrentModal = FiltersModalProducts;
        SearchTabSize = 'col-lg-4';
    }

    return (
        <div>
            {/* Передаем модалке текущие фильтры и колбэк для их изменения */}
            <CurrentModal
                isVisible={modalOpen}
                onClose={() => setModalOpen(false)}
                currentFilters={currentFilters}
                onFiltersChange={onFiltersChange}
            />

            <div className='container'>
                <div id={styles.searchPanel} className="row">
                    <div id={styles.filters} className="col-lg-4" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
                        <img id={styles.filtersImage} src="../filter.png" alt="" />
                        <p id={styles.filtersText}>Filters</p>
                        <img id={styles.dropDownArrow} src="../down-chevron.png" alt="" />
                    </div>

                    <div id={styles.searchTab} className={SearchTabSize}>
                        <input
                            type="text"
                            name="query"
                            placeholder="Search..."
                            className="form-control"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    {CurrentPanel}

                    <button
                        id={styles.searchButton}
                        className='btn btn-danger col-lg-2'
                        onClick={handleShowClick}
                    >
                        Show
                    </button>
                </div>
            </div>
        </div>
    )
}
