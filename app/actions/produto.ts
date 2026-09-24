"use server"

import { prisma } from "@/lib/prisma";

// 1. Buscar todos os produtos
export async function getProdutos() {
  return await prisma.produto.findMany({
    orderBy: { nome: 'asc' } // Traz em ordem alfabética
  });
}

// 2. Criar um novo produto
export async function criarProduto(data: { codigo: string, nome: string, preco: number, estoque: number }) {
  // Verifica se o código já existe
  const existe = await prisma.produto.findUnique({ where: { codigo: data.codigo } });
  if (existe) {
    return { erro: "Já existe um produto cadastrado com este código." };
  }

  const produto = await prisma.produto.create({
    data: {
      codigo: data.codigo,
      nome: data.nome,
      preco: data.preco,
      estoque: data.estoque,
    }
  });
  return { sucesso: true, produto };
}

// 3. Atualizar o estoque (Entrada ou Saída)
export async function atualizarEstoque(codigo: string, quantidade: number, operacao: 'entrada' | 'saida') {
  const produto = await prisma.produto.findUnique({ where: { codigo } });
  
  if (!produto) return { erro: "Produto não encontrado." };

  let novoEstoque = produto.estoque;
  
  if (operacao === 'entrada') novoEstoque += quantidade;
  if (operacao === 'saida') {
    if (produto.estoque < quantidade) return { erro: "Estoque insuficiente para esta saída." };
    novoEstoque -= quantidade;
  }

  const atualizado = await prisma.produto.update({
    where: { codigo },
    data: { estoque: novoEstoque }
  });

  return { sucesso: true, produto: atualizado };
}
export async function eliminarProduto(codigo: string) {
  const produto = await prisma.produto.findUnique({ where: { codigo } });
  
  if (!produto) return { erro: "Produto não encontrado." };
  if (produto.estoque > 0) return { erro: "Apenas é possível eliminar produtos com stock a zeros." };
  
  try {
    // 1. Primeiro, apagamos o histórico de vendas vinculado a este produto (pois é um teste)
    await prisma.itemVenda.deleteMany({
      where: { produtoId: produto.id }
    });
    
    // 2. Agora sim, podemos apagar o produto em segurança
    await prisma.produto.delete({ where: { codigo } });
    
    return { sucesso: true };
  } catch (error) {
    return { erro: "Erro ao eliminar o produto da base de dados." };
  }
}