import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">☕ Ann Café - Sistema</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          href="/pdv" 
          className="w-full py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center text-xl"
        >
           Abrir Caixa (PDV)
        </Link>
        
        <Link 
          href="/estoque" 
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center text-xl"
        >
           Gerenciar Estoque
        </Link>
      </div>
    </div>
  );
}