import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

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

  if (!respuesta.ok || !datos.access_token) {
    console.error('Error al pedir token de Spotify:', respuesta.status, datos);
    throw new Error('No se pudo autenticar con Spotify');
  }

  tokenCache = {
    token: datos.access_token,
    expira: Date.now() + (datos.expires_in - 60) * 1000,
  };

  return tokenCache.token;
}

async function obtenerImagenDesdeSupabase(nombreArtista: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('imagenes_artistas')
    .select('imagen_url')
    .eq('nombre_artista', nombreArtista)
    .maybeSingle();

  if (error) {
    console.error('Error leyendo imagenes_artistas en Supabase:', nombreArtista, error);
    return null;
  }

  return data?.imagen_url ?? null;
}

async function guardarImagenEnSupabase(nombreArtista: string, imagenUrl: string) {
  const { error } = await supabase.from('imagenes_artistas').upsert({
    nombre_artista: nombreArtista,
    imagen_url: imagenUrl,
    actualizado_en: new Date().toISOString(),
  });

  if (error) {
    console.error('Error guardando en imagenes_artistas:', nombreArtista, error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const nombreArtista = req.query.nombre as string;

  if (!nombreArtista) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre del artista' });
  }

  try {
    // 1. Primero buscamos en Supabase: si ya la tenemos guardada, no gastamos cuota de Spotify.
    const imagenGuardada = await obtenerImagenDesdeSupabase(nombreArtista);
    if (imagenGuardada) {
      return res.status(200).json({ error: false, imagen: imagenGuardada, nombreEncontrado: nombreArtista });
    }

    // 2. Si no está guardada, la pedimos a Spotify y la guardamos para no volver a pedirla nunca más.
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

    if (imagen) {
      await guardarImagenEnSupabase(nombreArtista, imagen);
    }

    return res.status(200).json({ error: false, imagen, nombreEncontrado: artista?.name ?? null });
  } catch (e) {
    console.error('Excepción obteniendo imagen de artista:', nombreArtista, e);
    return res.status(500).json({ error: true, mensaje: 'No se pudo obtener la imagen' });
  }
}