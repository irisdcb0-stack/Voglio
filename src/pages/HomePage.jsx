import { Link } from 'react-router-dom'
import { fallbackStats, menuHighlights, shopBenefits, valuePillars } from '../data/fallbackData'
import ProductCard from '../components/ProductCard'
import { formatDateLabel, formatTimeRange } from '../lib/formatters'

const brandGallery = [
  {
    src: new URL('../assets/voglio-images/packaging-1.png', import.meta.url).href,
    alt: 'Empaques de cafe VogliO con diseno colorido.',
    title: 'Packaging y etiquetas',
  },
  {
    src: new URL('../assets/voglio-images/gift-kit.png', import.meta.url).href,
    alt: 'Kit de regalo de VogliO con cafe y prensa francesa.',
    title: 'Kits y regalos',
  },
  {
    src: new URL('../assets/voglio-images/award-post.png', import.meta.url).href,
    alt: 'Publicacion de VogliO sobre The Best Coffee Shops Bolivia.',
    title: 'Comunidad cafetera',
  },
]

export default function HomePage({ featuredProducts, groupedSlots, onAddToCart, catalogState, slotState }) {
  const nextAvailableDay = Object.entries(groupedSlots)[0]

  return (
    <main className="page-frame">
      <section className="hero-surface">
        <div className="hero-copy">
          <p className="eyebrow">We Coffee Together</p>
          <h1>Street coffee identity para una tostaduria que vende cafe, impulsa comunidad y mueve marca.</h1>
          <p className="hero-text">
            VogliO mezcla cafe de especialidad, consultoria, accesorios y una presencia visual urbana inspirada en
            sus redes, su tienda y su energia de laboratorio creativo.
          </p>
          <div className="hero-actions">
            <Link className="action-primary" to="/tienda">
              Ir a la tienda
            </Link>
            <Link className="action-secondary" to="/agenda">
              Agendar reunion
            </Link>
          </div>
          <div className="hero-tags">
            {menuHighlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="cover-orb" />
          <div className="visual-card logo-card">
            <span className="logo-ring">
              <span>vo</span>
            </span>
            <div>
              <strong>voglio.bo</strong>
              <p>Tostadores, catadores, consultores, apasionados del cafe.</p>
            </div>
          </div>
          <div className="hero-image-stack">
            <img src={brandGallery[0].src} alt={brandGallery[0].alt} className="hero-photo primary" />
            <img src={brandGallery[1].src} alt={brandGallery[1].alt} className="hero-photo secondary" />
          </div>
          <div className="visual-card insight-card">
            <p className="eyebrow">Presencia digital</p>
            <strong>{fallbackStats[0].value} seguidores</strong>
            <span>Cuenta activa con tienda, clientes y votaciones de comunidad.</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {fallbackStats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="content-grid triple">
        {valuePillars.map((pillar) => (
          <article className="panel-card" key={pillar.title}>
            <p className="eyebrow">Pilar</p>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Productos destacados</p>
          <h2>Tienda con cafe, accesorios y productos destacados.</h2>
          <p>
            {catalogState === 'connected'
              ? 'El catalogo esta leyendo items reales desde Supabase.'
              : 'El catalogo usa datos demo hasta que conectes Supabase.'}
          </p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      <section className="content-grid split">
        <article className="panel-card accent-panel">
          <p className="eyebrow">Agenda inteligente</p>
          <h2>Horarios y dias visibles para contratar servicios.</h2>
          <p>
            {slotState === 'connected'
              ? 'Los cupos disponibles estan llegando desde la tabla service_slots de Supabase.'
              : 'Se muestran horarios demo mientras conectas la agenda real.'}
          </p>
          {nextAvailableDay ? (
            <div className="slot-preview">
              <strong>{formatDateLabel(nextAvailableDay[0])}</strong>
              <span>{nextAvailableDay[1][0].service_name}</span>
              <span>{formatTimeRange(nextAvailableDay[1][0])}</span>
            </div>
          ) : null}
          <Link className="action-primary" to="/agenda">
            Ver calendario
          </Link>
        </article>

        <article className="panel-card">
          <p className="eyebrow">Ruta rapida</p>
          <h2>Lo que no podia faltar.</h2>
          <ul className="bullet-list">
            {shopBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
            <li>Direccion, contacto y mapa.</li>
            <li>Servicios B2B y formulario comercial.</li>
          </ul>
        </article>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Imagenes reales</p>
          <h2>La identidad de VogliO ya se apoya en contenido visual real de sus redes.</h2>
        </div>
        <div className="media-grid">
          {brandGallery.map((item) => (
            <article className="media-card" key={item.title}>
              <img src={item.src} alt={item.alt} />
              <div className="media-copy">
                <strong>{item.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
