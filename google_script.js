
/**
 * CONFIGURACIÓN INICIAL
 * ID del documento: 17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg
 */

const SHEET_ID = "17slRl7f9AKQgCEGF5jDLMGfmOc-unp1gXSRpYFGX1Eg";

/**
 * Función para crear la estructura inicial de la base de datos
 */
function setupAppStructure() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. Hoja de Pagos
  let pagosSheet = ss.getSheetByName("Pagos") || ss.insertSheet("Pagos");
  pagosSheet.clear();
  const pagosHeaders = ["Timestamp", "Fecha Registro", "Fecha Pago", "Cedula Representante", "Nivel", "Matricula", "Tipo Pago", "Modo Pago", "Referencia", "Monto", "Observaciones"];
  pagosSheet.appendRow(pagosHeaders);
  pagosSheet.getRange(1, 1, 1, pagosHeaders.length).setFontWeight("bold").setBackground("#d9ead3");
  
  // 2. Hoja de Usuarios
  let usuariosSheet = ss.getSheetByName("Usuarios") || ss.insertSheet("Usuarios");
  usuariosSheet.clear();
  const usuariosHeaders = ["Cedula", "Clave", "Nombre", "Matricula"];
  usuariosSheet.appendRow(usuariosHeaders);
  usuariosSheet.getRange(1, 1, 1, usuariosHeaders.length).setFontWeight("bold").setBackground("#cfe2f3");
  
  // Usuario de prueba
  usuariosSheet.appendRow(["V-12345678", "1234", "Usuario de Prueba", "AD-2025-001"]);
  
  return "Estructura actualizada exitosamente con Modo de Pago.";
}

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.openById(SHEET_ID);

  if (action === 'login') {
    const user = e.parameter.user;
    const pass = e.parameter.pass;
    try {
      const userSheet = ss.getSheetByName("Usuarios");
      const data = userSheet.getDataRange().getValues();
      const found = data.slice(1).find(row => 
        row[0].toString().trim().toLowerCase() === user.trim().toLowerCase() && 
        row[1].toString().trim() === pass.trim()
      );
      
      if (found) {
        return createJsonResponse({ result: "success", user: user, nombre: found[2] });
      } else {
        return createJsonResponse({ result: "error", message: "Cédula o clave incorrecta" });
      }
    } catch (err) {
      return createJsonResponse({ result: "error", message: err.toString() });
    }
  }

  if (action === 'read') {
    try {
      const sheet = ss.getSheetByName("Pagos");
      if (!sheet || sheet.getLastRow() < 2) return createJsonResponse([]);
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
      return createJsonResponse(rows.reverse());
    } catch (err) {
      return createJsonResponse({ error: err.toString() });
    }
  }
  return ContentService.createTextOutput("Servicio Activo").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'register') {
      const sheet = ss.getSheetByName("Usuarios");
      const usersData = sheet.getDataRange().getValues();
      const exists = usersData.some(row => row[0].toString().trim().toLowerCase() === data.cedula.trim().toLowerCase());
      
      if (exists) {
        return createJsonResponse({ result: "error", message: "La cédula ya se encuentra registrada." });
      }
      
      sheet.appendRow([data.cedula, data.clave, data.nombre, data.matricula]);
      return createJsonResponse({ result: "success", message: "Usuario registrado con éxito." });
    }
    
    const sheet = ss.getSheetByName("Pagos");
    sheet.appendRow([
      new Date(), data.fechaRegistro, data.fechaPago, data.cedula, 
      data.nivel, data.matricula || "N/A", data.tipoPago, data.modoPago,
      data.referencia || "N/A", data.monto || 0, data.observaciones || ""
    ]);
    
    return createJsonResponse({ result: "success" });
  } catch (error) {
    return createJsonResponse({ result: "error", error: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
