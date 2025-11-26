Sim, você **pode e deve** apagar a tabela `usuarios` usando o DBeaver para forçar a recriação! Isso é exatamente o que precisamos fazer.

Com `ddl-auto=create` ativo no seu `application.properties` (que é o que está lá agora), quando você iniciar a aplicação, ela irá recriar a tabela `usuarios` do zero, com o schema correto que não inclui mais a coluna `tipo_usuario`.

**Passos a seguir com DBeaver:**

1.  No DBeaver, conecte-se ao seu banco de dados `db_englishverse`.
2.  Na árvore de navegação, localize a tabela `usuarios` (geralmente em `Databases > db_englishverse > Schemas > public > Tables`).
3.  Clique com o botão direito na tabela `usuarios` e selecione `Drop` (ou `Excluir`). Confirme a exclusão.
4.  **Feche o DBeaver** para garantir que não há conexões abertas com o banco de dados.
5.  Reinicie sua aplicação: `docker-compose up --build`.

Depois que a aplicação iniciar, teste novamente a criação de um usuário com o JSON simples que te passei:

```json
{
  "nome": "Usuario Teste",
  "email": "teste@email.com",
  "senha": "1234"
}
```

Se isso funcionar, me avise, e então vamos voltar o `ddl-auto` para `update` para que você não apague o banco de dados toda vez.