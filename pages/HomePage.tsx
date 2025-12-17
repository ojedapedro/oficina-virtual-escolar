
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, CreditCard, ChevronRight, Bell } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Bienvenido representante</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Gestione los pagos de sus representados de forma rápida, segura y transparente desde nuestra oficina virtual.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/cuentas" 
          className="group p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <CreditCard size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Datos de Cuentas</h3>
          <p className="text-slate-500 mb-6">Consulte nuestros números de cuenta, pago móvil y billeteras digitales.</p>
          <span className="text-blue-600 font-semibold flex items-center">Ver detalles <ChevronRight size={16} className="ml-1" /></span>
        </Link>

        <Link 
          to="/registro" 
          className="group p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ClipboardCheck size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Reportar un Pago</h3>
          <p className="text-slate-500 mb-6">Registre el comprobante de su transferencia o pago en efectivo rápidamente.</p>
          <span className="text-emerald-600 font-semibold flex items-center">Ir al registro <ChevronRight size={16} className="ml-1" /></span>
        </Link>
      </div>

      <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-blue-100 uppercase tracking-wider text-xs font-bold">
            <Bell size={14} />
            <span>Avisos Importantes</span>
          </div>
          <h3 className="text-2xl font-bold">Inscripciones Abiertas 2025-2026</h3>
          <p className="text-blue-100 max-w-md">
            Ya puede realizar el registro de la matrícula para el nuevo año escolar. Recuerde reportar sus pagos antes del 5 de cada mes.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
      </section>
    </div>
  );
};

export default HomePage;
