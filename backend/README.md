# Backend (AWS Lambda + DynamoDB)

Despliega una API mínima para crear y listar reservas desde la aplicación frontend.

## Estructura

- `template.yaml`: plantilla SAM que crea la tabla DynamoDB, el HttpApi y la función Lambda.
- `src/reservations.js`: handler Node.js 18 que soporta `GET /reservations` y `POST /reservations`.
- `package.json`: dependencias `@aws-sdk/*` y `uuid`.

## Despliegue rápido (SAM)

```bash
cd backend
npm install
sam build
sam deploy --guided
```

Valores recomendados durante `sam deploy --guided`:
- **Stack Name**: `lab-reservations`
- **AWS Region**: tu región (ej. `us-east-1`)
- **ReservationsTableName**: `LabReservations` (o el nombre que prefieras)

Al finalizar verás la salida `ApiEndpoint`, úsala como `API_BASE_URL` en el frontend.

## Contrato HTTP

- `GET /reservations?upcoming=true`
  - Devuelve `{ items: Reservation[] }` ordenadas por fecha ascendente.
  - `upcoming=true` (por defecto) filtra fechas >= ahora en UTC.
- `POST /reservations`
  - Body JSON: `{ studentId, name, email, reservationDate, laboratory, timezoneOffsetMinutes }`
  - `reservationDate` debe ser ISO-8601 (ej. `"2026-03-25T12:00:00.000Z"`) a la hora en punto entre 08:00 y 22:00 en la zona horaria de origen (usa `timezoneOffsetMinutes` que envía el frontend).
  - Respuesta: `{ item: Reservation }`

### Modelo `Reservation`

```json
{
  "id": "uuid",
  "studentId": "string",
  "name": "string",
  "email": "string",
  "reservationDate": "2026-03-25T12:00:00.000Z",
  "laboratory": "Laboratorio de Nanociencias",
  "timezoneOffsetMinutes": 240,
  "createdAt": "2026-03-24T18:12:00.000Z"
}
```

## Probando en local (API Gateway emulator)

```bash
sam local start-api
```

Esto expone `http://127.0.0.1:3000/reservations`.
Usa la app frontend con `window.API_BASE_URL = "http://127.0.0.1:3000";` para apuntar al emulador.
