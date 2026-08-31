import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { fetchFechamentos } from "@/lib/db";
import { formatCentavos, formatData, formatMesReferencia } from "@/lib/money";

export const Route = createFileRoute("/historico/")({
  head: () => ({
    meta: [
      { title: "Histórico de Fechamentos — Fechamento da República" },
      {
        name: "description",
        content: "Consulte os fechamentos mensais anteriores das contas da república.",
      },
      { property: "og:title", content: "Histórico de Fechamentos" },
      {
        property: "og:description",
        content: "Consulte os fechamentos mensais anteriores das contas da república.",
      },
    ],
  }),
  component: Historico,
});

function Historico() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fechamentos"],
    queryFn: fetchFechamentos,
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl">Histórico de Fechamentos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Todos os fechamentos salvos, com os valores originais de cada mês.
        </p>
      </header>

      {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
      {isError ? (
        <p className="text-sm text-destructive">Não foi possível carregar o histórico.</p>
      ) : null}

      {data && data.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum fechamento salvo ainda.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-90"
          >
            Fazer um fechamento
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {(data ?? []).map((f) => (
          <article key={f.id} className="panel flex flex-col p-6">
            <p className="eyebrow">{formatMesReferencia(f.mes_referencia)}</p>
            <p className="valor-destaque mt-3 text-2xl">
              {formatCentavos(f.total_geral_centavos)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Criado em {formatData(f.data_criacao)}
            </p>
            <Link
              to="/historico/$id"
              params={{ id: f.id }}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-sm border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Ver detalhes
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
