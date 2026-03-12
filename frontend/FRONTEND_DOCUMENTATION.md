# Documentação do Frontend - EnglishVerse

Bem-vindo à documentação do frontend do projeto EnglishVerse. Este documento foi criado para ajudar novos desenvolvedores a entenderem a arquitetura, as tecnologias escolhidas e como o sistema funciona sob o capô, facilitando futuras manutenções e evoluções.

## 1. Visão Geral das Tecnologias

O projeto é uma Single Page Application (SPA) moderna, construída com as seguintes tecnologias principais:
- **React 19 & TypeScript**: O núcleo da aplicação, proporcionando tipagem forte e componentes reativos.
- **Vite**: O _bundler_ e servidor de desenvolvimento (muito mais rápido que o Webpack/CRA).
- **React Router DOM v7**: Responsável pelo roteamento e navegação entre páginas.
- **Material-UI (MUI)**: A principal biblioteca de componentes de interface (UI) adotada. O tema principal (modo escuro) é configurado centralmente.
- **Tailwind CSS**: Utilizado pontualmente para classes utilitárias e estilizações rápidas complementares ao MUI.
- **Axios**: Cliente HTTP para comunicação com a API (backend).
- **Context API (React)**: Utilizada para o gerenciamento de estado global da aplicação (Autenticação e Módulos de estudo).

---

## 2. Estrutura de Diretórios (`/src`)

A pasta `src/` contém todo o código da aplicação e segue um padrão de organização focado em domínio técnico:

- `/assets`: Imagens estáticas (logos, svgs) que são importadas diretamente no código.
- `/components`: Componentes reutilizáveis da interface, agrupados muitas vezes por contexto de funcionalidade (ex: `Auth`, `Layout`, `Home`, `Practice`, `Presentation`, `Production`).
- `/contexts`: Onde a "mágica" do estado global acontece (ex: `AuthContext.tsx`, `ModuleContext.tsx`).
- `/pages`: Componentes de alto nível que representam as "telas" da aplicação (mapeadas nas rotas).
- `/routes`: Contém o arquivo `index.tsx` que define a árvore de roteamento (quais URLs carregam quais páginas).
- `/services`: Configurações de serviços externos, sendo o `api.ts` (configuração do Axios) o principal deles.
- `App.tsx` / `main.tsx`: Pontos de entrada da aplicação React. Eles envolvem a aplicação com os _Providers_ de Tema, Roteamento e Contextos Globais.

---

## 3. Gerenciamento de Estado e Contextos

O projeto optou por usar a própria **Context API** do React em vez de bibliotecas externas como Redux ou Zustand. Existem dois contextos vitais no sistema:

### 3.1. `AuthContext` (Autenticação)
- **O que faz:** Gerencia o usuário logado, o token JWT (armazenado no `localStorage`) e as funções de `login` e `logout`.
- **Como funciona:** Quando a aplicação inicializa, ele verifica se há um token salvo e não expirado (usa `jwt-decode`). Se válido, o usuário é considerado autenticado.
- **Integração com o Backend:** Utiliza os dados do Token (Subject/email, expiração, etc) e define no serviço do Axios para que toda requisição dali para frente já vá com o `Authorization: Bearer <token>`.

### 3.2. `ModuleContext` (Fluxo de Aprendizagem)
- **O que faz:** É o coração da experiência de estudo do aluno. Ele busca toda a estrutura de um módulo (Apresentações, Práticas e Produções) e consolida isso em uma única lista sequencial (`allItems`).
- **Como funciona:**
  - Carrega todos os dados paralelos da API (`/modulos`, `/recursos`, `/practice`, `/production`, `/progresso`).
  - Mantém o controle do `activeItem` (o conteúdo que o usuário está vendo no momento na tela).
  - Escuta por "Deep Links" na URL (`?type=...&id=...`) para abrir o módulo diretamente onde o aluno parou.
  - Oferece funções como `handleNextItem` (ir para o próximo conteúdo) e `markItemAsCompleted` (avisar a API que a tarefa atual foi concluída).

---

## 4. Roteamento e Navegação

Localizado em `src/routes/index.tsx`, o sistema usa a nova API `createBrowserRouter` do React Router.

- **Rotas Públicas:** `/login` e `/signup`.
- **Rotas Protegidas:** Todas as demais rotas filhas do path base `/` estão envoltas no componente `<ProtectedRoute>`. Esse componente verifica se o usuário está logado (consumindo o `AuthContext`); caso não esteja, redireciona o usuário de volta para o `/login`.
- **O Componente `Layout`:** As rotas protegidas são filhas de um componente `<Layout>`. Ele garante que o `<Header>` esteja sempre visível e usa o `<Outlet />` para renderizar o miolo da página (seja a Home, Perfil ou um Módulo de estudo).

---

## 5. Comunicação com a API (Backend)

O arquivo central para isso é `src/services/api.ts`.

- Foi criada uma instância do Axios configurada com a `VITE_API_URL` (vinda de variáveis de ambiente - `.env`).
- Existe um **Interceptor de Requisição**. Toda vez que o frontend for fazer uma chamada para o backend (ex: `api.get('/topicos')`), este interceptor captura a requisição antes dela sair, pega o token do `localStorage` e o insere no Header (`Authorization`). Isso exime o desenvolvedor de ter que passar o token manualmente em cada nova chamada criada.

---

## 6. Fluxo Principal do Usuário (Como a aplicação flui)

1. **Autenticação:** O usuário entra em `/login`, envia credenciais para a API. A API retorna um Token JWT. O `AuthContext` salva o token e decodifica o Payload. O Router encaminha para `/`.
2. **Home (Dashboard):** A página `Home` (através do componente `Secoes.tsx`) busca os `Tópicos` e os `Módulos` disponíveis. Também busca os `Progressos em Andamento` do aluno logado.
3. **Resumo Automático de Onde Parou:** Quando o usuário clica num Módulo na Home:
   - Se ele já havia começado ("Em andamento"), o frontend chama a rota de "último acesso" daquele módulo, descobre em qual item o usuário parou, e monta uma URL de redirecionamento específica (Deep link, ex: `/presentation/1?type=PRODUCTION&id=5`).
   - Se é a primeira vez, ele é mandado para o início do módulo (`/presentation/1`).
4. **Dentro do Módulo:** A URL direciona para um dos componentes de renderização (ex: `<ProductionTexto>`). Esse componente acessa o `ModuleContext`, diz qual é o módulo (URL Param) e renderiza seu conteúdo. Ao terminar, o aluno pode clicar em avançar (`handleNextItem`), enviando a conclusão para a API e trocando a tela sem sair da rota ou mudando apenas o contexto.

---

## 7. Como Modificar e Expandir

Se você vai adicionar uma **nova funcionalidade ou tela**:
1. **Defina as Interfaces (Types):** Crie ou atualize as interfaces TypeScript para espelhar os DTOs do backend (Java). Garantir que o Typescript entenda os dados da API evita inúmeros bugs.
2. **Crie a Página/Componente:** Crie a tela principal em `/pages` e quebre partes complexas em `/components`. Se for uma tela de aprendizado/jogo novo (como um novo tipo de `Practice`), lembre-se de usar o `useModule` para acessar os dados e notificar progresso.
3. **Adicione ao Router:** Exponha a nova tela em `src/routes/index.tsx`. Se for área logada, coloque dentro do `children` protegido.
4. **Chamadas de API:** Não use `fetch` ou o `axios` padrão diretamente nas páginas. Use **sempre** a instância `api` exportada de `src/services/api.ts`.
5. **Estilização:** Dê prioridade a usar os componentes prontos do MUI (como `<Box>`, `<Card>`, `<Typography>`, e `Grid` v2 do `@mui/material`) em conjunto com as propriedades da prop `sx={{...}}`.

Boa sorte com o desenvolvimento do EnglishVerse!