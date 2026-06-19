import { useState } from 'react'
import { saveBusinessLead } from '../lib/supabase'
import { saveLocalLead } from '../lib/localFallbacks'
import Seo from '../components/Seo'

const initial = { business_name: '', contact_name: '', business_type: '', email: '', phone: '', interest_area: 'tueste', monthly_volume: '', message: '' }

export default function RegistrationPage() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('Enviando...')
    try {
      await saveBusinessLead(form)
      setStatus('Registro enviado a Supabase.')
      setForm(initial)
    } catch (err) {
      try {
        saveLocalLead(form)
        setStatus('Registro guardado localmente (sin Supabase).')
        setForm(initial)
      } catch (e) {
        setStatus('No se pudo guardar el registro.')
      }
    }
  }

  return (
    <main className="page-frame">
      <Seo title="Registro | VogliO" description="Registro comercial y solicitudes B2B a VogliO." />
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Registro</p>
          <h1 className="page-title">Registro comercial y solicitud de contacto</h1>
          <p>Registra tu negocio o solicita contacto comercial con VogliO.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Negocio
            <input required value={form.business_name} onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))} />
          </label>
          <label>
            Tipo de negocio
            <select required value={form.business_type} onChange={(e) => setForm((f) => ({ ...f, business_type: e.target.value }))}>
              <option value="">Selecciona tipo</option>
              <option value="cafeteria">Cafetería</option>
              <option value="restaurante">Restaurante</option>
              <option value="distribuidor">Distribuidor</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label>
            Contacto
            <input required value={form.contact_name} onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))} />
          </label>
          <label>
            Email
            <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </label>
          <label>
            Telefono
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </label>
          <label>
            Interés
            <select value={form.interest_area} onChange={(e) => setForm((f) => ({ ...f, interest_area: e.target.value }))}>
              <option value="tueste">Tueste</option>
              <option value="blends">Blends</option>
              <option value="equipment">Equipamiento</option>
              <option value="training">Capacitación</option>
            </select>
          </label>
          <label>
            Volumen mensual
            <input
              value={form.monthly_volume}
              onChange={(event) => setForm((currentValue) => ({ ...currentValue, monthly_volume: event.target.value }))}
            />
          </label>
          <label>
            Mensaje
            <textarea rows="4" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
          </label>
          <button type="submit" className="action-primary block">Enviar registro</button>
          <p className="status-line">{status}</p>
        </form>
      </section>
    </main>
  )
}
