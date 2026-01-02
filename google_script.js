
/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 * ID de hoja: SistemLbeltranPfigueroa
 */
const SHEET_ID = "1vhTFY-DLkHZIvTozAj-_ZiJDLftgkHmh494OM9EjDdQ";

/**
 * Función para inicializar la estructura exacta de la Oficina Virtual.
 * Ejecutar manualmente en el editor de Apps Script la primera vez.
 */
function setupAppStructure() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. ESTRUCTURA DE PAGOS WEB (Hoja: OficinaVirtual)
  // Basado exactamente en la imagen proporcionada (15 columnas)
  const ovHeaders = [
    "id", "timestamp", "paymentDate", "cedulaRepresen", "matricula", 
    "level", "method", "reference", "amount", "observations", 
    "status", "type", "pendingBalance", "nombre", "EstatusSistema"
  ];

  let ovSheet = ss.getSheetByName("OficinaVirtual") || ss.insertSheet("OficinaVirtual");
  
  // Limpiar y configurar cabeceras si está vacía
  if (ovSheet.getLastRow() === 0) {
    ovSheet.getRange(1, 1, 1, ovHeaders.length).setValues([ovHeaders]);
    ovSheet.getRange(1, 1, 1, ovHeaders.length)
      .setFontWeight("bold")
      .setBackground("#1e293b")
      .setFontColor("white")
      .setHorizontalAlignment("center");
  }
  
  // 2. ESTRUCTURA DE USUARIOS (Hoja: Uove)
  // Basado en la imagen: A:cedula, B:clave, C:nombre, D:matricula
  const uoveHeaders = ["cedula", "clave", "nombre", "matricula"];
  let uoveSheet = ss.getSheetByName("Uove") || ss.insertSheet("Uove");
  
  if (uoveSheet.getLastRow() === 0) {
    uoveSheet.getRange(1, 1, 1, uoveHeaders.length).setValues([uoveHeaders]);
    uoveSheet.getRange(1, 1, 1, uoveHeaders.length)
      .setFontWeight("bold")
      .setBackground("#1e293b")
      .setFontColor("white");
  }
  
  return "Estructura de OficinaVirtual y Uove verificada satisfactoriamente.";
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const action = e.parameter.action;

  // LOGIN: Autentica contra la hoja Uove
  if (action === 'login') {
    const user = e.parameter.user;
    const pass = e.parameter.pass;
    const uoveSheet = ss.getSheetByName("Uove");
    if (!uoveSheet) return createJsonResponse({ result: "error", message: "Hoja de usuarios Uove no existe." });
    
    const data = uoveSheet.getDataRange().getValues();
    const found = data.slice(1).find(row => 
      row[0].toString().trim() === user.trim() && 
      row[1].toString().trim() === pass.trim()
    );
    
    if (found) {
      return createJsonResponse({ 
        result: "success", 
        nombre: found[2], 
        matricula: found[3] 
      });
    }
    return createJsonResponse({ result: "error", message: "Cédula o clave incorrecta." });
  }

  // LEER HISTORIAL: Solo lee de la hoja OficinaVirtual
  if (action === 'read') {
    const sheet = ss.getSheetByName("OficinaVirtual");
    if (!sheet || sheet.getLastRow() < 2) return createJsonResponse([]);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => h.toString().trim());
    const rows = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    // Retornamos solo los de la OficinaVirtual para que no vea los de "Pagos"
    return createJsonResponse(rows.reverse());
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    
    // REGISTRO DE NUEVO USUARIO EN UOVE
    if (data.action === 'register') {
      const uoveSheet = ss.getSheetByName("Uove") || ss.insertSheet("Uove");
      uoveSheet.appendRow([data.cedula, data.clave, data.nombre, data.matricula]);
      return createJsonResponse({ result: "success" });
    }

    // REGISTRO DE PAGO EN OFICINAVIRTUAL
    const sheet = ss.getSheetByName("OficinaVirtual") || ss.insertSheet("OficinaVirtual");
    const headersInSheet = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 15).getValues()[0]
      .map(h => h.toString().trim());

    // Objeto con llaves que coinciden con las cabeceras de tu imagen
    const dataToSave = {
      "id": "OV-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      "timestamp": new Date(),
      "paymentDate": data.paymentDate || "",
      "cedulaRepresen": data.cedulaRepresen || "",
      "matricula": data.matricula || "",
      "level": data.level || "",
      "method": data.method || "",
      "reference": data.reference || "",
      "amount": parseFloat(data.amount) || 0,
      "observations": data.observations || "",
      "status": "Pendiente",
      "type": data.type || "",
      "pendingBalance": parseFloat(data.pendingBalance) || 0,
      "nombre": data.nombre || "",
      "EstatusSistema": "Activo"
    };

    const finalRow = new Array(headersInSheet.length).fill("");
    headersInSheet.forEach((headerName, index) => {
      if (dataToSave.hasOwnProperty(headerName)) {
        finalRow[index] = dataToSave[headerName];
      }
    });

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
