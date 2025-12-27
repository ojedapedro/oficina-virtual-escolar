
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

// Fixed: Removed "V-" from sample data IDs
export const SCHOOL_ACCOUNTS: SchoolAccount[] = [
  {
    bank: "Banco Mercantil",
    accountNumber: "0105-0000-00-0000000000",
    holder: "Colegio Maestro Beltrán Prieto Figueroa",
    id: "J-12345678-0",
    type: "Corriente"
  },
  {
    bank: "Pago Móvil (BDV)",
    phone: "0412-0000000",
    id: "12345678",
    holder: "Administración Escolar"
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
const DEPLOYMENT_ID = "AKfycbxNBy31uyMDtIQ0BhfMHlSH4SyTA1w9_dtFO7DdfCFgnkniSXKlEPlB8AEFyQo7aoTvFw"; 

export const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
export const IS_CONFIGURED = true;
export const ENABLE_DEMO_MODE = false;
