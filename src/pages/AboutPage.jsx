import { socialProofGallery, aboutTimeline, businessFacts } from '../data/fallbackData'

export default function AboutPage() {
  return (
    <main className="page-frame">
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Sobre nosotros</p>
          <h1 className="page-title">Una marca de cafe que mezcla tienda, laboratorio y consultoria.</h1>
          <p>{businessFacts.about}</p>
        </div>
        <div className="content-grid split">
          <article className="panel-card dark-panel">
            <p className="eyebrow">ADN VogliO</p>
            <h2>Black, blue y cultura street.</h2>
            <p>
              La referencia visual viene de su presencia en Instagram y Facebook: fondos negros, bloques fuertes,
              azul electrico, piezas con circulos y empaques con personalidad propia.
            </p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Linea de tiempo</p>
            <ul className="timeline-list">
              {aboutTimeline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="media-grid social-proof">
          {socialProofGallery.map((item) => (
            <article className="media-card" key={item.caption}>
              <img src={item.src} alt={item.alt} />
              <div className="media-copy">
                <strong>{item.caption}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
