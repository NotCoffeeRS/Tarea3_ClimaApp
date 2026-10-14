# Bitácora de programación con IA

**Proyecto:** Clima App (Open-Meteo) · **Herramienta:** Claude Code (Claude Sonnet 5.5)

La profesora indicó que no eran necesarios 5 prompts distintos, sino una captura que muestre que las
indicaciones del documento de la tarea fueron el prompt con el que la IA generó el código completo.
Por eso esta bitácora documenta ese prompt, el resultado, un error real y lo aprendido.

---

## Prompt (real)

**Prompt copiado tal cual:**
```
revisa el documento y sigue las instrucciones
```
Adjunto: `Tarea-3.pdf` (las indicaciones de la tarea).

**Evidencia:** captura de pantalla de la conversación, entregada junto con la tarea
(`capturas/prompt.png` en este repositorio).

**Qué respondió la IA:** leyó las indicaciones del PDF y generó la app completa: eligió una app web de clima
con la API gratuita de Open-Meteo (sin clave, para no exponer secretos), creó `index.html`, `style.css` y `app.js`
con manejo de errores, el `README.md` con la declaración de IA, y esta bitácora, con commits incrementales.

**¿Funcionó a la primera?** Parcialmente. La estructura y la lógica funcionaron, pero al probar en el navegador
la búsqueda se quedaba en "Buscando…" y terminaba en "La solicitud tardó demasiado" (ver Error 1).

**Qué hubo que ajustar:** subir el timeout de 10 s a 15 s.

---

## Error detectado

### Error 1: timeout demasiado corto para el servicio de geocodificación

- **Qué pasó:** el código generado usaba un timeout de 10 s. Al probar, `geocoding-api.open-meteo.com`
  respondía de forma intermitente y lenta (~5 s por petición, y a veces la conexión se colgaba), así que la app
  mostraba "La solicitud tardó demasiado" aunque el código estaba bien.
- **Cómo se detectó:** se probó la app en el navegador, se revisó la consola y la red (sin peticiones registradas) y
  se comparó con `curl` directo: el host de pronóstico respondía rápido y el de geocodificación fallaba 1 de 3 veces.
- **Cómo se resolvió:** se subió `TIMEOUT_MS` a 15000 en `app.js`. Después la búsqueda de Guadalajara y Madrid
  funcionó y una ciudad inexistente mostró el mensaje de error esperado.

---

## Qué aprendí y qué haría distinto

- Un código generado por la IA que parece correcto puede fallar por factores externos (aquí, un servicio lento);
  hay que probarlo de verdad y medir antes de culpar a la lógica.
- Las indicaciones de la tarea sirvieron como prompt, pero un prompt más específico (por ejemplo, tiempos límite
  esperados o qué hacer ante errores) habría evitado el ajuste del timeout.
- La próxima vez pediría a la IA que me explique cada función (`fetchJSON`, `findCity`, `getWeather`, `render`)
  para poder defender todo el código en la demostración.
