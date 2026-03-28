import React from "react";

/**
 * ConfirmModal — a reusable, styled confirmation dialog.
 * 
 * Props:
 *   isOpen      (bool)     — whether the modal is visible
 *   onCancel    (fn)       — callback when Close/Cancel clicked
 *   onConfirm   (fn)       — callback when Confirm clicked
 *   title       (string)   — modal header
 *   message     (string)   — descriptive text
 *   confirmText (string)   — label for action button
 *   variant     (string)   — 'danger' (red) or 'primary' (blue)
 */
function ConfirmModal({ 
  isOpen, 
  onCancel, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  variant = "primary" 
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const isDanger = variant === "danger";

  return (
    <div 
      onClick={handleOverlayClick}
      className="fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(1, 4, 9, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px"
      }}
    >
      <div 
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--color-text-primary)" }}>{title}</h3>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
          {message}
        </div>

        {/* Actions */}
        <div style={{ padding: "16px 24px", background: "var(--color-bg-tertiary)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button 
            onClick={onCancel}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn-primary"
            style={{ 
              padding: "8px 20px", 
              fontSize: "13px",
              background: isDanger ? "#f85149" : "var(--color-blue)",
              border: isDanger ? "1px solid #f85149" : "1px solid var(--color-blue)",
              color: "#fff"
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
