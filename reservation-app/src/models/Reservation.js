export class Reservation {
  constructor(id, studentId, name, email, reservationDate, laboratory) {
    this.id = id;
    this.studentId = studentId;
    this.name = name;
    this.email = email;
    this.reservationDate = reservationDate;
    this.laboratory = laboratory;
  }
}