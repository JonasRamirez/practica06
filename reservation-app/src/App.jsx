import { useMemo, useState } from "react";
import ReservationList from "./components/ReservationList";
import ReservationModal from "./components/ReservationModal";
import "./styles.css";

const LABS = [
  "Laboratorio de Anatomía Digital",
  "Laboratorio de Nanociencias",
  "Laboratorio EICT",
  "Laboratorio DITEC",
];

function App() {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addReservation = (reservation) => {
    setReservations([
      ...reservations,
      { ...reservation, id: crypto.randomUUID() },
    ]);
    setShowModal(false);
  };

  const total = useMemo(() => reservations.length, [reservations]);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Coordinación académica</p>
          <h1>Reservas de Laboratorio</h1>
          <p className="muted">
            Gestiona turnos de uso en los laboratorios institucionales. Selecciona un
            laboratorio, fecha y hora; nosotros guardamos el resto.
          </p>
          <div className="lab-tags">
            {LABS.map((lab) => (
              <span key={lab} className="tag">
                {lab}
              </span>
            ))}
          </div>
        </div>
        <div className="hero__cta">
          <p className="stat">{total}</p>
          <p className="muted">reservas agendadas</p>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            Nueva reserva
          </button>
        </div>
      </header>

      <section className="content">
        <ReservationList reservations={reservations} />
      </section>

      {showModal && (
        <ReservationModal
          labs={LABS}
          onClose={() => setShowModal(false)}
          onSave={addReservation}
        />
      )}
    </div>
  );
}

export default App;
