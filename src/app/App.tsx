import React, { useState, useMemo, useRef } from "react";
import { PresentacionEC } from "./components/PresentacionEC";
import logoArteEnManos from "../imports/logoArteEnManos.jpeg";
import {
  ShoppingCart, Search, User, Menu, X, Star, Heart,
  Package, Truck, ChevronRight, ChevronLeft, Check,
  CreditCard, Bell, BarChart2, AlertTriangle, Pencil,
  Trash2, Plus, Minus, MapPin, Clock, Filter, Tag,
  Facebook, LogOut, TrendingUp, Box, DollarSign,
  RefreshCw, Instagram, Mail, ArrowLeft, ShoppingBag,
  RotateCcw, Eye, Users as UsersIcon, EyeOff, Volume2, Play, Pause,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

type Page =
  | "home" | "catalog" | "product" | "cart" | "checkout"
  | "success" | "orders" | "profile" | "auth" | "admin" | "returns"
  | "presentacion";

type Product = {
  id: number;
  name: string;
  artisan: string;
  artisanStory: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  description: string;
  image: string;
  badge?: string;
};

type CartItem = { product: Product; qty: number };

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vasija de Barro Pintada",
    artisan: "María Chávez",
    artisanStory:
      "Desde los 12 años, María aprendió el arte del barro negro de su abuela en San Bartolo Coyotepec, Oaxaca. Sus piezas han sido reconocidas por el FONART en tres ocasiones.",
    category: "Cerámica",
    price: 450,
    oldPrice: 550,
    rating: 4.8,
    reviewCount: 23,
    stock: 12,
    sold: 145,
    description:
      "Vasija artesanal elaborada a mano con barro negro de Oaxaca. Cada pieza es única, con diseños geométricos pintados a mano con pigmentos naturales. Apta para decoración e ideal como regalo único.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&h=600&fit=crop&auto=format",
    badge: "Más vendido",
  },
  {
    id: 2,
    name: "Bolsa Tejida de Palma",
    artisan: "Rosa Méndez",
    artisanStory:
      "Rosa lidera la cooperativa de tejido de palma en Guerrero, con más de 30 tejedoras. Cada bolsa tarda tres días en completarse con palma natural seleccionada a mano.",
    category: "Tejidos",
    price: 280,
    rating: 4.6,
    reviewCount: 18,
    stock: 5,
    sold: 89,
    description:
      "Bolsa tejida a mano con palma natural de Guerrero. Proceso artesanal que toma 3 días por pieza. Resistente, ecológica y versátil para uso diario o playa.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=600&fit=crop&auto=format",
    badge: "Últimas unidades",
  },
  {
    id: 3,
    name: "Aretes de Plata y Ámbar",
    artisan: "Elena Ruiz",
    artisanStory:
      "Elena heredó el taller de platería de su padre en Taxco, Guerrero. Combina técnicas precolombinas con piedras naturales de Chiapas para crear joyería de autor.",
    category: "Joyería",
    price: 680,
    rating: 4.9,
    reviewCount: 41,
    stock: 8,
    sold: 203,
    description:
      "Aretes artesanales de plata 925 con ámbar natural de Chiapas. Diseño único que combina técnicas precolombinas con estética contemporánea. Incluye caja de regalo.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&h=600&fit=crop&auto=format",
    badge: "Nuevo",
  },
  {
    id: 4,
    name: "Tapete Bordado Zapoteca",
    artisan: "Familia Torres",
    artisanStory:
      "La familia Torres lleva 4 generaciones preservando el bordado zapoteca en Teotitlán del Valle. Sus tapetes son tejidos con lana de oveja y tintes naturales de plantas locales.",
    category: "Textiles",
    price: 1200,
    rating: 4.7,
    reviewCount: 12,
    stock: 3,
    sold: 67,
    description:
      "Tapete artesanal con diseños zapotecas tejido a mano con lana de oveja y tintes naturales. Dimensiones: 60×90 cm. Cada tapete toma hasta 2 semanas en completarse.",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&h=600&fit=crop&auto=format",
    badge: "Exclusivo",
  },
  {
    id: 5,
    name: "Cuenco de Madera Tallada",
    artisan: "Juan Pérez",
    artisanStory:
      "Juan es carpintero artesanal de tercera generación en Paracho, Michoacán. Trabaja exclusivamente con madera de mezquite rescatada para crear piezas funcionales.",
    category: "Madera",
    price: 320,
    rating: 4.5,
    reviewCount: 9,
    stock: 15,
    sold: 44,
    description:
      "Cuenco tallado a mano en madera de mezquite. Acabado con aceite de linaza natural. Ideal para frutas, decoración o como accesorio de cocina. Dimensiones: 25 cm diámetro.",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&h=600&fit=crop&auto=format",
  },
  {
    id: 6,
    name: "Velas Artesanales de Cera",
    artisan: "Carmen López",
    artisanStory:
      "Carmen combina su amor por la apicultura con el arte de las velas aromáticas en su pequeño taller en Mérida. Sus fragancias son inspiradas en la flora yucateca.",
    category: "Hogar",
    price: 180,
    rating: 4.4,
    reviewCount: 31,
    stock: 22,
    sold: 120,
    description:
      "Set de 3 velas aromáticas elaboradas con cera de abeja 100% natural. Fragancias: lavanda, copal y vainilla. Duración promedio: 40 horas cada una.",
    image:
      "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=700&h=600&fit=crop&auto=format",
  },
  {
    id: 7,
    name: "Máscara Lacada Guerrerense",
    artisan: "Pedro Guzmán",
    artisanStory:
      "Pedro es maestro lacador reconocido por el FONART por preservar la técnica de rayado de Olinalá. Sus piezas forman parte de colecciones privadas en México y Europa.",
    category: "Arte",
    price: 850,
    rating: 4.9,
    reviewCount: 7,
    stock: 2,
    sold: 28,
    description:
      "Máscara decorativa lacada con técnica de rayado de Olinalá, Guerrero. Diseños de animales míticos en negro y rojo. Pieza de colección con certificado de autenticidad.",
    image:
      "https://images.unsplash.com/photo-1647582890059-8025b45265ca?w=700&h=600&fit=crop&auto=format",
    badge: "Arte único",
  },
  {
    id: 8,
    name: "Huipil Bordado Oaxaqueño",
    artisan: "Rosa Méndez",
    artisanStory:
      "Rosa lidera la cooperativa de tejido de palma en Guerrero, con más de 30 tejedoras. Cada bolsa tarda tres días en completarse con palma natural seleccionada a mano.",
    category: "Textiles",
    price: 2400,
    rating: 5.0,
    reviewCount: 5,
    stock: 1,
    sold: 15,
    description:
      "Huipil tradicional oaxaqueño bordado a mano con hilos de seda y algodón. Bordado de flores y aves en colores vibrantes sobre tela de algodón blanco. Talla única.",
    image:
      "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=700&h=600&fit=crop&auto=format",
    badge: "Pieza única",
  },
];

const CATEGORIES = ["Todos", "Cerámica", "Tejidos", "Joyería", "Textiles", "Madera", "Hogar", "Arte"];

const SAMPLE_REVIEWS = [
  {
    user: "Claudia M.",
    rating: 5,
    text: "Hermosa pieza, llegó muy bien empacada. Exactamente como en las fotos. Mi favorita de la colección.",
    date: "15 jun 2025",
    productId: 1,
  },
  {
    user: "Roberto S.",
    rating: 4,
    text: "Excelente calidad artesanal. Se nota el trabajo y dedicación. Solo bajé una estrella por el tiempo de envío.",
    date: "3 jun 2025",
    productId: 1,
  },
  {
    user: "Ana P.",
    rating: 5,
    text: "Lo regalé para un cumpleaños y fue un éxito total. Muy auténtico y bien hecho.",
    date: "28 may 2025",
    productId: 1,
  },
];

const SALES_DATA = [
  { month: "Ene", ventas: 18500, pedidos: 42 },
  { month: "Feb", ventas: 22300, pedidos: 51 },
  { month: "Mar", ventas: 19800, pedidos: 47 },
  { month: "Abr", ventas: 28700, pedidos: 63 },
  { month: "May", ventas: 31200, pedidos: 74 },
  { month: "Jun", ventas: 35600, pedidos: 82 },
  { month: "Jul", ventas: 41000, pedidos: 98 },
];

const ORDERS_HISTORY = [
  {
    id: "AM-2025-0892",
    date: "12 jul 2025",
    total: 1130,
    status: "Entregado",
    items: ["Vasija de Barro Pintada", "Aretes de Plata y Ámbar"],
    tracking: 5,
  },
  {
    id: "AM-2025-0754",
    date: "28 jun 2025",
    total: 680,
    status: "En tránsito",
    items: ["Bolsa Tejida de Palma ×2"],
    tracking: 3,
  },
  {
    id: "AM-2025-0631",
    date: "5 jun 2025",
    total: 2580,
    status: "Preparando envío",
    items: ["Tapete Bordado Zapoteca"],
    tracking: 2,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sz} ${
            i <= Math.round(rating)
              ? "fill-amber-500 text-amber-500"
              : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 cursor-pointer";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-base",
  };
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

function BadgePill({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const v = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${v[variant]}`}
    >
      {children}
    </span>
  );
}

function ProductCard({
  product,
  onView,
  onAddToCart,
}: {
  product: Product;
  onView: () => void;
  onAddToCart: () => void;
}) {
  const [wished, setWished] = useState(false);
  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              wished ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
        {product.stock <= 3 && (
          <span className="absolute bottom-3 left-3 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            Solo {product.stock} disponibles
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          por {product.artisan} · {product.category}
        </p>
        <h3 className="font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary font-mono">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through font-mono">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onView}
              className="p-2 rounded border border-border hover:bg-muted transition-colors"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onAddToCart}
              className="p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({
  page,
  navigate,
  cartCount,
  notifications,
  colorblindMode,
  toggleColorblind,
}: {
  page: Page;
  navigate: (p: Page, data?: Product) => void;
  cartCount: number;
  notifications: number;
  colorblindMode: boolean;
  toggleColorblind: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src={logoArteEnManos}
            alt="Arte en Manos — Tradición que Cobra Vida"
            className="h-10 w-10 rounded-lg object-contain"
            style={{ background: "#0F0704" }}
          />
          <span className="font-display text-xl font-bold text-foreground hidden sm:block">
            Arte<span className="text-primary">En</span>Manos
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {(
            [
              { label: "Inicio", p: "home" as Page },
              { label: "Catálogo", p: "catalog" as Page },
              { label: "Mis Pedidos", p: "orders" as Page },
            ] as const
          ).map(({ label, p }) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                page === p
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={toggleColorblind}
            title={colorblindMode ? "Desactivar modo daltónico" : "Activar modo daltónico (accesibilidad visual)"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors border ${
              colorblindMode
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
            }`}
          >
            {colorblindMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden lg:inline">Daltónico</span>
          </button>
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded hover:bg-muted transition-colors"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* RF18 – Notification bell */}
          <button className="relative p-2 rounded hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("cart")}
            className="relative p-2 rounded hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("profile")}
            className="p-2 rounded hover:bg-muted transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("admin")}
            className="hidden md:flex p-2 rounded hover:bg-muted transition-colors"
            title="Panel admin"
          >
            <BarChart2 className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-muted transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          {(
            [
              { label: "Inicio", p: "home" as Page },
              { label: "Catálogo", p: "catalog" as Page },
              { label: "Mis Pedidos", p: "orders" as Page },
              { label: "Mi Perfil", p: "profile" as Page },
              { label: "Panel Admin", p: "admin" as Page },
            ] as const
          ).map(({ label, p }) => (
            <button
              key={p}
              onClick={() => {
                navigate(p);
                setMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { toggleColorblind(); setMenuOpen(false); }}
            className={`flex items-center gap-2 text-left px-3 py-2 rounded text-sm font-medium transition-colors border ${
              colorblindMode
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
            }`}
          >
            {colorblindMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {colorblindMode ? "Desactivar modo daltónico" : "Activar modo daltónico"}
          </button>
        </div>
      )}

      {/* RF8 – Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-card px-4 py-3">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar productos artesanales, categorías o artesanos..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate("catalog");
                  setSearchOpen(false);
                  setSearchVal("");
                }
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Audio Presentación (Accesibilidad Visual) ────────────────────────────────

function AudioPresentacion() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const transcript = `Bienvenido a Arte en Manos, la plataforma de comercio electrónico de la cooperativa de artesanos rurales mexicanos. Aquí encontrarás piezas únicas creadas a mano: cerámica de barro negro de Oaxaca, tejidos de palma de Guerrero, joyería de plata y ámbar de Taxco y Chiapas, tapetes zapotecas de Teotitlán del Valle, y mucho más. Cada compra que realizas apoya directamente a una familia artesana en comunidad rural. Puedes navegar nuestro catálogo usando las teclas de tabulación y Enter, o activar el modo de accesibilidad visual en el menú superior. Si necesitas ayuda, contáctanos en hola@arteenmanos.mx. ¡Gracias por apoyar el arte hecho en México!`;

  return (
    <section
      aria-label="Audio de presentación — accesibilidad visual"
      className="border-b border-border"
      style={{ background: "var(--card)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon + label */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <Volume2 className="w-5 h-5" style={{ color: "var(--primary-foreground)" }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Presentación en audio
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Para personas con discapacidad visual
              </p>
            </div>
          </div>

          {/* Player area */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {/* Play/Pause */}
            <button
              onClick={toggle}
              aria-label={playing ? "Pausar audio de presentación" : "Reproducir audio de presentación"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: playing ? "var(--accent)" : "var(--primary)",
                color: playing ? "var(--accent-foreground)" : "var(--primary-foreground)",
              }}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pausar" : "Reproducir"}
            </button>

            {/* Waveform visual (decorativo) */}
            <div className="flex items-center gap-0.5 h-8 flex-1 max-w-40" aria-hidden="true">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all"
                  style={{
                    height: `${20 + Math.sin(i * 0.8) * 14}px`,
                    background: playing ? "var(--primary)" : "var(--muted-foreground)",
                    opacity: playing ? 0.7 + (i % 3) * 0.1 : 0.3,
                    animation: playing ? `pulse ${0.5 + (i % 4) * 0.15}s ease-in-out infinite alternate` : "none",
                  }}
                />
              ))}
            </div>

            {/* Audio element — coloca el archivo de audio aquí */}
            <audio
              ref={audioRef}
              onEnded={() => setPlaying(false)}
              aria-label="Audio de presentación de Arte en Manos"
            >
              {/* Reemplaza el src con tu archivo de audio real: */}
              {/* <source src="/audio/presentacion.mp3" type="audio/mpeg" /> */}
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>

          {/* Transcript toggle */}
          <button
            onClick={() => setTranscriptOpen((o) => !o)}
            aria-expanded={transcriptOpen}
            aria-controls="audio-transcript"
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            {transcriptOpen ? "Ocultar" : "Ver"} transcripción
          </button>
        </div>

        {/* Transcript panel */}
        {transcriptOpen && (
          <div
            id="audio-transcript"
            role="region"
            aria-label="Transcripción del audio"
            className="mt-4 p-4 rounded-xl border text-sm leading-relaxed"
            style={{
              background: "var(--muted)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--muted-foreground)" }}>
              Transcripción completa
            </p>
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Home Page ───────────────────────────────────────────────────────────────

function HomePage({
  navigate,
  addToCart,
}: {
  navigate: (p: Page, data?: Product) => void;
  addToCart: (p: Product) => void;
}) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[82vh] bg-foreground overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1609881583302-61548332039c?w=1600&h=900&fit=crop&auto=format"
          alt="Artesano dando forma a una vasija de barro con sus manos en el taller"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 items-center gap-12 w-full">
          <div className="text-white">
            <span className="inline-block text-xs font-mono tracking-widest uppercase text-amber-300 mb-5 opacity-90">
              Cooperativa Artesanal · Hecho en México
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              El arte
              <br />
              <em className="italic text-amber-300">en tus</em>
              <br />
              manos.
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md leading-relaxed">
              Descubre piezas únicas creadas por artesanos mexicanos. Cada
              compra apoya directamente a una familia en comunidad rural.
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn
                onClick={() => navigate("catalog")}
                variant="primary"
                size="lg"
                className="bg-amber-700 hover:bg-amber-800 text-white border-0"
              >
                Explorar catálogo <ChevronRight className="w-5 h-5" />
              </Btn>
              <Btn
                onClick={() => navigate("auth")}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Crear cuenta
              </Btn>
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="bg-card/90 backdrop-blur rounded-2xl p-6 w-64 border border-border/40">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-4">
                Comunidad ArteEnManos
              </p>
              <div className="space-y-3">
                {[
                  { label: "Artesanos activos", value: "48" },
                  { label: "Productos únicos", value: "320+" },
                  { label: "Pedidos entregados", value: "2,400+" },
                  { label: "Familias apoyadas", value: "48" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-lg font-bold text-primary font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio de presentación — Accesibilidad para personas con discapacidad visual */}
      <AudioPresentacion />

      {/* Category pills */}
      <section className="bg-muted py-5 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => navigate("catalog")}
                className="shrink-0 px-5 py-2 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Selección destacada
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Productos destacados
            </h2>
          </div>
          <Btn onClick={() => navigate("catalog")} variant="outline" size="sm">
            Ver todo <ChevronRight className="w-4 h-4" />
          </Btn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={() => navigate("product", p)}
              onAddToCart={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Artisan story */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=700&h=520&fit=crop&auto=format"
              alt="Artesana trabajando en su taller"
              className="rounded-2xl w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -right-4 bg-amber-700 text-white px-5 py-3 rounded-xl font-mono text-sm font-semibold shadow-lg">
              +48 artesanos activos
            </div>
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-primary-foreground/50 mb-4">
              Nuestra historia
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5 leading-snug">
              Detrás de cada pieza,
              <br />
              <em className="italic text-amber-300">hay una historia.</em>
            </h2>
            <p className="text-primary-foreground/80 mb-7 leading-relaxed">
              ArteEnManos nació de la necesidad de conectar a artesanos rurales
              con compradores de todo México. Somos una cooperativa de 48
              familias que preservan técnicas ancestrales mientras construyen un
              futuro sustentable.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Años experiencia promedio", value: "22" },
                { label: "Técnicas ancestrales", value: "15+" },
                { label: "Estados representados", value: "8" },
                { label: "Premios FONART", value: "12" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-primary-foreground/20 rounded-xl p-4"
                >
                  <div className="font-mono text-2xl font-bold text-amber-300 mb-1">
                    {value}
                  </div>
                  <div className="text-xs text-primary-foreground/60">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Nuevas llegadas
          </h2>
          <Btn onClick={() => navigate("catalog")} variant="outline" size="sm">
            Ver todo <ChevronRight className="w-4 h-4" />
          </Btn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.slice(4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={() => navigate("product", p)}
              onAddToCart={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted border-t border-border py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Mantente al día
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Novedades artesanales en tu correo
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Recibe notificaciones de nuevas piezas, descuentos exclusivos e
            historias de nuestros artesanos.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 px-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Btn variant="primary">Suscribirse</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Catalog Page (RF6, RF7, RF8) ────────────────────────────────────────────

function CatalogPage({
  navigate,
  addToCart,
}: {
  navigate: (p: Page, data?: Product) => void;
  addToCart: (p: Product) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<"popularity" | "price-asc" | "price-desc" | "rating">(
    "popularity"
  );
  const [priceMax, setPriceMax] = useState(3000);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const perPage = 6;

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search)
      list = list.filter(
        (x) =>
          x.name.toLowerCase().includes(search.toLowerCase()) ||
          x.category.toLowerCase().includes(search.toLowerCase()) ||
          x.artisan.toLowerCase().includes(search.toLowerCase())
      );
    if (category !== "Todos") list = list.filter((x) => x.category === category);
    list = list.filter((x) => x.price <= priceMax);
    if (sort === "popularity") list.sort((a, b) => b.sold - a.sold);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, category, sort, priceMax]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const shown = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Catálogo completo
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground mb-5">
          Productos artesanales
        </h1>
        {/* RF8 – Keyword search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre, categoría o artesano..."
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* RF7 – Filter sidebar */}
        <aside
          className={`w-60 shrink-0 ${showFilters ? "block" : "hidden"} md:block`}
        >
          <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
            <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtros
            </h3>

            <div className="mb-5">
              <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
                Categoría
              </p>
              <div className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      category === cat
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
                Precio máximo
              </p>
              <input
                type="range"
                min={100}
                max={3000}
                step={50}
                value={priceMax}
                onChange={(e) => {
                  setPriceMax(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
                <span>$100</span>
                <span className="text-primary font-semibold">
                  ${priceMax.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
                Ordenar por
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-sm focus:outline-none"
              >
                <option value="popularity">Más populares</option>
                <option value="rating">Mejor calificados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado
              {filtered.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Filter className="w-4 h-4" /> Filtros
            </button>
          </div>

          {shown.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No se encontraron productos con esos filtros.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("Todos");
                  setPriceMax(3000);
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shown.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={() => navigate("product", p)}
                  onAddToCart={() => addToCart(p)}
                />
              ))}
            </div>
          )}

          {/* RF6 – Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded border border-border hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                    n === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-border hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail (RF9, RF21) ───────────────────────────────────────────────

function ProductDetailPage({
  product,
  navigate,
  addToCart,
}: {
  product: Product;
  navigate: (p: Page, data?: Product) => void;
  addToCart: (p: Product) => void;
}) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "artisan" | "reviews">("desc");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const reviews = SAMPLE_REVIEWS.filter((r) => r.productId === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate("catalog")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-7 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
            {product.category} · por {product.artisan}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <Stars rating={product.rating} size="md" />
            <span className="font-mono font-semibold text-foreground">{product.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({product.reviewCount} reseñas) · {product.sold} vendidos
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-mono text-4xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <>
                <span className="font-mono text-xl text-muted-foreground line-through">
                  ${product.oldPrice.toLocaleString()}
                </span>
                <BadgePill variant="success">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}% dto.
                </BadgePill>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stock > 5
                  ? "bg-green-500"
                  : product.stock > 0
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {product.stock > 5
                ? "En stock"
                : product.stock > 0
                ? `Solo ${product.stock} disponibles`
                : "Agotado"}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-mono font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Btn
              onClick={handleAdd}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={product.stock === 0}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Agregado al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Agregar al carrito
                </>
              )}
            </Btn>
          </div>

          <div className="bg-muted rounded-xl p-4 space-y-2 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Costo de envío calculado al confirmar pedido</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Empaque artesanal con materiales reciclados</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCw className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Devoluciones dentro de 15 días</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-4">
            <div className="flex">
              {(["desc", "artisan", "reviews"] as const).map((t) => {
                const labels = {
                  desc: "Descripción",
                  artisan: "Artesano",
                  reviews: `Reseñas (${product.reviewCount})`,
                };
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      tab === t
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {labels[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {tab === "desc" && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {tab === "artisan" && (
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format"
                alt={product.artisan}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shrink-0"
              />
              <div>
                <h3 className="font-semibold text-foreground mb-1">{product.artisan}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.artisanStory}
                </p>
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sé el primero en reseñar este producto.
                </p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="border-b border-border pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{r.user}</span>
                      <span className="text-xs text-muted-foreground font-mono">{r.date}</span>
                    </div>
                    <Stars rating={r.rating} />
                    <p className="text-sm text-muted-foreground mt-2">{r.text}</p>
                  </div>
                ))
              )}
              <div className="pt-2">
                <p className="text-sm font-semibold mb-2">Escribe tu reseña</p>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s}>
                      <Star className="w-5 h-5 text-amber-400 hover:fill-amber-400 transition-colors" />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Comparte tu experiencia con este producto..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={3}
                />
                <Btn variant="primary" size="sm" className="mt-2">
                  Publicar reseña
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cart Page (RF10, RF11, RF12) ─────────────────────────────────────────────

function CartPage({
  cart,
  setCart,
  navigate,
}: {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  navigate: (p: Page, data?: Product) => void;
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const COUPONS: Record<string, number> = {
    ARTE10: 0.1,
    BIENVENIDO: 0.15,
    FERIA25: 0.25,
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, qty: Math.max(1, Math.min(item.product.stock, item.qty + delta)) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const applyCoupon = () => {
    const pct = COUPONS[coupon.toUpperCase()];
    if (pct) {
      setDiscount(pct);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Cupón no válido. Prueba: ARTE10, BIENVENIDO o FERIA25");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discountAmt = Math.round(subtotal * discount);
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal - discountAmt + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Tu carrito está vacío
        </h2>
        <p className="text-muted-foreground mb-6">
          Explora nuestro catálogo y encuentra piezas únicas.
        </p>
        <Btn onClick={() => navigate("catalog")} variant="primary">
          Ir al catálogo
        </Btn>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Tu carrito{" "}
        <span className="text-muted-foreground font-normal text-xl">
          ({cart.reduce((s, i) => s + i.qty, 0)} artículos)
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, qty }) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl p-5 flex gap-4"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{product.artisan}</p>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQty(product.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-mono font-semibold">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQty(product.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-mono font-bold text-lg text-primary">
                    ${(product.price * qty).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* RF12 – Coupon */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Cupón de descuento
            </p>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="ARTE10"
                className="flex-1 px-3 py-2 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              />
              <Btn onClick={applyCoupon} variant="outline" size="sm">
                Aplicar
              </Btn>
            </div>
            {couponApplied && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <Check className="w-3 h-3" /> Cupón aplicado: -{discount * 100}%
              </p>
            )}
            {couponError && (
              <p className="text-xs text-red-500 mt-2">{couponError}</p>
            )}
          </div>

          {/* RF11 – Dynamic totals */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground mb-1">Resumen del pedido</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">${subtotal.toLocaleString()}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento ({discount * 100}%)</span>
                <span className="font-mono">-${discountAmt.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span className="font-mono">
                {shipping === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  `$${shipping}`
                )}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-green-600">
                ¡Envío gratis en compras mayores a $1,000!
              </p>
            )}
            <div className="pt-3 border-t border-border flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-mono font-bold text-xl text-primary">
                ${total.toLocaleString()}
              </span>
            </div>
            <Btn
              onClick={() => navigate("checkout")}
              variant="primary"
              size="lg"
              className="w-full mt-1"
            >
              Proceder al pago <ChevronRight className="w-5 h-5" />
            </Btn>
            <button
              onClick={() => navigate("catalog")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout (RF13, RF14, RF15, RF16) ───────────────────────────────────────

function CheckoutPage({
  navigate,
  cartTotal,
}: {
  navigate: (p: Page, data?: Product) => void;
  cartTotal: number;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addressIdx, setAddressIdx] = useState(0);
  const [payMethod, setPayMethod] = useState<"card" | "paypal" | "transfer">("card");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const ADDRESSES = [
    {
      id: 0,
      label: "Casa",
      name: "Ana García",
      street: "Calle Morelos 45, Col. Centro",
      city: "Oaxaca, Oax.",
      zip: "68000",
    },
    {
      id: 1,
      label: "Trabajo",
      name: "Ana García",
      street: "Av. Insurgentes Sur 1234, Piso 3",
      city: "Ciudad de México, CDMX",
      zip: "03100",
    },
  ];

  const shippingCost =
    cartTotal > 1000
      ? 0
      : shippingMethod === "express"
      ? 280
      : 150;
  const total = cartTotal + shippingCost;

  const stepLabels = ["Dirección", "Envío", "Pago"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate("cart")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-7"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al carrito
      </button>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Finalizar compra
      </h1>

      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => {
          const n = i + 1;
          return (
            <React.Fragment key={label}>
              <div
                className={`flex items-center gap-2 ${
                  step >= n ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    step > n
                      ? "bg-primary border-primary text-primary-foreground"
                      : step === n
                      ? "border-primary text-primary"
                      : "border-border"
                  }`}
                >
                  {step > n ? <Check className="w-4 h-4" /> : n}
                </div>
                <span className="text-sm font-medium hidden sm:block">{label}</span>
              </div>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 ${step > n ? "bg-primary" : "bg-border"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* RF15 – Address selection */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Dirección de envío
              </h2>
              <div className="space-y-3 mb-5">
                {ADDRESSES.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      addressIdx === addr.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressIdx === addr.id}
                      onChange={() => setAddressIdx(addr.id)}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{addr.label}</span>
                        <BadgePill>{addr.zip}</BadgePill>
                      </div>
                      <p className="text-sm text-muted-foreground">{addr.name}</p>
                      <p className="text-sm text-muted-foreground">{addr.street}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}</p>
                    </div>
                  </label>
                ))}
                <button className="w-full border-2 border-dashed border-border rounded-xl p-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Agregar nueva dirección
                </button>
              </div>
              <Btn onClick={() => setStep(2)} variant="primary" size="lg" className="w-full">
                Continuar <ChevronRight className="w-5 h-5" />
              </Btn>
            </div>
          )}

          {/* RF16 – Shipping cost calculation */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Método de envío
              </h2>
              <div className="space-y-3 mb-5">
                {[
                  {
                    id: "standard" as const,
                    label: "Envío estándar",
                    desc: "5–7 días hábiles",
                    cost: cartTotal > 1000 ? 0 : 150,
                    Icon: Package,
                  },
                  {
                    id: "express" as const,
                    label: "Envío express",
                    desc: "2–3 días hábiles",
                    cost: cartTotal > 1000 ? 130 : 280,
                    Icon: Truck,
                  },
                ].map(({ id, label, desc, cost, Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      shippingMethod === id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === id}
                      onChange={() => setShippingMethod(id)}
                      className="accent-primary"
                    />
                    <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <span className="font-mono font-bold text-primary">
                      {cost === 0 ? "Gratis" : `$${cost}`}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Btn onClick={() => setStep(1)} variant="outline" size="lg" className="flex-1">
                  Atrás
                </Btn>
                <Btn onClick={() => setStep(3)} variant="primary" size="lg" className="flex-1">
                  Continuar <ChevronRight className="w-5 h-5" />
                </Btn>
              </div>
            </div>
          )}

          {/* RF13 – Multiple payment methods */}
          {step === 3 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Método de pago
              </h2>
              <div className="flex gap-2 mb-6">
                {(["card", "paypal", "transfer"] as const).map((id) => {
                  const labels = { card: "Tarjeta", paypal: "PayPal", transfer: "Transferencia" };
                  return (
                    <button
                      key={id}
                      onClick={() => setPayMethod(id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                        payMethod === id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {labels[id]}
                    </button>
                  );
                })}
              </div>

              {payMethod === "card" && (
                <div className="space-y-3">
                  {[
                    { label: "Número de tarjeta", ph: "4242 4242 4242 4242", mono: true, full: true },
                    { label: "Vencimiento", ph: "MM/AA", mono: true, full: false },
                    { label: "CVV", ph: "123", mono: true, full: false },
                    { label: "Nombre en tarjeta", ph: "Ana García", mono: false, full: true },
                  ].map(({ label, ph, mono, full }) => (
                    <div key={label} className={full ? "col-span-2" : ""}>
                      <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                        {label}
                      </label>
                      <input
                        placeholder={ph}
                        className={`w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          mono ? "font-mono" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {payMethod === "paypal" && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold text-2xl font-mono">PP</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Serás redirigido a PayPal para completar el pago de forma segura.
                  </p>
                </div>
              )}

              {payMethod === "transfer" && (
                <div className="bg-muted rounded-xl p-4 text-sm space-y-1.5">
                  <p className="font-semibold mb-2">Datos para transferencia SPEI:</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    Banco: BBVA México
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    CLABE: 012180015657689000
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    Titular: ArteEnManos S.C.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Tu pedido se activará al confirmar tu transferencia.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Btn
                  onClick={() => setStep(2)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Atrás
                </Btn>
                <Btn
                  onClick={() => navigate("success")}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Confirmar · <span className="font-mono">${total.toLocaleString()}</span>
                </Btn>
              </div>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 h-fit space-y-3">
          <h3 className="font-semibold text-sm">Resumen del pedido</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Productos</span>
            <span className="font-mono">${cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="font-mono">
              {shippingCost === 0 ? "Gratis" : `$${shippingCost}`}
            </span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between font-semibold">
            <span>Total</span>
            <span className="font-mono text-primary text-lg">${total.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
            <p>Entrega estimada:</p>
            <p className="font-semibold text-foreground text-sm">
              {shippingMethod === "express" ? "11–13 jul 2025" : "14–18 jul 2025"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order Success (RF14) ─────────────────────────────────────────────────────

function SuccessPage({ navigate }: { navigate: (p: Page) => void }) {
  const [orderId] = useState(
    () => `AM-2025-0${Math.floor(Math.random() * 100 + 900)}`
  );
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">
        ¡Pedido confirmado!
      </h1>
      <p className="text-muted-foreground mb-2">
        Tu pedido ha sido recibido y está siendo procesado.
      </p>
      <p className="font-mono text-lg font-bold text-primary mb-7">{orderId}</p>
      <div className="bg-card border border-border rounded-xl p-5 text-left mb-7 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confirmación enviada a</span>
          <span className="font-mono">ana@correo.com</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Método de envío</span>
          <span>Estándar (5–7 días)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Entrega estimada</span>
          <span className="font-semibold">14–18 jul 2025</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Btn onClick={() => navigate("orders")} variant="primary">
          Ver mis pedidos
        </Btn>
        <Btn onClick={() => navigate("catalog")} variant="outline">
          Seguir comprando
        </Btn>
      </div>
    </div>
  );
}

// ─── Orders / Tracking (RF17, RF19) ──────────────────────────────────────────

function OrdersPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeOrder, setActiveOrder] = useState<
    (typeof ORDERS_HISTORY)[0] | null
  >(null);

  const statusVariant = (s: string) =>
    s === "Entregado"
      ? ("success" as const)
      : s === "En tránsito"
      ? ("warning" as const)
      : ("default" as const);

  if (activeOrder) {
    const steps = [
      { label: "Pedido confirmado", sub: "12 jul 2025, 10:42", done: true },
      { label: "Pago verificado", sub: "12 jul 2025, 11:05", done: true },
      {
        label: "Preparando envío",
        sub:
          activeOrder.tracking >= 3 ? "13 jul 2025, 09:30" : "Pendiente",
        done: activeOrder.tracking >= 3,
      },
      {
        label: "En tránsito",
        sub:
          activeOrder.tracking >= 4 ? "14 jul 2025, 14:00" : "Pendiente",
        done: activeOrder.tracking >= 4,
      },
      {
        label: "Entregado",
        sub:
          activeOrder.tracking >= 5 ? "16 jul 2025, 11:20" : "Pendiente",
        done: activeOrder.tracking >= 5,
      },
    ];

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => setActiveOrder(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-7"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al historial
        </button>
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Rastreo de pedido
            </h1>
            <p className="font-mono text-primary text-sm mt-1">{activeOrder.id}</p>
          </div>
          <BadgePill variant={statusVariant(activeOrder.status)}>
            {activeOrder.status}
          </BadgePill>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-5">
          <div>
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      s.done
                        ? "bg-primary border-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    {s.done ? (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-8 my-1 ${
                        s.done && steps[i + 1].done ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`font-semibold text-sm ${
                      s.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Artículos en este pedido</h3>
          <div className="space-y-1.5 mb-4">
            {activeOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Total pagado</span>
            <span className="font-mono font-bold text-primary">
              ${activeOrder.total.toLocaleString()}
            </span>
          </div>
          <Btn
            onClick={() => navigate("returns")}
            variant="outline"
            size="sm"
            className="mt-4 w-full"
          >
            <RotateCcw className="w-4 h-4" /> Solicitar devolución
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
        Mi cuenta
      </p>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Historial de compras
      </h1>
      <div className="space-y-4">
        {ORDERS_HISTORY.map((order) => (
          <div
            key={order.id}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-sm font-bold text-primary">
                  {order.id}
                </span>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {order.date}
                </p>
              </div>
              <BadgePill variant={statusVariant(order.status)}>
                {order.status}
              </BadgePill>
            </div>
            <div className="space-y-1 mb-4">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 shrink-0" /> {item}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-mono font-bold text-lg text-primary">
                ${order.total.toLocaleString()}
              </span>
              <div className="flex gap-2">
                <Btn
                  onClick={() => setActiveOrder(order)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Rastrear
                </Btn>
                <Btn
                  onClick={() => navigate("returns")}
                  variant="ghost"
                  size="sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Devolver
                </Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile (RF3) ────────────────────────────────────────────────────────────

function ProfilePage({ navigate }: { navigate: (p: Page) => void }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Ana García",
    email: "ana.garcia@correo.com",
    phone: "+52 951 123 4567",
    city: "Oaxaca, Oax.",
    bio: "Coleccionista de arte popular mexicano. Apasionada por preservar la tradición artesanal de mi país.",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
        Mi cuenta
      </p>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Mi perfil
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format"
              alt="Foto de perfil"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <h2 className="font-semibold text-foreground">{form.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{form.email}</p>
          <div className="space-y-2 w-full">
            <Btn
              onClick={() => navigate("orders")}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Package className="w-4 h-4" /> Mis pedidos
            </Btn>
            <Btn
              onClick={() => navigate("returns")}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4" /> Devoluciones
            </Btn>
            <Btn
              onClick={() => navigate("auth")}
              variant="ghost"
              size="sm"
              className="w-full text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </Btn>
          </div>
        </div>

        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-5">Editar información personal</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "name", label: "Nombre completo", full: false },
              { key: "phone", label: "Teléfono", full: false },
              { key: "email", label: "Correo electrónico", full: true },
              { key: "city", label: "Ciudad", full: true },
            ].map(({ key, label, full }) => (
              <div key={key} className={full ? "col-span-2" : ""}>
                <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                  {label}
                </label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                Biografía
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <Btn onClick={handleSave} variant="primary" size="md" className="mt-5">
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Cambios guardados
              </>
            ) : (
              "Guardar cambios"
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Auth Page (RF1, RF2) ─────────────────────────────────────────────────────

function AuthPage({ navigate }: { navigate: (p: Page) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-muted">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground text-2xl font-bold font-display">A</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            ArteEnManos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Arte artesanal mexicano al alcance de todos
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex mb-6">
            {(["login", "register"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  tab === id
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {id === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {/* RF2 – Social auth */}
          <div className="space-y-2 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm hover:bg-[#1877F2]/90 transition-colors">
              <Facebook className="w-4 h-4" />
              Continuar con Facebook
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="text-xs text-muted-foreground bg-card px-3">
                o con tu correo
              </span>
            </div>
          </div>

          {/* RF1 – Email/password registration */}
          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                  Nombre completo
                </label>
                <input
                  placeholder="Ana García"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ana@correo.com"
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {tab === "register" && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
            <Btn
              onClick={() => navigate("home")}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard (RF4, RF5, RF22, RF23, RF24) ────────────────────────────

function AdminDashboard({ navigate }: { navigate: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "inventory">(
    "overview"
  );
  const [addingProduct, setAddingProduct] = useState(false);

  const lowStock = PRODUCTS.filter((p) => p.stock <= 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Panel administrativo
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-mono">8 jul 2025, 10:30</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border mb-8">
        {(["overview", "products", "inventory"] as const).map((id) => {
          const labels = {
            overview: "Resumen",
            products: "Productos",
            inventory: "Inventario",
          };
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels[id]}
            </button>
          );
        })}
      </div>

      {/* RF22, RF23 – Sales reports + top products */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Ventas julio", value: "$41,000", change: "+15.2%", Icon: DollarSign },
              { label: "Pedidos del mes", value: "98", change: "+18.1%", Icon: ShoppingBag },
              { label: "Clientes activos", value: "312", change: "+5.4%", Icon: UsersIcon },
              { label: "Productos activos", value: "320", change: "+8", Icon: Box },
            ].map(({ label, value, change, Icon }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-green-600">
                    {change}
                  </span>
                </div>
                <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-6">
              Ventas mensuales 2025
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={SALES_DATA} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fontFamily: "DM Mono, monospace" }}
                />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fontFamily: "DM Mono, monospace" }}
                />
                <Tooltip
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Ventas"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="ventas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Productos más vendidos
            </h3>
            <div className="space-y-3">
              {[...PRODUCTS]
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 5)
                .map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <span className="font-mono text-sm text-muted-foreground w-5">
                      {i + 1}.
                    </span>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.artisan}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-primary">
                        {p.sold} uds.
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ${(p.price * p.sold).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* RF4, RF5 – Product management */}
      {activeTab === "products" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              {PRODUCTS.length} productos registrados
            </p>
            <Btn
              onClick={() => setAddingProduct(!addingProduct)}
              variant="primary"
              size="sm"
            >
              <Plus className="w-4 h-4" /> Agregar producto
            </Btn>
          </div>

          {addingProduct && (
            <div className="bg-card border border-primary/30 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-primary mb-5">Alta de nuevo producto</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Nombre del producto", ph: "Vasija de Barro...", full: true },
                  { label: "Artesano", ph: "María Chávez", full: false },
                  { label: "Categoría", ph: "Cerámica", full: false },
                  { label: "Precio ($)", ph: "450", full: false },
                  { label: "Stock disponible", ph: "12", full: false },
                ].map(({ label, ph, full }) => (
                  <div key={label} className={full ? "col-span-2" : ""}>
                    <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                      {label}
                    </label>
                    <input
                      placeholder={ph}
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe el producto artesanal..."
                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
                    Imágenes del producto
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    Arrastra imágenes aquí o haz clic para subir
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Btn variant="primary" size="md">
                  Guardar producto
                </Btn>
                <Btn
                  onClick={() => setAddingProduct(false)}
                  variant="outline"
                  size="md"
                >
                  Cancelar
                </Btn>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    {p.stock <= 3 && (
                      <BadgePill variant="danger">Stock bajo</BadgePill>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {p.artisan} · {p.category}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-mono font-bold text-primary">
                    ${p.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.stock} en stock</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-xl border border-border hover:bg-red-50 hover:border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RF24 – Inventory with alerts */}
      {activeTab === "inventory" && (
        <div>
          {lowStock.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-700 text-sm">
                  Alertas de stock bajo
                </span>
              </div>
              <div className="space-y-1">
                {lowStock.map((p) => (
                  <p key={p.id} className="text-sm text-amber-700">
                    <span className="font-semibold">{p.name}</span> — solo{" "}
                    {p.stock} {p.stock === 1 ? "unidad" : "unidades"} disponibles
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Control de inventario</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {["Producto", "Categoría", "Precio", "Stock", "Vendidos", "Estado"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`border-t border-border hover:bg-muted/40 transition-colors ${
                        i % 2 === 1 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium max-w-[180px] truncate">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 font-mono text-primary whitespace-nowrap">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold">{p.stock}</td>
                      <td className="px-4 py-3 font-mono">{p.sold}</td>
                      <td className="px-4 py-3">
                        <BadgePill
                          variant={
                            p.stock === 0
                              ? "danger"
                              : p.stock <= 3
                              ? "warning"
                              : "success"
                          }
                        >
                          {p.stock === 0
                            ? "Agotado"
                            : p.stock <= 3
                            ? "Stock bajo"
                            : "Disponible"}
                        </BadgePill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Returns Page (RF20) ──────────────────────────────────────────────────────

function ReturnsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState(ORDERS_HISTORY[0].id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate("orders")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-7"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a mis pedidos
      </button>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
        Servicio al cliente
      </p>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Solicitar devolución
      </h1>

      {submitted ? (
        <div className="text-center py-14">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-semibold text-xl text-foreground mb-2">
            Solicitud enviada
          </h2>
          <p className="text-muted-foreground mb-6">
            Nuestro equipo revisará tu solicitud en 2–3 días hábiles y te
            notificará por correo electrónico.
          </p>
          <BadgePill>ID: DEV-2025-0234</BadgePill>
          <div className="mt-6 flex gap-3 justify-center">
            <Btn onClick={() => navigate("orders")} variant="primary">
              Ver mis pedidos
            </Btn>
            <Btn onClick={() => navigate("catalog")} variant="outline">
              Seguir comprando
            </Btn>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
              Pedido a devolver
            </label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none"
            >
              {ORDERS_HISTORY.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} — {o.date}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
              Motivo de la devolución
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none"
            >
              <option value="">Selecciona un motivo...</option>
              <option>El producto no coincide con la descripción</option>
              <option>Llegó dañado o defectuoso</option>
              <option>No era lo que esperaba</option>
              <option>Talla o tamaño incorrecto</option>
              <option>Llegó demasiado tarde / ya no lo necesito</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
              Descripción detallada
            </label>
            <textarea
              rows={4}
              placeholder="Describe detalladamente el motivo de tu devolución..."
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-muted-foreground block mb-1">
              Fotografías del problema (opcional)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-5 text-center text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
              Arrastra o haz clic para adjuntar fotos
            </div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Política de devoluciones</p>
            Tienes hasta 15 días después de recibir tu pedido para solicitar
            devolución. El reembolso se procesa en 5–7 días hábiles al mismo
            método de pago original.
          </div>
          <Btn
            onClick={() => (reason ? setSubmitted(true) : null)}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!reason}
          >
            <RotateCcw className="w-5 h-5" /> Enviar solicitud de devolución
          </Btn>
        </div>
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer className="bg-foreground text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logoArteEnManos}
              alt="Arte en Manos — Tradición que Cobra Vida"
              className="h-9 w-9 rounded-lg object-contain"
              style={{ background: "#0F0704" }}
            />
            <span className="font-display text-lg font-semibold">ArteEnManos</span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed mb-5">
            Arte artesanal mexicano hecho con amor. Apoyamos directamente a
            familias de artesanos en zonas rurales.
          </p>
          <div className="flex gap-2">
            {[Instagram, Facebook, Mail].map((Icon, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {[
          {
            title: "Tienda",
            links: ["Catálogo", "Categorías", "Artesanos", "Ofertas"],
          },
          {
            title: "Mi Cuenta",
            links: ["Mi perfil", "Mis pedidos", "Devoluciones", "Direcciones"],
          },
          {
            title: "Contacto",
            links: ["hola@arteenmanos.mx", "+52 (951) 123 4567", "Oaxaca, Méx.", "Lun–Vie 9–18h"],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/40 mb-3">
              {title}
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <span className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/30 font-mono">
          <span>© 2025 ArteEnManos S.C. Todos los derechos reservados.</span>
          <button
            onClick={() => navigate("presentacion")}
            className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors underline underline-offset-2"
          >
            📋 Estudio de Caso · 2do Parcial UX
          </button>
          <span>Hecho con ♥ en Oaxaca, México</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [colorblindMode, setColorblindMode] = useState(false);
  const notifications = 3;

  const navigate = (p: Page, data?: Product) => {
    if (data) setSelectedProduct(data);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, qty: Math.min(i.qty + 1, product.stock) }
            : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div className={`min-h-screen bg-background${colorblindMode ? " colorblind" : ""}`}>
      <Header
        page={page}
        navigate={navigate}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        notifications={notifications}
        colorblindMode={colorblindMode}
        toggleColorblind={() => setColorblindMode((c) => !c)}
      />
      <main>
        {page === "home" && (
          <HomePage navigate={navigate} addToCart={addToCart} />
        )}
        {page === "catalog" && (
          <CatalogPage navigate={navigate} addToCart={addToCart} />
        )}
        {page === "product" && (
          <ProductDetailPage
            product={selectedProduct}
            navigate={navigate}
            addToCart={addToCart}
          />
        )}
        {page === "cart" && (
          <CartPage cart={cart} setCart={setCart} navigate={navigate} />
        )}
        {page === "checkout" && (
          <CheckoutPage navigate={navigate} cartTotal={cartTotal} />
        )}
        {page === "success" && <SuccessPage navigate={navigate} />}
        {page === "orders" && <OrdersPage navigate={navigate} />}
        {page === "profile" && <ProfilePage navigate={navigate} />}
        {page === "auth" && <AuthPage navigate={navigate} />}
        {page === "admin" && <AdminDashboard navigate={navigate} />}
        {page === "returns" && <ReturnsPage navigate={navigate} />}
        {page === "presentacion" && <PresentacionEC navigate={navigate} />}
      </main>
      {page !== "auth" && <Footer navigate={navigate} />}
    </div>
  );
}
