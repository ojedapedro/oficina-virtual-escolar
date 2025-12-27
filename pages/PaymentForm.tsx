
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const savedMatricula = localStorage.getItem('user_matricula');
    if (savedMatricula && !formData.matricula) {
      setFormData(prev => ({ ...prev, matricula: savedMatricula }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando reporte de pago...");

    if (!formData.matricula) {
      setError("Error: No se encontró matrícula. Cierre sesión e intente de nuevo.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Usamos mode 'no-cors' para evitar errores de red pero aseguramos que el cuerpo sea enviado
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(formData)
      });
      
      // Con no-cors no podemos leer el JSON de respuesta, así que asumimos éxito tras el envío
      console.log("Envío completado satisfactoriamente.");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Error en el envío:", err);
      setError("No se pudo conectar con el servidor administrativo.");
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
          <h2 className="text-3xl font-black text-slate-900">¡Reporte Registrado!</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">
            Su pago ha sido enviado exitosamente y será validado por administración en breve.
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
          <span>Matrícula: {formData.matricula || 'N/A'}</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reportar Pago</h2>
        <p className="text-slate-500 font-medium">Ingrese los detalles de su operación bancaria.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-[1.5rem] flex items-start space-x-3 text-sm font-bold animate-in shake">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Modalidad de Pago *</label>
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cédula del Representante</label>
            <input type="text" readOnly value={formData.cedulaRepresentative} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-slate-400 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matrícula</label>
            <input type="text" readOnly value={formData.matricula} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold text-slate-400 outline-none" />
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Referencia *</label>
            <input type="text" name="reference" required value={formData.reference} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none font-mono" placeholder="Referencia bancaria" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto Pagado ($) *</label>
            <input type="number" name="amount" step="0.01" required value={formData.amount} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-blue-600" placeholder="0.00" />
          </div>

          {formData.type === 'Abono' && (
            <div className="space-y-1.5 animate-in slide-in-from-left-2">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1">Saldo Restante ($) *</label>
              <input type="number" name="pendingBalance" step="0.01" required value={formData.pendingBalance} onChange={handleChange} className="w-full border border-red-100 bg-red-50/30 rounded-xl px-4 py-4 text-sm focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-red-600" placeholder="0.00" />
            </div>
          )}

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas u Observaciones</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-300" size={16} />
              <textarea name="observations" rows={3} value={formData.observations} onChange={handleChange} className="w-full border border-slate-100 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none resize-none transition-all" placeholder="Detalle el pago aquí..." />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl flex items-start space-x-3 border border-slate-100">
          <Info size={20} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Por favor, asegúrese de que la referencia y el monto coincidan exactamente con su comprobante bancario para evitar rechazos.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.8rem] hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 uppercase text-[11px] tracking-widest active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Reportar Pago Ahora</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
