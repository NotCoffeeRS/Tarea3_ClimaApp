// Clima App: consume dos APIs de Open-Meteo (geocodificación + pronóstico).
// No requiere clave de API.

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 15000;

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search-btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

// Códigos WMO de Open-Meteo -> [descripción, emoji]
const WEATHER_CODES = {
  0: ["Despejado", "☀️"],
  1: ["Mayormente despejado", "🌤️"],
  2: ["Parcialmente nublado", "⛅"],
  3: ["Nublado", "☁️"],
  45: ["Niebla", "🌫️"],
  48: ["Niebla con escarcha", "🌫️"],
  51: ["Llovizna ligera", "🌦️"],
  53: ["Llovizna", "🌦️"],
  55: ["Llovizna intensa", "🌧️"],
  61: ["Lluvia ligera", "🌧️"],
  63: ["Lluvia", "🌧️"],
  65: ["Lluvia fuerte", "🌧️"],
  71: ["Nieve ligera", "🌨️"],
  73: ["Nieve", "🌨️"],
  75: ["Nieve fuerte", "❄️"],
  80: ["Chubascos ligeros", "🌦️"],
  81: ["Chubascos", "🌧️"],
  82: ["Chubascos violentos", "⛈️"],
  95: ["Tormenta", "⛈️"],
  96: ["Tormenta con granizo", "⛈️"],
  99: ["Tormenta con granizo fuerte", "⛈️"],
};

function describe(code) {
  return WEATHER_CODES[code] ?? ["Condición desconocida", "❔"];
}

// Error propio para mostrar mensajes claros al usuario.
class AppError extends Error {}

// fetch con tiempo límite y errores traducidos a mensajes entendibles.
async function fetchJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new AppError("La solicitud tardó demasiado. Intenta de nuevo.");
    }
    throw new AppError("Sin conexión. Revisa tu internet e intenta de nuevo.");
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) {
    throw new AppError("Se alcanzó el límite de peticiones. Espera un momento e intenta otra vez.");
  }
  if (!res.ok) {
    throw new AppError(`El servicio respondió con un error (${res.status}).`);
  }

  try {
    return await res.json();
  } catch {
    throw new AppError("La respuesta del servicio no es válida.");
  }
}

async function findCity(name) {
  const url = `${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const data = await fetchJSON(url);
  // Respuesta vacía: Open-Meteo omite "results" cuando no hay coincidencias.
  if (!data.results || data.results.length === 0) {
    throw new AppError(`No se encontró la ciudad "${name}". Revisa la ortografía.`);
  }
  return data.results[0];
}

async function getWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: 6, // hoy + 5 días
  });
  const data = await fetchJSON(`${FORECAST_URL}?${params}`);
  if (!data.current || !data.daily) {
    throw new AppError("El servicio no devolvió datos del clima.");
  }
  return data;
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

function render(place, w) {
  const [desc, emoji] = describe(w.current.weather_code);
  const unitT = w.current_units.temperature_2m;

  document.getElementById("place").textContent =
    [place.name, place.admin1, place.country].filter(Boolean).join(", ");
  document.getElementById("icon").textContent = emoji;
  document.getElementById("temp").textContent = `${Math.round(w.current.temperature_2m)}${unitT}`;
  document.getElementById("desc").textContent = desc;
  document.getElementById("feels").textContent =
    `${Math.round(w.current.apparent_temperature)}${unitT}`;
  document.getElementById("humidity").textContent = `${w.current.relative_humidity_2m}%`;
  document.getElementById("wind").textContent =
    `${Math.round(w.current.wind_speed_10m)} ${w.current_units.wind_speed_10m}`;

  const list = document.getElementById("forecast");
  list.replaceChildren();
  // índice 0 es hoy; mostramos los 5 días siguientes
  for (let i = 1; i < w.daily.time.length; i++) {
    const [dDesc, dEmoji] = describe(w.daily.weather_code[i]);
    // "T12:00" evita que la zona horaria mueva la fecha al día anterior
    const dayName = new Date(`${w.daily.time[i]}T12:00`)
      .toLocaleDateString("es", { weekday: "long", day: "numeric", month: "short" });

    const li = document.createElement("li");
    const day = document.createElement("span");
    day.className = "day";
    day.textContent = dayName;
    const cond = document.createElement("span");
    cond.textContent = dEmoji;
    cond.title = dDesc;
    const range = document.createElement("span");
    range.className = "range";
    range.textContent =
      `${Math.round(w.daily.temperature_2m_min[i])}° / ${Math.round(w.daily.temperature_2m_max[i])}°`;
    li.append(day, cond, range);
    list.append(li);
  }

  resultEl.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = cityInput.value.trim();
  if (!name) {
    setStatus("Escribe el nombre de una ciudad.", true);
    return;
  }

  searchBtn.disabled = true;
  resultEl.hidden = true;
  setStatus("Buscando…");

  try {
    const place = await findCity(name);
    const weather = await getWeather(place.latitude, place.longitude);
    render(place, weather);
    setStatus("");
  } catch (err) {
    setStatus(err instanceof AppError ? err.message : "Ocurrió un error inesperado.", true);
    if (!(err instanceof AppError)) console.error(err);
  } finally {
    searchBtn.disabled = false;
  }
});
