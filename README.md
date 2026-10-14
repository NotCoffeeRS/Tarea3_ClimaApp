# Clima App

Aplicación web que consulta el clima actual y el pronóstico de 5 días de cualquier ciudad.
Consume dos APIs externas de [Open-Meteo](https://open-meteo.com/):

- **Geocoding API**: convierte el nombre de la ciudad en coordenadas.
- **Forecast API**: devuelve clima actual y pronóstico diario.

Ambas son **gratuitas y no requieren clave de API**, por lo que no hay secretos en el repositorio.

## Cómo ejecutarla

No necesita instalar dependencias. Solo hay que servir la carpeta con cualquier servidor estático:

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node
npx http-server -p 8000
```

Después abre <http://localhost:8000> en el navegador, escribe una ciudad y pulsa **Buscar**.

> También puede abrirse `index.html` directamente, pero se recomienda un servidor local.

## Manejo de errores

| Situación | Qué hace la app |
|---|---|
| Sin conexión a internet | Mensaje "Sin conexión…" |
| Ciudad no encontrada (respuesta vacía) | Mensaje "No se encontró la ciudad…" |
| Límite de peticiones (HTTP 429) | Mensaje pidiendo esperar |
| Otro error HTTP / JSON inválido | Mensaje con el código de error |
| Servicio demasiado lento (> 15 s) | Cancela la petición y avisa |
| Campo vacío | Pide escribir una ciudad |

## Estructura

```
index.html   Interfaz
style.css    Estilos (responsive, tema oscuro)
app.js       Peticiones a la API, manejo de errores y render
BITACORA.md  Bitácora de programación con IA
```

## Declaración de uso de IA

**Herramientas de IA utilizadas**

| Herramienta | Para qué se usó |
|---|---|
| Claude Code (Claude Sonnet 5.5, Anthropic) | Generar el código inicial de HTML/CSS/JS, depurar un problema de *timeout* con la API de geocodificación, y redactar este README. |

Los commits generados con ayuda de Claude llevan la línea `Co-Authored-By: Claude`.

**Parte del proyecto hecha sin ayuda de IA**

- **Verificación de la cuenta de GitHub (Student Developer Pack / GitHub Pro):** la hice yo por mi cuenta antes de esta tarea. Quedó verificada el 18 de septiembre de 2026 (tipo de solicitud: Student), como se ve en la captura entregada.

## Autor

Marcos Ramos — [perfil de GitHub](https://github.com/NotCoffeeRS)
