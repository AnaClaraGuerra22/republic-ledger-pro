# Fechamento da República 🏠✨

Aplicação web desenvolvida para automatizar e simplificar a divisão financeira mensal de despesas em uma república.

---

### 🎯 Motivação do Projeto

O projeto nasceu para resolver um problema recorrente na gestão da casa: a falta de automação e suporte por parte da **imobiliária**. 

Frequentemente, o prédio realiza manutenções ou reparos que são de responsabilidade do dono do imóvel (**despesas do proprietário**). Como a imobiliária não aplica esses abatimentos de forma automática no boleto do aluguel, o processo de fechamento exigia cálculos manuais para descontar o valor correto da imobiliária e recalcular a divisão justa do aluguel restante entre as moradoras.

O **Fechamento da República** automatiza essa matemática:
* **Abatimento Automático:** Subtrai as despesas do proprietário do valor repassado à imobiliária.
* **Rateio Sem Erros:** Ajusta a base de cálculo individual considerando o desconto já aplicado.
* **Transparência:** Gera um extrato claro para conferência antes do pagamento.

---


## 🚀 Funcionalidades Principais

* **Lançamento de Despesas:** Gestão de custos fixos (aluguel, internet, seguro) e variáveis (luz, condomínio, abatimentos).
* **Divisão Precisa:** Algoritmo de cálculo baseado em centavos inteiros que evita erros de arredondamento e considera os ajustes de cada tipo de quarto.
* **Relatórios em PDF:** Geração instantânea do fechamento detalhado pronto para envio.
* **Envio via WhatsApp:** Geração automática de mensagens individuais e direcionamento oficial via `wa.me`.
* **Histórico de Fechamentos:** Persistência dos dados financeiros históricos de cada mês.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React + TypeScript
* **Estilização:** Tailwind CSS + Shadcn UI
* **Build Tool:** Vite
* **Backend & Banco de Dados:** Supabase
* **Testes Automatizados:** Vitest

---

## 📊 Lógica Financeira

O cálculo é realizado de forma determinística para garantir que a soma dos pagamentos individuais seja exatamente igual ao total geral da casa:

1. **Total Geral:** Soma das despesas fixas e variáveis subtraindo eventuais despesas a ressarcir pelo proprietário.
2. **Valor Base:** Subtração do total de ajustes de quarto do Total Geral, dividindo o valor restante de forma igual entre as moradoras.
3. **Valor Individual:** Atribuição do valor base somado ao valor do ajuste específico do quarto de cada moradora (com tratamento do resíduo de centavos).

---

