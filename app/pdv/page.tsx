"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, QrCode, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProdutos } from '../actions/produto';
import { registrarVenda } from '../actions/vendas';
import Link from 'next/link';

export default function PDV() {
  const [produtosDB, setProdutosDB] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('dinheiro');
  const [carregando, setCarregando] = useState(true);
  const [processandoVenda, setProcessandoVenda] = useState(false);

  // Carrega os produtos reais do banco de dados ao abrir o caixa
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const dados = await getProdutos();
      setProdutosDB(dados);
    } catch (error) {
      toast.error('Erro ao carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    const produto = produtosDB.find(p => p.codigo.toUpperCase() === searchQuery.toUpperCase());
    
    if (produto) {
      if (produto.estoque <= 0) {
        toast.error(`Produto ${produto.nome} está sem estoque!`);
        setSearchQuery('');
        return;
      }

      const itemExistente = cart.find(item => item.id === produto.id);
      if (itemExistente) {
        if (itemExistente.qty + 1 > produto.estoque) {
          toast.error(`Apenas ${produto.estoque} unidades disponíveis em estoque.`);
          return;
        }
        setCart(cart.map(item => 
          item.id === produto.id ? { ...item, qty: item.qty + 1 } : item
        ));
      } else {
        setCart([...cart, { ...produto, qty: 1 }]);
      }
      setSearchQuery('');
    } else {
      toast.error('Código não encontrado no sistema.');
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    const produtoBase = produtosDB.find(p => p.id === id);
    
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        
        // Bloqueia adição se passar do estoque atual
        if (delta > 0 && produtoBase && newQty > produtoBase.estoque) {
          toast.error(`Limite de estoque atingido (${produtoBase.estoque} un)`);
          return item;
        }
        
        return { ...item, qty: newQty > 0 ? newQty : 0 };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.preco * item.qty), 0);

  const handleFinalizarVenda = async () => {
    if (cart.length === 0) return toast.error('O carrinho está vazio.');
    
    setProcessandoVenda(true);
    const toastId = toast.loading('A processar venda e a deduzir estoque...');

    // Prepara os dados para o banco
    const itensVenda = cart.map(item => ({
      id: item.id,
      quantidade: item.qty,
      precoFixo: item.preco
    }));

    const res = await registrarVenda({
      total: total,
      formaPagamento: metodoPagamento,
      itens: itensVenda
    });

    if (res.sucesso) {
      toast.success('Venda finalizada! Estoque deduzido.', { id: toastId });
      setCart([]);
      setMetodoPagamento('dinheiro');
      carregarProdutos(); // Recarrega para atualizar os números de estoque na tela
    } else {
      toast.error(res.erro || 'Erro ao finalizar venda.', { id: toastId });
    }
    
    setProcessandoVenda(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6 font-sans text-slate-800">
      
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="text-blue-600" />
              Ponto de Venda (Ann Café)
            </h1>
            <Link href="/" className="text-sm text-blue-600 hover:underline font-medium">Voltar ao Dashboard</Link>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bipe ou digite o código do produto..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-all"
                autoFocus
                disabled={carregando}
              />
            </div>
            <button type="submit" disabled={carregando} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Adicionar
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
          <h2 className="text-lg font-semibold mb-4">Catálogo de Produtos</h2>
          {carregando ? (
             <div className="flex flex-col items-center justify-center h-40 text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin mb-2" />
               <p>A carregar produtos do banco...</p>
             </div>
          ) : produtosDB.length === 0 ? (
             <p className="text-gray-500 text-center py-10">Nenhum produto cadastrado no estoque.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {produtosDB.map(p => (
                <div 
                  key={p.id} 
                  className={`p-4 border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${p.estoque === 0 ? 'bg-red-50 opacity-60' : 'bg-gray-50 hover:bg-gray-100'}`} 
                  onClick={() => { if(p.estoque > 0) setSearchQuery(p.codigo); else toast.error('Sem estoque!'); }}
                >
                  <div>
                    <p className="font-medium text-slate-700">{p.nome}</p>
                    <p className="text-sm text-gray-500">Cód: {p.codigo} • <span className={p.estoque > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{p.estoque} un</span></p>
                  </div>
                  <p className="font-bold text-blue-600">R$ {p.preco.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-3rem)] sticky top-6">
        <div className="p-6 border-b border-gray-100 bg-slate-800 rounded-t-xl">
          <h2 className="text-xl font-bold text-white">Venda Atual</h2>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart className="w-12 h-12 opacity-50" />
              <p>O carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-slate-800">{item.nome}</span>
                    <span className="font-bold text-slate-700">R$ {(item.preco * item.qty).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-slate-600 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded text-slate-600 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-medium">Total da Venda</span>
            <span className="text-3xl font-bold text-blue-600">R$ {total.toFixed(2)}</span>
          </div>

          <p className="text-sm text-gray-500 mb-3 font-medium">Forma de Pagamento</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button onClick={() => setMetodoPagamento('dinheiro')} className={`flex flex-col items-center gap-2 p-3 border rounded-lg font-medium transition-colors ${metodoPagamento === 'dinheiro' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-100 text-slate-600'}`}>
              <Banknote className="w-5 h-5" /> Dinheiro
            </button>
            <button onClick={() => setMetodoPagamento('cartão')} className={`flex flex-col items-center gap-2 p-3 border rounded-lg font-medium transition-colors ${metodoPagamento === 'cartão' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-100 text-slate-600'}`}>
              <CreditCard className="w-5 h-5" /> Cartão
            </button>
            <button onClick={() => setMetodoPagamento('pix')} className={`flex flex-col items-center gap-2 p-3 border rounded-lg font-medium transition-colors ${metodoPagamento === 'pix' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-100 text-slate-600'}`}>
              <QrCode className="w-5 h-5" /> Pix
            </button>
          </div>
          
          <button 
            onClick={handleFinalizarVenda}
            disabled={processandoVenda || cart.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm shadow-green-200 transform active:scale-[0.98]"
          >
            {processandoVenda ? 'A PROCESSAR...' : 'FINALIZAR VENDA'}
          </button>
        </div>
      </div>
    </div>
  );
}