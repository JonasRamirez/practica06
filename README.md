# Reservas de Laboratorio

Frontend estático listo para publicarse en GitHub Pages. Toda la lógica de negocio debe residir en tu backend (por ejemplo, AWS Lambda + DynamoDB); aquí solo queda la capa de presentación.

## Uso

- Archivos compilados en `index.html` y `assets/`.
- Define la URL de la API antes de cargar el bundle:

```html
<script>
  window.API_BASE_URL = "https://abc123.execute-api.us-east-1.amazonaws.com/prod";
</script>
<script type="module" crossorigin src="/practica06/assets/index-YTnqhLV7.js"></script>
```

Si no se define, la app usa `http://localhost:3000`.
