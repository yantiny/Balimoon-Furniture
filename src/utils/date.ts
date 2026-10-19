/**
 * Formats a date into compact numerical format: DD/MM/YYYY (e.g. 11/10/2026)
 */
export function formatNumericDate(dateVal?: any): string {
  if (!dateVal) return '-';
  const str = String(dateVal).trim();

  // If already in DD/MM/YYYY or DD-MM-YYYY format
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(str)) {
    return str.replace(/-/g, '/');
  }

  // Handle Indonesian text month like "11 Oktober 2026"
  const bulanMap: Record<string, string> = {
    januari: '01', februari: '02', maret: '03', april: '04',
    mei: '05', juni: '06', juli: '07', agustus: '08',
    september: '09', oktober: '10', november: '11', desember: '12',
    jan: '01', feb: '02', mar: '03', apr: '04',
    jun: '06', jul: '07', agu: '08', ags: '08',
    sep: '09', okt: '10', nov: '11', des: '12',
  };

  const parts = str.split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = bulanMap[parts[1].toLowerCase()];
    const year = parts[2];
    if (month && year) {
      return `${day}/${month}/${year}`;
    }
  }

  // Parse using Date
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return str;
}
