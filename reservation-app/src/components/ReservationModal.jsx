import { useState } from "react";

export default function ReservationModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    reservationDate: "",
    laboratory: "",
  });

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
        <h2>Nueva Reserva</h2>

        <form onSubmit={handleSubmit}>
          <input name="studentId" placeholder="ID" onChange={handleChange} required />
          <input name="name" placeholder="Nombre" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          
          <input
            type="datetime-local"
            name="reservationDate"
            onChange={handleChange}
            required
          />

          <input name="laboratory" placeholder="Laboratorio" onChange={handleChange} required />

          <div className="actions">
            <button type="submit" className="primary-btn">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}