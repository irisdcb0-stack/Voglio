import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { fallbackCatalog, fallbackSlots } from './data/fallbackData'
import { fetchCatalogItems, fetchServiceSlots, hasSupabaseConfig } from './lib/supabase'
import { groupSlotsByDay, readStoredCart } from './lib/formatters'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import CartDrawer from './components/CartDrawer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import LocationPage from './pages/LocationPage'
import StorePage from './pages/StorePage'
import SchedulePage from './pages/SchedulePage'
import RegistrationPage from './pages/RegistrationPage'
import AdminPage from './pages/AdminPage'

function App() {
  const [catalog, setCatalog] = useState(fallbackCatalog)
  const [slots, setSlots] = useState(fallbackSlots)
  const [catalogState, setCatalogState] = useState('fallback')
  const [slotState, setSlotState] = useState('fallback')
  const [cart, setCart] = useState(readStoredCart)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('voglio-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = cartOpen ? 'hidden' : previousOverflow

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [cartOpen])

  useEffect(() => {
    async function loadData() {
      if (!hasSupabaseConfig) {
        return
      }

      try {
        const remoteCatalog = await fetchCatalogItems()
        if (remoteCatalog.length) {
          setCatalog(remoteCatalog)
          setCatalogState('connected')
        }
      } catch {
        setCatalogState('fallback')
      }

      try {
        const remoteSlots = await fetchServiceSlots()
        if (remoteSlots.length) {
          setSlots(remoteSlots)
          setSlotState('connected')
        }
      } catch {
        setSlotState('fallback')
      }
    }

    loadData()
  }, [])

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          format: product.format,
          price: product.price,
          quantity: 1,
        },
      ]
    })
    setCartOpen(true)
  }

  function updateQuantity(itemId, nextQuantity) {
    if (nextQuantity <= 0) {
      setCart((currentCart) => currentCart.filter((item) => item.id !== itemId))
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) => (item.id === itemId ? { ...item, quantity: nextQuantity } : item)),
    )
  }

  function clearCart() {
    setCart([])
  }

  const cartCount = useMemo(
    () => cart.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [cart],
  )

  const cartTotal = useMemo(
    () => cart.reduce((accumulator, item) => accumulator + item.quantity * item.price, 0),
    [cart],
  )

  const featuredProducts = useMemo(
    () => catalog.filter((item) => item.featured).slice(0, 3),
    [catalog],
  )

  const groupedSlots = useMemo(() => groupSlotsByDay(slots), [slots])

  return (
    <HashRouter>
      <div className="app-shell">
        <SiteHeader cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
        <CartDrawer
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onClearCart={clearCart}
          onUpdateQuantity={updateQuantity}
          open={cartOpen}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                catalogState={catalogState}
                slotState={slotState}
                featuredProducts={featuredProducts}
                groupedSlots={groupedSlots}
                onAddToCart={addToCart}
              />
            }
          />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage groupedSlots={groupedSlots} />} />
          <Route path="/direccion" element={<LocationPage />} />
          <Route
            path="/tienda"
            element={<StorePage catalog={catalog} catalogState={catalogState} onAddToCart={addToCart} />}
          />
          <Route
            path="/agenda"
            element={<SchedulePage groupedSlots={groupedSlots} setSlots={setSlots} slotState={slotState} />}
          />
          <Route path="/registro" element={<RegistrationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <HomePage
                catalogState={catalogState}
                slotState={slotState}
                featuredProducts={featuredProducts}
                groupedSlots={groupedSlots}
                onAddToCart={addToCart}
              />
            }
          />
        </Routes>
        <SiteFooter />
      </div>
    </HashRouter>
  )
}

export default App
