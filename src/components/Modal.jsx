export default function Modal({
  open,
  title,
  children,
  onClose,
  onPrimary,
  primaryLabel = 'Aceptar',
  secondaryLabel = 'Cancelar',
  primaryDisabled = false,
}) {
  if (!open) return null
  const handlePrimary = () => {
    if (onPrimary) return onPrimary()
    return onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel">
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>{secondaryLabel}</button>
          <button type="button" className="action-primary" onClick={handlePrimary} disabled={primaryDisabled}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
