
/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 */
const SHEET_ID = "17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg";

/**
 * Función para inicializar las hojas si no existen
 * Ejecutar manualmente una vez o se ejecutará al primer POST/GET
 */
function setupAppStructure() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. Hoja de Pagos (13 columnas)
  let pagosSheet = ss.getSheetByName("Pagos") || ss.insertSheet("Pagos");
  const pagosHeaders = [
    "id", "timestamp", "paymentDate", "cedulaRepresentative", 
    "matricula", "level", "method", "reference", 
    "amount", "observations", "status", "type", "pendingBalance"
  ];
  
  if (pagosSheet.getLastRow() === 0) {
    pagosSheet.appendRow(pagosHeaders);
    pagosSheet.getRange(1, 1, 1, pagosHeaders.length)
      .setFontWeight("bold")
      .setBackground("#1e293b")
      .setFontColor("white");
  }
  
  // 2. Hoja de Usuarios
  let usuariosSheet = ss.getSheetByName("Usuarios") || ss.insertSheet("Usuarios");
  const usuariosHeaders = ["cedula", "clave", "nombre", "matricula"];
  
  if (usuariosSheet.getLastRow() === 0) {
    usuariosSheet.appendRow(usuariosHeaders);
    usuariosSheet.getRange(1, 1, 1, usuariosHeaders.length)
      .setFontWeight("bold")
      .setBackground("#1e293b")
      .setFontColor("white");
  }
  
  return "Estructura verificada/creada correctamente.";
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
      row[0].toString().trim().toLowerCase() === user.trim().toLowerCase() && 
      row[1].toString().trim() === pass.trim()
    );
    
    if (found) {
      return createJsonResponse({ result: "success", nombre: found[2], matricula: found[3] });
    }
    return createJsonResponse({ result: "error", message: "Credenciales inválidas" });
  }

  if (action === 'read') {
    const sheet = ss.getSheetByName("Pagos");
    if (sheet.getLastRow() < 2) return createJsonResponse([]);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => obj[header] = row[i]);
      return obj;
    });
    return createJsonResponse(rows.reverse());
  }
  
  return ContentService.createTextOutput("Servicio Activo").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'register') {
    const sheet = ss.getSheetByName("Usuarios");
    sheet.appendRow([data.cedula, data.clave, data.nombre, data.matricula]);
    return createJsonResponse({ result: "success" });
  }
  
  // Registro de Pago con nueva estructura
  const sheet = ss.getSheetByName("Pagos");
  const newId = "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  sheet.appendRow([
    newId,                        // id
    new Date(),                   // timestamp
    data.paymentDate,             // paymentDate
    data.cedulaRepresentative,    // cedulaRepresentative
    data.matricula,               // matricula
    data.level,                   // level
    data.method,                  // method
    data.reference,               // reference
    data.amount,                  // amount
    data.observations,            // observations
    "Pendiente",                  // status (default)
    data.type,                    // type (Pago Total / Abono)
    data.pendingBalance || 0      // pendingBalance
  ]);
  
  return createJsonResponse({ result: "success", id: newId });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
