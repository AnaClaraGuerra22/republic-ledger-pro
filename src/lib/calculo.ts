
export interface MoradoraCalculo {
  id: string;
  nome: string;
  telefone: string;
  tipo_quarto: string;
  ajuste_centavos: number;
}

export interface EntradaFechamento {
  aluguel: number;
  internet: number;
  seguro: number;
  condominio: number;
  luz: number;
  despesasProprietaria: number;
}

export interface PagamentoCalculado extends MoradoraCalculo {
  valor_pago_centavos: number;
}

export interface ResultadoFechamento {
  totalGeral: number;
  valorImobiliaria: number;
  valorBase: number;
  totalAjustes: number;
  pagamentos: PagamentoCalculado[];
  somaPagamentos: number;
  confere: boolean;
}

export function calcularFechamento(
  entrada: EntradaFechamento,
  moradoras: MoradoraCalculo[],
): ResultadoFechamento {

  const totalGeral =
    entrada.aluguel +
    entrada.condominio +
    entrada.luz +
    entrada.internet +
    entrada.seguro -
    entrada.despesasProprietaria;

  const valorImobiliaria = entrada.aluguel + entrada.seguro - entrada.despesasProprietaria;

 
  const totalAjustes = moradoras.reduce((acc, m) => acc + m.ajuste_centavos, 0);
  const n = moradoras.length;
  const restante = totalGeral - totalAjustes;

  const valorBase = n > 0 ? Math.floor(restante / n) : 0;
  let sobra = n > 0 ? restante - valorBase * n : 0;

  const pagamentos: PagamentoCalculado[] = moradoras.map((m) => {
    const extra = sobra > 0 ? 1 : 0;
    if (sobra > 0) sobra -= 1;
    return { ...m, valor_pago_centavos: valorBase + extra + m.ajuste_centavos };
  });

  const somaPagamentos = pagamentos.reduce((acc, p) => acc + p.valor_pago_centavos, 0);

  return {
    totalGeral,
    valorImobiliaria,
    valorBase,
    totalAjustes,
    pagamentos,
    somaPagamentos,
    confere: somaPagamentos === totalGeral,
  };
}
