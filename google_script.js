
/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 */
const SHEET_ID = "17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg";

/**
 * Sincroniza la estructura de la hoja. 
 * Si las columnas no existen, las crea. Si existen, identifica su posición.
 */
function setupAppStructure() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const pagosHeaders = [
    "id", "timestamp", "paymentDate", "cedulaRepresentative", 
    "matricula", "level", "method", "reference", 
    "amount", "observations", "status", "type", "pendingBalance"
  ];

  let pagosSheet = ss.getSheetByName("Pagos") || ss.insertSheet("Pagos");
  
  // Si la hoja está vacía, ponemos los headers
  if (pagosSheet.getLastRow() === 0) {
    pagosSheet.getRange(1, 1, 1, pagosHeaders.length).setValues([pagosHeaders]);
    pagosSheet.getRange(1, 1, 1, pagosHeaders.length)
      .setFontWeight("bold")
      .setBackground("#1e293b")
      .setFontColor("white");
  }
  
  let usuariosSheet = ss.getSheetByName("Usuarios") || ss.insertSheet("Usuarios");
  const usuariosHeaders = ["cedula", "clave", "nombre", "matricula"];
  
  if (usuariosSheet.getLastRow() === 0) {
    usuariosSheet.appendRow(usuariosHeaders);
    usuariosSheet.getRange(1, 1, 1, usuariosHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
  }
  
  return "Estructura verificada.";
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const action = e.parameter.action;

  if (action === 'login') {
    const user = e.parameter.user;
    const pass = e.parameter.pass;
    const userSheet = ss.getSheetByName("Usuarios");
    const data = userSheet.getDataRange().getValues();
    const found = data.slice(1).find(row => 
      row[0].toString().trim() === user.trim() && 
      row[1].toString().trim() === pass.trim()
    );
    
    if (found) {
      return createJsonResponse({ result: "success", nombre: found[2], matricula: found[3] });
    }
    return createJsonResponse({ result: "error", message: "Cédula o clave incorrecta." });
  }

  if (action === 'read') {
    const sheet = ss.getSheetByName("Pagos");
    if (sheet.getLastRow() < 2) return createJsonResponse([]);
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => h.toString().trim());
    const rows = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    return createJsonResponse(rows.reverse());
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("Pagos");
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    
    if (data.action === 'register') {
      const uSheet = ss.getSheetByName("Usuarios");
      uSheet.appendRow([data.cedula, data.clave, data.nombre, data.matricula]);
      return createJsonResponse({ result: "success" });
    }

    // --- MAPEO DINÁMICO ANTIDESPLAZAMIENTO ---
    // 1. Obtener los encabezados actuales de la fila 1
    const headersInSheet = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 13).getValues()[0]
      .map(h => h.toString().trim());

    // 2. Preparar el objeto de datos que queremos guardar
    const dataToSave = {
      "id": "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      "timestamp": new Date(),
      "paymentDate": data.paymentDate || "",
      "cedulaRepresentative": data.cedulaRepresentative || "",
      "matricula": data.matricula || "",
      "level": data.level || "",
      "method": data.method || "",
      "reference": data.reference || "",
      "amount": parseFloat(data.amount) || 0,
      "observations": data.observations || "",
      "status": "Pendiente",
      "type": data.type || "",
      "pendingBalance": parseFloat(data.pendingBalance) || 0
    };

    // 3. Crear la fila de salida basándose en la posición REAL de cada columna
    const finalRow = new Array(headersInSheet.length).fill("");
    
    headersInSheet.forEach((headerName, index) => {
      // Si el nombre de la columna existe en nuestro objeto dataToSave, lo ponemos en esa posición
      if (dataToSave.hasOwnProperty(headerName)) {
        finalRow[index] = dataToSave[headerName];
      }
    });

    // 4. Insertar la fila
    sheet.appendRow(finalRow);

    return createJsonResponse({ result: "success", id: dataToSave.id });
  } catch (err) {
    return createJsonResponse({ result: "error", message: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
