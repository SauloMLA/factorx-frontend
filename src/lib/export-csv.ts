/**
 * Utilidad global para exportar datos en formato CSV con soporte UTF-8 (BOM para compatibilidad con Excel).
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headersMap?: Record<keyof T | string, string>,
) {
  if (!data || data.length === 0) {
    alert('No hay datos disponibles para exportar.');
    return;
  }

  // Determinar encabezados
  const keys = Object.keys(data[0]);
  const headers = keys.map((key) => (headersMap && headersMap[key] ? headersMap[key] : key));

  // Generar filas
  const rows = data.map((row) =>
    keys
      .map((key) => {
        let value = row[key];
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }
        // Escapar comillas dobles
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(','),
  );

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
