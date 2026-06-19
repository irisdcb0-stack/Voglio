import React from 'react'

export default function Modal({ open, title, children, onClose, onPrimary, primaryLabel = 'Aceptar', secondaryLabel = 'Cancelar' }) {
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
          <button className="ghost-button" onClick={onClose}>{secondaryLabel}</button>
          <button className="action-primary" onClick={handlePrimary}>{primaryLabel}</button>
        </div>
      </div>
    </div>
  )
}
