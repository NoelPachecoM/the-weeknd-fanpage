import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

async function obtenerJson(url: string) {
  const respuesta = await fetch(url);
  return respuesta.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const usuario = req.query.usuario as string;
  const mesesMinimoAntiguedad = parseInt((req.query.meses as string) ?? '6', 10);

  if (!usuario) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre de usuario' });
  }

  const urlLista = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklychartlist&user=${encodeURIComponent(usuario)}&api_key=${LASTFM_API_KEY}&format=json`;
  const datosLista = await obtenerJson(urlLista);

  if (datosLista.error) {
    return res.status(200).json({ error: true, mensaje: 'No se pudo obtener la información' });
  }

  const todasLasSemanas = datosLista.weeklychartlist?.chart ?? [];
  const limiteTiempo = Date.now() / 1000 - mesesMinimoAntiguedad * 30 * 24 * 60 * 60;
  let semanasAntiguas = todasLasSemanas.filter((semana: any) => parseInt(semana.to, 10) < limiteTiempo);

  // Barajamos las semanas para probar varias al azar hasta encontrar una con datos
  semanasAntiguas = semanasAntiguas.sort(() => Math.random() - 0.5);

  const maximoIntentos = 15;
  for (let i = 0; i < Math.min(maximoIntentos, semanasAntiguas.length); i++) {
    const semana = semanasAntiguas[i];

    const urlArtistas = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=${encodeURIComponent(usuario)}&from=${semana.from}&to=${semana.to}&api_key=${LASTFM_API_KEY}&format=json`;
    const urlCanciones = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=${encodeURIComponent(usuario)}&from=${semana.from}&to=${semana.to}&api_key=${LASTFM_API_KEY}&format=json`;

    const [datosArtistas, datosCanciones] = await Promise.all([
      obtenerJson(urlArtistas),
      obtenerJson(urlCanciones),
    ]);

    const topArtistas = (datosArtistas.weeklyartistchart?.artist ?? []).slice(0, 5).map((a: any) => ({
      nombre: a.name,
      reproducciones: parseInt(a.playcount, 10),
    }));

    const topCanciones = (datosCanciones.weeklytrackchart?.track ?? []).slice(0, 5).map((t: any) => ({
      nombre: t.name,
      artista: t.artist['#text'],
      reproducciones: parseInt(t.playcount, 10),
    }));

    // Si esta semana sí tuvo actividad, la usamos
    if (topArtistas.length > 0 || topCanciones.length > 0) {
      return res.status(200).json({
        error: false,
        desde: parseInt(semana.from, 10) * 1000,
        hasta: parseInt(semana.to, 10) * 1000,
        topArtistas,
        topCanciones,
      });
    }
  }

  // Si tras varios intentos ninguna semana tuvo datos
  return res.status(200).json({
    error: true,
    mensaje: 'Todavía no hay suficiente historial para mostrar una explosión del pasado',
  });
}