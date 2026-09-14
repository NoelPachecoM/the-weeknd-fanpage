import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const ARTISTA_SEGUIDO = 'The Weeknd'; // el artista de tu fan page

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const nombreUsuario = req.query.usuario as string;

  if (!nombreUsuario) {
    return res.status(400).json({ encontrado: false, mensaje: 'Falta el nombre de usuario' });
  }

  // 1. Validar que el usuario existe en Last.fm
  const urlValidacion = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(nombreUsuario)}&api_key=${LASTFM_API_KEY}&format=json`;
  const respuestaValidacion = await fetch(urlValidacion);
  const datosValidacion = await respuestaValidacion.json();

  if (datosValidacion.error) {
    return res.status(200).json({ encontrado: false, mensaje: 'Ese usuario no existe en Last.fm' });
  }

  const usuarioLastfm = datosValidacion.user;

  // La API regresa un arreglo de imágenes en distintos tamaños; usamos la más grande disponible.
  const imagenesDisponibles: { size: string; '#text': string }[] = usuarioLastfm?.image ?? [];
  const imagenUrl =
    imagenesDisponibles.find(img => img.size === 'extralarge')?.['#text'] ||
    imagenesDisponibles[imagenesDisponibles.length - 1]?.['#text'] ||
    null;

  const scrobblesTotales = usuarioLastfm?.playcount ? parseInt(usuarioLastfm.playcount, 10) : 0;
  const miembroDesde = usuarioLastfm?.registered?.unixtime
    ? new Date(parseInt(usuarioLastfm.registered.unixtime, 10) * 1000).toISOString()
    : null;

  // 2. Traer historial reciente
  const urlHistorial = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(nombreUsuario)}&api_key=${LASTFM_API_KEY}&format=json&limit=50`;
  const respuestaHistorial = await fetch(urlHistorial);
  const datosHistorial = await respuestaHistorial.json();
  const canciones = datosHistorial.recenttracks?.track ?? [];

  // 3. Buscar si ya existe el perfil en Supabase
  const { data: perfilExistente } = await supabase
    .from('perfiles')
    .select('*')
    .eq('nombre_usuario_lastfm', nombreUsuario)
    .maybeSingle();

  let perfil = perfilExistente ?? {
    nombre_usuario_lastfm: nombreUsuario,
    puntos: 0,
    racha_artista_actual: 0,
    racha_artista_mas_larga: 0,
    racha_general_actual: 0,
    racha_general_mas_larga: 0,
    ultima_cancion_contada: null as string | null,
    ultima_fecha_escucha_artista: null as string | null,
    ultima_fecha_escucha_general: null as string | null,
  };

  // 4. Filtrar solo canciones nuevas (que no hayamos contado ya)
  const cancionesNuevas: any[] = [];
  for (const cancion of canciones) {
    // la canción que está sonando "ahora mismo" no trae fecha (@attr nowplaying), la ignoramos
    if (cancion['@attr']?.nowplaying) continue;

    const idCancion = `${cancion.artist['#text']}-${cancion.name}-${cancion.date?.uts}`;
    if (idCancion === perfil.ultima_cancion_contada) break; // ya llegamos a lo que ya habíamos contado
    cancionesNuevas.push({ ...cancion, idCancion });
  }

  if (cancionesNuevas.length > 0) {
    // 5. Sumar puntos por cada canción nueva (1 punto c/u)
    perfil.puntos += cancionesNuevas.length;
    perfil.ultima_cancion_contada = cancionesNuevas[0].idCancion;

    const hoy = new Date().toISOString().split('T')[0];

    // Racha general: ¿escuchó algo hoy?
    perfil.racha_general_actual = actualizarRacha(perfil.ultima_fecha_escucha_general, hoy, perfil.racha_general_actual);
    perfil.racha_general_mas_larga = Math.max(perfil.racha_general_mas_larga, perfil.racha_general_actual);
    perfil.ultima_fecha_escucha_general = hoy;

    // Racha de artista: ¿alguna de las canciones nuevas es del artista seguido?
    const escuchoAlArtista = cancionesNuevas.some(
      c => c.artist['#text'].toLowerCase() === ARTISTA_SEGUIDO.toLowerCase()
    );
    if (escuchoAlArtista) {
      perfil.racha_artista_actual = actualizarRacha(perfil.ultima_fecha_escucha_artista, hoy, perfil.racha_artista_actual);
      perfil.racha_artista_mas_larga = Math.max(perfil.racha_artista_mas_larga, perfil.racha_artista_actual);
      perfil.ultima_fecha_escucha_artista = hoy;
    }

    // 6. Guardar en Supabase (crea si no existía, actualiza si sí)
    await supabase.from('perfiles').upsert(perfil);
  }

  return res.status(200).json({
    encontrado: true,
    nombreUsuarioLastfm: perfil.nombre_usuario_lastfm,
    imagenUrl,
    scrobblesTotales,
    miembroDesde,
    puntos: perfil.puntos,
    clasificacion: obtenerClasificacion(perfil.puntos),
    rachaArtistaActual: perfil.racha_artista_actual,
    rachaGeneralActual: perfil.racha_general_actual,
  });
}

function actualizarRacha(ultimaFecha: string | null, hoy: string, rachaActual: number): number {
  if (!ultimaFecha) return 1;
  if (ultimaFecha === hoy) return rachaActual; // ya se había contado hoy, no duplicar
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split('T')[0];

  return ultimaFecha === ayerStr ? rachaActual + 1 : 1;
}

function obtenerClasificacion(puntos: number): string {
  if (puntos >= 5000) return 'Leyenda';
  if (puntos >= 2000) return 'Oro';
  if (puntos >= 500) return 'Plata';
  return 'Bronce';
}