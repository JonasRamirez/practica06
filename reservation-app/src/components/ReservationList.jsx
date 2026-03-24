import ReservationItem from "./ReservationItem";

export default function ReservationList({ reservations }) {
  if (reservations.length === 0) {
    return <p>No hay reservas aún.</p>;
  }

  return (
    <div className="list">
      {reservations.map((res, index) => (
        <ReservationItem key={index} reservation={res} />
      ))}
    </div>
  );
}