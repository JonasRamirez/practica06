const LABS = [
  "Laboratorio de Anatomía Digital",
  "Laboratorio de Nanociencias",
  "Laboratorio EICT",
  "Laboratorio DITEC"
];

let reservations = [];
let isModalOpen = false;

const root = document.getElementById("root");

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleString("es-BO", {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

const formatDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("es-BO", { dateStyle: "medium" });
};

const formatHourRange = (value) => {
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return "—";
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const options = { hour: "numeric", minute: "2-digit", hour12: true };
  return `${start.toLocaleTimeString("es-BO", options)} - ${end.toLocaleTimeString("es-BO", options)}`;
};

const renderList = () => {
  if (reservations.length === 0) {
    return `<p class="empty">No hay reservas aún.</p>`;
  }

  const rows = reservations
    .map(
      (reservation) => `
      <tr>
        <td>${escapeHtml(reservation.name || "Sin nombre")}</td>
        <td>${escapeHtml(formatDateOnly(reservation.reservationDate))}</td>
        <td>${escapeHtml(formatHourRange(reservation.reservationDate))}</td>
        <td>${escapeHtml(reservation.laboratory)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Día</th>
            <th>Hora</th>
            <th>Laboratorio</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
};

const renderModal = () => `
  <div class="modal-overlay">
    <div class="modal">
      <h2>Nueva Reserva</h2>
      <form id="reservation-form">
        <input name="studentId" placeholder="ID" autocomplete="off" required />
        <input name="name" placeholder="Nombre" autocomplete="off" required />
        <input name="email" type="email" placeholder="Email" autocomplete="off" required />
        <input type="date" name="reservationDay" required />
        <input type="time" name="reservationTime" step="3600" min="00:00" max="23:00" required />
        <div class="select-wrap">
          <label for="laboratory">Laboratorio</label>
          <select id="laboratory" name="laboratory">
            ${LABS.map((lab) => `<option value="${lab}">${lab}</option>`).join("")}
          </select>
        </div>
        <div class="actions">
          <button type="submit" class="primary-btn">Guardar</button>
          <button type="button" id="cancel-modal" class="ghost-btn">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
`;

const render = () => {
  root.innerHTML = `
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Agenda de laboratorios</p>
          <h1>Reservas de Laboratorio</h1>
          <p class="subtitle">
            Administra fechas sin sobresaltos. Selecciona un laboratorio y confirma en segundos.
          </p>
        </div>
        <div class="hero-actions">
          <button id="new-reservation" class="primary-btn">+ Nueva reserva</button>
        </div>
      </header>

      <section class="container">
        <h2 class="section-title">Próximas reservas</h2>
        ${renderList()}
      </section>

      ${isModalOpen ? renderModal() : ""}
    </div>
  `;

  const newReservationBtn = document.getElementById("new-reservation");
  newReservationBtn?.addEventListener("click", () => {
    isModalOpen = true;
    render();
  });

  if (isModalOpen) {
    const form = document.getElementById("reservation-form");
    const cancelBtn = document.getElementById("cancel-modal");

    cancelBtn?.addEventListener("click", () => {
      isModalOpen = false;
      render();
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const day = data.reservationDay;
      const time = data.reservationTime;
      const startDate = new Date(`${day}T${time}`);
      const hasDayAndTime = Boolean(day) && Boolean(time);
      const isValidDate = hasDayAndTime && !Number.isNaN(startDate.getTime());
      const onTheHour =
        startDate.getMinutes() === 0 &&
        startDate.getSeconds() === 0 &&
        startDate.getMilliseconds() === 0;

      if (!isValidDate) {
        alert("Selecciona un día y una hora válidos.");
        return;
      }

      if (!onTheHour) {
        alert("La hora debe terminar en :00 (ej. 2:00, 3:00, 14:00).");
        return;
      }

      reservations = [
        ...reservations,
        {
          studentId: data.studentId,
          name: data.name,
          email: data.email,
          reservationDate: `${day}T${time}`,
          laboratory: data.laboratory
        }
      ];
      isModalOpen = false;
      render();
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", render);
} else {
  render();
}
