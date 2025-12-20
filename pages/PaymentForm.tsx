
import React, { useState } from 'react';
import { PAYMENT_TYPES, LEVELS, GOOGLE_SCRIPT_URL } from '../constants';
import { Send, Loader2, CheckCircle2, AlertCircle, Fingerprint, MessageSquare } from 'lucide-react';

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

      // Enviar datos al script de Google
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Nota: Al usar 'no-cors', no podemos leer la respuesta pero el envío se realiza.
      // Suponemos éxito si no hay excepción de red.
      setSubmitted(true);
    } catch (err: any) {
      setError("Error al enviar el registro. Verifique su conexión.");
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
          <p className="text-slate-500">Su pago ha sido reportado satisfactoriamente para su validación.</p>
        </div>
        <button 
          onClick={() => { setSubmitted(false); setFormData({ ...formData, fechaPago: '', referencia: '', monto: '', matricula: '', observaciones: '' }); }}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
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
        <p className="text-slate-500">Complete los datos del comprobante de pago para procesar su registro.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cédula (Readonly) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Cédula del Representante</label>
            <input 
              type="text" 
              name="cedula"
              readOnly
              value={formData.cedula}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 outline-none cursor-not-allowed font-medium" 
            />
          </div>

          {/* Fecha Pago */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Fecha en la que pagó *</label>
            <input 
              type="date" 
              name="fechaPago"
              required
              value={formData.fechaPago}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          {/* Nivel */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Nivel Educativo *</label>
            <select 
              name="nivel" 
              value={formData.nivel} 
              onChange={handleChange} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Matrícula (Opcional - NUEVO) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Matrícula del Estudiante (Opcional)</label>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                name="matricula" 
                placeholder="Ej: CSJ-2025-001" 
                value={formData.matricula} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              />
            </div>
          </div>

          {/* Tipo de Pago */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Método de Pago *</label>
            <select 
              name="tipoPago" 
              value={formData.tipoPago} 
              onChange={handleChange} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Referencia */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Número de Referencia *</label>
            <input 
              type="text" 
              name="referencia" 
              required 
              placeholder="Nro de comprobante" 
              value={formData.referencia} 
              onChange={handleChange} 
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Monto Pagado *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                name="monto" 
                step="0.01" 
                required 
                placeholder="0.00" 
                value={formData.monto} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono" 
              />
            </div>
          </div>

          {/* Observaciones (Opcional) */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Observaciones Adicionales</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea 
                name="observaciones" 
                rows={2}
                placeholder="Indique cualquier detalle adicional sobre su pago..." 
                value={formData.observaciones} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Procesando envío...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Reportar Pago</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
