
import React, { useState } from 'react';
import { PAYMENT_METHODS, LEVELS, PAYMENT_TYPES, GOOGLE_SCRIPT_URL } from '../constants';
import { Send, Loader2, CheckCircle2, AlertCircle, Fingerprint, MessageSquare, Wallet, Target, Info } from 'lucide-react';

interface PaymentFormProps {
  userCedula: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ userCedula }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    paymentDate: '',
    cedulaRepresentative: userCedula,
    matricula: localStorage.getItem('user_matricula') || '',
    level: LEVELS[0],
    method: PAYMENT_METHODS[0],
    reference: '',
    amount: '',
    observations: '',
    type: PAYMENT_TYPES[0],
    pendingBalance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Scripts
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Como usamos no-cors no podemos leer la respuesta, pero si no hay error asumimos éxito
      setSubmitted(true);
    } catch (err: any) {
      setError("Error de red al enviar el reporte. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in zoom-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">¡Reporte Enviado!</h2>
          <p className="text-slate-500 mt-2 font-medium">Su pago será verificado por administración en las próximas 48h.</p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
        >
          Nuevo Reporte
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reportar Pago</h2>
        <p className="text-slate-500 font-medium">Complete los 13 campos requeridos para la validación administrativa.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Pago *</label>
            <div className="grid grid-cols-2 gap-4">
              {PAYMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type }))}
                  className={`
                    flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 transition-all
                    ${formData.type === type 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}
                  `}
                >
                  {type === 'Pago Total' ? <Target size={20} /> : <Wallet size={20} />}
                  <span className="font-black text-xs uppercase tracking-widest">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cédula Representante</label>
            <input type="text" readOnly value={formData.cedulaRepresentative} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 outline-none cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matrícula del Estudiante *</label>
            <div className="relative">
              <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" name="matricula" required value={formData.matricula} onChange={handleChange} className="w-full border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" placeholder="ID Estudiante" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Pago *</label>
            <input type="date" name="paymentDate" required value={formData.paymentDate} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel Académico *</label>
            <select name="level" value={formData.level} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none bg-white">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método de Pago *</label>
            <select name="method" value={formData.method} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none bg-white">
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Referencia *</label>
            <input type="text" name="reference" required value={formData.reference} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none" placeholder="Nro Operación" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto Pagado ($) *</label>
            <input type="number" name="amount" step="0.01" required value={formData.amount} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none font-bold text-blue-600" placeholder="0.00" />
          </div>

          {formData.type === 'Abono' && (
            <div className="space-y-1.5 animate-in slide-in-from-left-2">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1">Saldo Pendiente ($) *</label>
              <input type="number" name="pendingBalance" step="0.01" required value={formData.pendingBalance} onChange={handleChange} className="w-full border border-red-100 bg-red-50/30 rounded-xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none font-bold text-red-600" placeholder="¿Cuánto falta pagar?" />
            </div>
          )}

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones / Detalles</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-300" size={16} />
              <textarea name="observations" rows={3} value={formData.observations} onChange={handleChange} className="w-full border border-slate-100 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none resize-none transition-all" placeholder="Indique el mes, nombre del alumno o cualquier detalle relevante..." />
            </div>
          </div>
        </div>

        <div className="bg-blue-50/50 p-5 rounded-3xl flex items-start space-x-3">
          <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
            Al hacer clic en "Reportar Pago", su información será enviada a la base de datos central bajo el identificador de representante <b>{userCedula}</b>. Verifique que la referencia sea correcta para evitar retrasos.
          </p>
        </div>

        <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.8rem] hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 uppercase text-[11px] tracking-widest">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /><span>Reportar Pago</span></>}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
