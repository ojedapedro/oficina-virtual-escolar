
import React, { useState, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL } from '../constants';
import { Loader2, Calendar, RefreshCw, FileText, Bookmark, Clock, Target, Wallet, CheckCircle2, AlertCircle, Timer } from 'lucide-react';

interface PaymentRecord {
  id: string;
  timestamp: string;
  paymentDate: string;
  cedulaRepresentative: string;
  matricula: string;
  level: string;
  method: string;
  reference: string;
  amount: number;
  observations: string;
  status: string;
  type: string;
  pendingBalance: number;
}

interface HistoryPageProps {
  userCedula: string;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ userCedula }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const filtered = data.filter((p: any) => 
          p.cedulaRepresentative?.toString().trim() === userCedula.trim()
        );
        setPayments(filtered);
      }
    } catch (err: any) {
      setError("Error al sincronizar con la oficina virtual.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'validado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rechazado': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'validado': return <CheckCircle2 size={12} />;
      case 'rechazado': return <AlertCircle size={12} />;
      default: return <Timer size={12} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mis Reportes</h2>
          <p className="text-slate-500 font-medium">Historial detallado de 13 campos por registro.</p>
        </div>
        <button onClick={fetchHistory} disabled={loading} className="p-4 bg-white text-slate-900 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-5 rounded-[2rem] flex items-center space-x-3 text-sm font-bold border border-red-100">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Cargando base de datos...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-24 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
            <FileText size={32} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold">No se encontraron reportes asociados a esta cédula.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {payments.map((p, idx) => (
            <div key={idx} className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                
                <div className="space-y-5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                      ID: {p.id}
                    </span>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${getStatusStyle(p.status)}`}>
                      {getStatusIcon(p.status)}
                      {p.status || 'Pendiente'}
                    </span>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${p.type === 'Pago Total' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                      {p.type === 'Pago Total' ? <Target size={12} /> : <Wallet size={12} />}
                      {p.type}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Bookmark size={20} className="text-blue-600" />
                      {p.level}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      Matrícula: <span className="text-slate-600">{p.matricula}</span> | Ref: <span className="text-slate-600">{p.reference}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> Registro</p>
                      <p className="text-xs font-bold text-slate-700">{new Date(p.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> Pago</p>
                      <p className="text-xs font-bold text-slate-700">{new Date(p.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Método</p>
                      <p className="text-xs font-bold text-slate-700">{p.method}</p>
                    </div>
                  </div>

                  {p.observations && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">"{p.observations}"</p>
                    </div>
                  )}
                </div>

                <div className="lg:w-48 flex flex-col justify-center lg:items-end lg:border-l lg:border-slate-100 lg:pl-8">
                  <div className="space-y-4">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Pagado</p>
                      <p className="text-3xl font-black text-blue-600 tracking-tighter">
                        ${Number(p.amount).toFixed(2)}
                      </p>
                    </div>
                    
                    {p.type === 'Abono' && (
                      <div className="text-right p-3 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Saldo Pendiente</p>
                        <p className="text-lg font-black text-red-600 tracking-tighter">
                          ${Number(p.pendingBalance).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
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
