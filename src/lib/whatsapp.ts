import { formatCentavos } from "./money";

/**
 * Geração das mensagens individuais.
 * Arquitetura preparada para uma futura integração com a API oficial
 * do WhatsApp Business: `montarMensagem` é independente do canal de envio.
 */
export function montarMensagem(params: {
  nome: string;
  mes: string;
  valorCentavos: number;
}): string {
  return [
    `Oi, ${params.nome}!`,
    "",
    `O fechamento das contas da república referente a ${params.mes} foi realizado.`,
    "",
    "Valor que você deve pagar:",
    "",
    formatCentavos(params.valorCentavos),
    "",
    "Se quiser conferir todos os detalhes, o fechamento completo está disponível no PDF.",
  ].join("\n");
}

export function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

/** Link oficial wa.me com a mensagem pré-preenchida (não envia sozinho). */
export function linkWhatsApp(telefone: string, mensagem: string): string {
  return `https://wa.me/${normalizarTelefone(telefone)}?text=${encodeURIComponent(mensagem)}`;
}
