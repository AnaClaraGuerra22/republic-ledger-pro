import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CampoMoeda, centavosDoCampo } from "@/components/CampoMoeda";
import { ResultadoFechamento, type DadosResultado } from "@/components/ResultadoFechamento";
import { calcularFechamento } from "@/lib/calculo";
import { fetchDespesasFixas, fetchMoradoras, salvarFechamento } from "@/lib/db";
import { formatCentavos, formatMesReferencia } from "@/lib/money";

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
  const [mes, setMes] = useState(mesAtual());
  const [condominio, setCondominio] = useState("");
  const [luz, setLuz] = useState("");
  const [proprietaria, setProprietaria] = useState("");
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
      despesasProprietaria: centavosDoCampo(proprietaria),
    };

    const r = calcularFechamento(entrada, moradoras);

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
    const ok = window.confirm(
      `Salvar o fechamento de ${resultado.mesLabel} no valor total de ${formatCentavos(resultado.totalGeral)}?`,
    );
    if (!ok) return;

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
          ajuste_centavos: moradoras[i]?.ajuste_centavos ?? 0,
          valor_pago_centavos: p.valor_pago_centavos,
        })),
      });
      setSalvo(true);
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
          <ItemFixo rotulo="Aluguel" valor={fixas.aluguel} />
          <ItemFixo rotulo="Internet" valor={fixas.internet} />
          <ItemFixo rotulo="Seguro" valor={fixas.seguro} />
        </dl>
      </section>

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
          <CampoMoeda
            id="proprietaria"
            label="Despesas da proprietária"
            valor={proprietaria}
            onChange={setProprietaria}
            erro={erros["proprietaria"]}
          />
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

function ItemFixo({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-muted-foreground">{rotulo}</dt>
      <dd className="tabular-nums">{formatCentavos(valor)}</dd>
    </div>
  );
}
