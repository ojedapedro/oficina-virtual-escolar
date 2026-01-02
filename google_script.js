
/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 * ID de hoja: SistemLbeltranPfigueroa
 */
const SHEET_ID = "1vhTFY-DLkHZIvTozAj-_ZiJDLftgkHmh494OM9EjDdQ";
const TARGET_SHEET_NAME = "OficinaVirtual"; // DESTINO ÚNICO PARA LA APP
const USER_SHEET_NAME = "Uove";           // HOJA DE USUARIOS

/**
 * Función para inicializar la estructura exacta. 
 * EJECUTAR ESTA FUNCIÓN MANUALMENTE EN EL EDITOR PARA PREPARAR LAS HOJAS.
 */
function setupAppStructure() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. ESTRUCTURA DE PAGOS WEB (Hoja: OficinaVirtual) - 15 COLUMNAS
  const ovHeaders = [
    "id", "timestamp", "paymentDate", "cedulaRepresen", "matricula", 
    "level", "method", "reference", "amount", "observations", 
    "status", "type", "pendingBalance", "nombre", "EstatusSistema"
  ];

  let ovSheet = ss.getSheetByName(TARGET_SHEET_NAME) || ss.insertSheet(TARGET_SHEET_NAME);
  ovSheet.clearContents(); 
  ovSheet.getRange(1, 1, 1, ovHeaders.length).setValues([ovHeaders]);
  ovSheet.getRange(1, 1, 1, ovHeaders.length)
    .setFontWeight("bold")
    .setBackground("#1e293b")
    .setFontColor("white")
    .setHorizontalAlignment("center");
  
  // 2. ESTRUCTURA DE USUARIOS (Hoja: Uove)
  const uoveHeaders = ["cedula", "clave", "nombre", "matricula"];
  let uoveSheet = ss.getSheetByName(USER_SHEET_NAME) || ss.insertSheet(USER_SHEET_NAME);
  if (uoveSheet.getLastRow() === 0) {
    uoveSheet.getRange(1, 1, 1, uoveHeaders.length).setValues([uoveHeaders]);
    uoveSheet.getRange(1, 1, 1, uoveHeaders.length).setFontWeight("bold");
  }
  
  return "Estructura configurada con éxito. La APP ahora solo escribirá en " + TARGET_SHEET_NAME;
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const action = e.parameter.action;

  if (action === 'login') {
    const user = e.parameter.user;
    const pass = e.parameter.pass;
    const uoveSheet = ss.getSheetByName(USER_SHEET_NAME);
    if (!uoveSheet) return createJsonResponse({ result: "error", message: "Error: No existe la hoja de usuarios " + USER_SHEET_NAME });
    
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

  if (action === 'read') {
    const sheet = ss.getSheetByName(TARGET_SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) return createJsonResponse([]);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header.toString().trim()] = row[i];
      });
      return obj;
    });
    return createJsonResponse(rows.reverse());
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    
    if (data.action === 'register') {
      const uoveSheet = ss.getSheetByName(USER_SHEET_NAME) || ss.insertSheet(USER_SHEET_NAME);
      uoveSheet.appendRow([data.cedula, data.clave, data.nombre, data.matricula]);
      return createJsonResponse({ result: "success" });
    }

    // BLOQUEO DE SEGURIDAD: Solo escribimos en OficinaVirtual
    const sheet = ss.getSheetByName(TARGET_SHEET_NAME) || ss.insertSheet(TARGET_SHEET_NAME);
    
    // Mapeo manual por índice para garantizar posición exacta en las columnas de OficinaVirtual
    const rowToAppend = [
      "OV-" + Math.random().toString(36).substr(2, 7).toUpperCase(), // A: id (PREFIJO OV ES CLAVE)
      new Date(),                                                     // B: timestamp
      data.paymentDate || "",                                         // C: paymentDate
      data.cedulaRepresen || "",                                      // D: cedulaRepresen
      data.matricula || "",                                           // E: matricula
      data.level || "",                                               // F: level
      data.method || "",                                              // G: method
      data.reference || "",                                           // H: reference
      parseFloat(data.amount) || 0,                                   // I: amount
      data.observations || "",                                        // J: observations
      "Pendiente",                                                    // K: status
      data.type || "",                                                // L: type
      parseFloat(data.pendingBalance) || 0,                           // M: pendingBalance
      data.nombre || "",                                              // N: nombre
      "Activo"                                                        // O: EstatusSistema
    ];

    sheet.appendRow(rowToAppend);
    return createJsonResponse({ result: "success", id: rowToAppend[0] });
  } catch (err) {
    return createJsonResponse({ result: "error", message: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
