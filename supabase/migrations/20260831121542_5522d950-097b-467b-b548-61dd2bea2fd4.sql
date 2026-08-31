CREATE TABLE public.moradoras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  tipo_quarto text NOT NULL,
  ajuste_centavos integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.despesas_fixas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  rotulo text NOT NULL,
  valor_centavos integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.fechamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes_referencia text NOT NULL,
  data_criacao timestamptz NOT NULL DEFAULT now(),
  aluguel_centavos integer NOT NULL,
  internet_centavos integer NOT NULL,
  seguro_centavos integer NOT NULL,
  condominio_centavos integer NOT NULL,
  luz_centavos integer NOT NULL,
  despesas_proprietaria_centavos integer NOT NULL,
  total_geral_centavos integer NOT NULL,
  valor_imobiliaria_centavos integer NOT NULL
);

CREATE TABLE public.fechamento_pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fechamento_id uuid NOT NULL REFERENCES public.fechamentos(id) ON DELETE CASCADE,
  moradora_id uuid REFERENCES public.moradoras(id) ON DELETE SET NULL,
  nome_moradora text NOT NULL,
  tipo_quarto text NOT NULL,
  telefone text NOT NULL,
  ajuste_centavos integer NOT NULL,
  valor_pago_centavos integer NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pagamentos_fechamento ON public.fechamento_pagamentos(fechamento_id);
CREATE INDEX idx_fechamentos_data ON public.fechamentos(data_criacao DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.moradoras TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.despesas_fixas TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fechamentos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fechamento_pagamentos TO anon, authenticated;
GRANT ALL ON public.moradoras TO service_role;
GRANT ALL ON public.despesas_fixas TO service_role;
GRANT ALL ON public.fechamentos TO service_role;
GRANT ALL ON public.fechamento_pagamentos TO service_role;

ALTER TABLE public.moradoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamento_pagamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso_total_moradoras" ON public.moradoras FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso_total_despesas_fixas" ON public.despesas_fixas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso_total_fechamentos" ON public.fechamentos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso_total_pagamentos" ON public.fechamento_pagamentos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.moradoras (nome, telefone, tipo_quarto, ajuste_centavos, ordem) VALUES
  ('Ana', '+5531994353574', 'Suíte', 5000, 1),
  ('Duda', '+5535997503967', 'Quarto maior', 3000, 2),
  ('Luna', '+5527996504851', 'Quarto igual', 1000, 3),
  ('Bianca', '+5531998816022', 'Quarto igual', 1000, 4),
  ('Vanessa', '+5516988636839', 'Quarto igual', 1000, 5);

INSERT INTO public.despesas_fixas (chave, rotulo, valor_centavos) VALUES
  ('aluguel', 'Aluguel', 330000),
  ('internet', 'Internet', 9990),
  ('seguro', 'Seguro', 2353);