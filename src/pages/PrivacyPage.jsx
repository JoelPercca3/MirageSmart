import React from "react";

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>
        {`
          .privacy-container * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          
          .privacy-container p {
            display: block;
            margin-block-start: 0.8em;
            margin-block-end: 0.8em;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .privacy-container h1 {
            font-size: 1.6rem;
            font-weight: 600;
            margin-block-start: 0.67em;
            margin-block-end: 0.67em;
            color: #000;
          }
          
          .privacy-container h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-block-start: 1.2em;
            margin-block-end: 0.3em;
            color: #111;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 0.2rem;
          }
          
          .privacy-container ul {
            margin-block-start: 0.5em;
            margin-block-end: 0.8em;
            padding-inline-start: 1.5rem;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .privacy-container li {
            margin-block-end: 0.3em;
          }
          
          .privacy-container .small-print {
            font-size: 0.75rem;
            color: #5a5a5a;
            margin-block-start: 1.5em;
            border-top: 1px solid #eaeaea;
            padding-top: 1em;
          }
          
          .privacy-container strong {
            font-weight: 600;
            color: #000;
          }
        `}
      </style>

      <div className="privacy-container">
        <h1>Política de Privacidad</h1>
        <p>
          <strong>Vigencia desde mayo de 2026</strong> – MirageMart Professional
        </p>

        <p>
          En <strong>MirageMart</strong> (en adelante, “la Tienda” o
          “nosotros”), nos comprometemos a proteger tu privacidad y tus datos
          personales. La presente Política de Privacidad explica qué información
          recopilamos, cómo la utilizamos y los derechos que te asisten como
          titular de los datos.
        </p>

        <h2>1. Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento de tus datos personales es:
          <br />
          <strong>[Razón Social completa]</strong>
          <br />
          RUC / ID fiscal:{" "}
          <strong>[Número de identificación tributaria]</strong>
          <br />
          Domicilio: <strong>[Dirección completa]</strong>
          <br />
          Correo de contacto: <strong>privacidad@mirage-mart.com</strong>
        </p>

        <h2>2. Datos que recopilamos</h2>
        <p>
          Dependiendo de cómo interactúes con MirageMart, podemos recopilar las
          siguientes categorías de datos:
        </p>
        <ul>
          <li>
            <strong>Datos identificativos:</strong> nombre y apellidos,
            documento de identidad (DNI/CIE/RUT), fecha de nacimiento.
          </li>
          <li>
            <strong>Datos de contacto:</strong> correo electrónico, teléfono,
            dirección de envío y facturación.
          </li>
          <li>
            <strong>Datos de transacciones:</strong> historial de compras,
            productos adquiridos, métodos de pago utilizados (nunca almacenamos
            números completos de tarjetas).
          </li>
          <li>
            <strong>Datos de navegación:</strong> dirección IP, tipo de
            dispositivo, navegador, páginas visitadas.
          </li>
          <li>
            <strong>Datos de interacción:</strong> reseñas de productos,
            consultas al servicio al cliente.
          </li>
        </ul>

        <h2>3. Finalidad del tratamiento</h2>
        <p>Tus datos serán utilizados exclusivamente para:</p>
        <ul>
          <li>Gestionar tu registro como usuario de MirageMart.</li>
          <li>
            Procesar y enviar tus pedidos, incluyendo pagos a través de Culqi y
            logística de envíos.
          </li>
          <li>Atención al cliente, cambios, devoluciones o garantías.</li>
          <li>
            Enviar comunicaciones comerciales solo si has dado tu consentimiento
            expreso.
          </li>
          <li>
            Mejorar la experiencia de navegación mediante análisis de
            comportamiento.
          </li>
          <li>
            Cumplir con obligaciones legales (facturación fiscal, prevención de
            fraude).
          </li>
        </ul>

        <h2>4. Base legal del tratamiento</h2>
        <ul>
          <li>
            <strong>Ejecución de un contrato:</strong> para gestionar tu compra.
          </li>
          <li>
            <strong>Consentimiento:</strong> para envío de comunicaciones
            comerciales.
          </li>
          <li>
            <strong>Interés legítimo:</strong> para mejorar nuestros servicios y
            prevenir fraudes.
          </li>
          <li>
            <strong>Cumplimiento legal:</strong> para facturación y atención a
            autoridades.
          </li>
        </ul>

        <h2>5. Plazos de conservación</h2>
        <ul>
          <li>Datos de registro: mientras mantengas tu cuenta activa.</li>
          <li>
            Datos de transacciones: hasta 5 años después de la última compra.
          </li>
          <li>
            Comunicaciones comerciales: hasta que revoques tu consentimiento.
          </li>
        </ul>

        <h2>6. Cesión de datos a terceros</h2>
        <p>
          No vendemos ni alquilamos tus datos. Compartimos información
          únicamente con:
        </p>
        <ul>
          <li>
            <strong>Proveedores esenciales:</strong> Culqi (pagos), empresas de
            envíos, plataforma de ecommerce.
          </li>
          <li>
            <strong>Autoridades:</strong> cuando sea requerido por ley.
          </li>
          <li>
            <strong>Análisis:</strong> Google Analytics con fines estadísticos y
            anonimizados.
          </li>
        </ul>

        <h2>7. Derechos ARCO</h2>
        <p>
          Puedes ejercer tus derechos de{" "}
          <strong>Acceso, Rectificación, Cancelación y Oposición</strong>{" "}
          escribiendo a<strong> privacidad@mirage-mart.com</strong> adjuntando
          copia de tu documento de identidad.
        </p>

        <h2>8. Seguridad de la información</h2>
        <p>
          Implementamos medidas como protocolos HTTPS, cifrado de datos
          sensibles y controles de acceso para proteger tu información.
        </p>

        <h2>9. Privacidad de menores</h2>
        <p>
          Nuestros servicios están dirigidos a mayores de 18 años. No
          recopilamos conscientemente datos de menores.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Para dudas o ejercer tus derechos:{" "}
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

export default PrivacyPage;
