import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CampoMoeda, centavosDoCampo } from "@/components/CampoMoeda";
import { ResultadoFechamento, type DadosResultado } from "@/components/ResultadoFechamento";
import { calcularFechamento, comAjustesEfetivos } from "@/lib/calculo";
import { atualizarDespesaFixa, fetchDespesasFixas, fetchMoradoras, salvarFechamento } from "@/lib/db";
import { formatCentavos, formatMesReferencia, maskCurrency, parseToCentavos } from "@/lib/money";
import { Pencil } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Novo Fechamento — Fechamento da República" },
      {
        name: "description",
        content:
          "Calcule o fechamento mensal das contas da república e veja quanto cada moradora deve pagar.",
      },
      { property: "og:title", content: "Novo Fechamento — Fechamento da República" },
      {
        property: "og:description",
        content: "Calcule o fechamento mensal das contas da república.",
      },
    ],
  }),
  component: NovoFechamento,
});

function mesAtual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function NovoFechamento() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mes, setMes] = useState(mesAtual());
  const [condominio, setCondominio] = useState("");
  const [luz, setLuz] = useState("");
  const [proprietarias, setProprietarias] = useState<string[]>([""]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<DadosResultado | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const moradorasQuery = useQuery({ queryKey: ["moradoras"], queryFn: fetchMoradoras });
  const fixasQuery = useQuery({ queryKey: ["despesas-fixas"], queryFn: fetchDespesasFixas });

  const fixas = useMemo(() => {
    const map = new Map((fixasQuery.data ?? []).map((f) => [f.chave, f]));
    return {
      aluguel: map.get("aluguel")?.valor_centavos ?? 0,
      internet: map.get("internet")?.valor_centavos ?? 0,
      seguro: map.get("seguro")?.valor_centavos ?? 0,
    };
  }, [fixasQuery.data]);

  const agendadas = useMemo(
    () => (moradorasQuery.data ?? []).filter((m) => m.fechamentos_ate_aplicar !== null),
    [moradorasQuery.data],
  );

  const calcular = () => {
    const novosErros: Record<string, string> = {};
    if (!mes) novosErros["mes"] = "Selecione o mês de referência.";
    if (!condominio) novosErros["condominio"] = "Informe o valor do condomínio.";
    if (!luz) novosErros["luz"] = "Informe o valor da conta de luz.";

    const moradoras = moradorasQuery.data ?? [];
    if (moradoras.length === 0) {
      toast.error("Nenhuma moradora cadastrada.");
      return;
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      toast.error("Revise os campos destacados.");
      return;
    }

    const entrada = {
      aluguel: fixas.aluguel,
      internet: fixas.internet,
      seguro: fixas.seguro,
      condominio: centavosDoCampo(condominio),
      luz: centavosDoCampo(luz),
      despesasProprietaria: proprietarias.reduce((t, v) => t + centavosDoCampo(v), 0),
    };

    const r = calcularFechamento(entrada, comAjustesEfetivos(moradoras));

    if (r.totalGeral <= 0) {
      toast.error("O total geral ficou zerado ou negativo. Confira os valores informados.");
      return;
    }

    setResultado({
      mesLabel: formatMesReferencia(mes),
      ...entrada,
      totalGeral: r.totalGeral,
      valorImobiliaria: r.valorImobiliaria,
      pagamentos: r.pagamentos.map((p) => ({
        nome: p.nome,
        tipo_quarto: p.tipo_quarto,
        telefone: p.telefone,
        valor_pago_centavos: p.valor_pago_centavos,
      })),
    });
    setSalvo(false);
    toast.success("Fechamento calculado.");
  };

  const salvar = async () => {
    if (!resultado) return;
    const moradoras = moradorasQuery.data ?? [];
    const efetivas = comAjustesEfetivos(moradoras);

    setSalvando(true);
    try {
      await salvarFechamento({
        mes_referencia: mes,
        aluguel: resultado.aluguel,
        internet: resultado.internet,
        seguro: resultado.seguro,
        condominio: resultado.condominio,
        luz: resultado.luz,
        despesasProprietaria: resultado.despesasProprietaria,
        totalGeral: resultado.totalGeral,
        valorImobiliaria: resultado.valorImobiliaria,
        pagamentos: resultado.pagamentos.map((p, i) => ({
          id: moradoras[i]?.id ?? "",
          nome: p.nome,
          telefone: p.telefone,
          tipo_quarto: p.tipo_quarto,
          ajuste_centavos: efetivas[i]?.ajuste_centavos ?? 0,
          valor_pago_centavos: p.valor_pago_centavos,
        })),
      });
      setSalvo(true);
      queryClient.invalidateQueries({ queryKey: ["moradoras"] });
      toast.success("Fechamento salvo no histórico.");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar o fechamento.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl">Fechamento da República</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Organize as contas da casa de forma simples e transparente.
        </p>
      </header>

      <section className="panel p-6 sm:p-8">
        <p className="eyebrow">Mês de referência</p>
        <div className="mt-4 max-w-xs">
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="h-12 w-full rounded-sm border border-input bg-card px-3 text-base text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
          {erros["mes"] ? <p className="mt-2 text-xs text-destructive">{erros["mes"]}</p> : null}
        </div>
        {mes ? (
          <p className="mt-3 text-sm text-muted-foreground">{formatMesReferencia(mes)}</p>
        ) : null}
      </section>

      <section className="panel p-6 sm:p-8">
        <p className="eyebrow">Despesas fixas</p>
        <dl className="mt-4 divide-y divide-border text-sm">
          <ItemFixo chave="aluguel" rotulo="Aluguel" valor={fixas.aluguel} />
          <ItemFixo chave="internet" rotulo="Internet" valor={fixas.internet} />
          <ItemFixo chave="seguro" rotulo="Seguro" valor={fixas.seguro} />
        </dl>
      </section>

      {agendadas.length > 0 ? (
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow">Ajuste agendado</p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {agendadas.map((m) => (
              <li key={m.id}>
                {m.tipo_quarto} ({m.nome}): {formatCentavos(m.ajuste_centavos)} →{" "}
                {formatCentavos(m.ajuste_pendente_centavos ?? m.ajuste_centavos)}{" "}
                {m.fechamentos_ate_aplicar !== null && m.fechamentos_ate_aplicar > 1
                  ? `no ${m.fechamentos_ate_aplicar}º fechamento a partir de agora`
                  : "já no próximo fechamento"}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="panel p-6 sm:p-8">
        <p className="eyebrow">Despesas do mês</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <CampoMoeda
            id="condominio"
            label="Condomínio"
            valor={condominio}
            onChange={setCondominio}
            erro={erros["condominio"]}
          />
          <CampoMoeda
            id="luz"
            label="Luz"
            valor={luz}
            onChange={setLuz}
            erro={erros["luz"]}
          />
          <div className="space-y-2">
            {proprietarias.map((v, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1">
                  <CampoMoeda
                    id={`proprietaria-${i}`}
                    label={i === 0 ? "Despesas da proprietária" : `Despesa ${i + 1}`}
                    valor={v}
                    onChange={(t) => setProprietarias((a) => a.map((x, j) => (j === i ? t : x)))}
                    erro={i === 0 ? erros["proprietaria"] : undefined}
                  />
                </div>
                {proprietarias.length > 1 ? (
                  <button
                    type="button"
                    aria-label={`Remover despesa ${i + 1}`}
                    onClick={() => setProprietarias((a) => a.filter((_, j) => j !== i))}
                    className="h-12 w-10 rounded-sm border border-input text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProprietarias((a) => [...a, ""])}
              className="w-full rounded-sm border border-dashed border-primary/50 py-2 text-sm text-primary hover:bg-primary/5"
            >
              + Adicionar despesa
            </button>
            {proprietarias.length > 1 ? (
              <p className="text-right text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground tabular-nums">{formatCentavos(proprietarias.reduce((t, x) => t + centavosDoCampo(x), 0))}</span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={calcular}
        disabled={moradorasQuery.isLoading || fixasQuery.isLoading}
        className="h-14 w-full rounded-sm bg-primary text-base font-semibold tracking-wide text-primary-foreground transition-colors hover:brightness-90 disabled:opacity-60"
      >
        Calcular Fechamento
      </button>

      {resultado ? (
        <ResultadoFechamento
          dados={resultado}
          acoes={
            <>
              <button
                type="button"
                onClick={salvar}
                disabled={salvando || salvo}
                className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-90 disabled:opacity-60"
              >
                {salvo ? "Fechamento salvo ✓" : salvando ? "Salvando..." : "Salvar Fechamento"}
              </button>
              {salvo ? (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/historico" })}
                  className="inline-flex h-12 items-center justify-center rounded-sm border border-border px-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Ver histórico
                </button>
              ) : null}
            </>
          }
        />
      ) : null}
    </div>
  );
}

function ItemFixo({ chave, rotulo, valor }: { chave: string; rotulo: string; valor: number }) {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState("");
  const [salvandoFixo, setSalvandoFixo] = useState(false);
  const novo = parseToCentavos(texto);

  const salvarFixo = async () => {
    setSalvandoFixo(true);
    try {
      await atualizarDespesaFixa(chave, novo);
      await queryClient.invalidateQueries({ queryKey: ["despesas-fixas"] });
      toast.success(`${rotulo} atualizado para ${formatCentavos(novo)}.`);
      setEditando(false);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar o novo valor.");
    } finally {
      setSalvandoFixo(false);
    }
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted-foreground">{rotulo}</dt>
        <dd className="flex items-center gap-2 tabular-nums">
          {formatCentavos(valor)}
          <button
            type="button"
            aria-label={`Editar ${rotulo}`}
            onClick={() => {
              setTexto(formatCentavos(valor).replace(/^R\$\s?/, ""));
              setEditando((v) => !v);
            }}
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </dd>
      </div>
      {editando ? (
        <div className="mt-3 space-y-3 rounded-sm border border-border bg-background p-3">
          <input
            aria-label={`Novo valor de ${rotulo}`}
            inputMode="numeric"
            value={texto}
            onChange={(e) => setTexto(maskCurrency(e.target.value))}
            className="h-10 w-full rounded-sm border border-input bg-card px-3 text-right tabular-nums outline-none focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Deseja salvar {formatCentavos(novo)} como o novo valor padrão de {rotulo.toLowerCase()}?
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditando(false)} className="rounded-sm px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
              Cancelar
            </button>
            <button
              type="button"
              disabled={salvandoFixo || novo <= 0}
              onClick={salvarFixo}
              className="rounded-sm bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {salvandoFixo ? "Salvando..." : "Sim, salvar"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
