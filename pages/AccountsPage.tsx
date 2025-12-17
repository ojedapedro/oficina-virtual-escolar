
import React from 'react';
import { SCHOOL_ACCOUNTS } from '../constants';
import { Building2, Smartphone, Mail, Copy, Check } from 'lucide-react';

const AccountsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Cuentas Bancarias</h2>
        <p className="text-slate-500">Utilice estos datos para realizar sus pagos y luego repórtelos en la sección de registro.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCHOOL_ACCOUNTS.map((account, idx) => (
          <div key={idx} className="bg-white border rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-colors relative">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${account.bank.includes('Zelle') ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                {account.bank.includes('Zelle') ? <Mail size={24} /> : account.phone ? <Smartphone size={24} /> : <Building2 size={24} />}
              </div>
              <button 
                onClick={() => handleCopy(account.accountNumber || account.phone || account.email || "", idx)}
                className="text-slate-400 hover:text-blue-600 transition-colors p-2"
                title="Copiar dato principal"
              >
                {copiedIndex === idx ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-4">{account.bank}</h3>
            
            <div className="space-y-2 text-sm">
              {account.accountNumber && (
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Número de Cuenta:</span>
                  <span className="font-mono text-slate-700">{account.accountNumber}</span>
                </div>
              )}
              {account.phone && (
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="font-semibold text-slate-700">{account.phone}</span>
                </div>
              )}
              {account.email && (
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-700">{account.email}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Titular:</span>
                <span className="text-slate-700">{account.holder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rif / Cédula:</span>
                <span className="text-slate-700">{account.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-800 text-sm">
        <div className="mt-0.5">⚠️</div>
        <p>Asegúrese de verificar los datos antes de transferir. El colegio no se hace responsable por errores en la digitación de números de cuenta.</p>
      </div>
    </div>
  );
};

export default AccountsPage;
