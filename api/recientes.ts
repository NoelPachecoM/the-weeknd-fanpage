import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const usuario = req.query.usuario as string;
  const limite = parseInt((req.query.limite as string) ?? '30', 10);

  if (!usuario) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre de usuario' });
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(usuario)}&api_key=${LASTFM_API_KEY}&format=json&limit=${limite}&extended=1`;

  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  if (datos.error) {
    return res.status(200).json({ error: true, mensaje: 'No se pudo obtener la actividad reciente' });
  }

  const lista = datos.recenttracks?.track ?? [];

  const items = lista.map((item: any) => {
    const reproduciendoAhora = item['@attr']?.nowplaying === 'true';
    return {
      nombre: item.name,
      artista: item.artist?.name ?? item.artist?.['#text'] ?? '',
      album: item.album?.['#text'] || null,
      imagen: item.image?.find((img: any) => img.size === 'extralarge')?.['#text']
        || item.image?.find((img: any) => img.size === 'large')?.['#text']
        || null,
      fecha: item.date?.uts ? parseInt(item.date.uts, 10) * 1000 : null,
      reproduciendoAhora,
    };
  });

  return res.status(200).json({ error: false, items });
}