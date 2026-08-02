# EnglishVerse

O EnglishVerse é uma plataforma web para ensino de língua inglesa por meio de cultura pop e conteúdos multimodais. A experiência de aprendizagem segue o modelo pedagógico PPP:

1. **Presentation:** exposição ao conteúdo por vídeos, áudios, imagens, textos, letras e transcrições.
2. **Practice:** exercícios objetivos e interativos com correção automática.
3. **Production:** atividades abertas, como textos, áudios, imagens e arquivos, avaliadas pelo docente.

O projeto oferece jornadas diferentes para discentes e docentes, com autenticação JWT, controle de acesso por perfil, acompanhamento de progresso e gamificação.

## Funcionalidades atuais

### Experiência do discente

- Catálogo de tópicos e módulos publicados.
- Continuação de módulos a partir do último item acessado.
- Atividades de Presentation, Practice e Production.
- Envio de respostas e arquivos para atividades de produção.
- Progresso detalhado por módulo.
- Jornada gamificada com XP, níveis, sequência diária, conquistas e Star Capsules.
- Coleção de recompensas e itens equipáveis.
- Feedback visual imediato ao receber XP.
- Tema claro ou escuro persistido no navegador.

### Experiência do docente

- Login e navegação exclusivos para o perfil `DOCENTE`.
- Dashboard com resumo de turmas, alunos, módulos e correções pendentes.
- Teacher Studio em `/teacher-studio`.
- Criação, edição, publicação e exclusão de módulos próprios.
- Editor visual para conteúdos de Presentation, Practice e Production.
- Pré-visualização do conteúdo como ele será exibido ao aluno.
- Upload de capas e mídias de atividades.
- Classificação dos conteúdos por filme, série, música, poesia ou quadrinhos.
- Correção de Productions com feedback, nota e status.
- Liberação de XP ao discente quando uma Production é aprovada.

## Stack

| Camada               | Tecnologias                                                           |
| -------------------- | --------------------------------------------------------------------- |
| Frontend             | React 19, TypeScript, Vite, React Router, Material UI e Axios         |
| Backend              | Java 17, Spring Boot 3.2, Spring Security, JWT, JPA/Hibernate e Maven |
| Banco de dados       | PostgreSQL 16, incluindo colunas JSONB para atividades flexíveis     |
| Infraestrutura local | Docker Compose, Nginx e volumes persistentes                          |

## Estrutura do repositório

```text
EnglishVerse/
├── backend/                       # API Spring Boot
│   ├── src/main/java/             # controllers, services, models, DTOs e repositories
│   ├── src/main/resources/        # configurações da aplicação
│   └── DOCUMENTACAO_BACKEND.md
├── frontend/                      # SPA React
│   ├── src/                       # páginas, componentes, contextos, rotas e serviços
│   ├── FRONTEND_DOCUMENTATION.md
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Execução com Docker

### Pré-requisitos

- Docker Desktop ou Docker Engine
- Docker Compose

Na raiz do repositório, execute:

```bash
docker compose up -d --build
```

Os valores padrão são adequados apenas para desenvolvimento. Para sobrescrevê-los,
copie `.env.example` para `.env` e altere as credenciais e o segredo JWT antes de
subir os contêineres.

Serviços disponíveis:

| Serviço        | Endereço                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- |
| Aplicação web | [http://localhost:5173](http://localhost:5173)                                             |
| API             | [http://localhost:8080](http://localhost:8080)                                             |
| Swagger UI      | [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) |
| PostgreSQL      | `localhost:5433`                                                                        |

Para acompanhar a inicialização:

```bash
docker compose logs -f
```

Para encerrar os contêineres:

```bash
docker compose down
```

Os dados do PostgreSQL são mantidos em `./postgres-data`. Os arquivos enviados ao backend são armazenados no volume Docker `backend_uploads`.

> As credenciais presentes no `docker-compose.yml` e a chave JWT do `application.properties` são padrões de desenvolvimento. Use segredos externos em ambientes publicados.

## Execução local para desenvolvimento

O banco de dados deve estar disponível em `localhost:5433`. É possível subir apenas o PostgreSQL:

```bash
docker compose up -d postgres_db
```

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Frontend, em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Em desenvolvimento, o Vite encaminha chamadas iniciadas por `/api` para `http://localhost:8080`. O destino pode ser alterado com `VITE_API_PROXY_TARGET`. Para utilizar uma URL de API explícita no cliente Axios, configure `VITE_API_URL`.

## Autenticação e perfis

O cadastro e o login recebem o campo `perfil`, com os valores:

- `DISCENTE`
- `DOCENTE`

Contas docentes exigem e-mail institucional no formato `nome.sobrenome@belojardim.ifpe.edu.br`. O JWT expira em duas horas e contém `id`, `nome`, `sub` (e-mail) e `perfil`.

## Verificações úteis

```bash
# Frontend
cd frontend
npm run lint
npm run build

# Backend
cd backend
./mvnw test
```

## Documentação técnica

- [Estado atual e guia de handoff](HANDOFF.md)
- [Documentação do frontend](frontend/FRONTEND_DOCUMENTATION.md)
- [Documentação do backend](backend/DOCUMENTACAO_BACKEND.md)
- API interativa: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Contato

### José Neto

- GitHub: [JoseNNeto](https://github.com/JoseNNeto)
- E-mail: <josenunesalmeidaneto@gmail.com>
- LinkedIn: [José Nunes de Almeida Neto](https://www.linkedin.com/in/jose-nunes-de-almeida-neto/)

### Raíssa Beatriz

- E-mail: <raissab2468@gmail.com>
- LinkedIn: [Raíssa Beatriz](https://www.linkedin.com/in/raíssa-beatriz)
