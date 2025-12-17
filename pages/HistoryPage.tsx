
import React, { useState, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL } from '../constants';
import { Search, Loader2, Calendar, User, RefreshCw, FileText, AlertCircle } from 'lucide-react';

interface PaymentRecord {
  timestamp: string;
  fecharegistro: string;
  fechapago: string;
  cedularepresentante: string;
  nivel: string;
  tipopago: string;
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
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read`);
      const data = await response.json();
      // Filtrar para mostrar solo los del usuario logueado
      const filtered = data.filter((p: any) => p.cedularepresentante?.toString().trim() === userCedula.trim());
      setPayments(filtered);
    } catch (err: any) {
      setError("Error al cargar historial.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Mis Reportes</h2>
          <p className="text-slate-500">Historial personal de pagos registrados.</p>
        </div>
        <button onClick={fetchHistory} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : payments.length === 0 ? (
        <div className="bg-white border border-dashed rounded-3xl p-16 text-center space-y-4">
          <FileText size={48} className="mx-auto text-slate-200" />
          <p className="text-slate-500">No has registrado ningún pago todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {payments.map((p, idx) => (
            <div key={idx} className="bg-white border p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Referencia: {p.referencia}</p>
                <p className="font-bold text-slate-800">{p.nivel} - {p.tipopago}</p>
                <div className="flex items-center text-sm text-slate-500 space-x-2">
                  <Calendar size={14} />
                  <span>Pagado el: {p.fechapago ? new Date(p.fechapago).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-600">
                  {Number(p.monto).toLocaleString('es-VE', { minimumFractionDigits: 2 })} $
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
