# Reservas de Laboratorio

Aplicación frontend estática que consume un backend serverless (AWS Lambda + DynamoDB).

## Frontend

- Archivos ya compilados en `index.html` y `assets/`.
- Configura la API estableciendo `window.API_BASE_URL` antes de cargar el bundle, por ejemplo:

```html
<script>
  window.API_BASE_URL = "https://abc123.execute-api.us-east-1.amazonaws.com/prod";
</script>
<script type="module" crossorigin src="/practica06/assets/index-YTnqhLV7.js"></script>
```

Si no se define, la app intenta usar `http://localhost:3000`.

## Backend

Código en [`backend/`](./backend). Usa AWS SAM para desplegar:

```bash
cd backend
npm install
sam build
sam deploy --guided
```

Endpoints disponibles:
- `GET /reservations?upcoming=true`
- `POST /reservations` con body `{ studentId, name, email, reservationDate (ISO), laboratory, timezoneOffsetMinutes }`

Consulta [backend/README.md](./backend/README.md) para más detalles.
