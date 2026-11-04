// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ProductProvider } from './Context/ProductContext'
import { CategoryProvider } from './Context/CategoryContext'
import { SizeProvider } from './Context/SizeContext'
import { ColorProvider } from './Context/ColorContext'
import { OrderProvider } from './Context/OrderContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  // </StrictMode>,
  <OrderProvider>
    <CategoryProvider>
      <ProductProvider>
        <SizeProvider>
          <ColorProvider>
            <App />
          </ColorProvider>
        </SizeProvider>
      </ProductProvider>
    </CategoryProvider>
  </OrderProvider>
)
