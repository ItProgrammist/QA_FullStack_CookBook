import { useState } from 'react'
import styles from './Products.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { SearchPanel } from '../components/SearchPanel'


export function Products() {

  const [details, setDetails] = useState({
    title: 'Null',
    description: 'LEGENDARY Description',
    buttonText: "John Cena's CLICK"
  })

  return (
    <div>
      <Header />
      <div className={styles.createProduct}>
        <button className='btn btn-warning'>Create a product</button>
      </div>
      <SearchPanel />
      <div className={styles.productsBody}>
        <div className="container">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4">
                <ProductCard />
              </div>
              <div className="col-lg-4">
                <ProductCard />
              </div>
              <div className="col-lg-4">
                <ProductCard />
              </div>
              <div className="col-lg-4">
                <ProductCard />
              </div>
              <div className="col-lg-4">
                <ProductCard />
              </div>
              <div className="col-lg-4">
                <ProductCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 