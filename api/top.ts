import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let tokenCache: { token: string; expira: number } | null = null;

async function obtenerTokenSpotify(): Promise<string> {
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
  tokenCache = {
    token: datos.access_token,
    expira: Date.now() + (datos.expires_in - 60) * 1000,
  };

  return tokenCache.token;
}

const cacheImagenesArtistas = new Map<string, string | null>();

async function obtenerImagenArtista(nombreArtista: string): Promise<string | null> {
  if (cacheImagenesArtistas.has(nombreArtista)) {
    return cacheImagenesArtistas.get(nombreArtista) ?? null;
  }

  try {
    const token = await obtenerTokenSpotify();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombreArtista)}&type=artist&limit=1`;
    const respuesta = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const datos = await respuesta.json();
    const imagen = datos.artists?.items?.[0]?.images?.[0]?.url ?? null;
    cacheImagenesArtistas.set(nombreArtista, imagen);
    return imagen;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const usuario = req.query.usuario as string;
  const tipo = (req.query.tipo as string) ?? 'artists'; // artists | albums | tracks
  const periodo = (req.query.periodo as string) ?? '7day'; // 7day | 1month | 12month | overall
  const limite = parseInt((req.query.limite as string) ?? '10', 10);

  if (!usuario) {
    return res.status(400).json({ error: 'Falta el nombre de usuario' });
  }

  const metodo = `user.gettop${tipo}`;
  const url = `https://ws.audioscrobbler.com/2.0/?method=${metodo}&user=${encodeURIComponent(usuario)}&period=${periodo}&api_key=${LASTFM_API_KEY}&format=json&limit=${limite}`;

  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  if (datos.error) {
    return res.status(200).json({ error: true, mensaje: 'No se pudo obtener la información' });
  }

  const lista = datos[`top${tipo}`]?.[tipo === 'artists' ? 'artist' : tipo === 'albums' ? 'album' : 'track'] ?? [];

  let resultado = lista.map((item: any) => ({
    nombre: item.name,
    artista: item.artist?.name,
    reproducciones: parseInt(item.playcount, 10),
    imagen: item.image?.find((img: any) => img.size === 'large')?.['#text'] || null,
  }));

  // Álbumes ya traen portada real de Last.fm, no se tocan.
  // Artistas y canciones usan Spotify para conseguir una foto real del artista.
  if (tipo === 'artists') {
    resultado = await Promise.all(
      resultado.map(async (item: any) => ({
        ...item,
        imagen: await obtenerImagenArtista(item.nombre),
      }))
    );
  } else if (tipo === 'tracks') {
    resultado = await Promise.all(
      resultado.map(async (item: any) => ({
        ...item,
        imagen: await obtenerImagenArtista(item.artista),
      }))
    );
  }

  return res.status(200).json({ error: false, tipo, periodo, items: resultado });
}