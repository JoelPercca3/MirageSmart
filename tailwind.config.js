/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ─── Fuente ────────────────────────────────────────────────────────
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        sans: ["Lato", "system-ui", "sans-serif"],
      },

      // ─── Colores ────────────────────────────────────────────────────────
      // CAMBIO: eliminado el bloque `red` duplicado. `brand` referencia
      // directamente los mismos valores — un solo lugar para mantener.
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#FFFFFF",
        black: "#000000",

        // Escala de grises (idéntica a Falabella)
        gray: {
          50: "#F7F7F7",
          100: "#EEEEEE",
          200: "#E3E3E3",
          300: "#D1D1D1",
          400: "#ACACAC",
          500: "#8B8B8B",
          600: "#646464",
          700: "#515151",
          800: "#333333",
          900: "#131313",
        },

        // Rojo — fuente única de verdad
        red: {
          50: "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#F56565",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },

        // Brand apunta a la escala `red` — sin duplicar valores
        brand: {
          50: "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#F56565",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },

        green: { 500: "#38A169", 600: "#2F855A" },
        yellow: { 400: "#ECC94B", 500: "#D69E2E" },
        blue: { 500: "#3182CE", 600: "#2B6CB0" },
      },

      // ─── Tipografía ────────────────────────────────────────────────────
      // CAMBIO: valores en px explícitos. El sistema original usaba rem
      // asumiendo html { font-size: 62.5% } (base 10 px). Si tu proyecto
      // NO tiene esa regla (base 16 px por defecto), 1.2rem = 19.2px y
      // todo se ve el doble de grande.
      //
      // Elige UNA de las dos opciones y borra la otra:
      //
      // ── Opción A: base 10px (tienes html { font-size: 62.5% }) ────────
      //    Descomenta el bloque "rem" y borra el bloque "px" de abajo.
      //
      // ── Opción B (por defecto aquí): base 16px estándar ───────────────
      //    Usa px directos — sin ambigüedad.
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["14px", { lineHeight: "22px" }],
        md: ["15px", { lineHeight: "22px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["18px", { lineHeight: "26px" }],
        "2xl": ["20px", { lineHeight: "28px" }],
        "3xl": ["24px", { lineHeight: "32px" }],
        "4xl": ["30px", { lineHeight: "36px" }],
        "5xl": ["36px", { lineHeight: "40px" }],
      },

      // NOTA: fontWeight eliminado — Tailwind ya incluye todos estos
      // valores con los mismos nombres (font-normal, font-bold, etc.).
      // Redefinirlos no cambia nada y añade ruido.

      // ─── Espaciado (sistema 4 px) ───────────────────────────────────────
      // CAMBIO: misma corrección que fontSize — valores px directos.
      // El sistema original (spacing.4 = "1.6rem") asume base 10px.
      // Con base 16px estándar, spacing.4 sería 25.6px en lugar de 16px.
      spacing: {
        px: "1px",
        0.5: "2px",
        1: "4px",
        1.5: "6px",
        2: "8px",
        2.5: "10px",
        3: "12px",
        3.5: "14px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        12: "48px",
        14: "56px",
        16: "64px",
        20: "80px",
        24: "96px",
        28: "112px",
        32: "128px",
        36: "144px",
        40: "160px",
      },

      // ─── Sombras ────────────────────────────────────────────────────────
      boxShadow: {
        xs: "0 0 0 1px rgba(0,0,0,.05)",
        sm: "0 1px 2px 0 rgba(0,0,0,.05)",
        base: "0 2px 2px rgba(0,0,0,.1)",
        md: "0 0 10px rgba(0,0,0,.2)",
        lg: "0 5px 20px rgba(0,0,0,.2)",
        xl: "0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)",
        "2xl": "0 25px 50px -12px rgba(0,0,0,.25)",
        inner: "inset 0 2px 4px 0 rgba(0,0,0,.06)",
        none: "none",
      },

      // ─── Bordes ─────────────────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm: "2px",
        base: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },

      // ─── Animaciones ────────────────────────────────────────────────────
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        slideUp: "slideUp 0.2s ease-out",
        slideDown: "slideDown 0.2s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
