import { formatMoney, resolveProductImage } from '../lib/formatters'

export default function ProductCard({ product, onAddToCart }) {
  const productImage = resolveProductImage(product)

  return (
    <article className="product-card">
      <div className="product-art">
        <img src={productImage} alt={product.name} />
      </div>
      <div className="product-body">
        <div className="product-topline">
          <span>{product.format}</span>
          {product.featured ? <span className="status-dot">featured</span> : null}
        </div>
        <h3>{product.name}</h3>
        <p>{product.notes}</p>
        <div className="product-meta">
          <span>
            {product.origin} / {product.roast}
          </span>
          <strong>{formatMoney(product.price)}</strong>
        </div>
        <button type="button" className="action-primary block" onClick={() => onAddToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}
