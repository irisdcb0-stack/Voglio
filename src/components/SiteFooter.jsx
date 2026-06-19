import { businessFacts } from '../data/fallbackData'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>VogliO</strong>
        <span>{businessFacts.city}</span>
      </div>
      <div className="footer-links">
        <a href={businessFacts.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={businessFacts.facebook} target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href={businessFacts.maps} target="_blank" rel="noreferrer">
          Mapa
        </a>
      </div>
    </footer>
  )
}
