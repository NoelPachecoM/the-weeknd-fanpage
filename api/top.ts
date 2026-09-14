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

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Caché rápida en memoria, solo dura mientras la función siga "caliente".
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

async function buscarEnSpotify(nombreArtista: string, intento: number = 0): Promise<string | null> {
  try {
    const token = await obtenerTokenSpotify();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombreArtista)}&type=artist&limit=1`;
    const respuesta = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });

    if (respuesta.status === 429 && intento < 2) {
      const segundosEspera = parseInt(respuesta.headers.get('Retry-After') ?? '2', 10);
      console.error(`Rate limit de Spotify para "${nombreArtista}", esperando ${segundosEspera}s (intento ${intento + 1})`);
      await esperar((segundosEspera + 0.5) * 1000);
      return buscarEnSpotify(nombreArtista, intento + 1);
    }

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

async function obtenerImagenArtista(nombreArtista: string): Promise<string | null> {
  if (cacheMemoria.has(nombreArtista)) {
    return cacheMemoria.get(nombreArtista) ?? null;
  }

  // 1. Primero buscamos en Supabase: si ya la tenemos guardada, no gastamos cuota de Spotify.
  const imagenGuardada = await obtenerImagenDesdeSupabase(nombreArtista);
  if (imagenGuardada) {
    cacheMemoria.set(nombreArtista, imagenGuardada);
    return imagenGuardada;
  }

  // 2. Si no está guardada, la pedimos a Spotify UNA vez y la guardamos para siempre.
  const imagen = await buscarEnSpotify(nombreArtista);
  if (imagen) {
    cacheMemoria.set(nombreArtista, imagen);
    await guardarImagenEnSupabase(nombreArtista, imagen);
  }

  return imagen;
}

// Aun así seguimos yendo de a poco cuando SÍ hay que llamar a Spotify,
// para no disparar varias peticiones nuevas al mismo tiempo.
async function obtenerImagenesEnTandas<T extends { nombre?: string; artista?: string }>(
  items: T[],
  obtenerClave: (item: T) => string,
  tamañoTanda: number = 3
): Promise<(T & { imagen: string | null })[]> {
  const resultado: (T & { imagen: string | null })[] = [];

  for (let i = 0; i < items.length; i += tamañoTanda) {
    const tanda = items.slice(i, i + tamañoTanda);
    const imagenesTanda = await Promise.all(
      tanda.map(async (item) => ({
        ...item,
        imagen: await obtenerImagenArtista(obtenerClave(item)),
      }))
    );
    resultado.push(...imagenesTanda);
  }

  return resultado;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

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

  let resultado: any[] = lista.map((item: any) => ({
    nombre: item.name,
    artista: item.artist?.name,
    reproducciones: parseInt(item.playcount, 10),
    imagen: item.image?.find((img: any) => img.size === 'large')?.['#text'] || null,
  }));

  // Álbumes ya traen portada real de Last.fm, no se tocan.
  // Artistas y canciones usan Spotify (con caché en Supabase) para una foto real del artista.
  if (tipo === 'artists') {
    resultado = await obtenerImagenesEnTandas(resultado, (item) => item.nombre);
  } else if (tipo === 'tracks') {
    resultado = await obtenerImagenesEnTandas(resultado, (item) => item.artista);
  }

  return res.status(200).json({ error: false, tipo, periodo, items: resultado });
}