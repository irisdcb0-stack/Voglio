import { Link } from 'react-router-dom'
import { serviceCards } from '../data/fallbackData'
import { formatDateLabel, formatTimeRange } from '../lib/formatters'

export default function ServicesPage({ groupedSlots }) {
  const nextDays = Object.entries(groupedSlots).slice(0, 3)

  return (
    <main className="page-frame">
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Servicios</p>
          <h1 className="page-title">Tueste, blends, equipamiento y diseno operativo para cafeterias y marcas.</h1>
          <p>La pagina ahora separa los servicios para que sea claro que VogliO no solo informa: tambien vende y agenda.</p>
        </div>
        <div className="content-grid triple">
          {serviceCards.map((service) => (
            <article className="panel-card" key={service.id}>
              <p className="eyebrow">{service.id}</p>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <ul className="bullet-list compact">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Proximas reuniones</p>
          <h2>Dias y horas visibles para contratar servicio.</h2>
        </div>
        <div className="slot-grid">
          {nextDays.flatMap(([date, items]) =>
            items.map((slot) => (
              <article className="slot-card" key={slot.id}>
                <strong>{slot.service_name}</strong>
                <span>{formatDateLabel(date)}</span>
                <span>{formatTimeRange(slot)}</span>
                <span>{slot.format}</span>
                <span>{slot.remaining_spots} cupos disponibles</span>
                <Link className="inline-link" to="/agenda">
                  Reservar
                </Link>
              </article>
            )),
          )}
        </div>
      </section>
    </main>
  )
}
