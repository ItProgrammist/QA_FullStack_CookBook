import styles from '../products/Products.module.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'


export function Header() {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(prev => !prev);
    };

    return (
        <>
            <div className={styles.header}>
                <p className={styles.headline}>COOK | CREATE | ENJOY</p>
                <img className={styles.bannerImage} src="../banner.jpg" />
                <div className={styles.menuBlock}>
                    <img src="../menu.png"
                        className={`${styles.menuImg} ${open ? styles.open : ""}`}
                        onClick={toggle} />
                    <div className={`${styles.dropdown} ${open ? styles.open : ""}`}>
                        <ul>
                            <Link to='/products'><li>All Products</li></Link>
                            <Link to='/' id={styles.homePageLink}>
                                <li>
                                    <img className={styles.homeImage} src="../home.png" />
                                </li>
                            </Link>
                            <Link to='/dishes'><li>All Dishes</li></Link>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}