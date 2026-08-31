import { maskCurrency, parseToCentavos } from "@/lib/money";

interface Props {
  id: string;
  label: string;
  valor: string;
  onChange: (texto: string) => void;
  erro?: string | undefined;
}

export function CampoMoeda({ id, label, valor, onChange, erro }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          R$
        </span>
        <input
          id={id}
          inputMode="numeric"
          value={valor}
          onChange={(e) => onChange(maskCurrency(e.target.value))}
          placeholder="0,00"
          aria-invalid={Boolean(erro)}
          className="h-12 w-full rounded-sm border border-input bg-card pl-10 pr-3 text-right text-base tabular-nums text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25 aria-[invalid=true]:border-destructive"
        />
      </div>
      {erro ? <p className="text-xs text-destructive">{erro}</p> : null}
    </div>
  );
}

export function centavosDoCampo(valor: string): number {
  return parseToCentavos(valor);
}
