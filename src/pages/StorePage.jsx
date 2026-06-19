import { useMemo, useState } from 'react'
import { storeCategories } from '../data/fallbackData'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'

const galleryItems = [
  {
    src: new URL('../assets/voglio-images/packaging-1.png', import.meta.url).href,
    alt: 'Packaging de cafe VogliO.',
    title: 'Empaques de cafe de especialidad',
  },
  {
    src: new URL('../assets/voglio-images/gift-kit.png', import.meta.url).href,
    alt: 'Kit de regalo de cafe VogliO.',
    title: 'Regalos y productos listos para vender',
  },
  {
    src: new URL('../assets/web-captures/bomber-espresso-tools-live.png', import.meta.url).href,
    alt: 'Herramientas de espresso de MHW3BOMBER.',
    title: 'Herramientas MHW3BOMBER para espresso',
  },
]

export default function StorePage({ catalog, onAddToCart, catalogState }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const filteredCatalog = useMemo(() => {
    if (activeCategory === 'all') {
      return catalog
    }
    return catalog.filter((item) => item.category === activeCategory)
  }, [activeCategory, catalog])

  return (
    <main className="page-frame">
      <Seo title="Tienda | VogliO" description="Compra cafe de especialidad y accesorios en VogliO." />
      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Tienda</p>
          <h1 className="page-title">Cafe y accesorios en una misma tienda.</h1>
          <p>
            {catalogState === 'connected'
              ? 'Esta tienda esta conectada a Supabase y lista para actualizarse desde base de datos.'
              : 'Esta tienda esta usando datos de demostracion mientras conectas Supabase.'}
          </p>
        </div>
        <div className="chip-row">
          {storeCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={activeCategory === category.value ? 'chip active' : 'chip'}
              onClick={() => setActiveCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="product-grid large">
          {filteredCatalog.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
        <div className="media-grid store-gallery">
          {galleryItems.map((item) => (
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
