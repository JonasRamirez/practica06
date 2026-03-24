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

const renderList = () => {
  if (reservations.length === 0) {
    return `<p class="empty">No hay reservas aún.</p>`;
  }

  const rows = reservations
    .map(
      (reservation) => `
      <tr>
        <td>${escapeHtml(reservation.name || "Sin nombre")}</td>
        <td>${escapeHtml(formatDate(reservation.reservationDate))}</td>
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
            <th>Fecha</th>
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
        <input type="datetime-local" name="reservationDate" required />
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
      reservations = [
        ...reservations,
        {
          studentId: data.studentId,
          name: data.name,
          email: data.email,
          reservationDate: data.reservationDate,
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
