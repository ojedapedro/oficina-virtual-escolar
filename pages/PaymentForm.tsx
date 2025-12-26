
import React, { useState } from 'react';
import { PAYMENT_TYPES, LEVELS, PAYMENT_MODES, GOOGLE_SCRIPT_URL, IS_CONFIGURED } from '../constants';
import { Send, Loader2, CheckCircle2, AlertCircle, Fingerprint, MessageSquare, Wallet, Target, Sparkles } from 'lucide-react';

interface PaymentFormProps {
  userCedula: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ userCedula }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDemo = localStorage.getItem('is_demo') === 'true';
  
  const [formData, setFormData] = useState({
    fechaRegistro: new Date().toISOString(),
    fechaPago: '',
    cedula: userCedula,
    nivel: LEVELS[0],
    matricula: '',
    tipoPago: PAYMENT_TYPES[0],
    modoPago: PAYMENT_MODES[0],
    referencia: '',
    monto: '',
    observaciones: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModoChange = (modo: string) => {
    setFormData(prev => ({ ...prev, modoPago: modo }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isDemo) {
      // Simulación de guardado en Demo
      setTimeout(() => {
        const history = JSON.parse(localStorage.getItem('demo_payments') || '[]');
        const newRecord = { 
          ...formData, 
          fecharegistro: new Date().toISOString(), 
          cedularepresentante: userCedula,
          tipopago: formData.tipoPago,
          modopago: formData.modoPago
        };
        localStorage.setItem('demo_payments', JSON.stringify([newRecord, ...history]));
        setLoading(false);
        setSubmitted(true);
      }, 1500);
      return;
    }

    try {
      if (!IS_CONFIGURED) throw new Error("Sistema no configurado.");

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err: any) {
      setError("Error al enviar. Verifique conexión o configuración.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10">
          <CheckCircle2 size={56} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">¡Registro Exitoso!</h2>
          <p className="text-slate-500 font-medium">Su reporte ha sido enviado y será validado pronto.</p>
        </div>
        <button 
          onClick={() => { setSubmitted(false); setFormData({ ...formData, fechaPago: '', referencia: '', monto: '', matricula: '', observaciones: '' }); }}
          className="px-8 py-3.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 uppercase text-xs tracking-widest"
        >
          Realizar otro registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        {isDemo && (
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
            <Sparkles size={12} />
            <span>Modo Demostración</span>
          </div>
        )}
        <h2 className="text-3xl font-extrabold text-slate-900">Registrar Pago</h2>
        <p className="text-slate-500">Informe los detalles de su transferencia o pago móvil.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <div className="space-y-3">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tipo de Operación *</label>
          <div className="grid grid-cols-2 gap-4">
            {PAYMENT_MODES.map((modo) => (
              <button
                key={modo}
                type="button"
                onClick={() => handleModoChange(modo)}
                className={`
                  flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 transition-all
                  ${formData.modoPago === modo 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}
                `}
              >
                {modo === 'Pago Total' ? <Target size={22} /> : <Wallet size={22} />}
                <span className="font-black text-sm uppercase tracking-tighter">{modo}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cédula del Representante</label>
            <input type="text" readOnly value={formData.cedula} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-400 font-bold outline-none cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Operación *</label>
            <input type="date" name="fechaPago" required value={formData.fechaPago} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel Académico *</label>
            <select name="nivel" value={formData.nivel} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none bg-white">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Referencia *</label>
            <input type="text" name="referencia" required placeholder="Nro de comprobante" value={formData.referencia} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método de Pago *</label>
            <select name="tipoPago" value={formData.tipoPago} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none bg-white">
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto Pagado ($) *</label>
            <input type="number" name="monto" step="0.01" required placeholder="0.00" value={formData.monto} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none font-bold text-blue-600" />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones</label>
            <textarea name="observaciones" rows={2} placeholder="Indique mes o motivo del pago..." value={formData.observaciones} onChange={handleChange} className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none resize-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-blue-600/20 disabled:opacity-50 uppercase text-xs tracking-widest">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /><span>Enviar Reporte</span></>}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
