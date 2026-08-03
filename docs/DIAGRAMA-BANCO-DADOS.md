# Diagrama atualizado do banco de dados

Este documento representa o modelo de dados implementado atualmente no backend do EnglishVerse. A fonte do diagrama são as entidades JPA em `backend/src/main/java/com/joseneto/englishverse/model`.

O [quadro antigo do projeto no Miro](https://miro.com/app/board/uXjVJ1ZyoZU=/?share_link_id=234038937183) deve ser preservado como referência histórica durante a revisão deste DER.

## Como levar para o Miro

1. Abra o quadro e adicione o aplicativo **Mermaid Diagrams**.
2. Copie todo o conteúdo de [`diagrama-banco-dados.mmd`](./diagrama-banco-dados.mmd).
3. Cole o código no editor Mermaid do Miro e gere o diagrama.
4. Mantenha o diagrama antigo em um frame chamado `DER — legado` e nomeie o novo como `DER — atual` até a equipe revisar a atualização.

## O que mudou em relação ao diagrama antigo

- Foram adicionadas as tabelas de turmas: `turmas`, `turma_alunos` e `turma_modulos`.
- Foi adicionado o acompanhamento detalhado em `progresso_itens`.
- Foi incorporado o domínio de gamificação: perfil, XP, conquistas, cápsulas e inventário.
- `modulos` agora registra nível de dificuldade e o usuário que criou o conteúdo.
- Recursos, práticas e produções agora possuem classificação de mídia.
- Submissões de produção agora registram status da correção, nota, concessão de XP e data da correção.
- Recursos de apresentação agora suportam letra e blocos JSON, além da transcrição.

## Observações de modelagem

- `progresso_itens.item_id` é uma referência lógica. `item_type` informa se o ID pertence a `recursos_apresentacao`, `practice_atividades` ou `production_challenges`; não existe FK física para essas tabelas.
- `xp_events.source_id` também é uma referência lógica definida por `source_type`, sem FK física.
- Os pares marcados como `UK` em tabelas associativas representam restrições únicas compostas.
- O backend está configurado com `spring.jpa.hibernate.ddl-auto=update`. Portanto, uma base antiga pode conservar colunas obsoletas; este diagrama representa o modelo vigente no código, não eventuais resíduos de uma base local.

## Organização recomendada no quadro

Para facilitar a leitura, use quatro áreas visuais:

- **Conteúdo:** `topicos`, `modulos`, apresentações, práticas e produções.
- **Aprendizagem:** respostas, submissões e progresso.
- **Gestão docente:** `usuarios`, `turmas` e suas associações.
- **Gamificação:** perfil, eventos de XP, conquistas, cápsulas e recompensas.
