import { useState, useEffect } from 'react'
import styles from './Products.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { SearchPanel } from '../components/SearchPanel'
import { ModalWindowProduct } from '../components/ModalWindowProduct'

export function Products() {
  const [modalOpen, setModalOpen] = useState(false)

  const [products, setProducts] = useState([])

  const loadProducts = () => {
    fetch('http://localhost:5254/api/product')
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error("Failed to fetch products:", err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    loadProducts();
  };

  return (
    <div>
      <Header />
      <div className={styles.createProduct}>
        <button className='btn btn-warning' onClick={() => setModalOpen(true)}>
          Add a product
        </button>
      </div>
      <SearchPanel isProduct={true} />

      <ModalWindowProduct isVisible={modalOpen} onClose={handleCloseModal} />

      <div className={styles.productsBody}>
        <div className="container">
          <div className="col-lg-12">
            <div className="row">

              {products.length > 0 ? (
                products.map(item => (
                  <div key={item.id} className="col-lg-4 d-flex mb-4">
                    <ProductCard product={item} />
                  </div>
                ))
              ) : (
                <div className="col-lg-12 text-center py-5">
                  <p style={{ color: '#6c757d' }}>No products found.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
