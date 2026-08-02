# Handoff do EnglishVerse

Este documento registra o estado do projeto em **1º de agosto de 2026** para que
outra pessoa consiga continuar o trabalho sem depender de contexto informal.

## Estado do repositório

- Branch de trabalho: `feat/Raissa`.
- Commit que iniciou este handoff: `f367130`.
- A branch estava sincronizada com `origin/feat/Raissa` e sem alterações locais.
- Ela contém 18 commits de funcionalidade e documentação que ainda não estão em
  `main`.
- `main` possui apenas um merge commit adicional sem diferença de conteúdo do
  lado de `main`; ainda assim, confira novamente depois de `git fetch` antes de
  integrar.

**Próxima ação essencial:** abrir e revisar um pull request de `feat/Raissa` para
`main`. Não apague a branch antes de confirmar a integração no repositório remoto.

## O que está implementado

- Jornada PPP do discente: Presentation, Practice e Production.
- Autenticação JWT e acesso por perfis `DISCENTE` e `DOCENTE`.
- Progresso de módulos e retomada do último item.
- Gamificação com XP, níveis, sequência diária, conquistas, cápsulas e inventário.
- Teacher Studio para módulos, conteúdos, uploads e correção de Productions.
- Execução local com Docker Compose e documentação separada de frontend/backend.

Consulte [README.md](README.md),
[frontend/FRONTEND_DOCUMENTATION.md](frontend/FRONTEND_DOCUMENTATION.md) e
[backend/DOCUMENTACAO_BACKEND.md](backend/DOCUMENTACAO_BACKEND.md) para detalhes.

## Como iniciar

O caminho mais simples é o Docker:

```bash
docker compose up -d --build
docker compose logs -f
```

Os valores de desenvolvimento funcionam sem configuração adicional. Para outro
ambiente, copie `.env.example` para `.env` e troque, no mínimo,
`POSTGRES_PASSWORD` e `API_SECURITY_TOKEN_SECRET`.

Não há usuários padrão criados pelo seeder. Cadastre uma conta pela aplicação ou
por `POST /api/usuarios`. O e-mail de docente deve seguir o domínio institucional
documentado no README.

## Dados que não viajam com o Git

- O PostgreSQL local fica em `./postgres-data`, ignorado pelo Git.
- Os uploads ficam no volume Docker nomeado `backend_uploads`.
- O `.env` também é ignorado.

Antes de trocar de máquina ou responsável, faça backup do banco e do volume de
uploads. Clonar o repositório sozinho **não** recupera esses dados. Não versione
senhas, dumps, uploads reais nem o diretório `postgres-data`.

## Validação no momento do handoff

| Verificação | Estado | Observação |
| --- | --- | --- |
| `git status` | OK | antes desta revisão, a branch estava limpa e sincronizada com o remoto |
| `docker compose config --quiet` | OK | configuração válida |
| `docker compose build` | não executado | Docker Desktop instalado, mas o mecanismo Linux estava desligado |
| `npm ci` | OK | 390 pacotes instalados com Node 24.18.1 e npm 11.16.0 |
| `npm run lint` | falhou | 55 erros e 1 aviso; veja as pendências abaixo |
| `npm run build` | OK | build Vite 7.2.2 concluído em 2 de agosto de 2026 |
| `npm audit` | atenção | 16 vulnerabilidades: 12 altas, 3 moderadas e 1 baixa |
| `./mvnw test` | não executado | Java/JAVA_HOME não estavam disponíveis no ambiente da revisão |

Quem assumir deve executar as verificações pendentes antes de integrar a
branch. O backend possui atualmente apenas um teste de carregamento do contexto;
isso não representa cobertura funcional suficiente.

## Pendências conhecidas e ordem sugerida

### Antes de integrar ou publicar

1. Corrigir o lint do frontend e rodar os testes do backend com Java 17. O build
   do frontend já foi validado com Node 24, mas deve também ser coberto pela CI.
2. Fazer um teste manual completo: cadastro/login de ambos os perfis, execução de
   uma trilha PPP, envio/correção de Production, XP e uploads.
3. Abrir o PR `feat/Raissa` → `main` e registrar no PR o resultado dessas validações.
4. Em qualquer ambiente público, remover os padrões de desenvolvimento, usar
   segredos externos e restringir o CORS atualmente aberto para `*`.
5. Confirmar que qualquer banco externo antigo foi desativado ou teve suas
   credenciais rotacionadas. Endereços e padrões de desenvolvimento já apareceram
   no histórico do Git e não devem ser tratados como secretos.

### Dívida técnica relevante

- Criar testes de serviços, autorização, progresso, gamificação e Teacher Studio,
  além de testes do frontend e um workflow de CI.
- Corrigir os 55 erros do ESLint. Os grupos mais recorrentes são tipos `any`,
  atualização síncrona de estado dentro de efeitos e arquivos incompatíveis com
  a regra de Fast Refresh.
- Revisar as 16 vulnerabilidades relatadas pelo npm. Há correções disponíveis,
  mas atualizações automáticas não foram aplicadas para evitar mudanças de versão
  sem teste de regressão.
- Dividir o bundle principal do frontend, atualmente com cerca de 1,1 MB antes de
  gzip, usando carregamento sob demanda para as telas maiores.
- Adotar migrations versionadas (Flyway ou Liquibase) antes de produção. Hoje o
  projeto combina `ddl-auto=update` com um migrador específico de gamificação.
- Dividir `frontend/src/pages/TeacherStudio.tsx` (mais de 3 mil linhas) e os grandes
  serviços de gamificação/Teacher Studio em unidades menores.
- Substituir os indicadores fixos de `0%` em
  `ProductionOuvirCompletarContent.tsx` por progresso real ou removê-los.
- Trocar fallbacks externos de `via.placeholder.com` por assets locais para não
  depender de rede na Home.
- Revisar os `package.json`/`package-lock.json` da raiz: eles parecem sobras de uma
  configuração antiga, pois a aplicação ativa está em `frontend/`. Remova-os
  somente após confirmar que nenhum fluxo externo depende deles.
- Definir com os responsáveis a licença e a política de contribuição do projeto.

## Decisões que exigem os responsáveis

- O repositório ainda não declara licença.
- Não há uma estratégia formal de deploy/produção nem responsável operacional.
- Não há política definida para retenção, restauração ou anonimização dos dados de
  alunos e dos arquivos enviados.
- A regra de e-mail docente está acoplada ao domínio do IFPE Belo Jardim.

Esses pontos não devem ser decididos silenciosamente por quem assumir; precisam
de alinhamento com a equipe/instituição.
