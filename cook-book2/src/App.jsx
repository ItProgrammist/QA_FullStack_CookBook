import { useState } from 'react'
import styles from './App.module.scss'
import { Details } from './components/Details'
import { Link } from 'react-router-dom'
import { Header } from './components/Header'
import { DishCard } from './components/DishCard'

// const title = 'First component'

export function App() {

  const [details, setDetails] = useState({
    title: 'Null',
    description: 'LEGENDARY Description',
    buttonText: "John Cena's CLICK"
  })

  return (
    <div>
      <Header />
      <div className={styles.createDish}>
          <button className='btn btn-warning'>Create a dish</button>
      </div>
      <div className={styles.dishesBody}>
        <div className="container">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4">
                <DishCard />
              </div>
              <div className="col-lg-4">
                <DishCard />
              </div>
              <div className="col-lg-4">
                <DishCard />
              </div>
              <div className="col-lg-4">
                <DishCard />
              </div>
              <div className="col-lg-4">
                <DishCard />
              </div>
              <div className="col-lg-4">
                <DishCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 