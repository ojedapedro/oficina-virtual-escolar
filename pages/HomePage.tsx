
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, CreditCard, ChevronRight, Bell, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-500 font-black text-xs uppercase tracking-widest">
          <Sparkles size={16} />
          <span>Panel de Control Escolar</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Maestro Beltrán <br/> <span className="text-slate-400">Prieto Figueroa</span>
        </h2>
        <p className="text-slate-500 text-lg max-w-xl font-medium leading-relaxed">
          Bienvenido a su oficina virtual institucional. Gestione reportes de pago y consultas administrativas de forma segura.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link 
          to="/cuentas" 
          className="group relative p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl"></div>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
            <CreditCard size={28} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Datos Bancarios</h3>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">Consulte las cuentas bancarias oficiales de la institución para sus transferencias.</p>
          <div className="flex items-center text-blue-600 font-bold text-sm uppercase tracking-widest">
            <span>Ver Detalles</span>
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link 
          to="/registro" 
          className="group relative p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl"></div>
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-sm">
            <ClipboardCheck size={28} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Reportar Pago</h3>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">¿Ya realizó su transferencia? Registre su comprobante aquí para su validación.</p>
          <div className="flex items-center text-amber-600 font-bold text-sm uppercase tracking-widest">
            <span>Ir al Formulario</span>
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <section className="relative rounded-[3rem] p-10 text-white overflow-hidden sidebar-gradient shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-amber-400 uppercase tracking-widest text-[10px] font-black border border-white/5">
              <Bell size={14} />
              <span>Aviso Importante</span>
            </div>
            <h3 className="text-3xl font-black leading-tight">Proceso de <br/> <span className="text-amber-400">Inscripción Escolar</span></h3>
            <p className="text-slate-300 font-medium text-lg leading-relaxed">
              Recuerde que el Maestro Beltrán Prieto Figueroa prioriza la solvencia administrativa para los procesos de reserva de cupo.
            </p>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="w-48 h-48 bg-white/5 rounded-3xl rotate-12 flex items-center justify-center border border-white/10 shadow-inner">
               <img src="https://i.ibb.co/FbHJbvVT/images.png" alt="Icon" className="w-24 h-24 object-contain grayscale opacity-50" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
