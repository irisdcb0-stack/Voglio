import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../lib/formatters'
import { saveOrderRequest, hasSupabaseConfig } from '../lib/supabase'
import { saveLocalOrder } from '../lib/localFallbacks'
import Modal from './Modal'

export default function CartDrawer({ cart, cartTotal, open, onClose, onClearCart, onUpdateQuantity }) {
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', message: '' })
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const resetCheckoutForm = () => {
    setCustomerName('')
    setCustomerEmail('')
    setPhone('')
    setNotes('')
    setCheckoutError('')
  }

  const closeCheckout = () => {
    if (loading) return
    setCheckoutOpen(false)
    setCheckoutError('')
  }

  const handleCheckout = async () => {
    setCheckoutError('')

    if (!customerName.trim() || !customerEmail.trim()) {
      setCheckoutError('Nombre y correo son requeridos.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        phone: phone.trim() || null,
        notes: notes.trim() || null,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: cartTotal,
        created_at: new Date().toISOString(),
      }

      let savedRemotely = false
      let remoteError = null

      if (hasSupabaseConfig) {
        try {
          await saveOrderRequest(payload)
          savedRemotely = true
        } catch (error) {
          remoteError = error
          console.error(error)
        }
      }

      saveLocalOrder(payload)
      onClearCart()
      onClose()
      setCheckoutOpen(false)
      resetCheckoutForm()
      setModal({
        open: true,
        title: 'Compra registrada',
        message: savedRemotely
          ? 'Pedido registrado correctamente.'
          : `Pedido guardado localmente.${remoteError ? ' Supabase no respondio, pero la compra no se perdio.' : ''}`,
      })
    } catch (error) {
      console.error(error)
      setCheckoutOpen(false)
      setModal({
        open: true,
        title: 'Error',
        message: error?.message || 'Error al registrar el pedido.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={open ? 'cart-drawer-shell open' : 'cart-drawer-shell'} aria-hidden={!open} inert={!open}>
        <button type="button" className="cart-drawer-backdrop" onClick={onClose} aria-label="Cerrar carrito" />

        <aside className="cart-drawer-panel" aria-label="Carrito">
          <div className="cart-drawer-header">
            <div>
              <p className="eyebrow">Carrito</p>
              <h2>Productos seleccionados</h2>
            </div>
            <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Cerrar panel">
              x
            </button>
          </div>

          {cart.length ? (
            <>
              <div className="cart-drawer-list">
                {cart.map((item) => (
                  <article className="cart-drawer-item" key={item.id}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div
                        className="thumb"
                        aria-hidden
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 8,
                          display: 'grid',
                          placeItems: 'center',
                          background: 'linear-gradient(135deg,#0d69ff,#2fd1ff)',
                          color: '#03101f',
                          fontWeight: 800,
                        }}
                      >
                        {item.imageLabel ? item.imageLabel.slice(0, 2) : (item.name || '').slice(0, 2)}
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.format}</span>
                      </div>
                    </div>
                    <div className="cart-drawer-controls">
                      <button type="button" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <strong>{formatMoney(item.price * item.quantity)}</strong>
                  </article>
                ))}
              </div>

              <div className="cart-drawer-footer">
                <div>
                  <span>Total</span>
                  <strong>{formatMoney(cartTotal)}</strong>
                </div>
                <div className="stack-links">
                  <Link className="action-primary" to="/tienda" onClick={onClose}>
                    Seguir comprando
                  </Link>
                  <button type="button" className="ghost-button" onClick={onClearCart}>
                    Vaciar carrito
                  </button>
                  <button
                    type="button"
                    className="action-primary"
                    onClick={() => {
                      setCheckoutError('')
                      setCheckoutOpen(true)
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrar compra'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="cart-drawer-empty">
              <p>Tu carrito esta vacio. Agrega cafe o accesorios desde la tienda.</p>
              <Link className="action-primary" to="/tienda" onClick={onClose}>
                Ir a la tienda
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Modal open={modal.open} title={modal.title} onClose={() => setModal({ open: false, title: '', message: '' })}>
        <p>{modal.message}</p>
      </Modal>

      <Modal
        open={checkoutOpen}
        title="Completa tus datos"
        onClose={closeCheckout}
        onPrimary={handleCheckout}
        primaryLabel={loading ? 'Registrando...' : 'Confirmar y enviar'}
        primaryDisabled={loading}
        secondaryLabel="Cancelar"
      >
        <div style={{ display: 'grid', gap: 8 }}>
          {checkoutError && <p className="form-error">{checkoutError}</p>}
          <label>
            Nombre (requerido)
            <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
          </label>
          <label>
            Correo electronico (requerido)
            <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} />
          </label>
          <label>
            Telefono
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label>
            Notas
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>
        </div>
      </Modal>
    </>
  )
}
