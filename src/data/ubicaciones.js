// src/data/ubicaciones.js

// Importar JSONs
import departamentosFile from "./json/1_ubigeo_departamentos.json";
import provinciasFile from "./json/2_ubigeo_provincias.json";
import distritosFile from "./json/3_ubigeo_distritos.json";

// Extraer los datos
const departamentosData = departamentosFile.ubigeo_departamentos;
const provinciasData = provinciasFile.ubigeo_provincias;
const distritosData = distritosFile.ubigeo_distritos;

// Función para obtener el nombre
const getNombre = (obj) => {
  if (!obj) return null;
  return (
    obj.nombre || obj.name || obj.departamento || obj.provincia || obj.distrito
  );
};

// Función para obtener el ID
const getId = (obj) => {
  if (!obj) return null;
  return obj.id || obj.codigo || obj.ID;
};

// Crear mapa de departamento_id -> nombre
const departamentoMap = new Map();
departamentosData?.forEach((d) => {
  const id = getId(d);
  const nombre = getNombre(d);
  if (id && nombre) {
    departamentoMap.set(id, nombre);
  }
});

// Lista de departamentos
const departamentosList =
  departamentosData?.map((d) => getNombre(d)).filter(Boolean) || [];

// Crear mapa de provincias por departamento
const provinciasMap = {};
provinciasData?.forEach((prov) => {
  const deptoId = prov?.departamento_id || prov?.departamentoId;
  const provNombre = getNombre(prov);

  if (deptoId && provNombre) {
    const deptoNombre = departamentoMap.get(deptoId);
    if (deptoNombre) {
      if (!provinciasMap[deptoNombre]) {
        provinciasMap[deptoNombre] = [];
      }
      if (!provinciasMap[deptoNombre].includes(provNombre)) {
        provinciasMap[deptoNombre].push(provNombre);
      }
    }
  }
});

// Crear mapa de provincia_id -> nombre
const provinciaMap = new Map();
provinciasData?.forEach((p) => {
  const id = getId(p);
  const nombre = getNombre(p);
  if (id && nombre) {
    provinciaMap.set(id, nombre);
  }
});

// Crear mapa de distritos por provincia
const distritosMap = {};
distritosData?.forEach((dist) => {
  const provId = dist?.provincia_id || dist?.provinciaId;
  const distNombre = getNombre(dist);

  if (provId && distNombre) {
    const provNombre = provinciaMap.get(provId);
    if (provNombre) {
      if (!distritosMap[provNombre]) {
        distritosMap[provNombre] = [];
      }
      if (!distritosMap[provNombre].includes(distNombre)) {
        distritosMap[provNombre].push(distNombre);
      }
    }
  }
});

// FUNCIONES PARA USAR EN LOS COMPONENTES
export const getDepartamentos = () => departamentosList;
export const getProvincias = (departamento) =>
  provinciasMap[departamento] || [];
export const getDistritos = (departamento, provincia) =>
  distritosMap[provincia] || [];

export const getUbigeo = (departamento, provincia, distrito) => {
  if (!departamento || !provincia || !distrito) return null;

  const depto = departamentosData?.find((d) => getNombre(d) === departamento);
  const prov = provinciasData?.find(
    (p) =>
      getNombre(p) === provincia &&
      (p?.departamento_id || p?.departamentoId) === depto?.id,
  );
  const dist = distritosData?.find(
    (d) =>
      getNombre(d) === distrito &&
      (d?.provincia_id || d?.provinciaId) === prov?.id,
  );

  return {
    departamento_id: depto?.id,
    provincia_id: prov?.id,
    distrito_id: dist?.id,
    ubigeo: dist?.ubigeo || null,
  };
};

export const UBICACIONES = {
  departamentos: departamentosList,
  provincias: provinciasMap,
  distritos: distritosMap,
};
