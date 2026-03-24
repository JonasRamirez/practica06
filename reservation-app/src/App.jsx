import { useState } from "react";
import ReservationList from "./components/ReservationList";
import ReservationModal from "./components/ReservationModal";
import "./styles.css";

function App() {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addReservation = (reservation) => {
    setReservations([...reservations, reservation]);
    setShowModal(false);
  };

  return (
    <div className="container">
      <h1>Reservas de Laboratorio</h1>

      <button className="primary-btn" onClick={() => setShowModal(true)}>
        Nueva reserva
      </button>

      <ReservationList reservations={reservations} />

      {showModal && (
        <ReservationModal
          onClose={() => setShowModal(false)}
          onSave={addReservation}
        />
      )}
    </div>
  );
}

export default App;