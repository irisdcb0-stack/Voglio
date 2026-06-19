import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../lib/formatters'
import { saveOrderRequest, hasSupabaseConfig } from '../lib/supabase'
import { saveLocalOrder } from '../lib/localFallbacks'
import Modal from './Modal'
import { diagnoseSupabase } from '../lib/supabase'

export default function CartDrawer({ cart, cartTotal, open, onClose, onClearCart, onUpdateQuantity }) {
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, title: '', message: '' })
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  return (
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
                    <div className="thumb" aria-hidden style={{ width: 64, height: 64, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#0d69ff,#2fd1ff)', color: '#03101f', fontWeight: 800 }}>
                      {item.imageLabel ? item.imageLabel.slice(0,2) : (item.name || '').slice(0,2)}
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
                    if (!hasSupabaseConfig) {
                      alert('Supabase no está configurado. Revisa tus variables de entorno.')
                      return
                    }
                    // open checkout form modal
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
      <Modal open={modal.open} title={modal.title} onClose={() => setModal({ open: false, title: '', message: '' })}>
        <p>{modal.message}</p>
      </Modal>
      <Modal
        open={checkoutOpen}
        title="Completa tus datos"
        onClose={() => setCheckoutOpen(false)}
        onPrimary={async () => {
          // validate
          if (!customerName.trim() || !customerEmail.trim()) {
            setModal({ open: true, title: 'Datos incompletos', message: 'Nombre y correo son requeridos.' })
            return
          }

          setLoading(true)
          try {
            const payload = {
              customer_name: customerName,
              customer_email: customerEmail,
              phone: phone || null,
              notes: notes || null,
              items: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
              total: cartTotal,
              created_at: new Date().toISOString(),
            }
            await saveOrderRequest(payload)
            // save locally as fallback
            try {
              saveLocalOrder(payload)
            } catch {
              // fallback local save failed, but order was sent to Supabase
            }

            onClearCart()
            onClose()
            setCustomerName('')
            setCustomerEmail('')
            setPhone('')
            setNotes('')
            
            // Close checkout modal first, then show success modal
            setCheckoutOpen(false)
            setTimeout(() => {
              setModal({ open: true, title: 'Compra registrada', message: 'Pedido registrado correctamente.' })
            }, 100)
          } catch (err) {
            console.error(err)
            const msg = err?.message || 'Error al registrar el pedido.'
            let details = ''
            if (String(msg).includes('401')) {
              const diag = await diagnoseSupabase()
              details = '\n\nCódigo 401: revisa que `VITE_SUPABASE_ANON_KEY` y `VITE_SUPABASE_URL` estén correctos y reinicia el servidor de desarrollo.'
              details += '\n\nDiagnóstico: ' + JSON.stringify(diag)
            }
            
            // Close checkout modal first, then show error modal
            setCheckoutOpen(false)
            setTimeout(() => {
              setModal({ open: true, title: 'Error', message: msg + details })
            }, 100)
          } finally {
            setLoading(false)
          }
        }}
        primaryLabel="Confirmar y enviar"
        secondaryLabel="Cancelar"
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            Nombre (requerido)
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </label>
          <label>
            Correo electrónico (requerido)
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          </label>
          <label>
            Teléfono
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            Notas
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>
      </Modal>
    </div>
  )
}
