import { useState, useEffect } from 'react'
import { readLocalBookings } from '../lib/localFallbacks'
import { readLocalBookings as readBookingsAlias } from '../lib/localFallbacks'
import { fetchServiceBookings, fetchOrderRequests, fetchBusinessLeads, hasSupabaseConfig, diagnoseSupabase } from '../lib/supabase'

export default function AdminPage() {
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [leads, setLeads] = useState([])
  const [remoteMode, setRemoteMode] = useState(false)

  useEffect(() => {
    // load local data first
    try {
      const b = JSON.parse(localStorage.getItem('voglio-local-bookings') || '[]')
      const o = JSON.parse(localStorage.getItem('voglio-local-orders') || '[]')
      const l = JSON.parse(localStorage.getItem('voglio-local-leads') || '[]')
      setBookings(b)
      setOrders(o)
      setLeads(l)
    } catch {
      setBookings([])
      setOrders([])
      setLeads([])
    }

    // if Supabase available, try to load remote data
    async function loadRemote() {
      if (!hasSupabaseConfig) return
      try {
        const [rb, ro, rl] = await Promise.all([fetchServiceBookings(), fetchOrderRequests(), fetchBusinessLeads()])
        setBookings(rb)
        setOrders(ro)
        setLeads(rl)
        setRemoteMode(true)
      } catch {
        // keep local data
      }
    }

    loadRemote()
  }, [])

  function exportJson(list, name) {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function clearAll() {
    localStorage.removeItem('voglio-local-bookings')
    localStorage.removeItem('voglio-local-orders')
    localStorage.removeItem('voglio-local-leads')
    setBookings([])
    setOrders([])
    setLeads([])
  }

  function reloadLocal() {
    try {
      const b = JSON.parse(localStorage.getItem('voglio-local-bookings') || '[]')
      const o = JSON.parse(localStorage.getItem('voglio-local-orders') || '[]')
      const l = JSON.parse(localStorage.getItem('voglio-local-leads') || '[]')
      setBookings(b)
      setOrders(o)
      setLeads(l)
    } catch {
      // ignore
    }
  }

  return (
    <main className="page-frame">
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Admin {remoteMode ? '(Supabase)' : '(local)'}</p>
          <h1 className="page-title">Datos guardados {remoteMode ? 'en Supabase' : 'localmente'}</h1>
          <p>Vista de reservas, pedidos y registros — local o desde Supabase si está configurado.</p>
          <div style={{ marginTop: 8 }}>
            <button className="ghost-button" onClick={async () => {
              if (!hasSupabaseConfig) {
                alert('Supabase no está configurado (variables VITE_SUPABASE_URL/ANON_KEY faltantes).')
                return
              }
              const res = await diagnoseSupabase()
              alert('Diagnóstico Supabase:\n' + JSON.stringify(res, null, 2))
            }}>Comprobar Supabase</button>
          </div>
        </div>

        <div className="content-grid split">
          <article className="panel-card">
            <h2>Reservas</h2>
            <button className="action-secondary" onClick={() => exportJson(bookings, 'bookings')}>Exportar JSON</button>
            <ul>
              {bookings.map((b, i) => (
                <li key={b.id || `booking-${i}`}>{b.requester_name || b.contact_name} — {b.requested_date} {b.requested_time}</li>
              ))}
            </ul>
          </article>

          <article className="panel-card dark-panel">
            <h2>Pedidos</h2>
            <button className="action-secondary" onClick={() => exportJson(orders, 'orders')}>Exportar JSON</button>
            <ul>
              {orders.map((o, i) => (
                <li key={o.id || `order-${i}`} style={{ marginBottom: 8 }}>
                  <strong>{o.customer_name || 'Cliente anónimo'}</strong> — {o.total}
                  <div style={{ fontSize: 13, color: '#cfe9ff' }}>
                    {o.customer_email && <span>{o.customer_email} </span>}
                    {o.phone && <span>• {o.phone} </span>}
                    <div>{o.notes}</div>
                    <details>
                      <summary style={{ cursor: 'pointer' }}>Items ({Array.isArray(o.items) ? o.items.length : '—'})</summary>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(o.items, null, 2)}</pre>
                    </details>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="panel-card">
          <h2>Registros</h2>
          <button className="action-secondary" onClick={() => exportJson(leads, 'leads')}>Exportar JSON</button>
          <ul>
            {leads.map((l, i) => (
            <li key={l.id || `lead-${i}`} style={{ marginBottom: 8 }}>
              <strong>{l.business_name}</strong>
              <div style={{ fontSize: 13, color: '#cfe9ff' }}>
                {l.business_type && <div>Tipo: {l.business_type}</div>}
                {l.contact_name && <div>Contacto: {l.contact_name}</div>}
                {l.email && <div>{l.email}</div>}
                {l.phone && <div>{l.phone}</div>}
                <div>{l.message}</div>
              </div>
            </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="ghost-button" onClick={reloadLocal}>Recargar datos locales</button>
        </div>
      </section>
    </main>
  )
}
