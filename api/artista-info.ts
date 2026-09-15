import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
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

const cacheMemoria = new Map<string, string>();

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

async function buscarEnSpotify(nombreArtista: string): Promise<string | null> {
  try {
    const token = await obtenerTokenSpotify();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombreArtista)}&type=artist&limit=1`;
    const respuesta = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.error('Error búsqueda Spotify:', nombreArtista, respuesta.status, datos);
      return null;
    }

    return datos.artists?.items?.[0]?.images?.[0]?.url ?? null;
  } catch (e) {
    console.error('Excepción buscando en Spotify:', nombreArtista, e);
    return null;
  }
}

// Mismo caché de 2 pasos que usa api/top.ts: primero Supabase (gratis y para siempre),
// y solo si no está ahí, se le pregunta a Spotify y se guarda para la próxima vez.
async function obtenerImagenArtista(nombreArtista: string): Promise<string | null> {
  if (cacheMemoria.has(nombreArtista)) {
    return cacheMemoria.get(nombreArtista) ?? null;
  }

  const imagenGuardada = await obtenerImagenDesdeSupabase(nombreArtista);
  if (imagenGuardada) {
    cacheMemoria.set(nombreArtista, imagenGuardada);
    return imagenGuardada;
  }

  const imagen = await buscarEnSpotify(nombreArtista);
  if (imagen) {
    cacheMemoria.set(nombreArtista, imagen);
    await guardarImagenEnSupabase(nombreArtista, imagen);
  }

  return imagen;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const nombre = req.query.nombre as string;
  const usuario = req.query.usuario as string;

  if (!nombre) {
    return res.status(400).json({ error: true, mensaje: 'Falta el nombre del artista' });
  }

  // lang=es le pide a Last.fm la biografía en español (cuando exista traducción).
  const urlInfo = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(nombre)}&username=${encodeURIComponent(usuario ?? '')}&lang=es&api_key=${LASTFM_API_KEY}&format=json`;
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

  // Si Last.fm no trajo bio en español (no toda banda tiene traducción), caemos
  // de regreso a pedirla sin lang=es para que al menos no quede vacía del todo.
  let biografia: string | null = artista.bio?.summary?.replace(/<a href="[^"]*">.*<\/a>/, '').trim() || null;
  if (!biografia) {
    const urlInfoRespaldo = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(nombre)}&api_key=${LASTFM_API_KEY}&format=json`;
    const respRespaldo = await fetch(urlInfoRespaldo);
    const datosRespaldo = await respRespaldo.json();
    biografia = datosRespaldo.artist?.bio?.summary?.replace(/<a href="[^"]*">.*<\/a>/, '').trim() || null;
  }

  const nombresSimilares: string[] = (artista.similar?.artist ?? []).slice(0, 6).map((a: any) => a.name);

  // Imágenes del artista principal y de los similares, todas vía Spotify + caché en Supabase.
  const [imagenPrincipal, ...imagenesSimilares] = await Promise.all([
    obtenerImagenArtista(artista.name),
    ...nombresSimilares.map((n) => obtenerImagenArtista(n)),
  ]);

  const similares = nombresSimilares.map((n, i) => ({
    nombre: n,
    imagen: imagenesSimilares[i],
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
    imagen: imagenPrincipal,
    biografia,
    oyentes: artista.stats?.listeners ?? null,
    scrobblesUsuario: artista.stats?.userplaycount ?? null,
    similares,
    canciones,
    topCanciones,
  });
}