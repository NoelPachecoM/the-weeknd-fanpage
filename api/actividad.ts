import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

async function obtenerJson(url: string) {
  const respuesta = await fetch(url);
  return respuesta.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const usuario = req.query.usuario as string;
  const cantidadSemanas = parseInt((req.query.semanas as string) ?? '12', 10);

  if (!usuario) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre de usuario' });
  }

  // 1. Traer la lista completa de semanas disponibles
  const urlLista = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklychartlist&user=${encodeURIComponent(usuario)}&api_key=${LASTFM_API_KEY}&format=json`;
  const datosLista = await obtenerJson(urlLista);

  if (datosLista.error) {
    return res.status(200).json({ error: true, mensaje: 'No se pudo obtener la información' });
  }

  const todasLasSemanas = datosLista.weeklychartlist?.chart ?? [];
  const ultimasSemanas = todasLasSemanas.slice(-cantidadSemanas);

  // 2. Para cada semana, traer el top de artistas y sumar reproducciones
  const actividad = await Promise.all(
    ultimasSemanas.map(async (semana: any) => {
      const urlSemana = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=${encodeURIComponent(usuario)}&from=${semana.from}&to=${semana.to}&api_key=${LASTFM_API_KEY}&format=json`;
      const datosSemana = await obtenerJson(urlSemana);
      const artistas = datosSemana.weeklyartistchart?.artist ?? [];

      const totalScrobbles = artistas.reduce((suma: number, a: any) => suma + parseInt(a.playcount, 10), 0);
      const artistaPrincipal = artistas[0]?.name ?? null;

      return {
        desde: parseInt(semana.from, 10) * 1000, // lo pasamos a milisegundos para JS
        hasta: parseInt(semana.to, 10) * 1000,
        totalScrobbles,
        artistaPrincipal,
      };
    })
  );

  return res.status(200).json({ error: false, semanas: actividad });
}