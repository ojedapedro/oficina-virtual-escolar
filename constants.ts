
export const SCHOOL_ACCOUNTS = [
  {
    bank: "Banco Mercantil",
    accountNumber: "0105-XXXX-XX-XXXXXXXXXX",
    holder: "Maestro Beltrán Prieto Figueroa",
    id: "J-12345678-0",
    type: "Corriente"
  },
  {
    bank: "Banco de Venezuela (Pago Móvil)",
    phone: "0412-1234567",
    id: "V-12345678",
    holder: "Admin Maestro Beltrán"
  },
  {
    bank: "Zelle / International",
    email: "pagos@maestrobeltran.edu",
    holder: "School Administration"
  }
];

export const PAYMENT_TYPES = [
  "Transferencia",
  "Pago Móvil",
  "Zelle",
  "Binance",
  "Efectivo Bs",
  "Efectivo $",
  "Efectivo Euro"
];

export const PAYMENT_MODES = [
  "Pago Total",
  "Abono"
];

export const LEVELS = [
  "Maternal",
  "Pre-escolar",
  "Primaria",
  "Secundaria"
];

/**
 * CONFIGURACIÓN DEL BACKEND (Google Apps Script)
 * 1. En script.google.com, dale a "Desplegar" -> "Nueva implementación" -> "Aplicación Web".
 * 2. Acceso: "Cualquier persona" (Anyone).
 * 3. Copia el "ID de implementación" y pégalo aquí abajo:
 */
const DEPLOYMENT_ID = "https://script.google.com/macros/s/AKfycbzBdfC3yAPAtheuAMpBb1jtW98uHIsGL0dONHl33w891WlgyrbsunesQMHqvhkcHDg21A/exec"; 

export const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
export const IS_CONFIGURED = DEPLOYMENT_ID !== "https://script.google.com/macros/s/AKfycbzBdfC3yAPAtheuAMpBb1jtW98uHIsGL0dONHl33w891WlgyrbsunesQMHqvhkcHDg21A/exec";
export const ENABLE_DEMO_MODE = true; // Permite probar la app sin backend configurado
