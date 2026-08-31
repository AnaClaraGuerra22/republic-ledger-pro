# República Contas

Quero criar uma aplicação web completa chamada Fechamento da República.

IMPORTANTE: leia todas as instruções abaixo antes de implementar. Não crie funcionalidades fora do escopo e não altere as regras matemáticas definidas.

OBJETIVO DA APLICAÇÃO

Esta aplicação será usada exclusivamente para realizar o fechamento financeiro mensal da minha república.

Ela deve permitir:

Informar as despesas do mês;

Calcular automaticamente quanto cada moradora deve pagar;

Exibir um resumo financeiro detalhado;

Salvar o fechamento mensal;

Consultar fechamentos anteriores;

Gerar um PDF organizado do fechamento;

Gerar mensagens personalizadas para WhatsApp para cada moradora.

Não quero um site institucional.

NÃO criar páginas ou funcionalidades como:

Moradoras como página institucional;

Galeria de fotos;

Sobre nós;

Eventos;

Blog;

Página inicial institucional.

O sistema deve ser uma aplicação simples e focada exclusivamente no fechamento das contas mensais.

MORADORAS

As cinco moradoras iniciais são:

Ana

Tipo de quarto: Suíte

Telefone: +55 31 99435-3574

Ajuste do quarto: + R$ 50,00

Duda

Tipo de quarto: Quarto maior

Telefone: +55 35 99750-3967

Ajuste do quarto: + R$ 30,00

Luna

Tipo de quarto: Quarto igual

Telefone: +55 27 99650-4851

Ajuste do quarto: + R$ 10,00

Bianca

Tipo de quarto: Quarto igual

Telefone: +55 31 99881-6022

Ajuste do quarto: + R$ 10,00

Vanessa

Tipo de quarto: Quarto igual

Telefone: +55 16 98863-6839

Ajuste do quarto: + R$ 10,00

Essas moradoras devem já estar cadastradas inicialmente no sistema.

A estrutura do banco de dados deve permitir futuramente editar:

nome;

telefone;

tipo de quarto;

ajuste financeiro.

Mas não preciso criar uma página complexa de gerenciamento de moradoras nesta primeira versão.

DESPESAS FIXAS

Existem três valores fixos:

Aluguel: R$ 3.300,00

Internet: R$ 99,90

Seguro: R$ 23,53


Esses valores devem aparecer no formulário como despesas fixas da casa.

O usuário não precisa digitá-los manualmente no fechamento mensal.

Mas eles devem estar estruturados de forma que possam ser alterados futuramente.

DESPESAS VARIÁVEIS

Todo mês o usuário deve preencher:

Mês de referência;

Valor da conta de luz;

Valor do condomínio;

Despesas da proprietária.

Os valores devem utilizar moeda brasileira.

Exemplo:

R$ 1.234,56

Implementar máscara e formatação adequadas para valores monetários brasileiros.

REGRA DE CÁLCULO

A lógica matemática é extremamente importante.

PASSO 1 — CALCULAR O TOTAL GERAL

O total das despesas deve ser:

TOTAL GERAL =
ALUGUEL
+
CONDOMÍNIO
+
LUZ
+
INTERNET
+
SEGURO
-
DESPESAS DA PROPRIETÁRIA


Em JavaScript, conceitualmente:

const totalGeral =
  aluguel +
  condominio +
  luz +
  internet +
  seguro -
  despesasProprietaria;


PASSO 2 — CALCULAR A BASE DA DIVISÃO

Os ajustes dos quartos são:

Ana: + R$ 50,00
Duda: + R$ 30,00
Luna: + R$ 10,00
Bianca: + R$ 10,00
Vanessa: + R$ 10,00


A soma total dos ajustes é:

R$ 110,00


Portanto, para garantir que a soma dos pagamentos individuais seja exatamente igual ao total geral das contas, a base deve ser calculada assim:

const totalAjustes = 110;

const valorBase =
  (totalGeral - totalAjustes) / 5;


PASSO 3 — CALCULAR O VALOR DE CADA MORADORA

const ana = valorBase + 50;

const duda = valorBase + 30;

const luna = valorBase + 10;

const bianca = valorBase + 10;

const vanessa = valorBase + 10;


IMPORTANTE:

A soma final dos valores individuais deve ser exatamente igual ao total geral.

Implementar arredondamento monetário correto para evitar diferenças de centavos.

Caso exista diferença de R$ 0,01 devido ao arredondamento, tratar automaticamente para que a soma final seja igual ao total geral.

VALOR DA IMOBILIÁRIA

Também quero mostrar separadamente o valor relacionado à imobiliária.

A fórmula é:

ALUGUEL
+
SEGURO
-
DESPESAS DA PROPRIETÁRIA


Ou:

const valorImobiliaria =
  aluguel +
  seguro -
  despesasProprietaria;


ESTRUTURA DA APLICAÇÃO

A aplicação pode funcionar como uma dashboard simples.

Quero preferencialmente uma única aplicação com navegação simples entre:

Novo Fechamento;

Histórico.

Não criar muitas páginas desnecessárias.

TELA 1 — NOVO FECHAMENTO

Esta deve ser a principal tela da aplicação.

Cabeçalho

Título:

Fechamento da República

Subtítulo:

Organize as contas da casa de forma simples e transparente.

SEÇÃO — MÊS DE REFERÊNCIA

Campo para selecionar:

Mês e ano


Exemplo:

Agosto de 2026


SEÇÃO — DESPESAS FIXAS

Exibir visualmente:

DespesaValorAluguelR$ 3.300,00InternetR$ 99,90SeguroR$ 23,53

Esses valores devem estar claramente identificados como:

Despesas fixas

SEÇÃO — DESPESAS DO MÊS

Campos editáveis:

Condomínio;

Luz;

Despesas da proprietária.

Cada campo deve possuir:

label claro;

campo monetário;

máscara brasileira;

validação.

BOTÃO PRINCIPAL

Um botão grande e destacado:

Calcular Fechamento

Ao clicar:

Validar os campos;

Realizar os cálculos;

Mostrar o resultado de forma clara.

TELA / SEÇÃO DE RESULTADO

Após calcular, mostrar um dashboard financeiro.

CARD PRINCIPAL

Mostrar em destaque:

Total Geral das Contas

R$ X.XXX,XX


Esse deve ser o principal destaque visual.

RESUMO DAS DESPESAS

Exibir uma tabela ou lista organizada:

Aluguel;

Condomínio;

Luz;

Internet;

Seguro;

Despesas da proprietária;

Total geral.

As despesas da proprietária devem aparecer claramente como um valor descontado.

Exemplo:

Despesas da proprietária: - R$ XXX,XX


CARD — VALOR DA IMOBILIÁRIA

Exibir separadamente:

Valor da Imobiliária

R$ X.XXX,XX


Esse valor deve ser calculado usando:

Aluguel + Seguro - Despesas da proprietária


SEÇÃO PRINCIPAL — QUANTO CADA UMA DEVE PAGAR

Esta é a parte mais importante do resultado.

Mostrar os cinco pagamentos em cards individuais ou uma tabela visualmente elegante.

Cada card deve conter:

Ana

SUÍTE

Valor a pagar:

R$ X.XXX,XX

Duda

QUARTO MAIOR

Valor a pagar:

R$ X.XXX,XX

Luna

QUARTO IGUAL

Valor a pagar:

R$ X.XXX,XX

Bianca

QUARTO IGUAL

Valor a pagar:

R$ X.XXX,XX

Vanessa

QUARTO IGUAL

Valor a pagar:

R$ X.XXX,XX

CONFERÊNCIA DO CÁLCULO

Na parte inferior do resultado, mostrar:

Total das contas: R$ X.XXX,XX

Total dividido entre as moradoras: R$ X.XXX,XX


Se os valores forem iguais, mostrar visualmente:

✓ Valores conferidos corretamente

Isso é importante para garantir transparência e evitar erros no fechamento.

PDF

Adicionar um botão:

Gerar PDF

O PDF deve possuir aparência elegante, limpa e organizada.

CABEÇALHO

Fechamento da República

Mês de referência:

Agosto de 2026


RESUMO DAS DESPESAS

Tabela contendo:

Aluguel;

Condomínio;

Luz;

Internet;

Seguro;

Despesas da proprietária;

Total geral.

DIVISÃO ENTRE AS MORADORAS

Tabela:

MoradoraQuartoValorAnaSuíteR$ XXXDudaQuarto maiorR$ XXXLunaQuarto igualR$ XXXBiancaQuarto igualR$ XXXVanessaQuarto igualR$ XXX

O PDF deve ser adequado para compartilhar com todas as moradoras.

WHATSAPP

Quero implementar mensagens individuais para cada moradora.

IMPORTANTE:

Não implementar disparos automáticos usando soluções não oficiais.

Nesta primeira versão, criar uma funcionalidade que:

Gere automaticamente a mensagem personalizada;

Utilize o número de telefone cadastrado;

Abra o WhatsApp com a mensagem já preenchida.

Utilizar links oficiais compatíveis com WhatsApp.

MENSAGEM PADRÃO

Para cada moradora, gerar automaticamente:

Oi, [NOME]! 🏠✨

O fechamento das contas da república referente a [MÊS] foi realizado.

💰 Valor que você deve pagar:

R$ [VALOR]

Se quiser conferir todos os detalhes, o fechamento completo está disponível no PDF. 😊


Substituir automaticamente:

[NOME]
[MÊS]
[VALOR]


BOTÕES DE WHATSAPP

Cada card de moradora deve possuir um botão discreto:

Enviar no WhatsApp

Ao clicar:

gerar a mensagem personalizada;

abrir a conversa correspondente;

preencher automaticamente a mensagem.

NÃO enviar automaticamente sem ação da usuária.

No futuro, a aplicação poderá ser integrada à API oficial do WhatsApp Business.

Por isso, manter a arquitetura preparada para uma futura integração.

HISTÓRICO

Criar uma área:

Histórico de Fechamentos

Mostrar os fechamentos anteriores.

Cada item deve mostrar:

mês;

data em que foi criado;

total geral.

Exemplo:

AGOSTO 2026

Total: R$ 4.250,30

[Ver detalhes]


DETALHES DO HISTÓRICO

Ao clicar em um fechamento anterior, mostrar novamente:

todas as despesas;

total geral;

valor da imobiliária;

valor pago por cada moradora.

Os valores históricos não devem mudar caso futuramente eu altere alguma configuração das moradoras.

Cada fechamento precisa armazenar uma cópia dos valores calculados naquele momento.

BANCO DE DADOS

Utilizar banco de dados para persistir as informações.

Estruturar pelo menos as seguintes entidades:

Moradoras

id
nome
telefone
tipo_quarto
ajuste
ativo
created_at


Fechamentos

id
mes_referencia
data_criacao

aluguel
internet
seguro

condominio
luz
despesas_proprietaria

total_geral
valor_imobiliaria


Pagamentos do Fechamento

id
fechamento_id
moradora_id

nome_moradora
tipo_quarto
ajuste

valor_pago


IMPORTANTE:

Os pagamentos devem registrar os dados históricos.

Se o nome ou quarto de uma moradora mudar no futuro, os fechamentos antigos devem continuar mostrando os dados originais.

DESIGN E IDENTIDADE VISUAL

Quero manter a identidade visual elegante do meu projeto antigo.

A inspiração deve seguir estas características:

PALETA DE CORES

--bg-color: #f4f1ea;
--text-color: #332f2c;
--card-bg: #ffffff;
--accent-color: #8b735b;
--secondary-color: #d7d1c2;


Características:

fundo bege claro;

tons terrosos suaves;

branco nos cards;

marrom elegante como cor de destaque;

visual minimalista;

acolhedor;

sofisticado.

TIPOGRAFIA

Utilizar uma tipografia elegante.

Como inspiração:

Georgia;

serifas elegantes;

títulos com espaçamento entre letras;

textos legíveis e modernos.

Pode utilizar fontes equivalentes disponíveis na aplicação.

Quero uma aparência semelhante a:

minimalista
elegante
acolhedora
clássica
sofisticada


CARDS

Os cards devem seguir aproximadamente:

fundo branco;

borda discreta;

sombra muito suave;

cantos pouco arredondados;

bastante espaço interno.

Não quero um visual excessivamente colorido.

BOTÕES

O botão principal deve utilizar o tom:

#8b735b


Texto branco.

Ao passar o mouse:

utilizar um tom mais escuro.

Os botões devem possuir aparência elegante e minimalista.

RESULTADOS FINANCEIROS

Os valores financeiros importantes devem utilizar:

fonte maior;

peso maior;

cor de destaque marrom.

O resultado principal deve chamar bastante atenção.

RESPONSIVIDADE

A aplicação deve funcionar perfeitamente em:

celular;

tablet;

computador.

No celular:

os cards devem ficar empilhados;

os botões devem ser fáceis de tocar;

as tabelas devem permanecer legíveis;

os valores não podem ficar cortados.

EXPERIÊNCIA DO USUÁRIO

Quero uma experiência simples.

O fluxo ideal deve ser:

1. Abrir o sistema

↓

2. Selecionar o mês

↓

3. Informar condomínio, luz e despesas da proprietária

↓

4. Clicar em "Calcular Fechamento"

↓

5. Conferir os valores

↓

6. Salvar o fechamento

↓

7. Gerar o PDF

↓

8. Enviar as mensagens individuais pelo WhatsApp


VALIDAÇÕES IMPORTANTES

Implementar:

validação de campos monetários;

impedir valores inválidos;

impedir valores negativos onde não fizer sentido;

confirmação antes de salvar;

feedback visual de sucesso;

tratamento de erros.

LÓGICA FINANCEIRA

IMPORTANTE:

Nunca utilizar valores de ponto flutuante de forma que gere erros monetários.

Utilizar tratamento adequado para valores em centavos ou uma estratégia segura de arredondamento.

A soma dos pagamentos individuais deve sempre ser igual ao total geral.

NÃO FAZER

Não criar:

galeria de fotos;

página de apresentação das moradoras;

sistema de rede social;

eventos;

blog;

funcionalidades desnecessárias;

dashboard excessivamente complexo;

gráficos sem utilidade.

O foco é exclusivamente:

CONTAS MENSAIS DA REPÚBLICA.

PRIORIDADE DE IMPLEMENTAÇÃO

Implemente nesta ordem:

ETAPA 1

Criar toda a interface visual da aplicação.

ETAPA 2

Implementar e validar cuidadosamente a lógica de cálculo.

Criar testes ou validações internas para garantir:

Soma dos pagamentos individuais = Total geral


ETAPA 3

Implementar o resultado do fechamento.

ETAPA 4

Implementar o salvamento no banco de dados.

ETAPA 5

Implementar o histórico.

ETAPA 6

Implementar geração de PDF.

ETAPA 7

Implementar geração das mensagens e abertura do WhatsApp.

INSTRUÇÃO FINAL

Antes de adicionar qualquer funcionalidade adicional, priorize:

funcionamento correto do cálculo;

persistência correta;

experiência simples;

design elegante;

funcionamento perfeito em celular.

Não modifique as regras financeiras sem minha autorização.

Comece implementando a aplicação seguindo rigorosamente todas as especificações acima.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2310b4c8-0a5e-4467-8f79-6f43bbc7bfee).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
