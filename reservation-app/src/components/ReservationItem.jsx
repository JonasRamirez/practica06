export default function ReservationItem({ reservation }) {
  return (
    <div className="card">
      <div className="card__title">
        <h3>{reservation.name}</h3>
        <span className="badge">{reservation.laboratory}</span>
      </div>
      <p className="muted">
        {new Date(reservation.reservationDate).toLocaleString("es-ES", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    </div>
  );
}
