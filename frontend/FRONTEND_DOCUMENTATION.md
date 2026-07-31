# Documentação do Frontend — EnglishVerse

Esta documentação descreve o frontend atualmente implementado, incluindo a experiência de aprendizagem do discente, a gamificação e o Teacher Studio.

## 1. Stack e responsabilidades

O frontend é uma Single Page Application construída com:

- **React 19 e TypeScript:** componentes e tipagem da aplicação.
- **Vite 7:** servidor de desenvolvimento e build.
- **React Router DOM 7:** rotas públicas, protegidas e restritas por perfil.
- **Material UI 7 e Emotion:** componentes, temas e estilização principal.
- **Axios:** acesso à API REST.
- **Context API:** autenticação, tema, gamificação e estado dos módulos.
- **react-markdown, remark-gfm e remark-breaks:** exibição de conteúdo textual formatado.
- **react-dropzone:** seleção de arquivos.
- **dnd-kit:** infraestrutura para interações de ordenação no editor visual.

O Tailwind CSS está instalado no projeto, mas a interface atual usa principalmente Material UI, propriedades `sx` e CSS próprio.

## 2. Estrutura de `src`

```text
src/
├── assets/                  # imagens importadas pelo código
├── components/
│   ├── ActivityMedia/       # renderização de mídia nas atividades
│   ├── Auth/                # formulários de login e cadastro
│   ├── Gamification/        # jornada, cápsulas e coleção
│   ├── Home/                # seções da página inicial do discente
│   ├── Practice/            # componentes dos tipos de prática
│   ├── Presentation/        # visualizador de itens do módulo
│   ├── Production/          # componentes dos tipos de produção
│   ├── User/                # conta e segurança
│   ├── ProtectedRoute.tsx
│   └── RoleRoute.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── GamificationContext.tsx
│   ├── ModuleContext.tsx
│   └── ThemeContext.tsx
├── pages/                   # telas associadas às rotas
├── routes/index.tsx         # árvore de roteamento
├── services/api.ts          # instância Axios e interceptor JWT
├── theme/palette.ts         # tokens das paletas clara e escura
├── types/gamification.ts    # contratos TypeScript de gamificação
├── App.tsx                  # providers de tema e gamificação
└── main.tsx                 # montagem da aplicação e AuthProvider
```

## 3. Árvore de providers

Os providers são compostos nesta ordem:

```text
AuthProvider
└── ThemeContextProvider
    └── MUI ThemeProvider
        └── GamificationProvider
            └── RouterProvider
```

Essa ordem permite que a gamificação conheça o usuário autenticado e o tema ativo antes de renderizar as rotas.

### `AuthContext`

Responsabilidades:

- lê `authToken` do `localStorage`;
- decodifica o JWT com `jwt-decode`;
- remove tokens inválidos ou expirados;
- expõe `user`, `token`, `isAuthenticated`, `isLoading`, `login` e `logout`;
- interpreta o perfil como `DISCENTE` ou `DOCENTE`.

O payload esperado contém:

```ts
interface User {
  id: number;
  nome: string;
  sub: string;
  exp: number;
  perfil: 'DISCENTE' | 'DOCENTE';
}
```

Existe uma compatibilidade temporária para tokens antigos sem `perfil`: e-mails terminados em `@belojardim.ifpe.edu.br` são interpretados como docentes.

### `ThemeContext`

Gerencia os modos `dark` e `light`. A preferência é armazenada em `localStorage` com a chave `englishverse-theme`, aplicada antes da pintura da interface com `useLayoutEffect` e refletida em `data-theme` e `color-scheme` no elemento raiz.

As cores ficam centralizadas em `src/theme/palette.ts`; evite introduzir cores globais desconectadas dessa paleta.

### `GamificationContext`

É ativado somente para discentes e:

- carrega `GET /gamification/me/journey`;
- atualiza a jornada após recompensas;
- mostra o aviso de XP, conquistas e recompensa especial;
- abre Star Capsules;
- equipa itens do inventário.

O método `applyReward` recebe a recompensa devolvida pela API ao concluir uma atividade. Dessa forma, o feedback visual usa o resultado persistido no backend, sem calcular XP no navegador.

### `ModuleContext`

Coordena a experiência de um módulo:

- carrega módulo, Presentations, Practices, Productions e itens concluídos em paralelo;
- ordena as Presentations pelo campo `ordem`;
- forma a sequência `allItems`;
- mantém `activeItem` e `completedItems`;
- interpreta deep links como `?type=PRACTICE&id=5`;
- inicia o progresso do módulo para discentes;
- registra respostas de Practice;
- envia Productions e seus arquivos;
- conclui itens e encaminha a recompensa ao `GamificationContext`.

Uma Production enviada permanece pendente. Ela só é marcada como concluída e gera XP após aprovação docente.

## 4. Rotas e controle de acesso

| Rota | Tela | Acesso |
| --- | --- | --- |
| `/login` | Login com escolha de perfil | Pública |
| `/signup` | Cadastro | Pública |
| `/` | Home e módulos | `DISCENTE` |
| `/user` | Conta e segurança | Autenticado |
| `/presentation/:id` | Jornada do módulo | Autenticado |
| `/practice/marcar/:id` | Múltipla escolha | Autenticado |
| `/practice/completar/:id` | Preencher lacuna | Autenticado |
| `/practice/lista/:id` | Lista de palavras | Autenticado |
| `/practice/selecionar/:id` | Seleção de palavras | Autenticado |
| `/practice/relacionar/:id` | Relação entre colunas | Autenticado |
| `/practice/substituir/:id` | Substituição de palavras | Autenticado |
| `/production/arquivo/:id` | Upload de arquivo | Autenticado |
| `/production/texto/:id` | Produção textual | Autenticado |
| `/production/ouvir-completar/:id` | Completar a partir de mídia | Autenticado |
| `/production/ouvir-texto/:id` | Texto a partir de áudio | Autenticado |
| `/production/postagem/:id` | Imagem e texto | Autenticado |
| `/teacher-studio` | Área docente | `DOCENTE` |

`ProtectedRoute` exige autenticação. `RoleRoute` valida o perfil e redireciona o usuário para a área adequada: `/` para discentes ou `/teacher-studio` para docentes.

## 5. Comunicação com a API

A instância de Axios em `src/services/api.ts` usa:

```ts
baseURL: import.meta.env.VITE_API_URL || '/api'
```

O interceptor adiciona:

- `Authorization: Bearer <token>`, quando existe um token;
- `ngrok-skip-browser-warning: true`, para ambientes expostos pelo ngrok.

### Desenvolvimento

O Vite encaminha `/api` para:

```text
VITE_API_PROXY_TARGET ou http://localhost:8080
```

### Contêiner de produção local

O Nginx serve a SPA, aplica fallback para `index.html` e encaminha `/api/` ao serviço Docker `backend:8080`. O upstream usa resolução DNS dinâmica para continuar funcionando quando o contêiner do backend é recriado.

Ao chamar a API, use sempre a instância de `services/api.ts`. Os caminhos passados a ela não incluem o prefixo `/api`; por exemplo:

```ts
await api.get('/gamification/me/journey');
```

## 6. Fluxo do discente

1. O usuário entra como `DISCENTE` e recebe o JWT.
2. A Home carrega tópicos, módulos publicados e progressos em andamento.
3. Ao abrir um módulo, `ModuleContext` busca toda a trilha PPP.
4. Um deep link restaura o último item acessado, quando disponível.
5. Presentations e Practices concluídas registram progresso e podem gerar XP.
6. Productions são enviadas para correção e ficam com status pendente.
7. Quando o docente aprova uma Production, o backend conclui o item e concede o XP.
8. A jornada gamificada é recarregada após recompensas.

### Tipos suportados

Presentation:

- `VIDEO`
- `AUDIO`
- `IMAGEM`
- `TEXTO`

Practice:

- `MULTIPLA_ESCOLHA`
- `PREENCHER_LACUNA`
- `LISTA_PALAVRAS`
- `SELECIONAR_PALAVRAS`
- `RELACIONAR_COLUNAS`
- `SUBSTITUIR_PALAVRAS`

Production:

- `TEXTO_LONGO`
- `AUDIO`
- `FOTO_E_TEXTO`
- `UPLOAD_ARQUIVO`
- `COMPLETAR_IMAGEM`

## 7. Teacher Studio

A tela `pages/TeacherStudio.tsx` concentra três seções:

- **Visão geral:** totais de turmas, alunos, módulos e correções pendentes.
- **Editor de módulos:** módulos próprios editáveis e módulos da biblioteca para consulta.
- **Correções:** fila de Productions com resposta do aluno, status, feedback e nota.

### Editor de módulos

O docente pode:

- definir título, descrição, nível e status de publicação;
- enviar ou trocar a imagem de capa;
- visualizar a aparência do módulo para o aluno;
- adicionar, editar e excluir itens PPP;
- classificar o item como `FILM`, `SERIES`, `MUSIC`, `POETRY` ou `COMICS`;
- informar mídia por link ou upload;
- pré-visualizar mídia e a página da atividade;
- criar blocos formatados de conteúdo em Presentations.

O editor envia um contrato unificado para `/teacher-studio/conteudos`. O backend converte `etapa` e `tipo` na entidade correta e mantém os dados específicos em JSONB quando necessário.

### Uploads usados pelo Studio

| Uso | Endpoint | Regra no frontend/backend |
| --- | --- | --- |
| Capa | `POST /files/covers/upload` | Imagem, até 8 MB |
| Mídia de conteúdo | `POST /files/content/upload` | Imagem, áudio, vídeo ou PDF, até 100 MB |

Os endpoints retornam `fileDownloadUri`, que é salvo no módulo ou conteúdo.

### Correções

O docente escolhe `APROVADA` ou `AJUSTES_SOLICITADOS`, informa feedback e pode atribuir nota. A resposta da API informa se o XP foi liberado. Uma Production já aprovada não pode voltar para ajustes depois que o XP tiver sido concedido.

## 8. Gamificação na interface

A jornada do aluno é exibida pelos componentes em `components/Gamification`:

- `MyJourney`: visão geral da jornada;
- `JourneyCard`: progresso de cada módulo;
- `JourneyHeaderChip`: resumo no cabeçalho;
- `StarCapsules`: cápsulas disponíveis e abertas;
- `MyCollection`: conquistas e inventário.

Os tipos compartilhados estão em `src/types/gamification.ts`. Ao alterar um DTO de gamificação no backend, atualize o tipo correspondente antes de consumir o novo campo.

## 9. Desenvolvimento e verificação

```bash
cd frontend
npm install
npm run dev
```

Antes de entregar uma alteração:

```bash
npm run lint
npm run build
```

O build executa `tsc -b` antes de gerar os arquivos do Vite.

## 10. Como expandir

### Nova tela

1. Crie o componente de alto nível em `pages`.
2. Extraia partes reutilizáveis para `components`.
3. Adicione a rota em `routes/index.tsx`.
4. Escolha conscientemente entre rota pública, protegida ou restrita por perfil.

### Novo tipo de atividade

1. Adicione o valor equivalente no enum do backend.
2. Atualize os tipos de `ModuleContext`.
3. Crie o componente de execução do aluno.
4. Inclua o tipo e seus campos no editor do Teacher Studio.
5. Atualize o mapeamento de navegação/renderização.
6. Confirme o contrato JSONB e a conclusão de progresso.

### Nova chamada HTTP

1. Espelhe o DTO Java com uma interface TypeScript.
2. Use `api`, nunca uma instância Axios avulsa.
3. Não calcule permissões, progresso ou XP somente no cliente.
4. Trate estados de carregamento, vazio e erro.
