/**
 * Fungsi utama untuk menangani permintaan HTTP GET
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const result = {};

    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      const data = sheet.getDataRange().getValues();
      
      // Jika sheet kosong (hanya header atau kurang), skip
      if (data.length <= 1) {
        result[sheetName] = [];
        return;
      }

      const headers = data[0].map(h => h.toString().toLowerCase().trim());
      const sheetData = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const item = {};
        
        // Memastikan baris tidak kosong sebelum diproses
        if (row.join('').trim() === '') continue;

        headers.forEach((header, index) => {
          item[header] = row[index];
        });
        
        sheetData.push(item);
      }
      
      result[sheetName] = sheetData;
    });

    return createJsonResponse({
      status: "success",
      data: result
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    }, 500);
  }
}

/**
 * Fungsi utama untuk menangani permintaan HTTP POST (CRUD)
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action; // 'create', 'update', 'delete'
    const table = postData.table;   // e.g. 'zikir_setelah_shalat'
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(table);
    if (!sheet) {
      return createJsonResponse({ status: "error", message: "Tabel tidak ditemukan: " + table }, 400);
    }
    
    // Ambil data header dan nilai-nilai baris
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(h => h.toString().toLowerCase().trim());
    
    if (action === 'create') {
      const item = postData.item;
      // Normalisasi data baris berdasarkan header
      const newRow = headers.map(h => item[h] !== undefined ? item[h] : "");
      sheet.appendRow(newRow);
      return createJsonResponse({ status: "success", message: "Data berhasil ditambahkan" });
    }
    
    if (action === 'update') {
      const item = postData.item;
      const noIndex = headers.indexOf('no');
      if (noIndex === -1) {
        return createJsonResponse({ status: "error", message: "Kolom 'no' tidak ditemukan" }, 400);
      }
      
      let foundRowIndex = -1;
      for (let i = 1; i < values.length; i++) {
        if (values[i][noIndex].toString() === item.no.toString()) {
          foundRowIndex = i + 1; // 1-based index di sheet
          break;
        }
      }
      
      if (foundRowIndex === -1) {
        return createJsonResponse({ status: "error", message: "Data dengan nomor " + item.no + " tidak ditemukan" }, 404);
      }
      
      // Perbarui nilai di setiap kolom
      headers.forEach((h, index) => {
        if (item[h] !== undefined) {
          sheet.getRange(foundRowIndex, index + 1).setValue(item[h]);
        }
      });
      return createJsonResponse({ status: "success", message: "Data berhasil diperbarui" });
    }
    
    if (action === 'delete') {
      const no = postData.no;
      const noIndex = headers.indexOf('no');
      if (noIndex === -1) {
        return createJsonResponse({ status: "error", message: "Kolom 'no' tidak ditemukan" }, 400);
      }
      
      let foundRowIndex = -1;
      for (let i = 1; i < values.length; i++) {
        if (values[i][noIndex].toString() === no.toString()) {
          foundRowIndex = i + 1;
          break;
        }
      }
      
      if (foundRowIndex === -1) {
        return createJsonResponse({ status: "error", message: "Data tidak ditemukan" }, 404);
      }
      
      sheet.deleteRow(foundRowIndex);
      return createJsonResponse({ status: "success", message: "Data berhasil dihapus" });
    }
    
    return createJsonResponse({ status: "error", message: "Aksi tidak valid" }, 400);
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() }, 500);
  }
}

/**
 * Helper untuk membuat response JSON
 */
function createJsonResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
