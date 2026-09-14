import type { VercelRequest, VercelResponse } from '@vercel/node';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let tokenCache: { token: string; expira: number } | null = null;

async function obtenerTokenSpotify(): Promise<string> {
  // Reutiliza el token mientras no haya expirado, para no pedir uno nuevo en cada llamada
  if (tokenCache && Date.now() < tokenCache.expira) {
    return tokenCache.token;
  }

  const credenciales = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const respuesta = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credenciales}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.access_token) {
    console.error('Error al pedir token de Spotify:', respuesta.status, datos);
    throw new Error('No se pudo autenticar con Spotify');
  }

  tokenCache = {
    token: datos.access_token,
    expira: Date.now() + (datos.expires_in - 60) * 1000, // le restamos 60s de margen
  };

  return tokenCache.token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store');
  const nombreArtista = req.query.nombre as string;

  if (!nombreArtista) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre del artista' });
  }

  try {
    const token = await obtenerTokenSpotify();

    const urlBusqueda = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombreArtista)}&type=artist&limit=1`;
    const respuesta = await fetch(urlBusqueda, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.error('Error búsqueda Spotify:', nombreArtista, respuesta.status, datos);
    }

    const artista = datos.artists?.items?.[0];
    const imagen = artista?.images?.[0]?.url ?? null;

    return res.status(200).json({ error: false, imagen, nombreEncontrado: artista?.name ?? null });
  } catch (e) {
    console.error('Excepción obteniendo imagen de artista:', nombreArtista, e);
    return res.status(500).json({ error: true, mensaje: 'No se pudo obtener la imagen' });
  }
}