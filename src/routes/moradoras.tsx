import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { atualizarMoradora, fetchMoradoras, type Moradora } from "@/lib/db";
import { formatCentavos } from "@/lib/money";

export const Route = createFileRoute("/moradoras")({
  head: () => ({
    meta: [
      { title: "Moradoras — Fechamento da República" },
      { name: "description", content: "Atualize quem mora em cada quarto, nomes e WhatsApp das moradoras." },
      { property: "og:title", content: "Moradoras — Fechamento da República" },
      { property: "og:description", content: "Atualize quem mora em cada quarto, nomes e WhatsApp das moradoras." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MoradorasPage,
});

function MoradorasPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["moradoras"], queryFn: fetchMoradoras });

  return (
    <div className="space-y-8">
      <header className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl">Moradoras</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cada quarto tem seu ajuste. Quando alguém mudar de quarto ou entrar uma nova moradora, troque o nome e o
          WhatsApp no quarto correspondente.
        </p>
      </header>
      {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
      {isError ? <p className="text-sm text-destructive">Não foi possível carregar as moradoras.</p> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        {(data ?? []).map((m) => (
          <CartaoMoradora key={m.id} moradora={m} />
        ))}
      </div>
    </div>
  );
}

function CartaoMoradora({ moradora }: { moradora: Moradora }) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState(moradora.nome);
  const [telefone, setTelefone] = useState(moradora.telefone);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNome(moradora.nome);
    setTelefone(moradora.telefone);
  }, [moradora.nome, moradora.telefone]);

  const alterado = nome.trim() !== moradora.nome || telefone.trim() !== moradora.telefone;
  const valido = nome.trim().length > 0 && telefone.replace(/\D/g, "").length >= 10;

  const salvar = async () => {
    setSalvando(true);
    try {
      await atualizarMoradora(moradora.id, { nome: nome.trim(), telefone: telefone.trim() });
      await queryClient.invalidateQueries({ queryKey: ["moradoras"] });
      toast.success(`${moradora.tipo_quarto} atualizado.`);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="panel space-y-4 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow">{moradora.tipo_quarto}</p>
        <span className="text-xs text-muted-foreground">ajuste +{formatCentavos(moradora.ajuste_centavos)}</span>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-foreground">Nome</span>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="h-11 w-full rounded-sm border border-input bg-card px-3 outline-none focus:border-primary"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-foreground">WhatsApp (com DDD)</span>
        <input
          value={telefone}
          inputMode="tel"
          placeholder="11 99999-9999"
          onChange={(e) => setTelefone(e.target.value)}
          className="h-11 w-full rounded-sm border border-input bg-card px-3 tabular-nums outline-none focus:border-primary"
        />
      </label>
      {!valido ? <p className="text-xs text-destructive">Informe o nome e um WhatsApp com DDD.</p> : null}
      <button
        type="button"
        onClick={salvar}
        disabled={!alterado || !valido || salvando}
        className="inline-flex h-10 w-full items-center justify-center rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {salvando ? "Salvando..." : "Salvar alterações"}
      </button>
    </section>
  );
}
