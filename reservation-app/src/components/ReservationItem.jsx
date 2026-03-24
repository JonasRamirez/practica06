export default function ReservationItem({ reservation }) {
  return (
    <div className="card">
      <h3>{reservation.name}</h3>
      <p><strong>ID:</strong> {reservation.studentId}</p>
      <p><strong>Email:</strong> {reservation.email}</p>
      <p><strong>Fecha:</strong> {reservation.reservationDate}</p>
      <p><strong>Laboratorio:</strong> {reservation.laboratory}</p>
    </div>
  );
}