
export const SCHOOL_ACCOUNTS = [
  {
    bank: "Banco Mercantil",
    accountNumber: "0105-XXXX-XX-XXXXXXXXXX",
    holder: "Colegio San José",
    id: "J-12345678-0",
    type: "Corriente"
  },
  {
    bank: "Banco de Venezuela (Pago Móvil)",
    phone: "0412-1234567",
    id: "V-12345678",
    holder: "Admin Escolar"
  },
  {
    bank: "Zelle / International",
    email: "pagos@colegiosanjose.edu",
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

export const LEVELS = [
  "Maternal",
  "Pre-escolar",
  "Primaria",
  "Secundaria"
];

/**
 * INSTRUCCIONES:
 * 1. Ve a tu Google Sheet.
 * 2. Extensiones > Apps Script.
 * 3. Implementar > Nueva implementación > Aplicación Web.
 * 4. Copia la "URL de la aplicación web" y pégala aquí abajo.
 */
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
