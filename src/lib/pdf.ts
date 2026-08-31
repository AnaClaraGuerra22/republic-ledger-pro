import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCentavos } from "./money";

export interface DadosPdf {
  mesLabel: string;
  aluguel: number;
  condominio: number;
  luz: number;
  internet: number;
  seguro: number;
  despesasProprietaria: number;
  totalGeral: number;
  valorImobiliaria: number;
  pagamentos: { nome: string; tipo_quarto: string; valor_pago_centavos: number }[];
}

const MARROM: [number, number, number] = [139, 115, 91];
const TEXTO: [number, number, number] = [51, 47, 44];
const BEGE: [number, number, number] = [244, 241, 234];

export function gerarPdfFechamento(dados: DadosPdf) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const largura = doc.internal.pageSize.getWidth();
  const margem = 48;

  doc.setFillColor(...BEGE);
  doc.rect(0, 0, largura, 120, "F");

  doc.setTextColor(...MARROM);
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("Fechamento da República", margem, 60);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXTO);
  doc.text(`Mês de referência: ${dados.mesLabel}`, margem, 82);

  doc.setDrawColor(...MARROM);
  doc.setLineWidth(1);
  doc.line(margem, 100, largura - margem, 100);

  autoTable(doc, {
    startY: 140,
    head: [["Resumo das despesas", "Valor"]],
    body: [
      ["Aluguel", formatCentavos(dados.aluguel)],
      ["Condomínio", formatCentavos(dados.condominio)],
      ["Luz", formatCentavos(dados.luz)],
      ["Internet", formatCentavos(dados.internet)],
      ["Seguro", formatCentavos(dados.seguro)],
      ["Despesas da proprietária", `- ${formatCentavos(dados.despesasProprietaria)}`],
    ],
    foot: [["Total geral", formatCentavos(dados.totalGeral)]],
    theme: "plain",
    margin: { left: margem, right: margem },
    styles: { fontSize: 10, cellPadding: 7, textColor: TEXTO },
    headStyles: { fontStyle: "bold", textColor: MARROM, lineWidth: { bottom: 0.8 }, lineColor: MARROM },
    footStyles: { fontStyle: "bold", textColor: MARROM, fillColor: BEGE },
    columnStyles: { 1: { halign: "right" } },
    alternateRowStyles: { fillColor: [252, 251, 248] },
  });

  let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXTO);
  doc.text("Valor da imobiliária", margem, y);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...MARROM);
  doc.text(formatCentavos(dados.valorImobiliaria), largura - margem, y + 2, { align: "right" });

  autoTable(doc, {
    startY: y + 24,
    head: [["Moradora", "Quarto", "Valor"]],
    body: dados.pagamentos.map((p) => [
      p.nome,
      p.tipo_quarto,
      formatCentavos(p.valor_pago_centavos),
    ]),
    foot: [
      [
        "Total dividido",
        "",
        formatCentavos(dados.pagamentos.reduce((a, p) => a + p.valor_pago_centavos, 0)),
      ],
    ],
    theme: "plain",
    margin: { left: margem, right: margem },
    styles: { fontSize: 10, cellPadding: 7, textColor: TEXTO },
    headStyles: { fontStyle: "bold", textColor: MARROM, lineWidth: { bottom: 0.8 }, lineColor: MARROM },
    footStyles: { fontStyle: "bold", textColor: MARROM, fillColor: BEGE },
    columnStyles: { 2: { halign: "right" } },
    alternateRowStyles: { fillColor: [252, 251, 248] },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 30;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(130, 125, 118);
  doc.text(
    "Documento gerado automaticamente pelo sistema Fechamento da República.",
    margem,
    y,
  );

  doc.save(`fechamento-${dados.mesLabel.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
