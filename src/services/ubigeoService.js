// frontend/src/services/ubigeoService.js
import ubigeo from "ubigeo-peru";

export const getDepartamentos = () => {
  return ubigeo.getDepartamentos();
};

export const getProvincias = (departamentoId) => {
  const departamento = ubigeo
    .getDepartamentos()
    .find((d) => d.nombre === departamentoId);
  if (!departamento) return [];
  const provincias = ubigeo.getProvincias(departamento.id);
  return provincias.map((p) => ({ ...p, nombre: p.nombre }));
};

export const getDistritos = (departamentoId, provinciaId) => {
  const departamento = ubigeo
    .getDepartamentos()
    .find((d) => d.nombre === departamentoId);
  if (!departamento) return [];
  const provincias = ubigeo.getProvincias(departamento.id);
  const provincia = provincias.find((p) => p.nombre === provinciaId);
  if (!provincia) return [];
  const distritos = ubigeo.getDistritos(provincia.id);
  return distritos.map((d) => ({ ...d, nombre: d.nombre }));
};
