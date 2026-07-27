import React, { useState } from "react";
import logoArteEnManos from "../../imports/logoArteEnManos.jpeg";
import {
  ChevronLeft, ChevronRight, Check, AlertCircle, ShoppingCart,
  Search, User, Star, Package, ArrowLeft, Eye, MousePointer,
  BookOpen, Code2, Layers, Film, CheckCircle, Monitor,
} from "lucide-react";

type Page = string;

type SlideId =
  | "portada" | "guia-estilo" | "normativa" | "usabilidad"
  | "accesibilidad" | "navegacion" | "prototipo" | "conclusion";

const SLIDES: { id: SlideId; title: string; num: number }[] = [
  { id: "portada", title: "Portada", num: 1 },
  { id: "guia-estilo", title: "Guía de Estilo", num: 2 },
  { id: "normativa", title: "Normativa de Diseño", num: 3 },
  { id: "usabilidad", title: "Principios de Usabilidad", num: 4 },
  { id: "accesibilidad", title: "Principios de Accesibilidad", num: 5 },
  { id: "navegacion", title: "Modelo de Navegación", num: 6 },
  { id: "prototipo", title: "Navegación del Prototipo", num: 7 },
  { id: "conclusion", title: "Conclusión", num: 8 },
];

const TEAM = [
  "Kevin Noel Pacheco Magaña",
  "Pacheco Soto Ángel Saúl",
  "Velasco Rodea Abraham Elihu",
  "González Calva Edwin Alexander",
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SlideHeader({ title }: { title: string }) {
  return (
    <div
      className="relative px-8 py-7 mb-7 rounded-t-xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #6B3520 0%, #9B4520 55%, #B87333 100%)" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          color: "#F5EDE0",
          fontSize: "1.9rem",
          fontWeight: 400,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      <div className="absolute top-0 right-0 w-6 h-full" style={{ background: "#D4A520" }} />
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start text-sm" style={{ color: "#4A2C1A" }}>
      <span style={{ color: "#B87333", marginTop: "2px", flexShrink: 0 }}>►</span>
      <span>{children}</span>
    </div>
  );
}

// ─── Slide 1: Portada ─────────────────────────────────────────────────────────

function SlidePortada() {
  return (
    <div
      className="min-h-[540px] rounded-xl flex flex-col items-center justify-center text-center px-8 py-12"
      style={{ background: "linear-gradient(150deg, #5C2A14 0%, #7B3A1E 40%, #A86030 100%)" }}
    >
      <div className="mb-5">
        <img
          src={logoArteEnManos}
          alt="Arte en Manos — Tradición que Cobra Vida"
          className="w-28 h-28 rounded-2xl object-contain"
          style={{ background: "#0F0704" }}
        />
      </div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          color: "#F5EDE0",
          fontSize: "2.8rem",
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: "0.4rem",
        }}
      >
        ArteEnManos
      </h1>
      <p style={{ color: "#E8C99A", fontSize: "1rem", marginBottom: "0.3rem" }}>
        Estudio de Caso · Plataforma E-Commerce para Cooperativa de Artesanos Rurales
      </p>
      <p style={{ color: "#C4956A", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Experiencia de Usuario · 2do Parcial · Julio 2026
      </p>
      <div className="w-12 h-px mb-6" style={{ background: "#D4A520" }} />
      <div className="space-y-2">
        {TEAM.map((name) => (
          <p key={name} style={{ color: "#E8C99A", fontSize: "0.9rem", letterSpacing: "0.04em" }}>
            {name}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 2: Guía de Estilo ──────────────────────────────────────────────────

function SlideGuiaEstilo() {
  const colors = [
    { name: "Barro Terracota", hex: "#6B3520", role: "Primario" },
    { name: "Parchment", hex: "#F5EDE0", role: "Fondo", dark: true },
    { name: "Cobre Ámbar", hex: "#B87333", role: "Acento" },
    { name: "Arena", hex: "#C4956A", role: "Secundario" },
    { name: "Café Profundo", hex: "#2B1A10", role: "Texto" },
    { name: "Crema Muted", hex: "#EDE0CD", role: "Muted", dark: true },
  ];

  const icons = [
    { label: "Carrito", emoji: "🛒" },
    { label: "Búsqueda", emoji: "🔍" },
    { label: "Usuario", emoji: "👤" },
    { label: "Pedidos", emoji: "📦" },
    { label: "Favoritos", emoji: "❤️" },
    { label: "Calificación", emoji: "⭐" },
    { label: "Ubicación", emoji: "📍" },
    { label: "Etiqueta", emoji: "🏷️" },
    { label: "Notif.", emoji: "🔔" },
    { label: "Regreso", emoji: "↩️" },
  ];

  return (
    <div>
      <SlideHeader title="Guía de Estilo" />
      <div className="px-2 space-y-6">
        {/* Paleta */}
        <section>
          <h3 className="mb-3" style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}>
            Paleta de Colores
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {colors.map((c) => (
              <div key={c.hex} className="text-center">
                <div
                  className="w-full h-12 rounded-lg border mb-1 shadow-sm"
                  style={{ background: c.hex, borderColor: "rgba(107,53,32,0.2)" }}
                />
                <p style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: "#6B3520" }}>{c.hex}</p>
                <p style={{ fontSize: "0.6rem", color: "#7A5642", fontWeight: 600 }}>{c.role}</p>
                <p style={{ fontSize: "0.55rem", color: "#9A7060" }}>{c.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tipografía */}
        <section>
          <h3 className="mb-3" style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}>
            Tipografía
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                use: "TÍTULOS",
                name: "Playfair Display",
                desc: "Serif · Elegante · Artesanal",
                sample: "Artesanías de México",
                fontStyle: { fontFamily: "var(--font-heading)" } as React.CSSProperties,
              },
              {
                use: "SUBTÍTULOS Y CUERPO",
                name: "Nunito",
                desc: "Sans-serif · Legible · Amigable",
                sample: "Cooperativa de artesanos rurales",
                fontStyle: { fontFamily: "Nunito, sans-serif" } as React.CSSProperties,
              },
              {
                use: "PRECIOS Y DATOS",
                name: "DM Mono",
                desc: "Monoespaciada · Clara · Numérica",
                sample: "$1,200.00 MXN",
                fontStyle: { fontFamily: "DM Mono, monospace", color: "#B87333" } as React.CSSProperties,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="p-4 rounded-lg border"
                style={{ borderColor: "rgba(107,53,32,0.2)", background: "#FDF8F0" }}
              >
                <p style={{ fontSize: "0.6rem", color: "#9A7060", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                  {t.use}
                </p>
                <p style={{ ...t.fontStyle, fontSize: "1.1rem", color: "#2B1A10", marginBottom: "0.2rem" }}>{t.name}</p>
                <p style={{ ...t.fontStyle, fontSize: "0.8rem", color: "#7A5642", marginBottom: "0.5rem" }}>{t.desc}</p>
                <div
                  className="mt-2 p-2 rounded"
                  style={{ background: "#EDE0CD" }}
                >
                  <p style={{ ...t.fontStyle, fontSize: "0.85rem", color: "#2B1A10" }}>{t.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Iconografía */}
        <section>
          <h3 className="mb-3" style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}>
            Iconografía
          </h3>
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: "rgba(107,53,32,0.2)", background: "#FDF8F0" }}
          >
            <p style={{ fontSize: "0.75rem", color: "#7A5642", marginBottom: "0.75rem" }}>
              <strong>Librería:</strong> Lucide React · Stroke width 1.5 · Tamaño base 20px · Color heredado del contexto
            </p>
            <div className="flex flex-wrap gap-4">
              {icons.map((ic) => (
                <div key={ic.label} className="flex flex-col items-center gap-1">
                  <span style={{ fontSize: "1.4rem" }}>{ic.emoji}</span>
                  <span style={{ fontSize: "0.55rem", color: "#9A7060" }}>{ic.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Estructura */}
        <section>
          <h3 className="mb-3" style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}>
            Estructura de Página
          </h3>
          <div className="border rounded-lg overflow-hidden text-xs" style={{ borderColor: "rgba(107,53,32,0.25)" }}>
            <div className="p-2 text-center" style={{ background: "#6B3520", color: "#F5EDE0" }}>
              &lt;header&gt; — Logo · Navegación Principal · Búsqueda · Carrito · Perfil
            </div>
            <div className="p-2 text-center" style={{ background: "#B87333", color: "#F5EDE0" }}>
              &lt;hero&gt; — Banner Principal · CTA · Categorías destacadas
            </div>
            <div className="grid grid-cols-4" style={{ borderTop: "1px solid rgba(107,53,32,0.2)", borderBottom: "1px solid rgba(107,53,32,0.2)" }}>
              <div className="p-3 text-center border-r" style={{ borderColor: "rgba(107,53,32,0.2)", background: "#EDE0CD" }}>
                &lt;aside&gt;<br />
                <span style={{ color: "#7A5642" }}>Filtros<br />Categ.</span>
              </div>
              <div className="p-3 text-center col-span-3" style={{ background: "#FDF8F0" }}>
                &lt;main&gt; · Grid de Productos<br />
                <span style={{ color: "#7A5642" }}>3–4 columnas · Cards · Paginación</span>
              </div>
            </div>
            <div className="p-2 text-center" style={{ background: "#2B1A10", color: "#F5EDE0" }}>
              &lt;footer&gt; — Links · Redes Sociales · Contacto · Derechos
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Slide 3: Normativa de Diseño ─────────────────────────────────────────────

function SlideNormativa() {
  const rules = [
    {
      n: 1,
      title: "Consistencia",
      desc: "El navbar, botones primarios (terracota), tarjetas de producto y tipografía se mantienen idénticos en las 11 vistas de la app.",
    },
    {
      n: 2,
      title: "Atajos para usuarios expertos",
      desc: "Búsqueda directa por nombre, filtros por categoría con un clic, y acceso rápido al carrito desde cualquier página.",
    },
    {
      n: 3,
      title: "Retroalimentación informativa",
      desc: "Contador de artículos en el carrito, alertas de 'Últimas unidades', notificaciones de estado del pedido y confirmación de compra.",
    },
    {
      n: 4,
      title: "Diálogos con cierre",
      desc: "Flujo de checkout dividido en 4 pasos con indicador de progreso y pantalla de confirmación con folio de pedido.",
    },
    {
      n: 5,
      title: "Prevención y manejo de errores",
      desc: "Validación de formularios en tiempo real, mensajes de error descriptivos y confirmación antes de vaciar el carrito.",
    },
    {
      n: 6,
      title: "Reversibilidad",
      desc: "Botón 'Eliminar artículo', opción de modificar cantidades, cancelar pedido desde 'Mis Pedidos' y proceso de devoluciones.",
    },
    {
      n: 7,
      title: "Control del usuario",
      desc: "El usuario decide cuándo avanzar al pago, puede seguir comprando, guardar favoritos o abandonar el flujo sin consecuencias.",
    },
    {
      n: 8,
      title: "Reducción de la carga cognitiva",
      desc: "Imágenes grandes de producto, precio en DM Mono destacado, historia del artesano accesible y descripción concisa en cada tarjeta.",
    },
  ];

  return (
    <div>
      <SlideHeader title="Normativa de Diseño" />
      <div className="px-2">
        <div
          className="p-5 rounded-xl mb-5 border"
          style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.25)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              color: "#6B3520",
              fontSize: "1.15rem",
              marginBottom: "0.6rem",
            }}
          >
            Normativa elegida: <em>Las 8 Reglas de Oro del Diseño de Interfaces</em> — Ben Shneiderman
          </p>
          <p style={{ color: "#4A2C1A", fontSize: "0.85rem", lineHeight: 1.6 }}>
            <strong>Justificación:</strong> Esta normativa es la más adecuada para ArteEnManos porque establece principios
            concretos y verificables directamente en cada pantalla del e-commerce. Al estar orientada a la interacción
            con el usuario final, garantiza que tanto compradores urbanos como artesanos con menor experiencia digital
            puedan navegar la plataforma con facilidad. Sus reglas cubren desde la consistencia visual hasta la
            tolerancia a errores, aspectos críticos para generar confianza en una transacción económica en línea y
            para empoderar a comunidades rurales que dependen de este canal de ventas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((r) => (
            <div
              key={r.n}
              className="flex gap-3 p-3 rounded-lg border"
              style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.15)" }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: "#6B3520", color: "#F5EDE0", fontFamily: "DM Mono, monospace" }}
              >
                {r.n}
              </div>
              <div>
                <p style={{ color: "#2B1A10", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.2rem" }}>
                  {r.title}
                </p>
                <p style={{ color: "#7A5642", fontSize: "0.75rem", lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mini Mockups para Usabilidad ─────────────────────────────────────────────

function MockupVisibilidad() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Checkout — Paso 3 de 4
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-3">
          {["Carrito", "Datos", "Pago", "Confirmar"].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 0 }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: i < 2 ? "#6B3520" : i === 2 ? "transparent" : "transparent",
                    border: i === 2 ? "2px solid #6B3520" : i > 2 ? "1px solid #C4956A" : "none",
                    color: i < 2 ? "#F5EDE0" : i === 2 ? "#6B3520" : "#C4956A",
                    fontSize: "0.6rem",
                  }}
                >
                  {i < 2 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.5rem", color: i <= 2 ? "#6B3520" : "#C4956A" }}>{step}</span>
              </div>
              {i < 3 && (
                <div className="flex-1 h-px" style={{ background: i < 2 ? "#6B3520" : "#D4B89A" }} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="rounded p-2 text-xs" style={{ background: "#EDE0CD", color: "#4A2C1A" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>💳 Información de pago</p>
          <div className="h-5 rounded mb-1" style={{ background: "#FDF8F0", border: "1px solid #D4B89A" }} />
          <div className="h-5 rounded" style={{ background: "#FDF8F0", border: "1px solid #D4B89A" }} />
        </div>
      </div>
    </div>
  );
}

function MockupControl() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        🛒 Mi Carrito (2 artículos)
      </div>
      <div className="p-3 space-y-2">
        {["Vasija de Barro · $450", "Aretes de Plata · $680"].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded p-2 text-xs"
            style={{ background: "#EDE0CD" }}
          >
            <span style={{ color: "#2B1A10", fontSize: "0.7rem" }}>{item}</span>
            <button
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "#C0392B", color: "white", fontSize: "0.6rem" }}
            >
              ✕ Eliminar
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 py-1 rounded text-xs"
            style={{ border: "1px solid #6B3520", color: "#6B3520", fontSize: "0.65rem" }}
          >
            ← Seguir comprando
          </button>
          <button
            className="flex-1 py-1 rounded text-xs"
            style={{ background: "#6B3520", color: "#F5EDE0", fontSize: "0.65rem" }}
          >
            Pagar →
          </button>
        </div>
      </div>
    </div>
  );
}

function MockupConsistencia() {
  const NavBar = ({ page }: { page: string }) => (
    <div className="flex items-center justify-between px-3 py-1.5 rounded text-xs" style={{ background: "#2B1A10" }}>
      <span style={{ fontFamily: "var(--font-heading)", color: "#F5EDE0", fontSize: "0.7rem" }}>ArteEnManos</span>
      <div className="flex gap-2" style={{ color: "#C4956A", fontSize: "0.55rem" }}>
        <span style={{ textDecoration: page === "Catálogo" ? "underline" : "none", color: page === "Catálogo" ? "#E8C99A" : "#C4956A" }}>Catálogo</span>
        <span style={{ textDecoration: page === "Artesanos" ? "underline" : "none", color: page === "Artesanos" ? "#E8C99A" : "#C4956A" }}>Artesanos</span>
        <span>🛒</span>
        <span>👤</span>
      </div>
    </div>
  );
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Navbar idéntico en todas las páginas
      </div>
      <div className="p-3 space-y-2">
        <div>
          <p style={{ fontSize: "0.55rem", color: "#9A7060", marginBottom: "0.3rem" }}>Página: Catálogo</p>
          <NavBar page="Catálogo" />
        </div>
        <div>
          <p style={{ fontSize: "0.55rem", color: "#9A7060", marginBottom: "0.3rem" }}>Página: Detalle de Producto</p>
          <NavBar page="Detalle" />
        </div>
        <div>
          <p style={{ fontSize: "0.55rem", color: "#9A7060", marginBottom: "0.3rem" }}>Página: Mis Pedidos</p>
          <NavBar page="Pedidos" />
        </div>
      </div>
    </div>
  );
}

function MockupPrevencion() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Validación de formulario en tiempo real
      </div>
      <div className="p-3 space-y-2 text-xs">
        <div>
          <label style={{ color: "#4A2C1A", fontSize: "0.7rem", fontWeight: 600 }}>Correo electrónico</label>
          <div
            className="mt-0.5 px-2 py-1.5 rounded flex items-center justify-between"
            style={{ border: "1.5px solid #C0392B", background: "#FFF5F5" }}
          >
            <span style={{ color: "#888", fontSize: "0.7rem" }}>usuario@gmail</span>
            <AlertCircle className="w-3 h-3 text-red-600" />
          </div>
          <p style={{ color: "#C0392B", fontSize: "0.6rem", marginTop: "0.2rem" }}>✕ Ingresa un correo electrónico válido (ej: nombre@correo.com)</p>
        </div>
        <div>
          <label style={{ color: "#4A2C1A", fontSize: "0.7rem", fontWeight: 600 }}>Cantidad</label>
          <div
            className="mt-0.5 px-2 py-1.5 rounded"
            style={{ border: "1.5px solid #E8A020", background: "#FFFBF0" }}
          >
            <span style={{ color: "#2B1A10", fontSize: "0.7rem" }}>12</span>
          </div>
          <p style={{ color: "#B87333", fontSize: "0.6rem", marginTop: "0.2rem" }}>⚠ Solo quedan 5 unidades disponibles</p>
        </div>
        <div>
          <label style={{ color: "#4A2C1A", fontSize: "0.7rem", fontWeight: 600 }}>Nombre completo</label>
          <div
            className="mt-0.5 px-2 py-1.5 rounded flex items-center justify-between"
            style={{ border: "1.5px solid #6B3520", background: "#F0F8F0" }}
          >
            <span style={{ color: "#2B1A10", fontSize: "0.7rem" }}>Kevin Pacheco</span>
            <CheckCircle className="w-3 h-3 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupReconocimiento() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Catálogo visual + migas de pan
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-2" style={{ fontSize: "0.55rem", color: "#9A7060" }}>
          <span>Inicio</span><span>›</span><span>Catálogo</span><span>›</span>
          <span style={{ color: "#6B3520", fontWeight: 600 }}>Cerámica</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Vasija de Barro", price: "$450", color: "#C4956A" },
            { name: "Cuenco Talavera", price: "$320", color: "#7A9B8C" },
          ].map((p) => (
            <div
              key={p.name}
              className="rounded-lg overflow-hidden border"
              style={{ borderColor: "#D4B89A" }}
            >
              <div className="h-12 flex items-center justify-center" style={{ background: p.color }}>
                <span style={{ fontSize: "1.2rem" }}>🏺</span>
              </div>
              <div className="p-1.5">
                <p style={{ fontSize: "0.6rem", color: "#2B1A10", fontWeight: 600 }}>{p.name}</p>
                <p style={{ fontSize: "0.6rem", color: "#B87333", fontFamily: "DM Mono, monospace" }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4: Principios de Usabilidad ───────────────────────────────────────

function SlideUsabilidad() {
  const principles = [
    {
      num: 1,
      title: "Visibilidad del Estado del Sistema",
      heuristic: "Heurística #1 de Nielsen",
      desc: "El indicador de progreso en el checkout muestra en qué paso está el usuario (Carrito → Datos → Pago → Confirmar), reduciendo la incertidumbre durante la compra.",
      mockup: <MockupVisibilidad />,
    },
    {
      num: 2,
      title: "Control y Libertad del Usuario",
      heuristic: "Heurística #3 de Nielsen",
      desc: "El carrito permite eliminar artículos individuales, modificar cantidades y volver al catálogo en cualquier momento sin perder el progreso.",
      mockup: <MockupControl />,
    },
    {
      num: 3,
      title: "Consistencia y Estándares",
      heuristic: "Heurística #4 de Nielsen",
      desc: "El header y la barra de navegación son idénticos en las 11 pantallas. Los botones primarios siempre son terracota (#6B3520) y los secundarios contorno.",
      mockup: <MockupConsistencia />,
    },
    {
      num: 4,
      title: "Prevención de Errores",
      heuristic: "Heurística #5 de Nielsen",
      desc: "Los formularios validan en tiempo real mostrando el error específico antes de que el usuario intente enviar. Las alertas de stock bajo evitan pedidos imposibles.",
      mockup: <MockupPrevencion />,
    },
    {
      num: 5,
      title: "Reconocimiento antes que Recuerdo",
      heuristic: "Heurística #6 de Nielsen",
      desc: "El catálogo muestra imágenes prominentes de cada producto, y las migas de pan indican la ubicación del usuario en todo momento sin que tenga que recordar la ruta.",
      mockup: <MockupReconocimiento />,
    },
  ];

  const [active, setActive] = useState(0);
  const p = principles[active];

  return (
    <div>
      <SlideHeader title="Principios de Usabilidad" />
      <div className="px-2">
        <div className="flex gap-2 mb-4 flex-wrap">
          {principles.map((pr, i) => (
            <button
              key={pr.num}
              onClick={() => setActive(i)}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: i === active ? "#6B3520" : "#EDE0CD",
                color: i === active ? "#F5EDE0" : "#6B3520",
                border: "1px solid rgba(107,53,32,0.3)",
              }}
            >
              #{pr.num} {pr.title.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border" style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.2)" }}>
            <span
              className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
              style={{ background: "#EDE0CD", color: "#6B3520", fontFamily: "DM Mono, monospace" }}
            >
              {p.heuristic}
            </span>
            <h3
              className="mb-2"
              style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}
            >
              {p.title}
            </h3>
            <p style={{ color: "#4A2C1A", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.desc}</p>
          </div>
          <div>{p.mockup}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Mockups para Accesibilidad ─────────────────────────────────────────

function MockupPerceptible() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Contraste y texto alternativo
      </div>
      <div className="p-3 space-y-2">
        <div className="relative rounded overflow-hidden h-14" style={{ background: "#C4956A" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: "1.5rem" }}>🏺</span>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 px-1 py-0.5"
            style={{ background: "rgba(43,26,16,0.85)", fontSize: "0.55rem", color: "#F5EDE0" }}
          >
            alt="Vasija de barro negro pintada a mano, Oaxaca"
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { bg: "#6B3520", text: "#F5EDE0", label: "AA ✓ 8.5:1" },
            { bg: "#B87333", text: "#2B1A10", label: "AA ✓ 4.8:1" },
            { bg: "#EDE0CD", text: "#6B3520", label: "AA ✓ 5.2:1" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex-1 p-1.5 rounded text-center"
              style={{ background: c.bg }}
            >
              <p style={{ color: c.text, fontSize: "0.55rem", fontWeight: 600 }}>Texto</p>
              <p style={{ color: c.text, fontSize: "0.5rem" }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupOperable() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Targets accesibles + foco de teclado
      </div>
      <div className="p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <button
            className="flex-1 py-3 rounded text-xs flex items-center justify-center gap-1"
            style={{ background: "#6B3520", color: "#F5EDE0", fontSize: "0.75rem" }}
          >
            <ShoppingCart className="w-4 h-4" /> Agregar al carrito
          </button>
          <div style={{ fontSize: "0.55rem", color: "#7A5642", maxWidth: "60px", lineHeight: 1.3 }}>
            Min. 44×44px ✓ táctil y teclado
          </div>
        </div>
        <div
          className="px-3 py-2 rounded text-xs flex items-center justify-between"
          style={{
            border: "2.5px solid #B87333",
            background: "#FDF8F0",
            boxShadow: "0 0 0 3px rgba(184,115,51,0.25)",
          }}
        >
          <span style={{ color: "#2B1A10", fontSize: "0.7rem" }}>Buscar artesanías…</span>
          <Search className="w-3 h-3 text-amber-700" />
        </div>
        <p style={{ fontSize: "0.55rem", color: "#7A5642" }}>↑ Ring de foco visible (Tab navigation)</p>
      </div>
    </div>
  );
}

function MockupComprensible() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Etiquetas claras y mensajes descriptivos
      </div>
      <div className="p-3 space-y-2 text-xs">
        <div>
          <label style={{ color: "#4A2C1A", fontSize: "0.65rem", fontWeight: 700 }}>
            Dirección de entrega <span style={{ color: "#C0392B" }}>*</span>
          </label>
          <p style={{ color: "#9A7060", fontSize: "0.55rem", marginBottom: "0.2rem" }}>
            Calle, número, colonia, ciudad, estado y código postal
          </p>
          <div
            className="px-2 py-1.5 rounded"
            style={{ border: "1px solid rgba(107,53,32,0.3)", background: "#EDE0CD", fontSize: "0.65rem", color: "#9A7060" }}
          >
            Ej: Calle Reforma 123, Col. Centro, Oaxaca, 68000
          </div>
        </div>
        <div>
          <div
            className="flex items-start gap-1.5 p-2 rounded"
            style={{ background: "#FFF0F0", border: "1px solid #C0392B" }}
          >
            <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: "0.6rem", color: "#9B1C1C", lineHeight: 1.4 }}>
              Por favor, completa la dirección completa incluyendo código postal para calcular el envío correctamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupRobusto() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        HTML semántico compatible con tecnologías asistivas
      </div>
      <div className="p-3">
        <div className="font-mono text-xs space-y-0.5" style={{ color: "#2B1A10" }}>
          {[
            { tag: "<header>", indent: 0, color: "#6B3520" },
            { tag: "  <nav aria-label='Principal'>", indent: 1, color: "#B87333" },
            { tag: "  </nav>", indent: 1, color: "#B87333" },
            { tag: "</header>", indent: 0, color: "#6B3520" },
            { tag: "<main>", indent: 0, color: "#6B3520" },
            { tag: "  <section aria-label='Productos'>", indent: 1, color: "#B87333" },
            { tag: "    <article role='listitem'>", indent: 2, color: "#C4956A" },
            { tag: "    </article>", indent: 2, color: "#C4956A" },
            { tag: "  </section>", indent: 1, color: "#B87333" },
            { tag: "</main>", indent: 0, color: "#6B3520" },
            { tag: "<footer>", indent: 0, color: "#6B3520" },
            { tag: "</footer>", indent: 0, color: "#6B3520" },
          ].map((line, i) => (
            <p key={i} style={{ color: line.color, fontSize: "0.6rem", paddingLeft: `${line.indent * 12}px` }}>
              {line.tag}
            </p>
          ))}
        </div>
        <p style={{ fontSize: "0.55rem", color: "#7A5642", marginTop: "0.5rem" }}>
          Compatible con NVDA, JAWS y VoiceOver ✓
        </p>
      </div>
    </div>
  );
}

function MockupAdaptable() {
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#D4B89A", background: "#FDF8F0" }}>
      <div className="p-2 border-b text-xs" style={{ borderColor: "#D4B89A", background: "#EDE0CD", color: "#6B3520", fontWeight: 700 }}>
        Escalabilidad de texto y adaptabilidad
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-end gap-3">
          {[
            { size: "0.75rem", label: "12px · Notas" },
            { size: "0.875rem", label: "14px · Cuerpo" },
            { size: "1rem", label: "16px · Base" },
            { size: "1.25rem", label: "20px · Subtít." },
          ].map((s) => (
            <div key={s.size} className="text-center">
              <p style={{ fontSize: s.size, color: "#2B1A10", lineHeight: 1 }}>Aa</p>
              <p style={{ fontSize: "0.5rem", color: "#9A7060", marginTop: "0.2rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded flex-1" style={{ background: "#EDE0CD" }}>
            <p style={{ fontSize: "0.6rem", color: "#6B3520", fontWeight: 700 }}>Responsive</p>
            <p style={{ fontSize: "0.55rem", color: "#7A5642" }}>Mobile · Tablet · Desktop</p>
          </div>
          <div className="p-2 rounded flex-1" style={{ background: "#EDE0CD" }}>
            <p style={{ fontSize: "0.6rem", color: "#6B3520", fontWeight: 700 }}>Sin auto-play</p>
            <p style={{ fontSize: "0.55rem", color: "#7A5642" }}>Medios bajo control del usuario</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 5: Principios de Accesibilidad ────────────────────────────────────

function SlideAccesibilidad() {
  const principles = [
    {
      num: 1,
      title: "Perceptible",
      wcag: "WCAG 2.1 — Principio 1 (POUR)",
      desc: "Todas las imágenes de productos tienen atributo alt descriptivo. Los colores cumplen ratio de contraste WCAG AA (mínimo 4.5:1) garantizando legibilidad para personas con baja visión.",
      mockup: <MockupPerceptible />,
    },
    {
      num: 2,
      title: "Operable",
      wcag: "WCAG 2.1 — Principio 2 (POUR)",
      desc: "Todos los botones tienen un área táctil mínima de 44×44px. La navegación completa es posible por teclado (Tab, Enter, Escape) con anillo de foco visible en color ámbar.",
      mockup: <MockupOperable />,
    },
    {
      num: 3,
      title: "Comprensible",
      wcag: "WCAG 2.1 — Principio 3 (POUR)",
      desc: "Los formularios tienen etiquetas explícitas, texto de ayuda con ejemplo y mensajes de error que describen qué salió mal y cómo corregirlo — no solo 'error'.",
      mockup: <MockupComprensible />,
    },
    {
      num: 4,
      title: "Robusto",
      wcag: "WCAG 2.1 — Principio 4 (POUR)",
      desc: "La estructura usa HTML5 semántico con etiquetas header, main, nav, section, article y footer, más atributos ARIA en componentes interactivos para compatibilidad con lectores de pantalla.",
      mockup: <MockupRobusto />,
    },
    {
      num: 5,
      title: "Adaptabilidad y Escalabilidad",
      wcag: "WCAG 2.1 — Criterio 1.4.4",
      desc: "El texto escala correctamente hasta 200% sin pérdida de contenido. El diseño responde a mobile/tablet/desktop. No hay contenido que dependa exclusivamente del color para transmitir información.",
      mockup: <MockupAdaptable />,
    },
  ];

  const [active, setActive] = useState(0);
  const p = principles[active];

  return (
    <div>
      <SlideHeader title="Principios de Accesibilidad" />
      <div className="px-2">
        <div className="flex gap-2 mb-4 flex-wrap">
          {principles.map((pr, i) => (
            <button
              key={pr.num}
              onClick={() => setActive(i)}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: i === active ? "#6B3520" : "#EDE0CD",
                color: i === active ? "#F5EDE0" : "#6B3520",
                border: "1px solid rgba(107,53,32,0.3)",
              }}
            >
              #{pr.num} {pr.title.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border" style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.2)" }}>
            <span
              className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
              style={{ background: "#EDE0CD", color: "#6B3520", fontFamily: "DM Mono, monospace" }}
            >
              {p.wcag}
            </span>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}>
              {p.title}
            </h3>
            <p style={{ color: "#4A2C1A", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.desc}</p>
          </div>
          <div>{p.mockup}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 6: Modelo de Navegación ───────────────────────────────────────────

function SlideNavegacion() {
  const Box = ({
    label,
    sub,
    primary,
    accent,
  }: {
    label: string;
    sub?: string;
    primary?: boolean;
    accent?: boolean;
  }) => (
    <div
      className="px-3 py-2 rounded-lg text-center shadow-sm border"
      style={{
        background: primary ? "#6B3520" : accent ? "#B87333" : "#FDF8F0",
        color: primary || accent ? "#F5EDE0" : "#2B1A10",
        borderColor: primary ? "#6B3520" : accent ? "#B87333" : "rgba(107,53,32,0.25)",
        minWidth: "90px",
      }}
    >
      <p style={{ fontSize: "0.7rem", fontWeight: 600 }}>{label}</p>
      {sub && <p style={{ fontSize: "0.55rem", opacity: 0.7 }}>{sub}</p>}
    </div>
  );

  const Arrow = ({ vertical }: { vertical?: boolean }) => (
    <div className="flex items-center justify-center">
      {vertical ? (
        <div style={{ width: "1px", height: "16px", background: "rgba(107,53,32,0.4)" }} />
      ) : (
        <div style={{ height: "1px", width: "16px", background: "rgba(107,53,32,0.4)" }} />
      )}
    </div>
  );

  return (
    <div>
      <SlideHeader title="Modelo de Navegación" />
      <div className="px-2">
        <div
          className="p-4 rounded-xl border mb-4"
          style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.2)" }}
        >
          <Bullet>
            <strong>Tipo:</strong> Navegación Jerárquica + Navegación Secuencial (flujo de compra)
          </Bullet>
          <Bullet>
            <strong>Patrón:</strong> Hub and Spoke — el Inicio actúa como hub central desde donde se accede a todas las secciones.
          </Bullet>
        </div>

        {/* Navigation diagram */}
        <div className="overflow-x-auto">
          <div className="flex flex-col items-center gap-0 min-w-[600px] pb-4">
            {/* Root */}
            <Box label="🏠 Inicio" primary />
            <Arrow vertical />

            {/* Level 1 branches */}
            <div className="flex items-start gap-3 w-full justify-center">
              {/* Branch 1: Tienda */}
              <div className="flex flex-col items-center gap-1">
                <Box label="📦 Catálogo" accent />
                <Arrow vertical />
                <Box label="🏺 Producto" />
                <Arrow vertical />
                <Box label="🛒 Carrito" />
                <Arrow vertical />
                <div className="flex flex-col items-center gap-1">
                  <Box label="📋 Checkout" />
                  <Arrow vertical />
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <Box label="✅ Confirmación" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2" style={{ color: "rgba(107,53,32,0.3)", fontSize: "1.2rem" }}>—</div>

              {/* Branch 2: Mi Cuenta */}
              <div className="flex flex-col items-center gap-1">
                <Box label="👤 Mi Cuenta" accent />
                <Arrow vertical />
                <div className="flex gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <Box label="🔐 Login" />
                    <Arrow vertical />
                    <Box label="📝 Registro" />
                  </div>
                </div>
                <Arrow vertical />
                <Box label="👤 Perfil" />
                <Arrow vertical />
                <div className="flex flex-col items-center gap-1 gap-x-1">
                  <Box label="📦 Mis Pedidos" />
                  <Arrow vertical />
                  <Box label="↩️ Devoluciones" />
                </div>
              </div>

              <div className="pt-2" style={{ color: "rgba(107,53,32,0.3)", fontSize: "1.2rem" }}>—</div>

              {/* Branch 3: Admin */}
              <div className="flex flex-col items-center gap-1">
                <Box label="⚙️ Admin" accent />
                <Arrow vertical />
                <Box label="📊 Dashboard" />
                <Arrow vertical />
                <Box label="📦 Productos" />
                <Arrow vertical />
                <Box label="👥 Pedidos" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-3 flex-wrap">
          {[
            { color: "#6B3520", label: "Página raíz (Inicio)" },
            { color: "#B87333", label: "Secciones principales" },
            { color: "#FDF8F0", label: "Sub-páginas", border: true },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-4 h-4 rounded"
                style={{
                  background: l.color,
                  border: l.border ? "1px solid rgba(107,53,32,0.4)" : "none",
                }}
              />
              <span style={{ color: "#4A2C1A" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 7: Navegación del Prototipo ───────────────────────────────────────

function SlidePrototipo() {
  return (
    <div>
      <SlideHeader title="Navegación del Prototipo en Figma" />
      <div className="px-2 space-y-5">
        <div className="space-y-2">
          <Bullet>
            Video de demostración del prototipo navegable en Figma — todos los integrantes participan en la explicación.
          </Bullet>
          <Bullet>
            El prototipo cubre los flujos principales: Inicio → Catálogo → Producto → Carrito → Checkout → Confirmación.
          </Bullet>
        </div>

        {/* Video placeholder */}
        <div
          className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 py-12"
          style={{ borderColor: "#C4956A", background: "#FDF8F0" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#EDE0CD" }}
          >
            <Film className="w-8 h-8" style={{ color: "#B87333" }} />
          </div>
          <div className="text-center">
            <p style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "1.1rem" }}>
              Insertar enlace del video aquí
            </p>
            <p style={{ color: "#7A5642", fontSize: "0.85rem", marginTop: "0.3rem" }}>
              YouTube / Google Drive / Loom con la grabación de la navegación del prototipo en Figma
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: "#6B3520", color: "#F5EDE0" }}
          >
            ▶ Ver Demo del Prototipo
          </div>
        </div>

        {/* Checklist */}
        <div
          className="p-4 rounded-xl border"
          style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.2)" }}
        >
          <p className="mb-3" style={{ color: "#6B3520", fontWeight: 700, fontSize: "0.9rem" }}>
            El video debe incluir:
          </p>
          <div className="space-y-2">
            {[
              "Presentación del equipo (los 4 integrantes)",
              "Navegación por el Home → Catálogo → Filtros",
              "Flujo de compra completo: Producto → Carrito → Checkout → Confirmación",
              "Vista de Mi Cuenta: Login, Perfil, Mis Pedidos y Devoluciones",
              "Panel de Administrador: Dashboard y gestión de productos",
              "Explicación de cómo se aplica cada principio en la interfaz",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#6B3520" }} />
                <p style={{ fontSize: "0.82rem", color: "#4A2C1A" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 8: Conclusión ──────────────────────────────────────────────────────

function SlideConclusion() {
  const topics = [
    {
      icon: "🎨",
      title: "Guía de Estilo",
      text: "La paleta de colores cafés artesanales (terracota, ámbar, parchment) y la combinación tipográfica Playfair Display/Nunito/DM Mono generaron una identidad visual coherente que comunica autenticidad y confianza, alineada con la propuesta de valor de la cooperativa.",
    },
    {
      icon: "📐",
      title: "Normativa de Diseño",
      text: "Las 8 Reglas de Oro de Shneiderman sirvieron como guía práctica para estructurar cada pantalla, garantizando que el sistema sea predecible, tolerante a errores y eficiente tanto para artesanos con baja experiencia digital como para compradores urbanos frecuentes.",
    },
    {
      icon: "🖥️",
      title: "Principios de Usabilidad",
      text: "Los 5 principios de Nielsen aplicados (visibilidad del estado, control del usuario, consistencia, prevención de errores y reconocimiento) redujeron la fricción en el flujo de compra y aumentaron la confianza del usuario en la plataforma.",
    },
    {
      icon: "♿",
      title: "Principios de Accesibilidad",
      text: "Implementar los 4 principios WCAG POUR (Perceptible, Operable, Comprensible, Robusto) aseguró que la plataforma sea inclusiva y funcione correctamente con tecnologías asistivas, ampliando el alcance del mercado potencial.",
    },
    {
      icon: "🗺️",
      title: "Modelo de Navegación",
      text: "El modelo jerárquico hub-and-spoke con flujo secuencial para el checkout permitió organizar las 11 vistas de forma intuitiva. El breadcrumb y el indicador de progreso orientan al usuario en todo momento sin esfuerzo cognitivo adicional.",
    },
  ];

  return (
    <div>
      <SlideHeader title="Conclusión" />
      <div className="px-2 space-y-4">
        <div
          className="p-4 rounded-xl border"
          style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.2)" }}
        >
          <p style={{ color: "#4A2C1A", fontSize: "0.88rem", lineHeight: 1.7 }}>
            El desarrollo de <strong>ArteEnManos</strong> como estudio de caso demostró que aplicar de forma sistemática
            los fundamentos de Experiencia de Usuario no es un lujo estético, sino una necesidad funcional.
            La plataforma logró integrar los 25 requerimientos funcionales dentro de una interfaz coherente, accesible
            y orientada al usuario, donde cada decisión de diseño tiene una justificación basada en principios académicos
            y normativas reconocidas. El proceso de Diseño Centrado en el Usuario (DCU) guió la iteración constante
            de mockups, priorizando siempre las necesidades reales de artesanos rurales y compradores digitales.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((t) => (
            <div
              key={t.title}
              className="p-3 rounded-lg border flex gap-3"
              style={{ background: "#FDF8F0", borderColor: "rgba(107,53,32,0.15)" }}
            >
              <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{t.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#6B3520", marginBottom: "0.2rem" }}>
                  {t.title}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#4A2C1A", lineHeight: 1.55 }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: "linear-gradient(135deg, #6B3520, #B87333)", color: "#F5EDE0" }}
        >
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}>
            "Un buen diseño de UX no es visible — es la ausencia de fricción."
          </p>
          <p style={{ fontSize: "0.7rem", opacity: 0.7, marginTop: "0.3rem" }}>
            Kevin N. Pacheco · Ángel Pacheco · Abraham Velasco · Edwin González — Equipo ArteEnManos 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Presentation Component ─────────────────────────────────────────────

export function PresentacionEC({ navigate }: { navigate: (p: Page) => void }) {
  const [slideIdx, setSlideIdx] = useState(0);

  const current = SLIDES[slideIdx];

  const renderSlide = () => {
    switch (current.id) {
      case "portada": return <SlidePortada />;
      case "guia-estilo": return <SlideGuiaEstilo />;
      case "normativa": return <SlideNormativa />;
      case "usabilidad": return <SlideUsabilidad />;
      case "accesibilidad": return <SlideAccesibilidad />;
      case "navegacion": return <SlideNavegacion />;
      case "prototipo": return <SlidePrototipo />;
      case "conclusion": return <SlideConclusion />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5EDE0" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between border-b"
        style={{ background: "#2B1A10", borderColor: "rgba(196,149,106,0.2)" }}
      >
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: "#C4956A" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ArteEnManos
        </button>
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4" style={{ color: "#C4956A" }} />
          <span style={{ fontFamily: "DM Mono, monospace", color: "#C4956A", fontSize: "0.8rem" }}>
            2do Parcial · UX
          </span>
        </div>
        <div style={{ fontFamily: "DM Mono, monospace", color: "#C4956A", fontSize: "0.8rem" }}>
          {slideIdx + 1} / {SLIDES.length}
        </div>
      </div>

      {/* Slide dots nav */}
      <div className="flex justify-center gap-1.5 pt-4 pb-2 flex-wrap px-6">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSlideIdx(i)}
            className="group flex flex-col items-center gap-1"
            title={s.title}
          >
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === slideIdx ? "2rem" : "0.75rem",
                background: i === slideIdx ? "#6B3520" : "#C4956A",
                opacity: i === slideIdx ? 1 : 0.5,
              }}
            />
            <span
              style={{
                fontSize: "0.55rem",
                color: i === slideIdx ? "#6B3520" : "#9A7060",
                fontWeight: i === slideIdx ? 700 : 400,
              }}
            >
              {s.title.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{ background: "#FDFAF6", border: "1px solid rgba(107,53,32,0.15)" }}
        >
          {renderSlide()}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
            disabled={slideIdx === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-30"
            style={{ background: "#6B3520", color: "#F5EDE0" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <div className="text-center">
            <p style={{ fontFamily: "var(--font-heading)", color: "#6B3520", fontSize: "0.9rem" }}>
              {current.title}
            </p>
            <p style={{ fontSize: "0.65rem", color: "#9A7060", fontFamily: "DM Mono, monospace" }}>
              Diapositiva {slideIdx + 1} de {SLIDES.length}
            </p>
          </div>
          <button
            onClick={() => setSlideIdx((i) => Math.min(SLIDES.length - 1, i + 1))}
            disabled={slideIdx === SLIDES.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-30"
            style={{ background: "#6B3520", color: "#F5EDE0" }}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
