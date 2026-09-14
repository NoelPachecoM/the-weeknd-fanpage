import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const nombre = req.query.nombre as string;
  const usuario = req.query.usuario as string;

  if (!nombre) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre del artista' });
  }

  const urlInfo = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(nombre)}&username=${encodeURIComponent(usuario ?? '')}&api_key=${LASTFM_API_KEY}&format=json`;
  const urlCanciones = `https://ws.audioscrobbler.com/2.0/?method=library.getartisttracks&user=${encodeURIComponent(usuario ?? '')}&artist=${encodeURIComponent(nombre)}&api_key=${LASTFM_API_KEY}&format=json`;
  const urlTopTracks = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(nombre)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;

  const [respInfo, respCanciones, respTopTracks] = await Promise.all([
    fetch(urlInfo),
    fetch(urlCanciones),
    fetch(urlTopTracks),
  ]);
  const datosInfo = await respInfo.json();
  const datosCanciones = await respCanciones.json();
  const datosTopTracks = await respTopTracks.json();

  if (datosInfo.error) {
    return res.status(200).json({ error: true, mensaje: 'No se encontró el artista' });
  }

  const artista = datosInfo.artist;

  const similares = (artista.similar?.artist ?? []).slice(0, 6).map((a: any) => ({
    nombre: a.name,
    imagen: a.image?.find((img: any) => img.size === 'large')?.['#text'] || null,
  }));

  const canciones = (datosCanciones.artisttracks?.track ?? []).slice(0, 15).map((t: any) => ({
    nombre: t.name,
    album: t.album?.['#text'] ?? null,
    fecha: t.date?.['#text'] ?? null,
  }));

  const topCanciones = (datosTopTracks.toptracks?.track ?? []).slice(0, 10).map((t: any) => ({
    nombre: t.name,
    reproducciones: parseInt(t.playcount, 10) || 0,
  }));

  return res.status(200).json({
    error: false,
    nombre: artista.name,
    biografia: artista.bio?.summary?.replace(/<a href="[^"]*">.*<\/a>/, '').trim() ?? null,
    oyentes: artista.stats?.listeners ?? null,
    scrobblesUsuario: artista.stats?.userplaycount ?? null,
    similares,
    canciones,
    topCanciones,
  });
}