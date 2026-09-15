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
    console.error('[SUPABASE] Error leyendo:', nombreArtista, JSON.stringify(error));
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
    console.error('[SUPABASE] Error guardando:', nombreArtista, JSON.stringify(error));
  } else {
    console.log('[SUPABASE] Guardado con éxito:', nombreArtista);
  }
}

async function buscarEnSpotify(nombreArtista: string): Promise<string | null> {
  try {
    const token = await obtenerTokenSpotify();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombreArtista)}&type=artist&limit=1`;
    const respuesta = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.error('[SPOTIFY] Error búsqueda:', nombreArtista, respuesta.status, JSON.stringify(datos));
      return null;
    }

    const imagen = datos.artists?.items?.[0]?.images?.[0]?.url ?? null;

    if (!imagen) {
      console.log('[SPOTIFY] Sin resultados para:', nombreArtista, '- items encontrados:', datos.artists?.items?.length ?? 0);
    }

    return imagen;
  } catch (e) {
    console.error('[SPOTIFY] Excepción:', nombreArtista, e);
    return null;
  }
}

async function obtenerImagenArtista(nombreArtista: string): Promise<string | null> {
  if (cacheMemoria.has(nombreArtista)) {
    return cacheMemoria.get(nombreArtista) ?? null;
  }

  const imagenGuardada = await obtenerImagenDesdeSupabase(nombreArtista);
  if (imagenGuardada) {
    console.log('[CACHE] Encontrado en Supabase:', nombreArtista);
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

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  const tipo = (req.query.tipo as string) ?? 'artists';
  const periodo = (req.query.periodo as string) ?? '7day';
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

  console.log(`[TOP] tipo=${tipo} usuario=${usuario} items=${resultado.length}`);

  if (tipo === 'artists') {
    resultado = await obtenerImagenesEnTandas(resultado, (item) => item.nombre);
  } else if (tipo === 'tracks') {
    resultado = await obtenerImagenesEnTandas(resultado, (item) => item.artista);
  }

  return res.status(200).json({ error: false, tipo, periodo, items: resultado });
}