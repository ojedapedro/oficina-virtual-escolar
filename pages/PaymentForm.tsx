
import React, { useState } from 'react';
import { PAYMENT_TYPES, LEVELS, GOOGLE_SCRIPT_URL } from '../constants';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  userCedula: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ userCedula }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fechaRegistro: new Date().toISOString().split('T')[0],
    fechaPago: '',
    cedula: userCedula, // Usar la cédula del usuario logueado
    nivel: LEVELS[0],
    matricula: '',
    tipoPago: PAYMENT_TYPES[0],
    referencia: '',
    monto: '',
    observaciones: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
        throw new Error("El sistema no está configurado.");
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setSubmitted(true);
    } catch (err: any) {
      setError("Error al enviar el registro.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">¡Registro Exitoso!</h2>
          <p className="text-slate-500">Su pago ha sido reportado satisfactoriamente.</p>
        </div>
        <button 
          onClick={() => { setSubmitted(false); setFormData({ ...formData, fechaPago: '', referencia: '', monto: '' }); }}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Realizar otro registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Registrar Pago</h2>
        <p className="text-slate-500">Formulario exclusivo para el representante: {userCedula}</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Cédula del Representante</label>
            <input 
              type="text" 
              name="cedula"
              readOnly
              value={formData.cedula}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Fecha en la que pagó *</label>
            <input 
              type="date" 
              name="fechaPago"
              required
              value={formData.fechaPago}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Nivel Educativo *</label>
            <select name="nivel" value={formData.nivel} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Tipo de Pago *</label>
            <select name="tipoPago" value={formData.tipoPago} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white">
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Referencia *</label>
            <input type="text" name="referencia" required placeholder="Nro de comprobante" value={formData.referencia} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Monto *</label>
            <input type="number" name="monto" step="0.01" required placeholder="Ej: 50.00" value={formData.monto} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          <span>Enviar Registro</span>
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
