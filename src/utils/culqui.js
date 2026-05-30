// src/utils/culqi.js
export const loadCulqi = () => {
  return new Promise((resolve, reject) => {
    if (window.Culqi) {
      resolve(window.Culqi);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;

    script.onload = () => {
      if (window.Culqi) {
        resolve(window.Culqi);
      } else {
        reject(new Error("Culqi no se cargó correctamente"));
      }
    };

    script.onerror = () => reject(new Error("Error al cargar Culqi"));
    document.head.appendChild(script);
  });
};
