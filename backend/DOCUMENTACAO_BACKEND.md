# Documentação do Backend - EnglishVerse

Este documento detalha o funcionamento do backend do sistema **EnglishVerse**, fornecendo informações cruciais para desenvolvedores que precisam dar manutenção ou implementar novas funcionalidades.

## 1. Visão Geral e Stack Tecnológica
O backend é uma API RESTful construída em Java, focada em fornecer uma plataforma de aprendizado de inglês. A arquitetura segue o padrão MVC (Model-View-Controller) tradicional, separado em camadas: *Controllers*, *Services*, *Repositories*, *Models* (Entidades) e *DTOs*.

**Tecnologias Principais:**
*   **Linguagem:** Java 17
*   **Framework:** Spring Boot 3.2.5
*   **Banco de Dados:** PostgreSQL
*   **ORM:** Spring Data JPA / Hibernate 6
*   **Segurança:** Spring Security com JWT (JSON Web Tokens)
*   **Documentação da API:** Springdoc OpenAPI (Swagger)
*   **Ferramentas adicionais:** Lombok (para redução de código boilerplate) e Maven.

---

## 2. Modelagem de Dados e Domínio

A lógica de negócios principal do EnglishVerse gira em torno da estrutura de aulas e do progresso do usuário. A metodologia de ensino parece seguir a abordagem **PPP (Presentation, Practice, Production)**.

### Estrutura de Ensino
*   **`Topico`**: A categoria mais alta de organização de conteúdo (ex: "Verbo To Be", "Tempos Verbais").
*   **`Modulo`**: Uma aula específica que pertence a um `Topico`. Possui título, descrição, imagem de capa e um status de publicação (`publicado`).

### Etapas de Aprendizado (A Trilha do Módulo)
Dentro de um `Modulo`, o conteúdo é dividido em três fases:

1.  **`RecursoApresentacao` (Apresentação):** Material de estudo passivo para o aluno. Pode ser `VIDEO`, `AUDIO`, `IMAGEM` ou `TEXTO`. Contém URL da mídia, e opcionalmente letra/transcrição e ordem de exibição.
2.  **`PracticeAtividade` (Prática):** Exercícios objetivos com correção automática. 
    *   *Tipos:* `MULTIPLA_ESCOLHA`, `PREENCHER_LACUNA`, `LISTA_PALAVRAS`, etc.
    *   *Destaque Técnico:* Usa **JSONB** (`@JdbcTypeCode(SqlTypes.JSON)`) no campo `dadosAtividade` para armazenar a estrutura flexível da pergunta, opções e resposta correta no PostgreSQL.
3.  **`ProductionChallenge` (Produção):** Desafios abertos onde o aluno precisa produzir conteúdo.
    *   *Tipos:* `AUDIO`, `TEXTO_LONGO`, `FOTO_E_TEXTO`, etc.
    *   *Destaque Técnico:* Também usa **JSONB** para `dadosDesafio`, permitindo flexibilidade dependendo do formato do desafio exigido.

### Interação e Progresso do Usuário
*   **`Usuario`**: Entidade base do aluno/professor. Autenticação é baseada no `email` e `senha`.
*   **Respostas às Atividades:**
    *   **`PracticeRespostaUsuario`**: Armazena a resposta de um usuário a um exercício prático. Salva a resposta em **JSONB** e um booleano `estaCorreta` para contabilizar os acertos.
    *   **`ProductionSubmissao`**: Armazena a submissão de um desafio de produção. Contém a `resposta` em **JSONB** e um campo `feedbackProfessor` para correção posterior.
*   **Gerenciamento de Progresso:**
    *   **`Progresso`**: Controla o status geral de um usuário em um `Modulo` (`NAO_INICIADO`, `EM_ANDAMENTO`, `CONCLUIDO`). Registra data de início e conclusão.
    *   **`ProgressoItem`**: Controla detalhadamente quais itens individuais (`PRESENTATION`, `PRACTICE`, `PRODUCTION`) o aluno já visualizou/resolveu dentro do módulo. Essencial para o cálculo de "porcentagem" ou para o recurso de "Continuar de onde parou" (que busca o `UltimoAcessoDTO`).

---

## 3. Arquitetura e Fluxo de Dados

*   **Controllers (`/controller`)**: Expõem os endpoints REST. Utilizam `ResponseEntity` e chamam os métodos da camada Service. A maioria das rotas está sob `/api/*`.
*   **Services (`/service`)**: Contêm toda a regra de negócio. Controllers nunca devem acessar Repositories diretamente. É nos Services (ex: `ProgressoService`) onde validações são feitas antes de salvar no banco.
*   **Repositories (`/repository`)**: Interfaces do Spring Data JPA. Elas estendem `JpaRepository` e oferecem acesso aos dados.
*   **DTOs (`/dtos`)**: Data Transfer Objects são usados para transitar dados entre o backend e o frontend de forma segura, não expondo as Entidades diretamente quando não é necessário (ex: requisições e respostas do `ProgressoController`).

---

## 4. Segurança e Autenticação

A segurança é gerenciada no pacote `/config`.

*   **`SecurityConfig`**: Define quais rotas são públicas (como login, criação de usuário, ping e swagger) e bloqueia o restante, exigindo autenticação (`.anyRequest().authenticated()`). Configura o CORS para aceitar requisições de qualquer origem (`*`). A política de sessão é `STATELESS`, padrão para APIs REST.
*   **`SecurityFilter`**: Um filtro interceptador executado a cada requisição para capturar o Header `Authorization`, extrair o token JWT e validar usando o `TokenService`. Se válido, adiciona o contexto de autenticação do usuário na thread atual (`SecurityContextHolder`).
*   **`TokenService`**: Gera e valida os tokens JWT usando a biblioteca `jjwt`. A chave secreta (`api.security.token.secret`) é injetada do arquivo `application.properties`. O token dura 2 horas e inclui o `id`, `nome` e `email` do usuário em seus claims. O usuário autenticado pode ser recuperado nos Controllers através da anotação `@AuthenticationPrincipal Usuario usuario`.

---

## 5. Destaques Técnicos Importantes

### O Uso do JSONB (PostgreSQL)
A adoção do **JSONB** no Hibernate 6 para tabelas como `PracticeAtividade`, `ProductionChallenge`, `PracticeRespostaUsuario` e `ProductionSubmissao` é a característica arquitetural mais forte desse projeto.

**Por que isso foi feito?**
Evita a criação de dezenas de tabelas relativas e complexas para cada tipo de exercício (ex: uma tabela pra múltipla escolha, outra pra lacuna, etc.). Em vez disso, a estrutura exata do que o frontend precisa renderizar ou enviar fica livre dentro do Map Java, traduzido nativamente e de forma indexável como JSONB no Postgres.

**Atenção ao manter:** Sempre que lidar com esses campos, você estará lidando com `Map<String, Object>`. Garanta que a documentação das chaves de cada JSON esteja clara ou bem definida entre as equipes de Frontend e Backend.

### Soft Delete x Hard Delete
Atualmente, métodos como `moduloService.deletar(id)` não estão explicitados com um marcador lógico na entidade `Modulo` (como um booleano `ativo`), o que indica que as deleções no sistema podem ser de fato remoções do banco (Hard Delete). *Verifique a implementação de `deletar()` nos services caso precise evitar quebra de constraints de chaves estrangeiras com históricos de progressos de alunos.*

---

## 6. Guia Prático: Como Implementar uma Nova Feature

**Cenário de exemplo: Adicionando um novo tipo de atividade prática ("Ordenar Frase").**

1.  **Atualizar o Enum**: Vá em `TipoAtividade.java` e adicione `ORDENAR_FRASE`. (Dica: o código comentado até já possui isso em mente).
2.  **Acordar o Contrato JSON**: Defina com o Frontend como será o formato JSONB armazenado no banco para este tipo. Exemplo:
    ```json
    {
      "frase_desordenada": ["blue", "The", "is", "sky"],
      "ordem_correta": ["The", "sky", "is", "blue"]
    }
    ```
3.  **Lógica de Correção**: O frontend validará localmente ou enviará o array ordenado para o backend validar? Como o backend já salva o `estaCorreta` em `PracticeRespostaUsuario`, garanta que se o backend for responsável pela validação, a lógica em `PracticeRespostaUsuarioService` (ou onde a submissão for processada) saiba tratar e comparar o JSON do tipo `ORDENAR_FRASE`.
4.  **Testes**: Se existirem testes automatizados em `/test`, crie um mock para validar a inserção e correção deste novo tipo de atividade.

## 7. Configuração Local e Execução

Para rodar o projeto localmente:
1. Tenha o **Java 17** e **Maven** instalados.
2. Suba uma instância local do **PostgreSQL** (porta padrão 5432).
3. Crie um banco chamado `db_englishverse`.
4. Ajuste o `src/main/resources/application.properties` se necessário (o padrão já espera `localhost:5432`, user `neto` e senha `englishverse`).
5. A propriedade `spring.jpa.hibernate.ddl-auto=update` fará com que o Spring crie/atualize as tabelas automaticamente de acordo com as classes `@Entity`.
6. Rode o projeto na raiz com `mvn spring-boot:run` ou pela sua IDE na classe `EnglishverseApplication`.
7. O Swagger (UI da API) estará disponível em `http://localhost:8080/swagger-ui.html`.