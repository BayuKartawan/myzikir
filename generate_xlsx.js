import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Resolve paths
const jsonPath = './apps-script/DB-alazkar.json';
const outPath = './apps-script/DB-alazkar.xlsx';

try {
  // Read JSON file
  const jsonRaw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(jsonRaw);

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Loop through each key/sheet in JSON
  for (const [sheetName, items] of Object.entries(data)) {
    let rows;
    let headers;

    if (sheetName === 'menu_config') {
      rows = items.map(item => ({
        no: item.no,
        key: item.key || '',
        nama_sheet: item.nama_sheet || '',
        label: item.label || '',
        description: item.description || '',
        icon: item.icon || '',
        next: item.next || ''
      }));
      headers = ['no', 'key', 'nama_sheet', 'label', 'description', 'icon', 'next'];
    } else {
      rows = items.map(item => ({
        no: item.no,
        sub_menu: item.sub_menu || '',
        arab: item.arab || '',
        terjemah: item.terjemah || ''
      }));
      headers = ['no', 'sub_menu', 'arab', 'terjemah'];
    }

    // Convert JSON to sheet
    const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
    
    // Add to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // Write workbook to file
  XLSX.writeFile(wb, outPath);
  console.log('Successfully generated XLSX at:', outPath);
} catch (error) {
  console.error('Error generating XLSX:', error);
  process.exit(1);
}
