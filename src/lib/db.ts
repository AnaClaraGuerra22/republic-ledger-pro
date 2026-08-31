import { supabase } from "@/integrations/supabase/client";
import type { PagamentoCalculado } from "./calculo";

export interface Moradora {
  id: string;
  nome: string;
  telefone: string;
  tipo_quarto: string;
  ajuste_centavos: number;
  ativo: boolean;
  ordem: number;
}

export interface DespesaFixa {
  chave: string;
  rotulo: string;
  valor_centavos: number;
}

export interface Fechamento {
  id: string;
  mes_referencia: string;
  data_criacao: string;
  aluguel_centavos: number;
  internet_centavos: number;
  seguro_centavos: number;
  condominio_centavos: number;
  luz_centavos: number;
  despesas_proprietaria_centavos: number;
  total_geral_centavos: number;
  valor_imobiliaria_centavos: number;
}

export interface Pagamento {
  id: string;
  fechamento_id: string;
  nome_moradora: string;
  tipo_quarto: string;
  telefone: string;
  ajuste_centavos: number;
  valor_pago_centavos: number;
  ordem: number;
}

export async function fetchMoradoras(): Promise<Moradora[]> {
  const { data, error } = await supabase
    .from("moradoras")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Moradora[];
}

export async function fetchDespesasFixas(): Promise<DespesaFixa[]> {
  const { data, error } = await supabase
    .from("despesas_fixas")
    .select("chave, rotulo, valor_centavos");
  if (error) throw error;
  return (data ?? []) as DespesaFixa[];
}

export async function fetchFechamentos(): Promise<Fechamento[]> {
  const { data, error } = await supabase
    .from("fechamentos")
    .select("*")
    .order("data_criacao", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Fechamento[];
}

export async function fetchFechamento(
  id: string,
): Promise<{ fechamento: Fechamento; pagamentos: Pagamento[] }> {
  const { data, error } = await supabase.from("fechamentos").select("*").eq("id", id).single();
  if (error) throw error;
  const { data: pags, error: e2 } = await supabase
    .from("fechamento_pagamentos")
    .select("*")
    .eq("fechamento_id", id)
    .order("ordem", { ascending: true });
  if (e2) throw e2;
  return { fechamento: data as Fechamento, pagamentos: (pags ?? []) as Pagamento[] };
}

export async function salvarFechamento(params: {
  mes_referencia: string;
  aluguel: number;
  internet: number;
  seguro: number;
  condominio: number;
  luz: number;
  despesasProprietaria: number;
  totalGeral: number;
  valorImobiliaria: number;
  pagamentos: PagamentoCalculado[];
}): Promise<string> {
  const { data, error } = await supabase
    .from("fechamentos")
    .insert({
      mes_referencia: params.mes_referencia,
      aluguel_centavos: params.aluguel,
      internet_centavos: params.internet,
      seguro_centavos: params.seguro,
      condominio_centavos: params.condominio,
      luz_centavos: params.luz,
      despesas_proprietaria_centavos: params.despesasProprietaria,
      total_geral_centavos: params.totalGeral,
      valor_imobiliaria_centavos: params.valorImobiliaria,
    })
    .select("id")
    .single();
  if (error) throw error;

  const fechamentoId = (data as { id: string }).id;

  // Cópia histórica dos dados de cada moradora no momento do fechamento.
  const { error: e2 } = await supabase.from("fechamento_pagamentos").insert(
    params.pagamentos.map((p, i) => ({
      fechamento_id: fechamentoId,
      moradora_id: p.id,
      nome_moradora: p.nome,
      tipo_quarto: p.tipo_quarto,
      telefone: p.telefone,
      ajuste_centavos: p.ajuste_centavos,
      valor_pago_centavos: p.valor_pago_centavos,
      ordem: i,
    })),
  );
  if (e2) throw e2;

  return fechamentoId;
}
