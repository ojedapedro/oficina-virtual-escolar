
import React, { useState } from 'react';
import { GOOGLE_SCRIPT_URL } from '../constants';
import { Lock, User, Loader2, AlertCircle, BadgeCheck } from 'lucide-react';

const LOGO_URL = "https://i.ibb.co/FbHJbvVT/images.png";

interface LoginPageProps {
  onLoginSuccess: (cedula: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=login&user=${encodeURIComponent(cedula)}&pass=${encodeURIComponent(password)}`);
      const data = await response.json();
      
      if (data.result === 'success') {
        localStorage.setItem('user_cedula', cedula);
        localStorage.setItem('user_matricula', data.matricula || '');
        localStorage.setItem('user_nombre', data.nombre || '');
        onLoginSuccess(cedula);
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err: any) {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();
    try {
      const payload = { action: 'register', cedula, clave: password, nombre, matricula };
      await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors',
        body: JSON.stringify(payload) 
      });
      setSuccess("¡Cuenta creada! Ya puede iniciar sesión.");
      setIsRegistering(false);
      // Limpiar campos
      setNombre('');
      setMatricula('');
    } catch (err: any) {
      setError("Error al procesar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 relative">
      <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-900 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-amber-900 rounded-full blur-[150px] opacity-30"></div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[1.8rem] shadow-2xl mb-4 p-4">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Oficina Virtual</h1>
          <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">M. Beltrán Prieto Figueroa</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => { setIsRegistering(false); resetMessages(); }} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${!isRegistering ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Ingresar</button>
            <button onClick={() => { setIsRegistering(true); resetMessages(); }} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${isRegistering ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Unirse</button>
          </div>

          {(error || success) && (
            <div className={`p-4 rounded-2xl flex items-center space-x-3 text-[11px] font-bold animate-in slide-in-from-top-2 ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {error ? <AlertCircle size={16} /> : <BadgeCheck size={16} />}
              <span className="flex-1">{error || success}</span>
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Nombre del Representante</label>
                  <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Matrícula Escolar</label>
                  <input type="text" required value={matricula} onChange={(e) => setMatricula(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Ej: 2025001" />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Cédula de Identidad</label>
              <input type="text" required value={cedula} onChange={(e) => setCedula(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Solo números o formato local" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 text-[10px] uppercase tracking-widest disabled:opacity-50 mt-4 shadow-xl">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>{isRegistering ? 'Registrar Ahora' : 'Entrar al Panel'}</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
