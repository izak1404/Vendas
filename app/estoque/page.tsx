"use client";

import { useState, useEffect } from 'react';
import { Package, ArrowUpCircle, ArrowDownCircle, Search, Loader2, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getProdutos, criarProduto, atualizarEstoque, eliminarProduto } from '../actions/produto';
import { getHistoricoVendas } from '../actions/vendas';

export default function Estoque() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [exportando, setExportando] = useState(false);

  const [codEntrada, setCodEntrada] = useState('');
  const [nomeEntrada, setNomeEntrada] = useState('');
  const [precoEntrada, setPrecoEntrada] = useState('');
  const [qtdEntrada, setQtdEntrada] = useState('');

  const [codSaida, setCodSaida] = useState('');
  const [qtdSaida, setQtdSaida] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const dados = await getProdutos();
      setProdutos(dados);
    } catch (error) {
      toast.error('Erro ao conectar com a base de dados.');
    } finally {
      setCarregando(false);
    }
  };

  const handleEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codEntrada || !qtdEntrada) return toast.error('Preencha os campos obrigatórios.');

    const index = produtos.findIndex(p => p.codigo.toUpperCase() === codEntrada.toUpperCase());
    
    if (index >= 0) {
      const res = await atualizarEstoque(codEntrada.toUpperCase(), Number(qtdEntrada), 'entrada');
      if (res.sucesso) {
        toast.success('Stock atualizado com sucesso!');
        carregarProdutos();
      } else toast.error(res.erro || 'Erro ao atualizar.');
    } else {
      if (!nomeEntrada || !precoEntrada) return toast.error('Para registar um novo produto, preencha o Nome e o Preço.');
      const res = await criarProduto({
        codigo: codEntrada.toUpperCase(),
        nome: nomeEntrada,
        preco: Number(precoEntrada),
        estoque: Number(qtdEntrada)
      });

      if (res.sucesso) {
        toast.success(`Produto ${nomeEntrada} registado!`);
        carregarProdutos();
      } else toast.error(res.erro || 'Erro ao cadastrar produto.');
    }

    setCodEntrada(''); setNomeEntrada(''); setPrecoEntrada(''); setQtdEntrada('');
  };

  const handleSaida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codSaida || !qtdSaida) return;
    const res = await atualizarEstoque(codSaida.toUpperCase(), Number(qtdSaida), 'saida');
    if (res.sucesso) {
      toast.success('Baixa registada com sucesso.');
      carregarProdutos();
      setCodSaida(''); setQtdSaida('');
    } else toast.error(res.erro || 'Erro ao registar baixa.');
  };

  const handleEliminar = (codigo: string, nome: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-slate-800">
          Tem a certeza que deseja eliminar o produto <strong>{nome}</strong>?
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const toastCarregando = toast.loading('A eliminar...');
              
              const res = await eliminarProduto(codigo);
              if (res.sucesso) {
                toast.success('Produto eliminado do sistema.', { id: toastCarregando });
                carregarProdutos();
              } else {
                toast.error(res.erro || 'Erro ao eliminar produto.', { id: toastCarregando });
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity,
      position: 'top-center' 
    });
  };

  const exportarCSV = async () => {
    setExportando(true);
    try {
      const vendas = await getHistoricoVendas();
      
      let csv = "\uFEFF--- RELATÓRIO DE STOCK ATUAL ---\n";
      csv += "CÓDIGO;PRODUTO;PREÇO;QUANTIDADE DISPONÍVEL\n";
      produtos.forEach(p => {
        csv += `${p.codigo};${p.nome};R$ ${p.preco.toFixed(2).replace('.', ',')};${p.estoque}\n`;
      });

      csv += "\n--- HISTÓRICO DE VENDAS ---\n";
      csv += "DATA;FORMA PAGAMENTO;PRODUTO;QTD VENDIDA;TOTAL VENDA\n";
      vendas.forEach((v: any) => {
        const data = new Date(v.criadoEm).toLocaleString('pt-PT');
        v.itens.forEach((item: any) => {
          csv += `${data};${v.formaPagamento.toUpperCase()};${item.produto.nome};${item.quantidade};R$ ${v.total.toFixed(2).replace('.', ',')}\n`;
        });
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'relatorio_ann_cafe.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Ficheiro CSV descarregado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório.');
    } finally {
      setExportando(false);
    }
  };

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-800">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logótipo Ann Café" className="w-12 h-12 object-contain drop-shadow-sm" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Ann Café</h1>
            <p className="text-gray-500 font-medium">Painel de Controlo de Stock</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportarCSV} 
            disabled={exportando || carregando}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {exportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Relatório CSV
          </button>
          <Link href="/pdv" className="bg-white border border-gray-200 text-slate-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Ir para o Caixa (PDV)
          </Link>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-[2] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-800 rounded-t-xl text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5" /> Stock Atual
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por código ou nome..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-700 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="p-0 overflow-x-auto min-h-[300px]">
            {carregando ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>A carregar base de dados...</p>
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <Package className="w-12 h-12 opacity-20 mb-2" />
                <p>Nenhum produto registado.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <th className="p-4 font-semibold">CÓDIGO</th>
                    <th className="p-4 font-semibold">PRODUTO</th>
                    <th className="p-4 font-semibold">PREÇO</th>
                    <th className="p-4 font-semibold">QTD STOCK</th>
                    <th className="p-4 font-semibold">STATUS</th>
                    <th className="p-4 font-semibold text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-700">{p.codigo}</td>
                      <td className="p-4 font-medium">{p.nome}</td>
                      <td className="p-4 text-gray-500">R$ {p.preco.toFixed(2)}</td>
                      <td className="p-4 font-bold text-lg">{p.estoque}</td>
                      <td className="p-4">
                        {p.estoque > 20 ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Adequado</span>
                        ) : p.estoque > 0 ? (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Atenção</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Zerado</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {p.estoque === 0 && (
                          <button 
                            onClick={() => handleEliminar(p.codigo, p.nome)}
                            title="Eliminar produto esgotado"
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5" /> Adicionar / Registar Produto
            </h3>
            <form onSubmit={handleEntrada} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código do Produto</label>
                <input type="text" value={codEntrada} onChange={(e) => setCodEntrada(e.target.value)} placeholder="Ex: CAFE01" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 uppercase font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input type="text" value={nomeEntrada} onChange={(e) => setNomeEntrada(e.target.value)} placeholder="Ex: Café Expresso" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                  <input type="number" step="0.01" value={precoEntrada} onChange={(e) => setPrecoEntrada(e.target.value)} placeholder="Ex: 4.50" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input type="number" min="1" value={qtdEntrada} onChange={(e) => setQtdEntrada(e.target.value)} placeholder="Ex: 50" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <button type="submit" disabled={carregando} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-lg transition-colors mt-2">Guardar no Banco de Dados</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5" /> Baixa Manual (Perda/Quebra)
            </h3>
            <form onSubmit={handleSaida} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input type="text" value={codSaida} onChange={(e) => setCodSaida(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 uppercase font-mono" />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd</label>
                  <input type="number" min="1" value={qtdSaida} onChange={(e) => setQtdSaida(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <button type="submit" disabled={carregando} className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-3 rounded-lg transition-colors mt-2">Deduzir do Banco</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}