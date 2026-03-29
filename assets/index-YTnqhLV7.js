const API_BASE = window.API_BASE_URL || "http://localhost:3000";

const LABS = [
  "Laboratorio de Anatomía Digital",
  "Laboratorio de Nanociencias",
  "Laboratorio EICT",
  "Laboratorio DITEC"
];

let reservations = [];
let isModalOpen = false;
let loading = true;
let errorMessage = "";

const root = document.getElementById("root");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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
  if (loading) {
    return `<p class="empty">Cargando reservas...</p>`;
  }

  if (errorMessage) {
    return `<p class="error">${escapeHtml(errorMessage)}</p>`;
  }

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
        <input type="time" name="reservationTime" step="3600" required />
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
    const submitBtn = form?.querySelector('button[type="submit"]');

    cancelBtn?.addEventListener("click", () => {
      isModalOpen = false;
      render();
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form || !submitBtn) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const day = data.reservationDay;
      const time = data.reservationTime;
      const startDate = new Date(`${day}T${time}`);

      if (!day || !time || Number.isNaN(startDate.getTime())) {
        alert("Selecciona un día y una hora.");
        return;
      }

      const payload = {
        studentId: data.studentId.trim(),
        name: data.name.trim(),
        email: data.email.trim(),
        reservationDate: startDate.toISOString(),
        laboratory: data.laboratory,
        timezoneOffsetMinutes: startDate.getTimezoneOffset()
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Guardando...";

      try {
        await saveReservation(payload);
        isModalOpen = false;
        await fetchReservations();
      } catch (error) {
        const message = error?.message || "No se pudo guardar la reserva.";
        alert(message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Guardar";
        render();
      }
    });
  }
};

const fetchReservations = async () => {
  loading = true;
  errorMessage = "";
  render();

  try {
    const response = await fetch(`${API_BASE}/reservations`);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || `HTTP ${response.status}`);
    }

    const items = Array.isArray(body.items)
      ? body.items
      : Array.isArray(body)
        ? body
        : body.reservations || [];

    reservations = items;
  } catch (error) {
    console.error("fetchReservations error", error);
    errorMessage = "No se pudo cargar las reservas. Inténtalo de nuevo.";
  } finally {
    loading = false;
    render();
  }
};

const saveReservation = async (payload) => {
  const response = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  return body.item || body;
};

const bootstrap = () => {
  render();
  fetchReservations();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
