
// Interface to define the expected structure of school banking accounts
export interface SchoolAccount {
  bank: string;
  accountNumber?: string;
  phone?: string;
  email?: string;
  holder: string;
  id: string;
  type?: string;
}

// Fixed: Added explicit typing to SCHOOL_ACCOUNTS to support optional fields like email
export const SCHOOL_ACCOUNTS: SchoolAccount[] = [
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
  }
];

export const PAYMENT_METHODS = [
  "Transferencia",
  "Pago Móvil",
  "Zelle",
  "Efectivo $",
  "Efectivo Bs."
];

export const LEVELS = [
  "Maternal",
  "Pre-escolar",
  "Primaria",
  "Secundaria"
];

export const PAYMENT_TYPES = [
  "Pago Total",
  "Abono"
];

/**
 * CONFIGURACIÓN DEL BACKEND
 */
const DEPLOYMENT_ID = "AKfycbxBBsRqQ9nZykVioVqgQ_I3wmCYz3gncOM1rxZbFfgEPF-ijLp0Qp63fAKjsNxcytPNIQ"; 

export const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
export const IS_CONFIGURED = true;
export const ENABLE_DEMO_MODE = false;
