import React from "react";

const RefundPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>
        {`
          .refund-container * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          
          .refund-container p {
            display: block;
            margin-block-start: 0.8em;
            margin-block-end: 0.8em;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .refund-container h1 {
            font-size: 1.6rem;
            font-weight: 600;
            margin-block-start: 0.67em;
            margin-block-end: 0.67em;
            color: #000;
          }
          
          .refund-container h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-block-start: 1.2em;
            margin-block-end: 0.3em;
            color: #111;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 0.2rem;
          }
          
          .refund-container h3 {
            font-size: 0.95rem;
            font-weight: 600;
            margin-block-start: 0.8em;
            margin-block-end: 0.2em;
            color: #222;
          }
          
          .refund-container ul, .refund-container ol {
            margin-block-start: 0.5em;
            margin-block-end: 0.8em;
            padding-inline-start: 1.5rem;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .refund-container li {
            margin-block-end: 0.3em;
          }
          
          .refund-container .small-print {
            font-size: 0.75rem;
            color: #5a5a5a;
            margin-block-start: 1.5em;
            border-top: 1px solid #eaeaea;
            padding-top: 1em;
          }
          
          .refund-container .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1a1a1a;
            padding: 1rem;
            margin: 1rem 0;
            font-size: 0.85rem;
          }
          
          .refund-container .warning-box {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 1rem;
            margin: 1rem 0;
            font-size: 0.85rem;
          }
          
          .refund-container .success-box {
            background-color: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 1rem;
            margin: 1rem 0;
            font-size: 0.85rem;
          }
          
          .refund-container table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8rem;
            margin: 1em 0;
          }
          
          .refund-container th,
          .refund-container td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: left;
            vertical-align: top;
          }
          
          .refund-container th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          .refund-container strong {
            font-weight: 600;
            color: #000;
          }
        `}
      </style>

      <div className="refund-container">
        <h1>Política de Cambios, Devoluciones y Reembolsos</h1>
        <p>
          <strong>Vigencia desde mayo de 2026</strong> – MirageMart Professional
        </p>

        <p>
          En <strong>MirageMart</strong> queremos que estés completamente
          satisfecho con tu compra. La presente política establece las
          condiciones y plazos para solicitar cambios, devoluciones y
          reembolsos, en cumplimiento de la normativa de protección al
          consumidor.
        </p>

        <div className="info-box">
          <strong>📋 Resumen rápido:</strong>
          <ul style={{ marginBlockStart: "0.5em", marginBlockEnd: "0" }}>
            <li>
              ✅ Cambios por talla/color: <strong>15 días corridos</strong>
            </li>
            <li>
              ✅ Devolución por producto defectuoso:{" "}
              <strong>30 días corridos</strong>
            </li>
            <li>
              ✅ Derecho de retracto (compra online):{" "}
              <strong>7 días corridos</strong>
            </li>
            <li>
              ✅ Reembolso: hasta <strong>15 días hábiles</strong> después de
              aprobado
            </li>
          </ul>
        </div>

        <h2>1. Derecho de retracto (compra a distancia)</h2>
        <p>
          De acuerdo con la legislación vigente, al tratarse de una compra
          realizada a través de nuestra tienda virtual, cuentas con un plazo de{" "}
          <strong>7 días corridos</strong> desde que recibes el producto para
          ejercer tu
          <strong>derecho de retracto</strong> sin necesidad de justificar
          motivo, siempre que el producto no sea de aquellos exceptuados (ver
          sección 7).
        </p>
        <p>
          Para ejercer este derecho, el producto debe estar en las mismas
          condiciones en que lo recibiste: sin uso, con sus empaques originales,
          etiquetas y accesorios.
        </p>

        <h2>2. Cambios por talla, color o producto incorrecto</h2>
        <p>
          Si recibiste un producto con talla o color diferente al solicitado, o
          si te arrepentiste y deseas cambiarlo por otro producto disponible,
          dispones de <strong>15 días corridos</strong> desde la fecha de
          recepción para solicitar el cambio.
        </p>

        <h3>2.1 Condiciones para cambios</h3>
        <ul>
          <li>
            El producto debe estar sin uso, en perfecto estado y con todas sus
            etiquetas originales.
          </li>
          <li>
            Debe conservarse el empaque original y los accesorios (manuales,
            fundas, cables, etc.).
          </li>
          <li>
            Los gastos de envío por el primer cambio por error nuestro son
            gratuitos.
          </li>
          <li>
            Los cambios por gusto personal (talla, color) tienen un costo de
            envío de <strong>[monto]</strong> asumido por el cliente.
          </li>
        </ul>

        <h2>3. Devoluciones por producto defectuoso o dañado</h2>
        <p>
          Si al recibir tu pedido identificas que el producto tiene defectos de
          fábrica, llegó roto, incompleto o no funciona correctamente,
          contáctanos dentro de los{" "}
          <strong>7 días posteriores a la recepción</strong>
          para coordinar la devolución.
        </p>

        <h3>3.1 ¿Qué cubrimos?</h3>
        <ul>
          <li>Producto que no enciende o presenta fallas funcionales.</li>
          <li>Producto con partes rotas o faltantes.</li>
          <li>Producto diferente al anunciado en la ficha.</li>
          <li>
            Daños evidentes ocurridos durante el transporte (debes reportarlo el
            mismo día de la recepción).
          </li>
        </ul>

        <div className="warning-box">
          <strong>⚠️ Importante:</strong> Te recomendamos grabar un video del
          unboxing (apertura) de tu pedido. Esto nos ayudará a procesar tu
          reclamo de manera más rápida en caso de que el producto llegue dañado.
        </div>

        <h2>4. Plazos de garantía según tipo de producto</h2>

        <table>
          <thead>
            <tr>
              <th>Tipo de producto</th>
              <th>Garantía legal</th>
              <th>Garantía voluntaria MirageMart</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Electrónica y gadgets</td>
              <td>6 meses</td>
              <td>12 meses (registrando el producto)</td>
            </tr>
            <tr>
              <td>Ropa, calzado y accesorios</td>
              <td>3 meses</td>
              <td>No aplica</td>
            </tr>
            <tr>
              <td>Hogar y decoración</td>
              <td>3 meses</td>
              <td>6 meses</td>
            </tr>
            <tr>
              <td>Productos de belleza y cuidado personal</td>
              <td>No aplica garantía (excepto defectos visibles al abrir)</td>
              <td>7 días para cambio por producto sellado</td>
            </tr>
            <tr>
              <td>Juguetes y artículos infantiles</td>
              <td>6 meses</td>
              <td>9 meses</td>
            </tr>
          </tbody>
        </table>
        <p className="small-print" style={{ marginTop: "0.5rem" }}>
          La garantía no cubre daños por mal uso, golpes, exposición a líquidos,
          modificaciones no autorizadas o desgaste normal por uso.
        </p>

        <h2>5. Proceso para solicitar cambio o devolución</h2>
        <ol>
          <li>
            <strong>Contacta a nuestro servicio al cliente</strong> dentro del
            plazo correspondiente a través de:
            <ul>
              <li>
                Email: <strong>devoluciones@mirage-mart.com</strong>
              </li>
              <li>
                WhatsApp: <strong>+51 1 555 1234</strong>
              </li>
              <li>
                Formulario de contacto en nuestra tienda (sección "Ayuda")
              </li>
            </ul>
          </li>
          <li>
            <strong>Proporciona la siguiente información:</strong>
            <ul>
              <li>Número de pedido</li>
              <li>Producto a cambiar/devolver</li>
              <li>Motivo de la solicitud</li>
              <li>Fotos o video que evidencien el defecto (si aplica)</li>
            </ul>
          </li>
          <li>
            <strong>Espera la autorización</strong> de nuestro equipo (máximo 48
            horas hábiles).
          </li>
          <li>
            <strong>Empaca el producto</strong> en su empaque original con todos
            los accesorios.
          </li>
          <li>
            <strong>Envía el producto</strong> a nuestra dirección (te
            indicaremos la logística según el caso).
          </li>
          <li>
            <strong>Inspección y aprobación</strong> (hasta 5 días hábiles desde
            que recibimos el producto).
          </li>
          <li>
            <strong>Procesamos el cambio o reembolso</strong> según corresponda.
          </li>
        </ol>

        <div className="success-box">
          <strong>✅ Tiempos estimados de respuesta:</strong>
          <ul style={{ marginBlockStart: "0.5em", marginBlockEnd: "0" }}>
            <li>Autorización inicial: 48 horas</li>
            <li>Inspección del producto devuelto: 5 días hábiles</li>
            <li>Envío del nuevo producto (cambio): 3-5 días hábiles</li>
            <li>Reembolso: 7-15 días hábiles</li>
          </ul>
        </div>

        <h2>6. Tiempos y formas de reembolso</h2>
        <p>
          Una vez aprobada la devolución, el reembolso se realizará utilizando
          el mismo método de pago que utilizaste:
        </p>
        <ul>
          <li>
            <strong>Tarjeta de crédito/débito (Culqi):</strong> 7-15 días
            hábiles (depende del banco emisor).
          </li>
          <li>
            <strong>Transferencia bancaria / Yape / Plin:</strong> 3-7 días
            hábiles.
          </li>
          <li>
            <strong>Pago contraentrega:</strong> se coordinará la recogida del
            producto y el reembolso se hará por transferencia.
          </li>
        </ul>
        <p>
          El reembolso incluye el valor total pagado por el producto más los
          gastos de envío originales (excepto en casos de cambio de opinión o
          talla incorrecta por decisión del cliente).
        </p>

        <h2>7. Productos exceptuados (no aplican cambios ni devoluciones)</h2>
        <p>
          Por razones de higiene, seguridad o personalización, no se aceptan
          cambios ni devoluciones en:
        </p>
        <ul>
          <li>
            Ropa interior, lencería, medias, trajes de baño (por motivos de
            higiene).
          </li>
          <li>
            Productos de belleza, cosméticos y cuidado personal que hayan sido
            abiertos o utilizados.
          </li>
          <li>
            Productos personalizados o grabados (con nombre, iniciales o diseño
            especial).
          </li>
          <li>Software, juegos o tarjetas de regalo una vez activados.</li>
          <li>
            Productos de venta final liquidación (indicados claramente en la
            ficha).
          </li>
          <li>Alimentos o productos perecibles.</li>
        </ul>

        <h2>8. Gastos de envío en devoluciones y cambios</h2>

        <table>
          <thead>
            <tr>
              <th>Motivo</th>
              <th>¿Quién asume el envío de vuelta?</th>
              <th>¿Quién asume el nuevo envío?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Producto defectuoso o dañado</td>
              <td>MirageMart</td>
              <td>MirageMart (gratuito)</td>
            </tr>
            <tr>
              <td>Producto incorrecto (error nuestro)</td>
              <td>MirageMart</td>
              <td>MirageMart (gratuito)</td>
            </tr>
            <tr>
              <td>Cambio de talla/color (gusto del cliente)</td>
              <td>Cliente</td>
              <td>Cliente</td>
            </tr>
            <tr>
              <td>Derecho de retracto / arrepentimiento</td>
              <td>Cliente</td>
              <td>No aplica (es devolución, no cambio)</td>
            </tr>
          </tbody>
        </table>

        <h2>9. Política para productos en oferta o promoción</h2>
        <p>
          Los productos adquiridos con descuento o en promoción tienen los
          mismos derechos de cambio, devolución y garantía que los productos a
          precio regular, con las siguientes particularidades:
        </p>
        <ul>
          <li>
            Productos con <strong>20% o menos de descuento</strong>: aplican
            todas las condiciones normales.
          </li>
          <li>
            Productos con <strong>descuento superior al 50%</strong>: solo
            aplica garantía por defectos, no cambios por gusto.
          </li>
          <li>
            Promociones como "2x1" o "compra uno y llévate otro": el reembolso
            se calcula proporcionalmente.
          </li>
        </ul>

        <h2>10. Cancelación de pedidos antes del envío</h2>
        <p>
          Si cambias de opinión antes de que tu pedido sea despachado, puedes
          cancelarlo sin costo alguno contactándonos dentro de las{" "}
          <strong>2 horas posteriores</strong> a la confirmación de compra.
          Pasado ese tiempo, dependiendo de la rapidez de nuestro equipo
          logístico, podríamos no garantizar la cancelación si el producto ya
          fue entregado al courier.
        </p>

        <h2>11. Reclamos por demora en la entrega</h2>
        <p>
          Si tu pedido no llega dentro del plazo máximo estimado (publicado en
          la sección de envíos), puedes solicitar la{" "}
          <strong>anulación de la compra y el reembolso total</strong> si han
          transcurrido más de <strong>10 días hábiles adicionales</strong> al
          plazo máximo sin que el producto haya sido entregado.
        </p>

        <h2>12. Contacto para cambios y devoluciones</h2>
        <p>
          📧 <strong>devoluciones@mirage-mart.com</strong> (respuesta en 24-48
          horas)
          <br />
          📞 <strong>+51 1 555 1234</strong> (opción 2 - Postventa)
          <br />
          💬 WhatsApp: <strong>+51 1 555 1234</strong> (con el mensaje
          "DEVOLUCIÓN" + número de pedido)
          <br />
          📍 Dirección física (solo para devoluciones coordinadas previamente):
          <br />
          MirageMart – Atención de Devoluciones
          <br />
          [Dirección completa de almacén/logística]
        </p>

        <div className="small-print">
          <p>
            © 2026 MirageMart Professional – Política de Cambios, Devoluciones y
            Reembolsos
          </p>
          <p>
            Esta política cumple con lo establecido en el Código de Protección y
            Defensa del Consumidor y otras normativas aplicables. En caso de
            conflicto entre esta política y la ley, prevalecerá lo dispuesto por
            la ley.
          </p>
          <p>
            <strong>Última actualización:</strong> 22 de mayo de 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
