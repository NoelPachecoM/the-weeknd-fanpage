import type { VercelRequest, VercelResponse } from '@vercel/node';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const artista = req.query.artista as string;
  const cancion = req.query.cancion as string;

  if (!artista || !cancion) {
    return res.status(400).json({ error: true, videoId: null, mensaje: 'Falta artista o canción' });
  }

  const query = `${artista} ${cancion}`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const videoId = datos.items?.[0]?.id?.videoId ?? null;
    return res.status(200).json({ error: false, videoId });
  } catch {
    return res.status(500).json({ error: true, videoId: null, mensaje: 'No se pudo buscar el video' });
  }
}