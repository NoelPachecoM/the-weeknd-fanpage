import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const HORAS_CACHE = 24;

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const nombreArtista = req.query.nombre as string;

  if (!nombreArtista) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre del artista' });
  }

  // 1. Revisar si ya está en la caché de Supabase y sigue vigente
  const { data: cacheExistente } = await supabase
    .from('imagenes_artistas')
    .select('imagen_url, actualizado_en')
    .eq('nombre_artista', nombreArtista)
    .maybeSingle();

  if (cacheExistente) {
    const horasTranscurridas = (Date.now() - new Date(cacheExistente.actualizado_en).getTime()) / (1000 * 60 * 60);
    if (horasTranscurridas < HORAS_CACHE) {
      return res.status(200).json({ error: false, imagen: cacheExistente.imagen_url, nombreEncontrado: nombreArtista });
    }
  }

  // 2. No está en caché o ya expiró: pedirla a Spotify
  try {
    const token = await obtenerTokenSpotify();

    const urlBusqueda = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombreArtista)}&type=artist&limit=1`;
    const respuesta = await fetch(urlBusqueda, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const datos = await respuesta.json();

    const artista = datos.artists?.items?.[0];
    const imagen = artista?.images?.[0]?.url ?? null;

    // 3. Guardar (o actualizar) en la caché de Supabase
    await supabase.from('imagenes_artistas').upsert({
      nombre_artista: nombreArtista,
      imagen_url: imagen,
      actualizado_en: new Date().toISOString(),
    });

    return res.status(200).json({ error: false, imagen, nombreEncontrado: artista?.name ?? null });
  } catch (e) {
    // Si Spotify falla pero había algo en caché aunque expirado, mejor eso que nada
    if (cacheExistente) {
      return res.status(200).json({ error: false, imagen: cacheExistente.imagen_url, nombreEncontrado: nombreArtista });
    }
    return res.status(500).json({ error: true, mensaje: 'No se pudo obtener la imagen' });
  }
}