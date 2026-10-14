# Bitácora de programación con IA

**Proyecto:** Clima App (Open-Meteo) · **Herramienta:** Claude Code (Claude Sonnet 5.5)

> ✏️ **Instrucciones para el autor:** la tarea pide **al menos 5 prompts reales, copiados tal cual**.
> Este archivo trae pre-llenado solo lo que ocurrió de verdad en la sesión donde se construyó la app
> (Prompt 1 y el error 1). Los demás prompts **debes escribirlos tú** con lo que realmente le pediste
> a la IA (copia/pega desde tu historial). No inventes entradas: debes poder explicarlas en la demostración.
> Borra estas instrucciones al terminar.

---

## Prompt 1 (real, de la sesión de construcción)

**Prompt copiado tal cual:**
```
revisa el documento y sigue las instrucciones
```
(adjunto: `Tarea-3.pdf`)

**Qué respondió la IA:** leyó las instrucciones, eligió una app web de clima con Open-Meteo (sin clave de API),
creó `index.html`, `style.css`, `app.js`, README y esta bitácora, con commits incrementales.

**¿Funcionó a la primera?** Parcialmente. La estructura y la lógica funcionaron, pero al probar en el navegador
la búsqueda se quedaba en "Buscando…" y terminaba en "La solicitud tardó demasiado" (ver Error 1).

**Qué hubo que ajustar:** subir el timeout de 10 s a 15 s.

---

## Prompt 2

**Prompt copiado tal cual:**
```
(pegar aquí)
```
**Respuesta de la IA:** …
**¿Funcionó a la primera?** …
**Qué corregí o ajusté:** …

## Prompt 3

**Prompt copiado tal cual:**
```
(pegar aquí)
```
**Respuesta de la IA:** …
**¿Funcionó a la primera?** …
**Qué corregí o ajusté:** …

## Prompt 4

**Prompt copiado tal cual:**
```
(pegar aquí)
```
**Respuesta de la IA:** …
**¿Funcionó a la primera?** …
**Qué corregí o ajusté:** …

## Prompt 5

**Prompt copiado tal cual:**
```
(pegar aquí)
```
**Respuesta de la IA:** …
**¿Funcionó a la primera?** …
**Qué corregí o ajusté:** …

---

## Error de la IA / del entorno detectado

### Error 1 (real): timeout demasiado corto para el servicio de geocodificación

- **Qué pasó:** el código generado usaba un timeout de 10 s. Al probar, `geocoding-api.open-meteo.com`
  respondía de forma intermitente y lenta (~5 s por petición, y a veces la conexión se colgaba), así que la app
  mostraba "La solicitud tardó demasiado" aunque el código estaba bien.
- **Cómo se detectó:** se probó la app en el navegador, se revisó la consola/red (sin peticiones registradas) y
  se comparó con `curl` directo: el host de pronóstico respondía rápido y el de geocodificación fallaba 1 de 3 veces.
- **Cómo se resolvió:** se subió `TIMEOUT_MS` a 15000 en `app.js`; la búsqueda de Guadalajara y Madrid ya funcionó
  y el caso de ciudad inexistente mostró el mensaje esperado.
- **Lección:** el manejo de errores sí se probó de verdad (el aviso de timeout apareció), y un código "correcto"
  puede fallar por el servicio externo; hay que medir antes de culpar a la lógica.

> ✏️ Si detectaste otro error de la IA (función inexistente, código inseguro, etc.), agrégalo aquí.

---

## Qué aprendí y qué haría distinto

> ✏️ _COMPLETAR con tus propias palabras (2–4 líneas). Ideas de punto de partida, edítalas a tu experiencia:_
> - Probar la app pronto, no solo leer el código que genera la IA.
> - Pedir a la IA que explique cada parte para poder defenderla en la demostración.
> - Dar prompts más específicos (API, manejo de errores, qué no hacer con claves).
