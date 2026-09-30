ALTER TABLE public.moradoras
  ADD COLUMN IF NOT EXISTS ajuste_pendente_centavos integer,
  ADD COLUMN IF NOT EXISTS fechamentos_ate_aplicar integer;