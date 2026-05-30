import React from "react";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>
        {`
          /* Reset de márgenes y tipografía uniforme como Falabella */
          .terms-container * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          
          .terms-container p {
            display: block;
            margin-block-start: 0.8em;
            margin-block-end: 0.8em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .terms-container h1 {
            font-size: 1.6rem;
            font-weight: 600;
            margin-block-start: 0.67em;
            margin-block-end: 0.67em;
            color: #000;
            letter-spacing: -0.3px;
          }
          
          .terms-container h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-block-start: 1.2em;
            margin-block-end: 0.3em;
            color: #111;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 0.2rem;
          }
          
          .terms-container h3 {
            font-size: 0.95rem;
            font-weight: 600;
            margin-block-start: 0.8em;
            margin-block-end: 0.2em;
            color: #222;
          }
          
          .terms-container ul, .terms-container ol {
            margin-block-start: 0.5em;
            margin-block-end: 0.8em;
            padding-inline-start: 1.5rem;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .terms-container li {
            margin-block-end: 0.3em;
          }
          
          .terms-container .small-print {
            font-size: 0.75rem;
            color: #5a5a5a;
            margin-block-start: 1.5em;
            border-top: 1px solid #eaeaea;
            padding-top: 1em;
          }
          
          .terms-container strong {
            font-weight: 600;
            color: #000;
          }
        `}
      </style>

      <div className="terms-container">
        <h1>Términos y Condiciones de uso</h1>
        <p>
          <strong>Vigencia desde mayo de 2026</strong> – MirageMart Professional
        </p>

        <p>
          Los presentes Términos y Condiciones regulan el acceso, navegación y
          uso de la plataforma de comercio electrónico operada bajo el nombre
          comercial <strong>MirageMart</strong> (en adelante, “la Tienda” o
          “MirageMart”), disponible en el dominio asociado a esta tienda
          virtual. Al utilizar nuestros servicios, declaras haber leído,
          entendido y aceptado íntegramente estas disposiciones, así como las
          políticas de privacidad y tratamiento de datos.
        </p>

        <h2>1. Objeto y alcance</h2>
        <p>
          MirageMart tiene como objeto la comercialización de productos de
          [categorías: electrónica / hogar / moda / etc.] a través de medios
          electrónicos. Estos términos aplican a todas las compras, promociones,
          servicios postventa y cualquier interacción realizada dentro del
          sitio.
        </p>

        <h2>2. Registro y veracidad de la información</h2>
        <p>
          Para efectuar compras es necesario crear una cuenta proporcionando
          datos verdaderos, completos y actualizados. Eres el único responsable
          de la confidencialidad de tu clave de acceso. Cualquier operación
          realizada desde tu cuenta se entenderá efectuada por ti. MirageMart
          podrá suspender cuentas ante indicios de fraude, suplantación de
          identidad o violación a estos términos.
        </p>

        <h2>3. Productos, precios y disponibilidad</h2>
        <p>
          Los productos ofrecidos corresponden a las características y
          especificaciones publicadas en cada ficha. Los precios están
          expresados en moneda local, incluyen impuestos según legislación
          aplicable, pero no incluyen necesariamente el costo de envío (el cual
          se calculará antes de finalizar la compra). La disponibilidad de
          productos es dinámica y puede variar hasta el momento de confirmación
          del pedido. En caso de falta de stock luego de la compra, se te
          informará para ofrecer un producto similar o proceder al reembolso
          total.
        </p>

        <h2>4. Proceso de compra y medios de pago</h2>
        <p>
          Una vez agregados los productos al carro, deberás seguir las
          instrucciones de compra. Al hacer clic en “Finalizar compra” estás
          realizando una oferta vinculante. La confirmación del pedido se
          enviará por correo electrónico. Los pagos se procesan mediante{" "}
          <strong>Culqi</strong> u otras pasarelas autorizadas, cumpliendo con
          estándares de seguridad PCI. No almacenamos números completos de
          tarjetas. MirageMart se reserva el derecho de rechazar transacciones
          fraudulentas o no autorizadas.
        </p>

        <h2>5. Envíos y tiempos de entrega</h2>
        <p>
          Los despachos se realizan a través de empresas de logística externas.
          Los plazos de entrega se cuentan en días hábiles desde la acreditación
          del pago. Estos plazos son referenciales y pueden verse afectados por
          condiciones geográficas, aduaneras o fuerza mayor. Una vez entregado
          el producto al transportista, MirageMart no se hace responsable por
          demoras operativas del courier, pero brindaremos seguimiento.
        </p>

        <h2>6. Derecho de retracto, cambios y devoluciones</h2>
        <p>
          De acuerdo con la ley de protección al consumidor, cuentas con{" "}
          <strong>7 días corridos</strong> desde la recepción del producto para
          ejercer el derecho de retracto (solo para productos no personalizados
          y en condiciones originales). Para cambios por talla, color o producto
          incorrecto, dispones de <strong>15 días corridos</strong>. Los gastos
          de envío por devolución serán cubiertos por MirageMart si el error es
          nuestro. Para cambios por gusto del cliente, el costo de nuevo envío
          correrá por tu cuenta. No se aceptan devoluciones de productos de
          higiene personal, software desbloqueado o artículos perecibles.
        </p>

        <h2>7. Garantías legales y voluntarias</h2>
        <p>
          Los productos nuevos tienen garantía legal mínima de 3 meses, salvo
          que la ley establezca un plazo mayor. Algunos artículos pueden tener
          garantía extendida ofrecida directamente por el fabricante. La
          garantía no cubre daños por mal uso, golpes, exposición a líquidos o
          modificaciones no autorizadas.
        </p>

        <h2>8. Propiedad intelectual</h2>
        <p>
          Todo el contenido visual, textos, logotipos, iconos, imágenes, videos
          y código fuente son propiedad de MirageMart o de sus licenciantes.
          Queda prohibida la reproducción, distribución o uso comercial sin
          autorización expresa por escrito.
        </p>

        <h2>9. Protección de datos personales</h2>
        <p>
          Tus datos serán tratados conforme a nuestra Política de Privacidad.
          Los utilizamos para gestionar pedidos, mejorar servicios y, si
          autorizaste, enviar comunicaciones comerciales. Puedes solicitar baja
          o ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y
          Oposición) escribiendo a<strong> privacidad@mirage-mart.com</strong>.
          Este sitio utiliza cookies técnicas y de análisis.
        </p>

        <h2>10. Responsabilidad limitada</h2>
        <p>
          MirageMart no será responsable por daños indirectos, pérdida de
          ganancias o daño moral derivados del uso de los productos, salvo
          disposición legal en contrario. Nuestra responsabilidad máxima por
          cualquier reclamo estará limitada al valor pagado por el producto
          objeto del reclamo. Esto no afecta los derechos irrenunciables del
          consumidor.
        </p>

        <h2>11. Modificaciones y vigencia</h2>
        <p>
          Estos términos pueden ser actualizados periódicamente. La versión
          vigente será la publicada en esta misma página con la fecha de última
          revisión. Te recomendamos revisarlos antes de cada compra.
        </p>

        <h2>12. Legislación aplicable y tribunales</h2>
        <p>
          Estos términos se rigen por las leyes de [País]. Cualquier
          controversia se someterá a los tribunales ordinarios de [Ciudad,
          País], renunciando a cualquier otro fuero que pudiera corresponder,
          sin perjuicio de las acciones de protección al consumidor.
        </p>

        <h2>13. Contacto y atención al cliente</h2>
        <p>
          Para dudas, reclamos o solicitudes de información:
          <br />
          ✉️ <strong>atencion@mirage-mart.com</strong>
          <br />
          📞 <strong>+51 1 555 1234</strong> (horario de oficina)
          <br />
          También puedes usar nuestro chat en línea o formulario de contacto.
        </p>

        <div className="small-print">
          <p>
            © 2026 MirageMart Professional – Todos los derechos reservados.
            Estos términos constituyen el acuerdo completo entre el usuario y
            MirageMart. En caso de controversia sobre interpretación,
            prevalecerá el texto en español.
          </p>
          <p>
            <strong>Última actualización:</strong> 22 de mayo de 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
