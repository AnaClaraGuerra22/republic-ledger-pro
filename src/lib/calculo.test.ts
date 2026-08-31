import { describe, expect, it } from "vitest";
import { calcularFechamento, type MoradoraCalculo } from "./calculo";

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
