
export function formatCentavos(centavos: number): string {
  const negativo = centavos < 0;
  const abs = Math.abs(Math.round(centavos));
  const reais = Math.floor(abs / 100);
  const cents = abs % 100;
  const reaisStr = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negativo ? "-" : ""}R$ ${reaisStr},${cents.toString().padStart(2, "0")}`;
}

/** Converte texto digitado (máscara brasileira) em centavos. */
export function parseToCentavos(texto: string): number {
  const digits = texto.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}

/** Máscara progressiva: usuário digita apenas números, formata como 1.234,56 */
export function maskCurrency(texto: string): string {
  const centavos = parseToCentavos(texto);
  const reais = Math.floor(centavos / 100);
  const cents = centavos % 100;
  const reaisStr = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${reaisStr},${cents.toString().padStart(2, "0")}`;
}

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];


export function formatMesReferencia(valor: string): string {
  const [ano, mes] = valor.split("-");
  const idx = Number(mes) - 1;
  if (!ano || Number.isNaN(idx) || !MESES[idx]) return valor;
  return `${MESES[idx]} de ${ano}`;
}

export function formatData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
