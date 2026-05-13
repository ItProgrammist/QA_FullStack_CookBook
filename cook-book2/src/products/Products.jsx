/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState, useEffect } from 'react'
import styles from './Products.module.scss'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { SearchPanel } from '../components/SearchPanel'
import { ModalWindowProduct } from '../components/ModalWindowProduct'

import { ModalEditProduct } from '../components/ModalEditProduct'
import { ModalDeleteProduct } from '../components/ModalDeleteProduct'
import { ProductDetails } from '../components/ProductDetails'

export function Products() {
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    sortBy: "name",
    category: "",
    flags: "",
    cookingNecessity: ""
  });

  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteProductId, setDeleteProductId] = useState("")
  const [products, setProducts] = useState([])

  const loadProducts = (searchParams = {}) => {
    const currentQuery = { ...activeFilters, ...searchParams };

    let url = 'http://localhost:5254/api/product?';

    if (currentQuery.search) url += `search=${encodeURIComponent(currentQuery.search)}&`;
    if (currentQuery.sortBy) url += `sortBy=${currentQuery.sortBy}&`;

    if (currentQuery.category !== undefined && currentQuery.category !== "") {
      url += `category=${currentQuery.category}&`;
    }
    if (currentQuery.flags !== undefined && currentQuery.flags !== "") {
      url += `flags=${currentQuery.flags}&`;
    }

    if (currentQuery.cookingNecessity !== undefined && currentQuery.cookingNecessity !== "") {
      url += `cookingNecessity=${currentQuery.cookingNecessity}&`;
    }

    if (url.endsWith('&') || url.endsWith('?')) {
      url = url.slice(0, -1);
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        setProducts(data);

        if (selectedProduct) {
          const updatedProduct = data.find(p => p.id === selectedProduct.id);
          if (updatedProduct) setSelectedProduct(updatedProduct);
        }
      })
      .catch(err => console.error("Failed to fetch products:", err));
  };

  const handleSearchSubmit = (searchAndSortParams) => {
    const updated = { ...activeFilters, ...searchAndSortParams };
    setActiveFilters(updated);
    loadProducts(updated);
  };

  const handleFiltersChange = (newFilters) => {
    const updated = { ...activeFilters, ...newFilters };
    setActiveFilters(updated);
    loadProducts(updated);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    loadProducts();
  };

  const handleOpenEdit = (productObj) => {
    setSelectedProduct(productObj);
    setEditModalOpen(true);
  };

  const handleOpenSeeMore = (productObj) => {
    setSelectedProduct(productObj);
    setDetailsModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeleteProductId(id);
    setDeleteModalOpen(true);
  };

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
        onSearchSubmit={handleSearchSubmit}
        currentFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />

      <ModalWindowProduct isVisible={modalOpen} onClose={handleCloseModal} />

      <ModalEditProduct
        isVisible={editModalOpen}
        product={selectedProduct}
        onClose={() => { setEditModalOpen(false); loadProducts(); }}
      />

      <ProductDetails isVisible={detailsModalOpen} product={selectedProduct} onClose={() => setDetailsModalOpen(false)} />

      <ModalDeleteProduct isVisible={deleteModalOpen} productId={deleteProductId} onClose={() => { setDeleteModalOpen(false); loadProducts(); }} />

      <div className={styles.productsBody}>
        <div className="container">
          <div className="col-lg-12">
            <div className="row">
              {products.length > 0 ? (
                products.map(item => (
                  <div key={item.id} className="col-lg-4 d-flex mb-4">
                    {/* ПЕРЕДАЕМ КОЛБЭК-ФУНКЦИИ В КАРТОЧКУ */}
                    <ProductCard
                      product={item}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                      onSeeMore={handleOpenSeeMore}
                    />
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
