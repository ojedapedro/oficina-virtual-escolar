
/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 */
const SHEET_ID = "17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg";

function setupAppStructure() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  let pagosSheet = ss.getSheetByName("Pagos") || ss.insertSheet("Pagos");
  const pagosHeaders = [
    "id", "timestamp", "paymentDate", "cedulaRepresentative", 
    "matricula", "level", "method", "reference", 
    "amount", "observations", "status", "type", "pendingBalance"
  ];
  
  if (pagosSheet.getLastRow() === 0) {
    pagosSheet.appendRow(pagosHeaders);
    pagosSheet.getRange(1, 1, 1, pagosHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
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
}

function doPost(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("Pagos");
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'register') {
    const uSheet = ss.getSheetByName("Usuarios");
    uSheet.appendRow([data.cedula, data.clave, data.nombre, data.matricula]);
    return createJsonResponse({ result: "success" });
  }

  // --- LÓGICA DE REGISTRO DE PAGO ROBUSTA ---
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = new Array(headers.length).fill("");
  const newId = "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  // Mapeo explícito de campos según el nombre de la columna
  const mapping = {
    "id": newId,
    "timestamp": new Date(),
    "paymentDate": data.paymentDate,
    "cedulaRepresentative": data.cedulaRepresentative,
    "matricula": data.matricula,
    "level": data.level,
    "method": data.method,
    "reference": data.reference,
    "amount": data.amount,
    "observations": data.observations,
    "status": "Pendiente",
    "type": data.type,
    "pendingBalance": data.pendingBalance || 0
  };

  headers.forEach((header, i) => {
    const cleanHeader = header.toString().trim();
    if (mapping[cleanHeader] !== undefined) {
      newRow[i] = mapping[cleanHeader];
    }
  });

  sheet.appendRow(newRow);
  return createJsonResponse({ result: "success", id: newId });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
