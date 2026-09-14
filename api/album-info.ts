import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const artista = req.query.artista as string;
  const album = req.query.album as string;
  const usuario = req.query.usuario as string;

  if (!artista || !album) {
    return res.status(400).json({ error: true, mensaje: 'Falta artista o álbum' });
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artista)}&album=${encodeURIComponent(album)}&username=${encodeURIComponent(usuario ?? '')}&api_key=${LASTFM_API_KEY}&format=json`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  if (datos.error) {
    return res.status(200).json({ error: true, mensaje: 'No se encontró el álbum' });
  }

  const info = datos.album;

  const tracks = (Array.isArray(info.tracks?.track) ? info.tracks.track : [info.tracks?.track].filter(Boolean)).map((t: any) => ({
    nombre: t.name,
    duracionSegundos: parseInt(t.duration, 10) || null,
  }));

  return res.status(200).json({
    error: false,
    nombre: info.name,
    artista: info.artist,
    imagen: info.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || null,
    resumen: info.wiki?.summary?.replace(/<a href="[^"]*">.*<\/a>/, '').trim() ?? null,
    scrobblesUsuario: info.userplaycount ?? null,
    tracks,
  });
}