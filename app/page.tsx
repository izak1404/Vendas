import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        <div className="text-center mb-10">
          <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <span className="text-5xl drop-shadow-md">☕</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Ann Café</h1>
          <p className="text-slate-500 mt-2 font-medium">Sistema de Gestão e Caixa</p>
        </div>
        
        <div className="flex flex-col gap-5">
          <Link 
            href="/pdv" 
            className="group relative w-full flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative flex items-center gap-4">
              <span className="text-4xl bg-black/20 p-3 rounded-xl shadow-inner drop-shadow-md">💰</span>
              <div className="text-left">
                <h2 className="font-bold text-2xl drop-shadow-sm">Abrir Caixa</h2>
                <p className="text-emerald-100 text-sm font-medium">Módulo PDV (Vendas)</p>
              </div>
            </div>
            <span className="text-emerald-100 font-bold text-3xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
          
          <Link 
            href="/estoque" 
            className="group relative w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative flex items-center gap-4">
              <span className="text-4xl bg-black/20 p-3 rounded-xl shadow-inner drop-shadow-md">📦</span>
              <div className="text-left">
                <h2 className="font-bold text-2xl drop-shadow-sm">Estoque</h2>
                <p className="text-blue-200 text-sm font-medium">Controle de Produtos</p>
              </div>
            </div>
            <span className="text-blue-200 font-bold text-3xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>
      
    </div>
  );
}