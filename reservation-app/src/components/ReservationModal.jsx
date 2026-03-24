import { useState, useEffect } from "react";

export default function ReservationModal({ labs, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    reservationDate: "",
    laboratory: labs[0] ?? "",
  });

  useEffect(() => {
    if (labs[0]) {
      setForm((prev) => ({ ...prev, laboratory: labs[0] }));
    }
  }, [labs]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2>Agendar reserva</h2>
          <button type="button" className="ghost-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <label className="field">
            <span>Nombre completo</span>
            <input
              name="name"
              placeholder="Ej. Ana Pérez"
              onChange={handleChange}
              value={form.name}
              required
            />
          </label>

          <label className="field">
            <span>Laboratorio</span>
            <select
              name="laboratory"
              onChange={handleChange}
              value={form.laboratory}
              required
            >
              {labs.map((lab) => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Fecha y hora</span>
            <input
              type="datetime-local"
              name="reservationDate"
              onChange={handleChange}
              value={form.reservationDate}
              required
            />
          </label>

          <div className="actions">
            <button type="submit" className="primary-btn">
              Guardar
            </button>
            <button type="button" className="ghost-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
