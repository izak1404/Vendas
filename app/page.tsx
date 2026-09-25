import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
              <line x1="6" y1="2" x2="6" y2="4"/>
              <line x1="10" y1="2" x2="10" y2="4"/>
              <line x1="14" y1="2" x2="14" y2="4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ann Café</h1>
          <p className="text-slate-500 text-sm mt-1">Sistema de Gestão Integrado</p>
        </div>
        
        {/* Botões / Cards */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/pdv" 
            className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-900 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-lg text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-slate-900 text-lg">Abrir Caixa</h2>
                <p className="text-slate-500 text-xs">Módulo de Vendas (PDV)</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
          
          <Link 
            href="/estoque" 
            className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-900 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-lg text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-slate-900 text-lg">Estoque</h2>
                <p className="text-slate-500 text-xs">Controle de Produtos</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
        
      </div>
    </div>
  );
}