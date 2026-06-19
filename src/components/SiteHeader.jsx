import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../data/fallbackData'

export default function SiteHeader({ cartCount, onOpenCart }) {
  return (
    <header className="site-header">
      <div className="brand-zone">
        <Link className="logo-mark" to="/">
          <span>vo</span>
        </Link>
        <div>
          <p className="brand-kicker">Coffee store + lab</p>
          <Link className="brand-wordmark" to="/">
            VogliO
          </Link>
        </div>
      </div>

      <nav className="main-nav" aria-label="Principal">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="header-cta" onClick={onOpenCart}>
        Carrito
        <span className="cart-badge">{cartCount}</span>
      </button>
    </header>
  )
}
