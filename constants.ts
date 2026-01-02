
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
 * Actualizado con el nuevo ID y URL proporcionados
 */
const DEPLOYMENT_ID = "AKfycbxjtpqOqZPZ5Iovz2ERj8cVUMCZDbZuRKZEmMZtU_8Ao8_Yj_Y7KShDMSGgALxsUIfLNg"; 

export const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
export const IS_CONFIGURED = true;
export const ENABLE_DEMO_MODE = false;
