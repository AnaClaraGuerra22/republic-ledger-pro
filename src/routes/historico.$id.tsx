import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ResultadoFechamento } from "@/components/ResultadoFechamento";
import { fetchFechamento } from "@/lib/db";
import { formatData, formatMesReferencia } from "@/lib/money";

export const Route = createFileRoute("/historico/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Fechamento — Fechamento da República" },
      {
        name: "description",
        content: "Veja as despesas, o total geral e o valor pago por cada moradora.",
      },
      { property: "og:title", content: "Detalhes do Fechamento" },
      {
        property: "og:description",
        content: "Veja as despesas, o total geral e o valor pago por cada moradora.",
      },
    ],
  }),
  component: DetalheFechamento,
});

function DetalheFechamento() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fechamento", id],
    queryFn: () => fetchFechamento(id),
  });

  return (
    <div className="space-y-8">
      <div>
        <Link to="/historico" className="text-sm text-muted-foreground hover:text-primary">
          ← Voltar ao histórico
        </Link>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
      {isError ? (
        <p className="text-sm text-destructive">Fechamento não encontrado.</p>
      ) : null}

      {data ? (
        <>
          <header>
            <h1 className="text-3xl sm:text-4xl">
              {formatMesReferencia(data.fechamento.mes_referencia)}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fechamento criado em {formatData(data.fechamento.data_criacao)}
            </p>
          </header>

          <ResultadoFechamento
            dados={{
              mesLabel: formatMesReferencia(data.fechamento.mes_referencia),
              aluguel: data.fechamento.aluguel_centavos,
              condominio: data.fechamento.condominio_centavos,
              luz: data.fechamento.luz_centavos,
              internet: data.fechamento.internet_centavos,
              seguro: data.fechamento.seguro_centavos,
              despesasProprietaria: data.fechamento.despesas_proprietaria_centavos,
              totalGeral: data.fechamento.total_geral_centavos,
              valorImobiliaria: data.fechamento.valor_imobiliaria_centavos,
              pagamentos: data.pagamentos.map((p) => ({
                nome: p.nome_moradora,
                tipo_quarto: p.tipo_quarto,
                telefone: p.telefone,
                valor_pago_centavos: p.valor_pago_centavos,
              })),
            }}
          />
        </>
      ) : null}
    </div>
  );
}
