
import React, { useState, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL, IS_CONFIGURED } from '../constants';
import { Loader2, Calendar, RefreshCw, FileText, AlertCircle, Bookmark, Clock, Settings, Wallet, Target, Sparkles } from 'lucide-react';

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
  const isDemo = localStorage.getItem('is_demo') === 'true';

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    if (isDemo) {
      setTimeout(() => {
        const demoData = JSON.parse(localStorage.getItem('demo_payments') || '[]');
        setPayments(demoData);
        setLoading(false);
      }, 800);
      return;
    }

    if (!IS_CONFIGURED) {
      setError("Script no configurado. Usa el Modo Demo para probar.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read`, { method: 'GET' });
      const data = await response.json();
      if (Array.isArray(data)) {
        const filtered = data.filter((p: any) => p.cedularepresentante?.toString().trim() === userCedula.trim());
        setPayments(filtered);
      }
    } catch (err: any) {
      setError("Error al conectar con el servidor real.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) { return dateStr; }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          {isDemo && (
            <div className="inline-flex items-center space-x-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full mb-1">
              <Sparkles size={10} />
              <span>Vista de Demo</span>
            </div>
          )}
          <h2 className="text-3xl font-extrabold text-slate-900">Mis Reportes</h2>
          <p className="text-slate-500">Historial de pagos realizados.</p>
        </div>
        <button onClick={fetchHistory} disabled={loading} className="p-3 bg-white text-blue-600 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold border border-red-100">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Sincronizando registros...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto"><FileText size={32} className="text-slate-200" /></div>
          <p className="text-slate-400 font-bold">Aún no hay reportes registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {payments.map((p, idx) => (
            <div key={idx} className="group bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full">Ref: {p.referencia}</span>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border flex items-center gap-1.5 ${p.modopago === 'Pago Total' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {p.modopago === 'Pago Total' ? <Target size={12} /> : <Wallet size={12} />}
                      {p.modopago || 'Reportado'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Bookmark size={18} className="text-blue-500" />{p.nivel}</h3>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500"><Clock size={14} /><span>{formatDate(p.fecharegistro)}</span></div>
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500"><Calendar size={14} /><span>Pagado: {formatDate(p.fechapago)}</span></div>
                  </div>
                </div>
                <div className="md:text-right flex flex-col justify-center items-end">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monto Reportado</p>
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">{Number(p.monto).toLocaleString('es-VE', { minimumFractionDigits: 2 })} $</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
