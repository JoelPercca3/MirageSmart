import React, { useState, useEffect } from "react";

const CookiesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>
        {`
          .cookies-container * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          
          .cookies-container p {
            display: block;
            margin-block-start: 0.8em;
            margin-block-end: 0.8em;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .cookies-container h1 {
            font-size: 1.6rem;
            font-weight: 600;
            margin-block-start: 0.67em;
            margin-block-end: 0.67em;
            color: #000;
          }
          
          .cookies-container h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-block-start: 1.2em;
            margin-block-end: 0.3em;
            color: #111;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 0.2rem;
          }
          
          .cookies-container h3 {
            font-size: 0.95rem;
            font-weight: 600;
            margin-block-start: 0.8em;
            margin-block-end: 0.2em;
            color: #222;
          }
          
          .cookies-container ul {
            margin-block-start: 0.5em;
            margin-block-end: 0.8em;
            padding-inline-start: 1.5rem;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .cookies-container li {
            margin-block-end: 0.3em;
          }
          
          .cookies-container .cookie-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8rem;
            margin: 1em 0;
          }
          
          .cookies-container .cookie-table th,
          .cookies-container .cookie-table td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: left;
            vertical-align: top;
          }
          
          .cookies-container .cookie-table th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          .cookies-container .small-print {
            font-size: 0.75rem;
            color: #5a5a5a;
            margin-block-start: 1.5em;
            border-top: 1px solid #eaeaea;
            padding-top: 1em;
          }
          
          .cookies-container strong {
            font-weight: 600;
            color: #000;
          }
          
          .button-save {
            background-color: #1a1a1a;
            color: white;
            border: none;
            padding: 10px 24px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            margin-top: 1rem;
            border-radius: 4px;
          }
          
          .button-save:hover {
            background-color: #333;
          }
          
          .preference-card {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
          }
          
          .toggle-switch {
            display: inline-block;
            margin-left: 1rem;
          }
        `}
      </style>

      <div className="cookies-container">
        <h1>Política de Cookies</h1>
        <p>
          <strong>Vigencia desde mayo de 2026</strong> – MirageMart Professional
        </p>

        <p>
          Esta política explica qué son las cookies, cómo las utilizamos en
          MirageMart y cómo puedes gestionarlas.
        </p>

        <h2>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu
          dispositivo (computadora, tablet o teléfono) cuando visitas nuestro
          sitio web. Permiten recordar tus acciones y preferencias para mejorar
          tu experiencia de navegación.
        </p>

        <h2>2. Tipos de cookies que utilizamos</h2>

        <table className="cookie-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Propósito</th>
              <th>Plazo de conservación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Cookies estrictamente necesarias</strong> (
                <em>siempre activas</em>)
              </td>
              <td>
                Permiten la navegación básica: carrito de compras, inicio de
                sesión, proceso de pago. No pueden ser desactivadas.
              </td>
              <td>Sesión / hasta 1 año</td>
            </tr>
            <tr>
              <td>
                <strong>Cookies de rendimiento y análisis</strong>
              </td>
              <td>
                Recopilan información anónima sobre cómo usas el sitio (páginas
                visitadas, tiempo de estancia) para mejorar su funcionamiento.
                Utilizamos Google Analytics.
              </td>
              <td>Hasta 2 años</td>
            </tr>
            <tr>
              <td>
                <strong>Cookies funcionales</strong>
              </td>
              <td>
                Recuerdan tus preferencias: idioma, región, productos vistos
                recientemente.
              </td>
              <td>Hasta 1 año</td>
            </tr>
            <tr>
              <td>
                <strong>Cookies de publicidad y marketing</strong>
              </td>
              <td>
                Muestran anuncios relevantes basados en tus intereses y limitan
                la frecuencia de aparición.
              </td>
              <td>Hasta 2 años</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Cookies de terceros específicos</h2>
        <ul>
          <li>
            <strong>Google Analytics:</strong> análisis de audiencia (
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de privacidad de Google
            </a>
            ).
          </li>
          <li>
            <strong>Culqi:</strong> cookies de seguridad para el procesamiento
            de pagos.
          </li>
          <li>
            <strong>Plataforma de ecommerce / hosting:</strong> cookies técnicas
            propias del sistema.
          </li>
        </ul>

        <h2>4. Gestión del consentimiento de cookies</h2>
        <p>
          Al ingresar por primera vez a MirageMart, verás un banner de cookies
          donde podrás aceptar o rechazar las cookies no esenciales. Puedes
          modificar tu preferencia en cualquier momento desde esta página o
          desde el enlace <strong>“Configuración de cookies”</strong> en el pie
          de página.
        </p>

        <h3>4.1 Configura tus preferencias</h3>
        <div className="preference-card">
          <p>
            <strong>Cookies de rendimiento y análisis</strong>
            <br />
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              Nos ayudan a mejorar nuestro sitio web.
            </span>
          </p>
          <p>
            <strong>Cookies funcionales</strong>
            <br />
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              Recuerdan tus preferencias de navegación.
            </span>
          </p>
          <p>
            <strong>Cookies de publicidad y marketing</strong>
            <br />
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              Te muestran contenido relevante.
            </span>
          </p>
          <button className="button-save" id="savePreferences">
            Guardar preferencias
          </button>
        </div>

        <h3>4.2 Cómo gestionar cookies desde tu navegador</h3>
        <p>
          También puedes bloquear o eliminar cookies mediante la configuración
          de tu navegador:
        </p>
        <ul>
          <li>
            <strong>Google Chrome:</strong> Configuración → Privacidad y
            seguridad → Cookies y otros datos de sitios.
          </li>
          <li>
            <strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad
            → Cookies y datos del sitio.
          </li>
          <li>
            <strong>Safari:</strong> Preferencias → Privacidad → Gestionar
            cookies.
          </li>
          <li>
            <strong>Microsoft Edge:</strong> Configuración → Cookies y permisos
            del sitio.
          </li>
        </ul>
        <p>
          <strong>Nota importante:</strong> Deshabilitar cookies esenciales
          puede afectar el funcionamiento de la tienda (no podrás agregar
          productos al carrito ni completar compras).
        </p>

        <h2>5. Actualizaciones de esta política</h2>
        <p>
          Podemos modificar esta Política de Cookies periódicamente. La versión
          vigente estará siempre publicada en esta misma página con la fecha de
          última actualización.
        </p>

        <h2>6. Contacto</h2>
        <p>
          Si tienes dudas sobre el uso de cookies:{" "}
          <strong>privacidad@mirage-mart.com</strong>
        </p>

        <div className="small-print">
          <p>© 2026 MirageMart Professional – Todos los derechos reservados.</p>
          <p>
            <strong>Última actualización:</strong> 22 de mayo de 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
