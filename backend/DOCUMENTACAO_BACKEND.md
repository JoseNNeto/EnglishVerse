# Documentação do Backend — EnglishVerse

Esta documentação descreve a API atualmente implementada no EnglishVerse, com foco no domínio pedagógico, autenticação por perfil, progresso, gamificação, Teacher Studio e armazenamento de arquivos.

## 1. Stack

- Java 17
- Spring Boot 3.2.5
- Spring Web
- Spring Data JPA e Hibernate 6
- Spring Security
- JWT com JJWT 0.12
- PostgreSQL
- Bean Validation
- Lombok
- Springdoc OpenAPI
- Maven Wrapper

A aplicação segue a separação:

```text
Controller -> Service -> Repository -> PostgreSQL
                  |
                 DTO
```

- `controller`: publica endpoints REST e interpreta a requisição.
- `service`: concentra autorização de domínio, validações e transações.
- `repository`: consultas e persistência com Spring Data JPA.
- `model`: entidades e enums persistidos.
- `dtos`: contratos específicos de entrada e saída.
- `config`: segurança, carga inicial, classificação cultural e ajustes de schema.

## 2. Configuração e execução

As configurações padrão ficam em `src/main/resources/application.properties`.

| Propriedade | Padrão local | Finalidade |
| --- | --- | --- |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5433/db_englishverse` | conexão PostgreSQL |
| `spring.datasource.username` | `neto` | usuário local |
| `spring.datasource.password` | `englishverse` | senha local |
| `spring.jpa.hibernate.ddl-auto` | `update` | atualização automática do schema |
| `spring.servlet.multipart.max-file-size` | `100MB` | limite global por arquivo |
| `spring.servlet.multipart.max-request-size` | `100MB` | limite global da requisição |
| `api.security.token.secret` | valor de desenvolvimento | assinatura JWT |
| `app.gamification.zone-id` | `America/Fortaleza` | data da sequência diária |

Variáveis de ambiente do Spring sobrescrevem essas propriedades. Em ambientes publicados, forneça externamente pelo menos as credenciais do banco e `API_SECURITY_TOKEN_SECRET`.

### Execução local

Com o PostgreSQL disponível em `localhost:5433`:

```bash
./mvnw spring-boot:run
```

No Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

### Testes e build

```bash
./mvnw test
./mvnw clean package
```

### Docker

O `docker-compose.yml` configura a URL do datasource para `postgres_db:5432` e monta o volume `backend_uploads` em `/app/uploads`. Assim, capas, mídias e arquivos enviados sobrevivem à recriação do contêiner.

## 3. Domínio pedagógico

O conteúdo segue o modelo PPP.

```text
Topico
└── Modulo
    ├── RecursoApresentacao
    ├── PracticeAtividade
    └── ProductionChallenge
```

### Conteúdo

- `Topico`: agrupamento temático ou nível.
- `Modulo`: aula com título, descrição, capa, publicação, nível e docente criador opcional.
- `RecursoApresentacao`: conteúdo de Presentation com tipo, URL, letra, transcrição, blocos formatados, ordem e categoria cultural.
- `PracticeAtividade`: exercício objetivo; detalhes variáveis ficam em `dadosAtividade` como JSONB.
- `ProductionChallenge`: produção aberta; detalhes variáveis ficam em `dadosDesafio` como JSONB.

Tipos aceitos:

| Etapa | Enum | Valores |
| --- | --- | --- |
| Presentation | `TipoRecurso` | `VIDEO`, `AUDIO`, `IMAGEM`, `TEXTO` |
| Practice | `TipoAtividade` | `MULTIPLA_ESCOLHA`, `PREENCHER_LACUNA`, `LISTA_PALAVRAS`, `SELECIONAR_PALAVRAS`, `RELACIONAR_COLUNAS`, `SUBSTITUIR_PALAVRAS` |
| Production | `TipoDesafio` | `AUDIO`, `TEXTO_LONGO`, `FOTO_E_TEXTO`, `UPLOAD_ARQUIVO`, `COMPLETAR_IMAGEM` |

Um item pode receber uma `MediaCategory`: `FILM`, `SERIES`, `MUSIC`, `POETRY` ou `COMICS`.

### Turmas e autoria

- `Usuario` possui perfil `DISCENTE` ou `DOCENTE`.
- `Turma` pertence a um docente e mantém relações muitos-para-muitos com alunos e módulos.
- `Modulo.criadoPor` identifica módulos autorais.
- Módulos sem criador e publicados compõem a biblioteca EnglishVerse.
- Níveis de módulo: `INICIANTE`, `INTERMEDIARIO` e `AVANCADO`.
- Idiomas de turma: `PORTUGUES` e `INGLES`.

### Respostas e progresso

- `PracticeRespostaUsuario`: resposta JSONB e resultado objetivo.
- `ProductionSubmissao`: resposta JSONB, feedback, nota, status, data de correção e controle de XP concedido.
- `Progresso`: estado geral do aluno no módulo.
- `ProgressoItem`: conclusão de cada item PPP.

Os estados gerais são `NAO_INICIADO`, `EM_ANDAMENTO` e `CONCLUIDO`. A conclusão detalhada permite calcular a porcentagem e recuperar o último acesso.

Uma Production não é concluída no envio. A conclusão e o XP ocorrem quando o docente a aprova.

## 4. Autenticação e autorização

### Cadastro e login

Endpoints públicos:

- `POST /api/usuarios`
- `POST /api/auth/login`

Cadastro:

```json
{
  "nome": "Ada Lovelace",
  "email": "ada@example.com",
  "senha": "senha",
  "perfil": "DISCENTE"
}
```

Login:

```json
{
  "email": "ada@example.com",
  "senha": "senha",
  "perfil": "DISCENTE"
}
```

O login devolve:

```json
{
  "token": "<jwt>"
}
```

O JWT é assinado com HS256, expira em duas horas e contém:

- `iss`: `englishverse-api`
- `sub`: e-mail
- `id`
- `nome`
- `perfil`
- datas de emissão e expiração

O cliente autentica chamadas protegidas com:

```http
Authorization: Bearer <token>
```

### Regra de perfil institucional

O cadastro docente exige um e-mail no formato `nome.sobrenome@belojardim.ifpe.edu.br`. E-mails desse domínio não podem ser cadastrados como discentes. O perfil informado no login deve coincidir com o perfil da conta.

Para registros legados cujo campo `perfil` seja nulo, o domínio institucional é usado como compatibilidade para resolver o perfil.

### Segurança das rotas

- Swagger, ping, cadastro e login são públicos.
- Download de capas e mídias de conteúdo é público.
- Upload de capas e conteúdos exige `DOCENTE`.
- Rotas de gamificação e escrita de progresso/respostas exigem `DISCENTE`.
- Escrita nas rotas CRUD pedagógicas exige `DOCENTE`.
- As demais rotas exigem autenticação.
- O `TeacherStudioService` também verifica o perfil e a propriedade da turma ou módulo.

A API é stateless, usa BCrypt para senhas, desabilita CSRF e atualmente aceita CORS de qualquer origem. Restrinja as origens antes de uma publicação em produção.

## 5. Teacher Studio

O Teacher Studio fornece um contrato agregado para a área docente.

### Dashboard

`GET /api/teacher-studio`

Retorna:

```text
TeacherStudioDashboardDTO
├── resumo        # totais de turmas, alunos, módulos e pendências
├── turmas        # turmas do docente
├── modulos       # módulos próprios e biblioteca publicada
├── conteudos     # itens dos módulos próprios
└── submissoes    # Productions disponíveis para correção
```

Cada módulo informa se é `editavel` e se pertence à `biblioteca`. Somente o criador pode alterar ou excluir um módulo autoral.

### Endpoints

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `GET` | `/api/teacher-studio` | carregar dashboard agregado |
| `POST` | `/api/teacher-studio/turmas` | criar turma e associar alunos encontrados por e-mail |
| `POST` | `/api/teacher-studio/modulos` | criar módulo próprio |
| `PUT` | `/api/teacher-studio/modulos/{id}` | atualizar módulo próprio |
| `DELETE` | `/api/teacher-studio/modulos/{id}` | excluir módulo próprio e dados dependentes |
| `POST` | `/api/teacher-studio/conteudos` | criar item PPP |
| `PUT` | `/api/teacher-studio/conteudos/{etapa}/{id}` | atualizar item PPP |
| `DELETE` | `/api/teacher-studio/conteudos/{etapa}/{id}` | excluir item PPP e dependências |
| `PUT` | `/api/teacher-studio/submissoes/{id}/correcao` | corrigir Production |

### Contrato de módulo

```json
{
  "turmaId": null,
  "titulo": "Present Perfect com cinema",
  "descricao": "Descrição para o aluno",
  "imagemCapaUrl": "/api/files/covers/arquivo.jpg",
  "nivel": "INTERMEDIARIO",
  "publicado": false
}
```

Se `turmaId` for informado, a turma deve pertencer ao docente. O tópico do módulo é resolvido a partir do nível.

### Contrato unificado de conteúdo

```json
{
  "moduloId": 10,
  "etapa": "PRATICA",
  "tipo": "MULTIPLA_ESCOLHA",
  "classificacao": "FILM",
  "instrucao": "Selecione a alternativa correta.",
  "midiaUrl": "",
  "transcricao": "",
  "ordem": 1,
  "dados": {
    "pergunta": "Exemplo",
    "opcoes": ["A", "B"],
    "resposta_correta": "A"
  }
}
```

`etapa` aceita `APRESENTACAO`, `PRATICA` ou `PRODUCTION`. O serviço converte `tipo` no enum da entidade correspondente.

### Correção de Production

```json
{
  "status": "APROVADA",
  "feedback": "Ótimo uso do vocabulário.",
  "nota": 9
}
```

Os estados são:

- `PENDENTE`
- `APROVADA`
- `AJUSTES_SOLICITADOS`

Ao aprovar pela primeira vez, o serviço marca o item como concluído e libera o XP. O campo `xpConcedido` impede premiação duplicada; depois da liberação, a submissão não pode voltar para ajustes.

## 6. Upload e entrega de arquivos

Os arquivos são gravados sob o diretório `uploads`, separados em:

```text
uploads/
├── covers/
├── content/
└── <arquivos enviados por discentes>
```

O nome persistido recebe um UUID para evitar colisões. O caminho é normalizado e validado para impedir que o nome saia do diretório esperado.

| Método | Endpoint | Acesso | Limite e validação |
| --- | --- | --- | --- |
| `POST` | `/api/files/upload` | Autenticado | até 10 MB |
| `POST` | `/api/files/covers/upload` | `DOCENTE` | imagem, até 8 MB |
| `POST` | `/api/files/content/upload` | `DOCENTE` | imagem, áudio, vídeo ou PDF, até 100 MB |
| `GET` | `/api/files/{fileName}` | Autenticado | arquivo de submissão |
| `GET` | `/api/files/covers/{fileName}` | Público | capa |
| `GET` | `/api/files/content/{fileName}` | Público | mídia de atividade |

Uploads retornam `fileName`, `fileDownloadUri` e `size`. O download usa disposição `inline` e tenta detectar o MIME type.

## 7. Gamificação

A gamificação é calculada e persistida no backend. As entidades centrais são:

- `UserGamificationProfile`
- `XpEvent`
- `Achievement`
- `UserAchievement`
- `StarCapsule`
- `UserRewardItem`

### Política de XP

| Evento | XP |
| --- | ---: |
| Presentation concluída | 10 |
| Practice concluída | 20 |
| Production aprovada | 30 |
| Etapa completa de Practice | 20 |
| Módulo concluído | 50 |
| Tópico concluído | 100 |
| Primeira atividade válida do dia | 5 |
| Star Capsule aberta | 10 |

A primeira repetição de um item rende 50% do XP-base. Repetições posteriores não rendem XP nem bônus diário.

Chaves únicas nos eventos impedem duplicidade de premiação para o mesmo usuário e origem.

### Níveis

| Código | XP mínimo | Próximo marco |
| --- | ---: | ---: |
| `SPARK` | 0 | 100 |
| `EXPLORER` | 100 | 250 |
| `VOYAGER` | 250 | 450 |
| `PATHFINDER` | 450 | 700 |
| `COSMIC_LEGEND` | 700 | nível máximo |

### API de gamificação

Todas as rotas abaixo exigem `DISCENTE`:

| Método | Endpoint | Retorno |
| --- | --- | --- |
| `GET` | `/api/gamification/me` | resumo do perfil |
| `GET` | `/api/gamification/me/journey` | jornada agregada |
| `GET` | `/api/gamification/me/timeline` | últimos eventos de XP |
| `GET` | `/api/gamification/me/achievements` | conquistas bloqueadas e liberadas |
| `POST` | `/api/gamification/me/capsules/{id}/open` | cápsula, XP e recompensa |
| `PUT` | `/api/gamification/me/inventory/{id}/equip` | item equipado |

Categorias de conquista: `CONSISTENCY`, `CONTENT_MASTERY` e `POP_CULTURE`.

Recompensas especiais persistidas: `ORBITAL_SHIELD`, `PROFILE_TITLE` e `AVATAR_FRAME`.

## 8. Demais grupos de endpoints

| Prefixo | Responsabilidade |
| --- | --- |
| `/api/auth` | login |
| `/api/usuarios` | cadastro, consulta e conta |
| `/api/topicos` | tópicos |
| `/api/modulos` | módulos e busca |
| `/api/recursos` | Presentations |
| `/api/practice` | atividades de Practice |
| `/api/practice-respostas` | respostas objetivas |
| `/api/production` | desafios de Production |
| `/api/submissoes` | submissões e feedback |
| `/api/progresso` | início, conclusão, itens e último acesso |
| `/api/files` | uploads e downloads |
| `/api/gamification` | jornada e recompensas |
| `/api/teacher-studio` | gestão docente agregada |

Com a aplicação em execução, consulte os contratos expostos em:

- Swagger UI: <http://localhost:8080/swagger-ui/index.html>
- OpenAPI JSON: <http://localhost:8080/v3/api-docs>

## 9. Inicialização e evolução do schema

Na inicialização:

- `DataSeeder` cria o conteúdo pedagógico base quando ele ainda não existe.
- `GamificationAchievementSeeder` cadastra conquistas.
- `CultureContentSeeder` aplica categorias culturais ao conteúdo conhecido.
- `GamificationSchemaMigrator` atualiza constraints específicas da gamificação e das categorias de mídia.

O projeto usa `ddl-auto=update`, mas o migrador contém SQL direcionado ao PostgreSQL. Mudanças estruturais maiores devem ser levadas para uma ferramenta versionada de migrations, como Flyway ou Liquibase, antes de uma implantação de produção.

## 10. Como implementar uma nova funcionalidade

1. Modele ou atualize a entidade e os enums.
2. Crie DTOs de entrada e saída; evite expor entidades com relações desnecessárias.
3. Adicione métodos de consulta ao repository.
4. Implemente validação, autorização e transação no service.
5. Exponha o endpoint no controller.
6. Atualize `SecurityConfig` quando o acesso depender de método ou perfil.
7. Atualize os tipos TypeScript e o consumo no frontend.
8. Adicione testes de regra de negócio e autorização.
9. Atualize esta documentação e o contrato OpenAPI.

Para um novo tipo de atividade, também atualize:

- o enum da etapa correspondente;
- a estrutura JSONB esperada;
- o editor do Teacher Studio;
- o componente de execução do discente;
- a regra de progresso e, se aplicável, a premiação.
