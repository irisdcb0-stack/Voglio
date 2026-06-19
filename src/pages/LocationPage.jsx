import { businessFacts } from '../data/fallbackData'

export default function LocationPage() {
  return (
    <main className="page-frame">
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Direccion y contacto</p>
          <h1 className="page-title">VogliO opera en Cochabamba y mantiene contacto directo por redes.</h1>
        </div>
        <div className="content-grid split">
          <article className="panel-card">
            <h2>Visitanos</h2>
            <ul className="detail-list">
              <li>
                <strong>Ciudad</strong>
                <span>{businessFacts.city}</span>
              </li>
              <li>
                <strong>Telefono</strong>
                <span>{businessFacts.phone}</span>
              </li>
              <li>
                <strong>Instagram</strong>
                <a href={businessFacts.instagram} target="_blank" rel="noreferrer">
                  voglio.bo
                </a>
              </li>
              <li>
                <strong>Facebook</strong>
                <a href={businessFacts.facebook} target="_blank" rel="noreferrer">
                  Perfil de VogliO
                </a>
              </li>
            </ul>
          </article>
          <article className="panel-card dark-panel">
            <h2>Acciones rapidas</h2>
            <div className="stack-links">
              <a className="action-primary" href={businessFacts.maps} target="_blank" rel="noreferrer">
                Abrir mapa
              </a>
              <a className="action-secondary" href={`tel:+591${businessFacts.phone}`}>
                Llamar
              </a>
            </div>
            <p>La pagina de direccion sirve como punto de confianza para negocios que quieren contratar y visitar.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
