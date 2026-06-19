import { useState } from 'react'
import { saveBusinessLead, saveServiceBooking } from '../lib/supabase'
import { saveLocalBooking } from '../lib/localFallbacks'
import { formatDateLabel, formatTimeRange } from '../lib/formatters'
import Calendar from '../components/Calendar'
import Seo from '../components/Seo'

const initialLead = {
  business_name: '',
  contact_name: '',
  email: '',
  phone: '',
  business_type: '',
  interest_area: 'tueste',
  monthly_volume: '',
  message: '',
}

const initialBooking = {
  requester_name: '',
  requester_email: '',
  company: '',
  phone: '',
  slot_id: '',
  notes: '',
}

export default function SchedulePage({ groupedSlots, setSlots, slotState }) {
  const availableDates = Object.keys(groupedSlots)
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [leadForm, setLeadForm] = useState(initialLead)
  const [bookingForm, setBookingForm] = useState(initialBooking)
  const [leadStatus, setLeadStatus] = useState('')
  const [bookingStatus, setBookingStatus] = useState('')

  const resolvedDate = availableDates.includes(selectedDate) ? selectedDate : availableDates[0] || ''
  const slotsForSelectedDate = groupedSlots[resolvedDate] || []
  const selectedSlot =
    slotsForSelectedDate.find((slot) => slot.id === selectedSlotId) || slotsForSelectedDate[0] || null

  const [manualTime, setManualTime] = useState('')
  const [manualName, setManualName] = useState('')
  const [manualEmail, setManualEmail] = useState('')
  const [manualPhone, setManualPhone] = useState('')
  const [manualNotes, setManualNotes] = useState('')

  async function handleLeadSubmit(event) {
    event.preventDefault()
    setLeadStatus('Enviando solicitud...')
    try {
      await saveBusinessLead(leadForm)
      setLeadStatus('Solicitud enviada con exito.')
      setLeadForm(initialLead)
    } catch (error) {
      setLeadStatus(error.message)
    }
  }

  async function handleBookingSubmit(event) {
    event.preventDefault()
    if (!selectedSlot) {
      setBookingStatus('Selecciona primero un horario disponible.')
      return
    }
    setBookingStatus('Reservando...')
    try {
      await saveServiceBooking({
        ...bookingForm,
        slot_id: selectedSlot.id,
        requested_date: selectedSlot.slot_date,
        requested_time: selectedSlot.slot_time,
        service_name: selectedSlot.service_name,
      })
      setBookingStatus('Reserva enviada con exito.')
      setBookingForm(initialBooking)
      setSelectedSlotId('')
      setSlots((currentSlots) =>
        currentSlots.map((slot) =>
          slot.id === selectedSlot.id
            ? { ...slot, remaining_spots: Math.max(0, slot.remaining_spots - 1) }
            : slot,
        ),
      )
    } catch (error) {
      // Fallback: save locally if Supabase no esta configurado
      try {
        saveLocalBooking({
          ...bookingForm,
          slot_id: selectedSlot.id,
          requested_date: selectedSlot.slot_date,
          requested_time: selectedSlot.slot_time,
          service_name: selectedSlot.service_name,
        })
        setBookingStatus('Reserva guardada localmente (sin Supabase).')
        setBookingForm(initialBooking)
        setSelectedSlotId('')
        setSlots((currentSlots) =>
          currentSlots.map((slot) =>
            slot.id === selectedSlot.id
              ? { ...slot, remaining_spots: Math.max(0, slot.remaining_spots - 1) }
              : slot,
          ),
        )
      } catch (err) {
        setBookingStatus(error.message || 'No se pudo reservar el horario.')
      }
    }
  }

  return (
    <main className="page-frame">
      <Seo title="Agenda | VogliO" description="Calendario de reuniones y reservas de servicios VogliO." />
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Agenda</p>
          <h1 className="page-title">Calendario de reuniones para contratar servicios.</h1>
          <p>
            {slotState === 'connected'
              ? 'Los dias y horas se actualizan desde Supabase.'
              : 'Los horarios actuales son demo hasta conectar Supabase.'}
          </p>
        </div>

        <div className="booking-selector-bar">
          <div style={{ maxWidth: 720 }}>
            <Calendar groupedSlots={groupedSlots} selectedDate={resolvedDate} onSelectDate={(d) => {
              setSelectedDate(d)
              setSelectedSlotId('')
            }} />
          </div>
          <label>
            Fecha
            <select
              value={resolvedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value)
                setSelectedSlotId('')
                setBookingStatus('')
              }}
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDateLabel(date)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Hora
            <select
              value={selectedSlot?.id || ''}
              onChange={(event) => {
                setSelectedSlotId(event.target.value)
                setBookingForm((currentValue) => ({ ...currentValue, slot_id: event.target.value }))
                setBookingStatus('')
              }}
            >
              {slotsForSelectedDate.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.slot_time} - {slot.service_name}
                </option>
              ))}
            </select>
          </label>
          <div className="booking-summary-box">
            <strong>{selectedSlot ? formatTimeRange(selectedSlot) : 'Sin horario'}</strong>
            <span>{selectedSlot ? `${selectedSlot.format} · ${selectedSlot.remaining_spots} cupos` : 'Sin cupos'}</span>
          </div>
        </div>
      </section>

      <section className="content-grid split">
        <article className="panel-card">
          <div className="section-heading compact">
            <p className="eyebrow">Contratar servicio</p>
            <h2>Reservar reunion</h2>
            <p>
              {selectedSlot
                ? `${selectedSlot.service_name} - ${formatDateLabel(selectedSlot.slot_date)} - ${formatTimeRange(selectedSlot)}`
                : 'Selecciona fecha y horario para reservar.'}
            </p>
          </div>
          <form className="form-grid" onSubmit={handleBookingSubmit}>
            <label>
              Fecha seleccionada
              <input value={selectedSlot ? formatDateLabel(selectedSlot.slot_date) : ''} readOnly />
            </label>
            <label>
              Hora seleccionada
              <input value={selectedSlot ? formatTimeRange(selectedSlot) : ''} readOnly />
            </label>
            <label>
              Nombre
              <input
                required
                value={bookingForm.requester_name}
                onChange={(event) =>
                  setBookingForm((currentValue) => ({ ...currentValue, requester_name: event.target.value }))
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={bookingForm.requester_email}
                onChange={(event) =>
                  setBookingForm((currentValue) => ({ ...currentValue, requester_email: event.target.value }))
                }
              />
            </label>
            <label>
              Empresa
              <input
                value={bookingForm.company}
                onChange={(event) =>
                  setBookingForm((currentValue) => ({ ...currentValue, company: event.target.value }))
                }
              />
            </label>
            <label>
              Telefono
              <input
                value={bookingForm.phone}
                onChange={(event) =>
                  setBookingForm((currentValue) => ({ ...currentValue, phone: event.target.value }))
                }
              />
            </label>
            <label>
              Notas
              <textarea
                rows="4"
                value={bookingForm.notes}
                onChange={(event) =>
                  setBookingForm((currentValue) => ({ ...currentValue, notes: event.target.value }))
                }
              />
            </label>
            <button type="submit" className="action-primary block">
              Confirmar reserva
            </button>
            <p className="status-line">{bookingStatus}</p>
          </form>
        </article>

        {/* Formulario comercial ocultado a petición del usuario */}
          <article className="panel-card dark-panel">
            <div className="section-heading compact">
              <p className="eyebrow">Reserva libre</p>
              <h2>Solicitar reserva en fecha</h2>
              <p>Si no existe un horario disponible puedes pedir una reserva indicando nombre, correo y hora deseada.</p>
            </div>
            <form className="reserve-free-form"
              onSubmit={async (e) => {
                e.preventDefault()
                if (!selectedDate) {
                  setBookingStatus('Selecciona una fecha en el calendario primero.')
                  return
                }
                setBookingStatus('Enviando solicitud...')
                try {
                  await saveServiceBooking({
                    requester_name: manualName,
                    requester_email: manualEmail,
                    phone: manualPhone,
                    slot_id: undefined,
                    requested_date: selectedDate,
                    requested_time: manualTime || 'Por definir',
                    service_name: 'Solicitud libre',
                    notes: manualNotes,
                  })
                  setBookingStatus('Solicitud enviada. Nos contactaremos para confirmar.')
                  setManualName('')
                  setManualEmail('')
                  setManualPhone('')
                  setManualTime('')
                  setManualNotes('')
                } catch (err) {
                  setBookingStatus(err.message || 'Error al enviar la solicitud.')
                }
              }}
            >
                <div className="hint">Selecciona una fecha en el calendario y completa tus datos.</div>
                <div className="small-row">
                  <label>
                    Fecha
                    <input value={selectedDate ? selectedDate : ''} readOnly />
                  </label>
                  <label>
                    Hora
                    <input value={manualTime} onChange={(e) => setManualTime(e.target.value)} placeholder="ej. 14:30" />
                  </label>
                </div>

                <label>
                  Nombre
                  <input required value={manualName} onChange={(e) => setManualName(e.target.value)} />
                </label>
                <div className="small-row">
                  <label>
                    Email
                    <input required type="email" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} />
                  </label>
                  <label>
                    Telefono
                    <input value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} />
                  </label>
                </div>

                <label>
                  Notas (opcional)
                  <textarea rows="3" value={manualNotes} onChange={(e) => setManualNotes(e.target.value)} />
                </label>
                <button type="submit" className="action-primary block">Solicitar reserva</button>
                <p className="status-line">{bookingStatus}</p>
            </form>
          </article>
      </section>
    </main>
  )
}
