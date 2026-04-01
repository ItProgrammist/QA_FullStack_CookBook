import { useState } from 'react'
import styles from './scss/SearchPanel.module.scss'
import { Link } from 'react-router-dom'
import { Header } from './Header'


export function SearchPanel() {

    const [details, setDetails] = useState({
        title: 'Null',
        description: 'LEGENDARY Description',
        buttonText: "John Cena's CLICK"
    })

    return (
        <div className={styles.searchPanel}>
            <div className="searchTab">

            </div>
            <div className="filters">

            </div>
            <button className='btn btn-danger'>
                Show
            </button>
        </div>
    )
} 