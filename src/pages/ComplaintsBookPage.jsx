import React, { useState } from "react";

const ComplaintsBookPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    email: "",
    phone: "",
    orderNumber: "",
    complaintType: "",
    description: "",
    desiredSolution: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí enviarías los datos a tu backend o por email
    console.log("Reclamo enviado:", formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>
        {`
          .complaints-container * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          
          .complaints-container p {
            display: block;
            margin-block-start: 0.8em;
            margin-block-end: 0.8em;
            font-size: 0.85rem;
            line-height: 1.45;
            color: #2c2c2c;
          }
          
          .complaints-container h1 {
            font-size: 1.6rem;
            font-weight: 600;
            margin-block-start: 0.67em;
            margin-block-end: 0.67em;
            color: #000;
          }
          
          .complaints-container h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-block-start: 1.2em;
            margin-block-end: 0.3em;
            color: #111;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 0.2rem;
          }
          
          .complaints-container .small-print {
            font-size: 0.75rem;
            color: #5a5a5a;
            margin-block-start: 1.5em;
            border-top: 1px solid #eaeaea;
            padding-top: 1em;
          }
          
          .complaints-container strong {
            font-weight: 600;
            color: #000;
          }
          
          .complaint-form {
            margin: 2rem 0;
          }
          
          .form-group {
            margin-bottom: 1rem;
          }
          
          .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 0.3rem;
            color: #000;
          }
          
          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 0.6rem;
            font-size: 0.85rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: inherit;
          }
          
          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #000;
          }
          
          .submit-btn {
            background-color: #1a1a1a;
            color: white;
            border: none;
            padding: 10px 24px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            border-radius: 4px;
          }
          
          .submit-btn:hover {
            background-color: #333;
          }
          
          .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.85rem;
          }
          
          .required {
            color: #d32f2f;
          }
        `}
      </style>

      <div className="complaints-container">
        <h1>Libro de Reclamaciones</h1>

        <p>
          En MirageMart nos esforzamos por brindar un servicio de calidad. Si no
          estás satisfecho con tu compra o con nuestra atención, puedes
          presentar tu reclamo o queja a través del siguiente formulario.
        </p>

        <h2>Información importante</h2>
        <p>
          De acuerdo con la{" "}
          <strong>
            Ley N° 29571 - Código de Protección y Defensa del Consumidor
          </strong>
          , ponemos a tu disposición este Libro de Reclamaciones virtual. Los
          datos proporcionados serán tratados con confidencialidad y recibirás
          una respuesta en un plazo máximo de <strong>15 días hábiles</strong>.
        </p>
        <p>
          <strong>¿Diferencia entre queja y reclamo?</strong>
          <br />- <strong>Queja:</strong> Insatisfacción con el servicio (demora
          en atención, trato, etc.).
          <br />- <strong>Reclamo:</strong> Disconformidad con el producto
          (defecto, incumplimiento de garantía, etc.).
        </p>

        {submitted ? (
          <div className="success-message">
            <strong>✓ Reclamo registrado correctamente</strong>
            <br />
            Hemos recibido tu comunicación. Te responderemos dentro de los
            próximos 15 días hábiles al correo electrónico proporcionado. Guarda
            tu número de seguimiento:{" "}
            <strong>MIR-{Math.floor(Math.random() * 100000)}</strong>
          </div>
        ) : (
          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Nombre completo <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Documento de identidad (DNI/CIE/RUT){" "}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Correo electrónico <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono / celular</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Número de pedido (si aplica)</label>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="Ej: MIR-12345"
              />
            </div>

            <div className="form-group">
              <label>
                Tipo <span className="required">*</span>
              </label>
              <select
                name="complaintType"
                value={formData.complaintType}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona...</option>
                <option value="queja">
                  Queja (insatisfacción con el servicio)
                </option>
                <option value="reclamo">
                  Reclamo (disconformidad con el producto)
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Descripción detallada <span className="required">*</span>
              </label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe tu problema o inconformidad con la mayor cantidad de detalles posible (fecha, producto, etc.)"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Solución deseada</label>
              <textarea
                name="desiredSolution"
                rows="3"
                value={formData.desiredSolution}
                onChange={handleChange}
                placeholder="Ej: Cambio del producto, devolución del dinero, reparación, etc."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Enviar reclamo
            </button>
          </form>
        )}

        <div className="small-print">
          <p>© 2026 MirageMart Professional – Libro de Reclamaciones Virtual</p>
          <p>
            <strong>Órgano de supervisión:</strong> INDECOPI / Autoridad de
            Protección al Consumidor de tu país
          </p>
          <p>
            <strong>Última actualización:</strong> 22 de mayo de 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsBookPage;
