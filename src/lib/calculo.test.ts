import { describe, expect, it } from "vitest";
import {
  ajusteEfetivo,
  calcularFechamento,
  comAjustesEfetivos,
  type MoradoraCalculo,
} from "./calculo";

const moradoras: MoradoraCalculo[] = [
  { id: "1", nome: "Ana", telefone: "1", tipo_quarto: "Suíte", ajuste_centavos: 5000 },
  { id: "2", nome: "Duda", telefone: "2", tipo_quarto: "Quarto maior", ajuste_centavos: 3000 },
  { id: "3", nome: "Luna", telefone: "3", tipo_quarto: "Quarto igual", ajuste_centavos: 1000 },
  { id: "4", nome: "Bianca", telefone: "4", tipo_quarto: "Quarto igual", ajuste_centavos: 1000 },
  { id: "5", nome: "Vanessa", telefone: "5", tipo_quarto: "Quarto igual", ajuste_centavos: 1000 },
];

const fixas = { aluguel: 330000, internet: 9990, seguro: 2353 };

describe("calcularFechamento", () => {
  it("calcula o total geral conforme a regra", () => {
    const r = calcularFechamento(
      { ...fixas, condominio: 50000, luz: 30000, despesasProprietaria: 10000 },
      moradoras,
    );
    expect(r.totalGeral).toBe(330000 + 50000 + 30000 + 9990 + 2353 - 10000);
    expect(r.valorImobiliaria).toBe(330000 + 2353 - 10000);
  });

  it("garante que a soma dos pagamentos é sempre igual ao total geral", () => {
    for (let condominio = 0; condominio <= 200000; condominio += 1237) {
      for (const luz of [0, 9999, 31111, 77777]) {
        for (const prop of [0, 1, 12345]) {
          const r = calcularFechamento(
            { ...fixas, condominio, luz, despesasProprietaria: prop },
            moradoras,
          );
          expect(r.somaPagamentos).toBe(r.totalGeral);
          expect(r.confere).toBe(true);
        }
      }
    }
  });

  it("aplica os ajustes de cada quarto sobre a base", () => {
    const r = calcularFechamento(
      { ...fixas, condominio: 50000, luz: 30000, despesasProprietaria: 0 },
      moradoras,
    );
    const base = r.valorBase;
    expect(r.pagamentos[0]!.valor_pago_centavos - base).toBeGreaterThanOrEqual(5000);
    expect(r.pagamentos[1]!.valor_pago_centavos - base).toBeGreaterThanOrEqual(3000);
    expect(r.pagamentos[4]!.valor_pago_centavos - base).toBeGreaterThanOrEqual(1000);
  });
});

describe("ajustes agendados", () => {
  const ana = {
    ajuste_centavos: 4000,
    ajuste_pendente_centavos: 6000,
    fechamentos_ate_aplicar: 2,
  };
  const semAgendamento = {
    ajuste_centavos: 3000,
    ajuste_pendente_centavos: null,
    fechamentos_ate_aplicar: null,
  };

  it("mantém o valor atual enquanto faltar mais de 1 fechamento", () => {
    expect(ajusteEfetivo(ana)).toBe(4000);
  });

  it("aplica o valor pendente quando falta 1 fechamento ou menos", () => {
    expect(ajusteEfetivo({ ...ana, fechamentos_ate_aplicar: 1 })).toBe(6000);
    expect(ajusteEfetivo({ ...ana, fechamentos_ate_aplicar: 0 })).toBe(6000);
  });

  it("usa o ajuste atual quando não há agendamento", () => {
    expect(ajusteEfetivo(semAgendamento)).toBe(3000);
  });

  it("comAjustesEfetivos altera apenas quem tem agendamento vencendo", () => {
    const efetivas = comAjustesEfetivos([
      { id: "1", ...ana },
      { id: "2", ...semAgendamento },
    ]);
    expect(efetivas[0]!.ajuste_centavos).toBe(4000);
    expect(efetivas[1]!.ajuste_centavos).toBe(3000);
  });
});
