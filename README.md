# Simulador de Desconto por Antecipação

Aplicação em Vue 3 + TypeScript que replica (de forma estimada) o cálculo de desconto por antecipação de parcelas usado pelo Nubank. A interface foi personalizada com a paleta oficial do banco digital e fornece uma experiência próxima à exibida no app.

🔗 **Live demo:** https://nubank.dadalto.tec.br/

## Principais recursos
- Conversão automática da taxa anual em taxa mensal efetiva.
- Salva os últimos valores preenchidos no `localStorage` para retomar a simulação depois.
- Cartões-resumo que mostram valor da parcela, valor presente, desconto total, cashback esperado e benefício agregado.
- Tabela detalhada com o valor presente de cada parcela e fator de desconto aplicado.
- Exemplos rápidos para preencher o formulário com um clique.

## Tecnologias utilizadas
- [Vue 3](https://vuejs.org/) com script setup e componentes single-file.
- [Vite](https://vitejs.dev/) para desenvolvimento rápido e build.
- [TypeScript](https://www.typescriptlang.org/) para tipagem estática.
- [Bootstrap 5](https://getbootstrap.com/) para grid e componentes básicos, com customizações visuais nas cores do Nubank.

## Como executar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O Vite informará a URL (geralmente `http://localhost:5173`).
3. Para gerar os artefatos otimizados para produção:
   ```bash
   npm run build
   ```
4. (Opcional) Valide os tipos do projeto:
   ```bash
   npm run typecheck
   ```

## Estrutura principal
- `src/App.vue`: layout base e cabeçalho/rodapé.
- `src/components/Simulator.vue`: formulário, cartões de resultado e tabela principal.
- `src/utils/finance.ts`: funções de cálculo financeiro usadas nas simulações.
- `src/styles.css`: variáveis de tema e estilos globais alinhados ao visual do Nubank.

## Licença
Uso educacional/demonstração. Ajuste conforme necessário antes de usar em produção.
