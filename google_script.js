
/**
 * INSTRUCCIONES:
 * 1. Abra su Google Sheet (ID: 17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg)
 * 2. Vaya a Extensiones > Apps Script
 * 3. Reemplace el código por este nuevo contenido.
 * 4. Cree una hoja llamada "Usuarios" con dos columnas: "Cedula" y "Clave".
 * 5. Implemente como Aplicación Web (Acceso: Cualquiera).
 */

function doGet(e) {
  const sheetId = "17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg";
  const action = e.parameter.action;

  // Acción de Login
  if (action === 'login') {
    const user = e.parameter.user;
    const pass = e.parameter.pass;
    try {
      const ss = SpreadsheetApp.openById(sheetId);
      const userSheet = ss.getSheetByName("Usuarios") || ss.insertSheet("Usuarios");
      if (userSheet.getLastRow() < 1) {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "No hay usuarios registrados por el administrador" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = userSheet.getDataRange().getValues();
      const found = data.find(row => row[0].toString().trim() === user.trim() && row[1].toString().trim() === pass.trim());
      
      if (found) {
        return ContentService.createTextOutput(JSON.stringify({ result: "success", user: user }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Cédula o clave incorrecta" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Acción de Leer Historial
  if (action === 'read') {
    try {
      const ss = SpreadsheetApp.openById(sheetId);
      const sheet = ss.getSheetByName("Pagos");
      if (!sheet || sheet.getLastRow() < 2) {
        return ContentService.createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, i) => {
          const key = header.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
          obj[key] = row[i];
        });
        return obj;
      });
      
      return ContentService.createTextOutput(JSON.stringify(rows.reverse()))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput("Servicio Activo").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const sheetId = "17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg";
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName("Pagos") || ss.insertSheet("Pagos");
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Fecha Registro", "Fecha Pago", "Cedula Representante", "Nivel", "Matricula", "Tipo Pago", "Referencia", "Monto", "Observaciones"]);
    }
    
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([new Date(), data.fechaRegistro, data.fechaPago, data.cedula, data.nivel, data.matricula || "N/A", data.tipoPago, data.referencia || "N/A", data.monto || 0, data.observaciones || ""]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
