"use server"

import { prisma } from "@/lib/prisma";

export async function registrarVenda(dadosDaVenda: {
  total: number;
  formaPagamento: string;
  itens: { id: string; quantidade: number; precoFixo: number }[];
}) {
  try {
    // A Transação garante que, em caso de erro (ex: falta de estoque), nada seja salvo.
    const venda = await prisma.$transaction(async (tx) => {
      
      // 1. Cria a fatura/venda
      const novaVenda = await tx.venda.create({
        data: {
          total: dadosDaVenda.total,
          formaPagamento: dadosDaVenda.formaPagamento,
        }
      });

      // 2. Processa cada item do carrinho
      for (const item of dadosDaVenda.itens) {
        
        const produto = await tx.produto.findUnique({ where: { id: item.id } });
        
        if (!produto) {
          throw new Error(`Um dos produtos não foi encontrado no sistema.`);
        }
        
        // Validação de Estoque (Bloqueia a venda se não houver unidades suficientes)
        if (produto.estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${produto.nome}. (Disponível: ${produto.estoque})`);
        }

        // Subtrai do estoque real
        await tx.produto.update({
          where: { id: item.id },
          data: { estoque: { decrement: item.quantidade } }
        });

        // Regista o item vendido com o preço congelado
        await tx.itemVenda.create({
          data: {
            quantidade: item.quantidade,
            precoFixo: item.precoFixo,
            vendaId: novaVenda.id,
            produtoId: item.id
          }
        });
      }

      return novaVenda;
    });

    return { sucesso: true, venda };
  } catch (error: any) {
    return { erro: error.message || "Erro ao processar a venda." };
  }
}
export async function getHistoricoVendas() {
  return await prisma.venda.findMany({
    include: { itens: { include: { produto: true } } },
    orderBy: { criadoEm: 'desc' }
  });
}