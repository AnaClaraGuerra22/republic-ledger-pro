import { formatCentavos } from "@/lib/money";
import { gerarPdfFechamento } from "@/lib/pdf";
import { linkWhatsApp, montarMensagem } from "@/lib/whatsapp";

export interface DadosResultado {
  mesLabel: string;
  aluguel: number;
  condominio: number;
  luz: number;
  internet: number;
  seguro: number;
  despesasProprietaria: number;
  totalGeral: number;
  valorImobiliaria: number;
  pagamentos: {
    nome: string;
    tipo_quarto: string;
    telefone: string;
    valor_pago_centavos: number;
  }[];
}

export function ResultadoFechamento({
  dados,
  acoes,
}: {
  dados: DadosResultado;
  acoes?: React.ReactNode;
}) {
  const soma = dados.pagamentos.reduce((a, p) => a + p.valor_pago_centavos, 0);
  const confere = soma === dados.totalGeral;

  const abrirWhatsApp = (nome: string, telefone: string, valor: number) => {
    const mensagem = montarMensagem({ nome, mes: dados.mesLabel, valorCentavos: valor });
    window.open(linkWhatsApp(telefone, mensagem), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Card principal */}
      <section className="panel px-6 py-10 text-center sm:px-10">
        <p className="eyebrow">Total geral das contas</p>
        <p className="valor-destaque mt-3 text-4xl leading-tight sm:text-5xl">
          {formatCentavos(dados.totalGeral)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{dados.mesLabel}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Resumo das despesas */}
        <section className="panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Resumo das despesas</h2>
          <dl className="mt-5 divide-y divide-border text-sm">
            <Linha rotulo="Aluguel" valor={formatCentavos(dados.aluguel)} />
            <Linha rotulo="Condomínio" valor={formatCentavos(dados.condominio)} />
            <Linha rotulo="Luz" valor={formatCentavos(dados.luz)} />
            <Linha rotulo="Internet" valor={formatCentavos(dados.internet)} />
            <Linha rotulo="Seguro" valor={formatCentavos(dados.seguro)} />
            <Linha
              rotulo="Despesas da proprietária"
              valor={`- ${formatCentavos(dados.despesasProprietaria)}`}
              desconto
            />
            <div className="flex items-center justify-between gap-4 pt-4">
              <dt className="font-semibold">Total geral</dt>
              <dd className="valor-destaque text-lg">{formatCentavos(dados.totalGeral)}</dd>
            </div>
          </dl>
        </section>

        {/* Imobiliária */}
        <section className="panel flex flex-col justify-center p-6 sm:p-8">
          <p className="eyebrow">Valor da imobiliária</p>
          <p className="valor-destaque mt-3 text-3xl">
            {formatCentavos(dados.valorImobiliaria)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Aluguel + Seguro − Despesas da proprietária
          </p>
        </section>
      </div>

      {/* Pagamentos */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Quanto cada uma deve pagar</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dados.pagamentos.map((p) => (
            <article key={p.nome} className="panel flex flex-col p-6">
              <h3 className="text-xl">{p.nome}</h3>
              <p className="eyebrow mt-1">{p.tipo_quarto}</p>
              <p className="mt-5 text-xs text-muted-foreground">Valor a pagar</p>
              <p className="valor-destaque text-2xl">{formatCentavos(p.valor_pago_centavos)}</p>
              <button
                type="button"
                onClick={() => abrirWhatsApp(p.nome, p.telefone, p.valor_pago_centavos)}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-sm border border-border bg-transparent px-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Enviar no WhatsApp
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Conferência */}
      <section className="panel p-6 sm:p-8">
        <h2 className="text-base font-semibold">Conferência do cálculo</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Linha rotulo="Total das contas" valor={formatCentavos(dados.totalGeral)} semBorda />
          <Linha
            rotulo="Total dividido entre as moradoras"
            valor={formatCentavos(soma)}
            semBorda
          />
        </dl>
        <p
          className={`mt-5 text-sm font-medium ${confere ? "text-success" : "text-destructive"}`}
        >
          {confere
            ? "✓ Valores conferidos corretamente"
            : "⚠ Divergência encontrada na divisão dos valores"}
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => gerarPdfFechamento(dados)}
          className="inline-flex h-12 items-center justify-center rounded-sm border border-primary bg-transparent px-6 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Gerar PDF
        </button>
        {acoes}
      </div>
    </div>
  );
}

function Linha({
  rotulo,
  valor,
  desconto,
  semBorda,
}: {
  rotulo: string;
  valor: string;
  desconto?: boolean;
  semBorda?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${semBorda ? "" : "py-3"}`}>
      <dt className="text-muted-foreground">{rotulo}</dt>
      <dd className={`tabular-nums ${desconto ? "text-destructive" : "text-foreground"}`}>
        {valor}
      </dd>
    </div>
  );
}
