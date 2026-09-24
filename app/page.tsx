import Link from 'next/link';
import { ShoppingCart, Package, Store } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans text-slate-800">
      <div className="text-center mb-10">
        <div className="bg-blue-600 p-4 rounded-2xl inline-block mb-4 shadow-lg shadow-blue-200">
          <Store className="text-white w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Ann Café</h1>
        <p className="text-gray-500">Selecione o módulo que deseja acessar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Card do PDV */}
        <Link href="/pdv" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center text-center">
          <div className="bg-blue-50 p-6 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
            <ShoppingCart className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Ponto de Venda (PDV)</h2>
          <p className="text-gray-500">Acesse o caixa para realizar vendas e pagamentos.</p>
        </Link>

        {/* Card do Estoque */}
        <Link href="/estoque" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:green-blue-300 transition-all group flex flex-col items-center text-center">
          <div className="bg-green-50 p-6 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
            <Package className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Gestão de Estoque</h2>
          <p className="text-gray-500">Cadastre produtos, dê entradas e registre perdas.</p>
        </Link>
      </div>
    </div>
  );
}