
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
 * IMPORTANTE: Si actualizaste el archivo google_script.js, 
 * DEBES generar una "Nueva Versión" en Implementar > Gestionar implementaciones
 * y asegurarte de que el ID aquí sea el de la última implementación.
 */
const DEPLOYMENT_ID = "https://script.google.com/macros/s/AKfycbyp8JpkPf35Qr56p5co6C_lyfKFdDu0rRpGd3S4bvlu3Dtb-y5InBn3yHxv4EQK7cLnnQ/exec"; 

export const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
export const IS_CONFIGURED = true;
export const ENABLE_DEMO_MODE = false;
