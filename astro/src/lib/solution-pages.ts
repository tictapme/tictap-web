const SOLUTION_SLUGS = new Set<string>([
  // Spanish
  'gestion-de-coshh',
  'gestion-de-immuebles',
  'gestion-de-instalaciones-y-servicios-facility-management-2',
  'gestion-de-instalaciones-y-servicios-facility-management-3',
  'gestion-de-mantenimiento-de-vehiculos',
  'gestion-de-tu-instalacion',
  'gestion-equipo-proteccion-personal',
  'gestion-equipos-contra-incendios',
  'gestion-instalaciones-y-mantenimiento',
  'gestion-inteligente-activos-flotas-y-maquinaria-sin-app',
  'gestion-tareas-de-limpieza',
  'mantenimiento-de-flotas',
  'mantenimiento-de-herramientas',
  'smart-asset-passport',
  'smart-asset-platform',
  'asset-passport',
  'plataforma-para-la-identificacion-y-trazabilidad-de-activos-industria',
  'railway',
  'stock',
  'tool-maintenance',
  'vehicle-maintenance',
  // English
  'en/coshh-management',
  'en/cleaning-management',
  'en/fire-management',
  'en/tool-management',
  'en/tool-maintenance',
  'en/vehicle-maintenance',
  'en/fleet-maintenance',
  'en/smart-asset-passport',
  'en/smart-asset-platform',
  'en/asset-passport',
  'en/gestion-de-coshh',
  'en/gestion-de-instalaciones-y-servicios-facility-management-2',
  'en/gestion-de-instalaciones-y-servicios-facility-management-3',
  'en/gestion-inteligente-activos-flotas-y-maquinaria-sin-app',
  'en/industry',
  'en/railway',
  'en/stock',
]);

export function isSolutionPage(relativePath: string): boolean {
  const slug = relativePath.replace(/\/index\.html$/i, '');
  return SOLUTION_SLUGS.has(slug);
}
