import { useState } from 'react'
import styles from './Products.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { SearchPanel } from '../components/SearchPanel'
import { ModalWindowProduct } from '../components/ModalWindowProduct'


export function Products() {

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <Header />
      <div className={styles.createProduct}>
        <button className='btn btn-warning' onClick={() => setModalOpen(true)}>
          Add a product
        </button>
      </div>
      <SearchPanel
        isProduct={true}
      />
      <ModalWindowProduct
        isVisible={modalOpen}
        onClose={() => setModalOpen(false)}
      />
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