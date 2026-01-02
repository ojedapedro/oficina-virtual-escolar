
import React, { useState, useEffect } from 'react';
import { PAYMENT_METHODS, LEVELS, PAYMENT_TYPES, GOOGLE_SCRIPT_URL } from '../constants';
import { Send, Loader2, CheckCircle2, AlertCircle, Fingerprint, MessageSquare } from 'lucide-react';

interface PaymentFormProps {
  userCedula: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ userCedula }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    action: 'payment', // Añadimos acción explícita
    paymentDate: '',
    cedulaRepresentative: userCedula, 
    matricula: localStorage.getItem('user_matricula') || '',
    nombre: localStorage.getItem('user_nombre') || '',
    level: LEVELS[0],
    method: PAYMENT_METHODS[0],
    reference: '',
    amount: '',
    observations: '',
    type: PAYMENT_TYPES[0],
    pendingBalance: ''
  });

  useEffect(() => {
    const savedMatricula = localStorage.getItem('user_matricula');
    const savedNombre = localStorage.getItem('user_nombre');
    if (savedMatricula && !formData.matricula) {
      setFormData(prev => ({ ...prev, matricula: savedMatricula, nombre: savedNombre || '' }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // POST directo al script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(formData)
      });
      
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError("Error de red: Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">¡Reporte Enviado!</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">
            Su pago ha sido registrado en la hoja <strong>OficinaVirtual</strong> correctamente.
          </p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest shadow-xl"
        >
          Nuevo Reporte
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="flex items-center space-x-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
          <Fingerprint size={14} />
          <span>Validación: Oficina Virtual</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Registro de Pago</h2>
        <p className="text-slate-500 font-medium italic">Destino: Hoja 'OficinaVirtual'</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-[1.5rem] flex items-start space-x-3 text-sm font-bold animate-in shake">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
            <input type="text" readOnly value={formData.nombre} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-slate-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cédula del Representante</label>
            <input type="text" readOnly value={formData.cedulaRepresentative} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-slate-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matrícula Escolar</label>
            <input type="text" readOnly value={formData.matricula} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-slate-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha del Pago *</label>
            <input type="date" name="paymentDate" required value={formData.paymentDate} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel Escolar *</label>
            <select name="level" value={formData.level} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none bg-white">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Canal de Pago *</label>
            <select name="method" value={formData.method} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none bg-white">
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referencia Bancaria *</label>
            <input type="text" name="reference" required value={formData.reference} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none font-mono" placeholder="Número de operación" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto Pagado ($) *</label>
            <input type="number" name="amount" step="0.01" required value={formData.amount} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-blue-600" placeholder="0.00" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Pago *</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none bg-white">
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {formData.type === 'Abono' && (
            <div className="space-y-1.5 animate-in slide-in-from-left-2">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1">Saldo Pendiente ($) *</label>
              <input type="number" name="pendingBalance" step="0.01" required value={formData.pendingBalance} onChange={handleChange} className="w-full border border-red-100 bg-red-50/30 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-red-600" placeholder="0.00" />
            </div>
          )}

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-300" size={16} />
              <textarea name="observations" rows={3} value={formData.observations} onChange={handleChange} className="w-full border border-slate-100 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none resize-none" placeholder="Opcional: Detalles adicionales..." />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.8rem] hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 uppercase text-[11px] tracking-widest"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Conectando con Oficina Virtual...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Confirmar Registro</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
