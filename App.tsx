
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  ClipboardCheck, 
  HelpCircle, 
  Menu, 
  X,
  History,
  LogOut,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import HomePage from './pages/HomePage';
import PaymentForm from './pages/PaymentForm';
import AccountsPage from './pages/AccountsPage';
import SupportPage from './pages/SupportPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';

const LOGO_URL = "https://i.ibb.co/FbHJbvVT/images.png";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<string | null>(localStorage.getItem('user_cedula'));

  const logout = () => {
    localStorage.removeItem('user_cedula');
    setUser(null);
  };

  const NavLink = ({ to, icon: Icon, children, onClick }: any) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300"
    >
      <div className="flex items-center space-x-3">
        <Icon size={18} className="group-hover:text-amber-400 transition-colors" />
        <span className="font-semibold text-sm">{children}</span>
      </div>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </Link>
  );

  if (!user) {
    return <LoginPage onLoginSuccess={(cedula) => setUser(cedula)} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white p-1" />
            <span className="text-white font-bold tracking-tight">Oficina Virtual</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-0 z-40 sidebar-gradient transform transition-transform md:relative md:translate-x-0 w-72 shadow-2xl
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-8">
            <div className="hidden md:flex items-center space-x-4 mb-10">
              <img src={LOGO_URL} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-xl p-1 shadow-lg" />
              <div>
                <h1 className="text-white text-[11px] font-extrabold leading-tight tracking-tight uppercase opacity-60">Colegio</h1>
                <p className="text-amber-400 text-sm font-black uppercase tracking-tighter leading-none">M. Beltrán Prieto F.</p>
              </div>
            </div>

            {/* Perfil de Usuario */}
            <div className="mb-10 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <UserIcon size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Representante</p>
                  <p className="text-sm font-bold text-white truncate">{user}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5">
              <NavLink to="/" icon={Home} onClick={() => setIsMenuOpen(false)}>Inicio</NavLink>
              <NavLink to="/cuentas" icon={CreditCard} onClick={() => setIsMenuOpen(false)}>Datos Bancarios</NavLink>
              <NavLink to="/registro" icon={ClipboardCheck} onClick={() => setIsMenuOpen(false)}>Reportar Pago</NavLink>
              <NavLink to="/historial" icon={History} onClick={() => setIsMenuOpen(false)}>Mi Historial</NavLink>
              <NavLink to="/soporte" icon={HelpCircle} onClick={() => setIsMenuOpen(false)}>Asistente Virtual</NavLink>
            </nav>

            <div className="mt-8 pt-8 border-t border-white/5">
              <button 
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all w-full text-left font-bold text-sm"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            <div className="mt-auto pt-6 text-[10px] text-slate-500 text-center font-medium">
              © 2025 M. Beltrán Prieto Figueroa <br/>
              Gestión Administrativa
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cuentas" element={<AccountsPage />} />
              <Route path="/registro" element={<PaymentForm userCedula={user} />} />
              <Route path="/historial" element={<HistoryPage userCedula={user} />} />
              <Route path="/soporte" element={<SupportPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
