/**
 * Fungsi utama untuk menangani permintaan HTTP GET
 */
function doGet(e) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const allowedSecret = scriptProperties.getProperty('API_SECRET_KEY') || 'myzikir_secret_key_123';
    
    // Verifikasi secret key jika dikonfigurasi di Script Properties atau menggunakan fallback default
    if (allowedSecret) {
      const clientSecret = e.parameter.secret;
      if (clientSecret !== allowedSecret) {
        return createJsonResponse({ status: "error", message: "Unauthorized" });
      }
    }

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
    
    const scriptProperties = PropertiesService.getScriptProperties();
    const allowedSecret = scriptProperties.getProperty('API_SECRET_KEY') || 'myzikir_secret_key_123';
    
    // Verifikasi secret key jika dikonfigurasi di Script Properties atau menggunakan fallback default
    if (allowedSecret) {
      const clientSecret = postData.secret;
      if (clientSecret !== allowedSecret) {
        return createJsonResponse({ status: "error", message: "Unauthorized" });
      }
    }

    const action = postData.action; // 'create', 'update', 'delete'
    const table = postData.table;   // e.g. 'zikir_setelah_shalat'
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ----------------------------------------------------
    // Aksi Eksplisit untuk Manajemen Sheet
    // ----------------------------------------------------
    if (action === 'create_sheet') {
      if (!table) {
        return createJsonResponse({ status: "error", message: "Nama sheet tidak boleh kosong" }, 400);
      }
      const sheetName = table.toString().trim();
      if (ss.getSheetByName(sheetName)) {
        return createJsonResponse({ status: "error", message: "Sheet '" + sheetName + "' sudah ada" }, 400);
      }
      try {
        const newSheet = ss.insertSheet(sheetName);
        newSheet.appendRow(['no', 'sub_menu', 'arab', 'terjemah']);
        return createJsonResponse({ status: "success", message: "Sheet '" + sheetName + "' berhasil ditambahkan" });
      } catch (err) {
        return createJsonResponse({ status: "error", message: "Gagal membuat sheet: " + err.toString() }, 500);
      }
    }

    if (action === 'rename_sheet') {
      if (!table) {
        return createJsonResponse({ status: "error", message: "Nama sheet tidak boleh kosong" }, 400);
      }
      const newTable = postData.new_table || postData.newTable;
      if (!newTable) {
        return createJsonResponse({ status: "error", message: "Nama sheet baru tidak boleh kosong" }, 400);
      }
      const oldSheetName = table.toString().trim();
      const newSheetName = newTable.toString().trim();
      
      const targetSheet = ss.getSheetByName(oldSheetName);
      if (!targetSheet) {
        return createJsonResponse({ status: "error", message: "Sheet '" + oldSheetName + "' tidak ditemukan" }, 404);
      }
      if (ss.getSheetByName(newSheetName)) {
        return createJsonResponse({ status: "error", message: "Sheet '" + newSheetName + "' sudah ada" }, 400);
      }
      
      try {
        targetSheet.setName(newSheetName);
        return createJsonResponse({ status: "success", message: "Sheet berhasil diubah dari '" + oldSheetName + "' menjadi '" + newSheetName + "'" });
      } catch (err) {
        return createJsonResponse({ status: "error", message: "Gagal mengubah nama sheet: " + err.toString() }, 500);
      }
    }

    if (action === 'delete_sheet') {
      if (!table) {
        return createJsonResponse({ status: "error", message: "Nama sheet tidak boleh kosong" }, 400);
      }
      const sheetName = table.toString().trim();
      const targetSheet = ss.getSheetByName(sheetName);
      if (!targetSheet) {
        return createJsonResponse({ status: "error", message: "Sheet '" + sheetName + "' tidak ditemukan" }, 404);
      }
      
      try {
        ss.deleteSheet(targetSheet);
        return createJsonResponse({ status: "success", message: "Sheet '" + sheetName + "' berhasil dihapus" });
      } catch (err) {
        return createJsonResponse({ status: "error", message: "Gagal menghapus sheet: " + err.toString() }, 500);
      }
    }

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

      // Manajemen Sheet Otomatis untuk menu_config
      if (table === 'menu_config' && item.nama_sheet) {
        const sheetName = item.nama_sheet.toString().trim();
        if (sheetName && !ss.getSheetByName(sheetName)) {
          try {
            const newSheet = ss.insertSheet(sheetName);
            newSheet.appendRow(['no', 'sub_menu', 'arab', 'terjemah']);
          } catch (e) {
            console.error("Gagal membuat sheet otomatis: " + e.toString());
          }
        }
      }

      return createJsonResponse({ status: "success", message: "Data berhasil ditambahkan" });
    }

    if (action === 'create_batch') {
      const items = postData.items;
      if (!Array.isArray(items)) {
        return createJsonResponse({ status: "error", message: "Parameter 'items' harus berupa array" }, 400);
      }
      
      try {
        items.forEach(item => {
          const newRow = headers.map(h => item[h] !== undefined ? item[h] : "");
          sheet.appendRow(newRow);
        });
        return createJsonResponse({ status: "success", message: items.length + " data berhasil ditambahkan" });
      } catch (err) {
        return createJsonResponse({ status: "error", message: "Gagal menambahkan batch data: " + err.toString() }, 500);
      }
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

      // Manajemen Sheet Otomatis untuk menu_config
      if (table === 'menu_config' && item.nama_sheet) {
        const namaSheetIndex = headers.indexOf('nama_sheet');
        if (namaSheetIndex !== -1) {
          const oldNamaSheet = values[foundRowIndex - 1][namaSheetIndex].toString().trim();
          const newNamaSheet = item.nama_sheet.toString().trim();
          if (oldNamaSheet && newNamaSheet && oldNamaSheet !== newNamaSheet) {
            const targetSheet = ss.getSheetByName(oldNamaSheet);
            if (targetSheet && !ss.getSheetByName(newNamaSheet)) {
              try {
                targetSheet.setName(newNamaSheet);
              } catch (e) {
                console.error("Gagal mengubah nama sheet otomatis: " + e.toString());
              }
            }
          }
        }
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

      // Manajemen Sheet Otomatis untuk menu_config
      if (table === 'menu_config') {
        const namaSheetIndex = headers.indexOf('nama_sheet');
        if (namaSheetIndex !== -1) {
          const oldNamaSheet = values[foundRowIndex - 1][namaSheetIndex].toString().trim();
          if (oldNamaSheet) {
            const targetSheet = ss.getSheetByName(oldNamaSheet);
            if (targetSheet) {
              try {
                ss.deleteSheet(targetSheet);
              } catch (e) {
                console.error("Gagal menghapus sheet otomatis: " + e.toString());
              }
            }
          }
        }
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
