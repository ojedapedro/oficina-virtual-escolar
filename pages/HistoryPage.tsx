
import React, { useState, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL, IS_CONFIGURED } from '../constants';
import { Loader2, Calendar, RefreshCw, FileText, AlertCircle, Bookmark, Clock, Settings, Wallet, Target } from 'lucide-react';

interface PaymentRecord {
  timestamp: string;
  fecharegistro: string;
  fechapago: string;
  cedularepresentante: string;
  nivel: string;
  tipopago: string;
  modopago: string;
  referencia: string;
  monto: number;
}

interface HistoryPageProps {
  userCedula: string;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ userCedula }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!IS_CONFIGURED) {
      setError("Script no configurado");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read`, {
        method: 'GET'
      });
      if (!response.ok) throw new Error("Error en respuesta de red");
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const filtered = data.filter((p: any) => 
          p.cedularepresentante?.toString().trim().toLowerCase() === userCedula.trim().toLowerCase()
        );
        setPayments(filtered);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar historial. Verifique la configuración del Deployment ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Mis Reportes</h2>
          <p className="text-slate-500">Historial personal de pagos registrados en la institución.</p>
        </div>
        <button 
          onClick={fetchHistory} 
          disabled={loading}
          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100 shadow-sm bg-white"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {!IS_CONFIGURED && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-3xl flex flex-col items-center text-center space-y-3">
          <Settings className="animate-spin-slow" size={40} />
          <div className="space-y-1">
            <h4 className="font-black uppercase text-xs tracking-widest">Acción Requerida</h4>
            <p className="text-sm font-medium">Debe configurar el <b>Deployment ID</b> de Google Apps Script.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Consultando registros...</p>
        </div>
      ) : payments.length === 0 && IS_CONFIGURED ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
            <FileText size={40} className="text-slate-200" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 font-bold text-lg">Sin registros previos</p>
            <p className="text-slate-400 max-w-xs mx-auto">No has reportado ningún pago todavía.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {payments.map((p, idx) => (
            <div key={idx} className="group bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                      Ref: {p.referencia}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                      {p.tipopago}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${
                      p.modopago === 'Pago Total' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {p.modopago === 'Pago Total' ? <Target size={12} /> : <Wallet size={12} />}
                      {p.modopago || 'Reportado'}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Bookmark size={18} className="text-blue-500" />
                      {p.nivel}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-slate-500 space-x-3 bg-slate-50/50 p-2 rounded-xl">
                      <Clock size={16} className="text-slate-400" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Registrado el</p>
                        <p className="font-bold text-slate-700">{formatDate(p.fecharegistro)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 space-x-3 bg-slate-50/50 p-2 rounded-xl">
                      <Calendar size={16} className="text-slate-400" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Fecha del Pago</p>
                        <p className="font-bold text-slate-700">{formatDate(p.fechapago)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:text-right flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Reportado</p>
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">
                    {Number(p.monto).toLocaleString('es-VE', { minimumFractionDigits: 2 })} <span className="text-lg text-blue-400">$</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="pt-6 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Administración Maestro Beltrán Prieto Figueroa.
        </p>
      </footer>
    </div>
  );
};

export default HistoryPage;
