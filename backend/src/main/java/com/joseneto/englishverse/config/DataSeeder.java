package com.joseneto.englishverse.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.joseneto.englishverse.model.Modulo;
import com.joseneto.englishverse.model.PracticeAtividade;
import com.joseneto.englishverse.model.ProductionChallenge;
import com.joseneto.englishverse.model.RecursoApresentacao;
import com.joseneto.englishverse.model.Topico;
import com.joseneto.englishverse.model.enums.TipoAtividade;
import com.joseneto.englishverse.model.enums.TipoDesafio;
import com.joseneto.englishverse.model.enums.TipoRecurso;
import com.joseneto.englishverse.repository.ModuloRepository;
import com.joseneto.englishverse.repository.PracticeAtividadeRepository;
import com.joseneto.englishverse.repository.ProductionChallengeRepository;
import com.joseneto.englishverse.repository.RecursoApresentacaoRepository;
import com.joseneto.englishverse.repository.TopicoRepository;

@Configuration
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private TopicoRepository topicoRepository;

    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private RecursoApresentacaoRepository recursoRepository;

    @Autowired
    private PracticeAtividadeRepository practiceRepository;

    @Autowired
    private ProductionChallengeRepository productionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Verificação de Segurança: Só cria se a tabela estiver vazia
        System.out.println(">>> Iniciando o Data Seeder (Nível 1)...");

        // 1. CRIAR TÓPICO "INICIANTE"
        Topico topicoIniciante = topicoRepository.findByNome("Iniciante")
            .orElseGet(() -> {
                Topico novoTopico = new Topico();
                novoTopico.setNome("Iniciante");
                novoTopico.setDescricao("Fundamentos essenciais: Pronomes, Verbo To Be, Artigos e Advérbios de Frequencia.");
                return topicoRepository.save(novoTopico);
            });

        System.out.println(">>> Tópico 'Iniciante' verificado/criado com ID: " + topicoIniciante.getId());

        // --- CRIAR O MÓDULO ---
        moduloRepository.findByTitulo("Subject Pronouns (I, You, He, She, It, We, They)")
            .ifPresentOrElse(
                (mod) -> System.out.println(">>> Módulo 'Subject Pronouns' já existe. ID: " + mod.getId()),
                () -> {
                    System.out.println(">>> Cadastrando Módulo: Subject Pronouns...");
                    Modulo modPronouns = new Modulo();
                    modPronouns.setTopico(topicoIniciante);
                    modPronouns.setTitulo("Subject Pronouns (I, You, He, She, It, We, They)");
                    modPronouns.setDescricao("Aprenda os pronomes pessoais com clássicos da música, esquetes de comédia, trechos de filmes e memes!");
                    modPronouns.setImagemCapaUrl("https://img.youtube.com/vi/5tc0gLSSU1M/hqdefault.jpg"); // Capa dos Beatles
                    modPronouns.setPublicado(true);
                    modPronouns = moduloRepository.save(modPronouns);

                    // ==========================================
                    // ETAPA 1: PRESENTATION (Os Vídeos de Estudo)
                    // ==========================================
                    
                    // 1. And I Love Her (Beatles)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/5tc0gLSSU1M?si=mi-GCh9941-MoVUx", 
                        "**I** give her all my love\nThat's all **I** do\nAnd if **you** saw my love\n**You**'d love her too\n**I** love her\n\n**She** gives me everything\nAnd tenderly\nThe kiss my lover brings\n**She** brings to me\nAnd **I** love her\n\nA love like ours\nCould never die\nAs long as **I**\nHave **you** near me\n\nBright are the stars that shine\nDark is the sky\n**I** know this love of mine\nWill never die\nAnd **I** love her, mm\n\nBright are the stars that shine\nDark is the sky\n**I** know this love of mine\nWill never die\nAnd **I** love her",
                        "# Distinguindo quem fala e de quem se fala \nOs **_Subject Pronouns_** (Pronomes Pessoais do Caso Reto) são palavras usadas para substituir os nomes das pessoas ou coisas que realizam a ação. Eles são essenciais para evitar repetições desnecessárias. \n O ponto de partida é entender os dois papéis principais em uma conversa: \n1.  **_I_ (Eu):** Refere-se a quem está falando. \n      *⚠️**Regra de Ouro:** Em inglês, o pronome _'I'_ deve ser escrito **sempre com letra maiúscula**, independente de sua posição na frase. \n 2. **_She_ (Ela):** Refere-se a uma terceira pessoa do gênero feminino (uma mulher ou menina). \n ### Conexão com a Mídia \nNa música **_'And I Love Her'_**, dos Beatles, observe essa dinâmica em ação. A letra é uma declaração direta onde o cantor utiliza o **_'I'_** para expressar o que *ele* sente (*'I give her all my love'*) e refere-se à mulher amada como **_'She'_** ('*She* brings to me').\n\n 🎸 Os Beatles foram uma lendária banda de rock britânica formada em Liverpool, Inglaterra, em 1960. Composta por John Lennon, Paul McCartney, George Harrison e Ringo Starr, eles são amplamente considerados o grupo mais influente da história da música popular.", 1);
                   
                    // 3. He Is They Are (Harry Connick JR)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/YuzEs_Yo1W8?si=UlQKHaPwun5n5Vw1", 
                        "**He** is good\n**They** are happy\n**He** is strong\n**They** are secure\n**He** is right\n**They** are unquestioning\n**He** is wrong\n**They** are demure\n\nWhen **she** left\n**He** was tortured\n**She** was gone\n**They** were confused\n**He** was forgetful\n**They** were supportive\n**He** was funny\n**They** were amused\n\n**He** did things that only superman could do\nThings that sis and **I** could not believe were true\n\n**He** is older\n**They** are loving\n**He** is hardened\n**They** are grown\n**He** is needing\n**They** are giving\n**He** is glad **they** are his own",
                        "# Diferenciando Quantidades: Singular vs. Plural \n\nAo falar sobre terceiros, é fundamental saber distinguir entre uma única pessoa e um grupo. \n\n1.  **_He_ (Ele):** É o equivalente masculino de _'She'_. Usamos exclusivamente para se referir a **um** homem ou menino.\n 2. **_They_ (Eles ou Elas):** É o pronome do plural utilizado utilizado para se referir a um grupo de pessoas, animais ou objetos. *💡*Dica:* O _'They'_ não tem gênero. Serve tanto para um grupo só de homens, só de mulheres ou misto. \n\n ### Conexão com a Mídia \n\nA música **_'He Is They Are'_**, de Harry Connick Jr., foi desenhada justamente para ensinar essa gramática. O cantor alterna frases mostrando o singular masculino (**_'He is'_**) e contrasta imediatamente com o plural (**_'They are'_**), tornando a distinção auditiva muito clara. \n\n 🎵 Harry Connick Jr. (nascido em 1967) é um artista norte-americano multifacetado, consagrado como cantor, pianista de jazz, compositor e ator. Natural de Nova Orleans, ele é frequentemente creditado por ajudar a popularizar o estilo big band e o swing para as novas gerações.", 2);

                    // 2. We Can Work It Out (Beatles)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/IgRrWPdzkao?si=hV1_iiHQmqVQQYHt", 
                        "Try to see **it** my way \nDo **I** have to keep on talking 'til **I** can't go on? \nWhile **you** see **it** your way \nRun the risk of knowing that our love may soon be gone \n**We** can work **it** out \n**We** can work **it** out \n\nThink of what **you**'re saying\n**You** can get **it** wrong and still **you** think that **it**'s alright\nThink of what **I**'m saying \n**We** can work **it** out and get **it** straight, or say good night\n**We** can work **it** out\n**We** can work **it** out\n\nLife is very short, and there's no time\nFor fussing and fighting, my friend\n**I** have always thought that **it**'s a crime\nSo, **I** will ask you once again\nTry to see **it** my way\nOnly time will tell if **I** am right or **I** am wrong\nWhile you see **it** your way\nThere's a chance that **we** might fall apart before too long\n**We** can work **it** out \n**We** can work **it** out\n\n Life is very short, and there's no time\nFor fussing and fighting, my friend\n**I** have always thought that **it**'s a crime\nSo **I** will ask you once again\nTry to see **it** my way\nOnly time will tell if **I** am right or **I** am wrong\nWhile you see **it** your way\nThere's a chance that **we** might fall apart before too long\n**We** can work **it** out\n**We** can work **it** out",
                        "# O Grupo, O Ouvinte e o 'Neutro'\n\nPara completar os pronomes, precisamos falar sobre interação e objetos.\n\n1. **We (Nós):** Usado quando você se inclui no grupo. A fórmula é simples: *Eu + Outra(s) pessoa(s) = We*\n2.  **You (Você/Vocês):** Usado para falar diretamente com alguém. Em inglês, a palavra é a mesma tanto para o singular quanto para o plural. \n3.  **It (Ele/Ela/Isso):** Este é o pronome 'neutro'. Usamos para objetos, lugares, sentimentos e animais (quando não têm nome próprio). * 🚫 Nunca usamos 'He' ou 'She' para coisas inanimadas. \n\n### Conexão com a Mídia\n\nEm **'We Can Work It Out'**, dos Beatles, a letra gira em torno de um conflito entre duas pessoas. Paul McCartney canta sobre como **'You'** (a outra pessoa) vê as coisas de um jeito, enquanto ele vê de outro. O refrão traz a solução: **'We'** (Nós) podemos resolver isso juntos. É o uso perfeito do pronome para unir os dois lados. \n\n 🎸 Os Beatles foram uma lendária banda de rock britânica formada em Liverpool, Inglaterra, em 1960. Composta por John Lennon, Paul McCartney, George Harrison e Ringo Starr, eles são amplamente considerados o grupo mais influente da história da música popular.", 3);


                    // ==========================================
                    // ETAPA 2: PRACTICE (Os Quizzes com Vídeo no JSON)
                    // ==========================================

                    // 1. Happy Together (The Turtles) -> Identificar Pronomes
                    Map<String, Object> dadosP1 = new HashMap<>();
                    dadosP1.put("video_url", "https://youtu.be/BqZ6sRHpWIk?si=wx1kOFBgQUA-7ZfQ");
                    dadosP1.put("instrucao_video", "Ouça a música e preste atenção nos pronomes pessoais (Subject Pronouns) que aparecem na letra.");
                    dadosP1.put("texto_base", "Imagine me and you , I do \n I think about you day and night \n It 's only right \n To think about the girl you love \n And hold her tight \n So happy together \n ... \n Me and you, and you and me \n No matter how they tossed the dice\n It had to be \n The only one for me is you \nAnd you for me \n So happy together");
                    dadosP1.put("palavras_corretas", List.of("I", "you", "It", "They")); // O sistema valida essas
                    criarPractice(modPronouns, TipoAtividade.SELECIONAR_PALAVRAS, "Clique nos pronomes (Subject Pronouns) que aparecem na letra.", dadosP1);
                    
                    // 2. She's Leaving Home (Beatles) -> Identificar Pronomes
                    Map<String, Object> dadosP2 = new HashMap<>();
                    dadosP2.put("video_url", "https://youtu.be/VaBPY78D88g?si=tzMxMWiwFR7jGQZS");
                    dadosP2.put("texto_base", "... Leaving the note that she hoped would say more ... She goes downstairs to the kitchen ... Stepping outside, she is free ... We gave her most of our lives ... She is leaving home after living alone for so many years...");
                    dadosP2.put("palavras_corretas", List.of("She", "We"));
                    criarPractice(modPronouns, TipoAtividade.SELECIONAR_PALAVRAS, "Identifique quem está saindo de casa.", dadosP2);

                    // 3. Rei Leão -> Identificar Pronomes
                    // Map<String, Object> dadosP3 = new HashMap<>();
                    // dadosP3.put("video_url", "https://youtu.be/leDXfrt2r9A?si=_8QEf89wWZ_ZGlzi"); // Trecho específico
                    // dadosP3.put("pergunta", "Quem Timão diz que é um 'menino mau'? (He/She/It?)");
                    // dadosP3.put("opcoes", List.of("He (Pumba)", "She (Nala)", "It (The Bug)", "They (The Lions)"));
                    // dadosP3.put("resposta_correta", "He (Pumba)");
                    // criarPractice(modPronouns, TipoAtividade.MULTIPLA_ESCOLHA, "Assista ao trecho e responda.", dadosP3);

                    // 4. Atividade de Listar Palavras 
                    Map<String, Object> dadosP4 = new HashMap<>();
                    dadosP4.put("video_url", "https://youtu.be/i2mTGBRVRr0?si=NskRvqAbcD6OUFLj");
                    dadosP4.put("numberOfInputs", 3);
                    dadosP4.put("respostas_possiveis", List.of("I", "You", "He", "She", "It", "We", "They"));
                    criarPractice(modPronouns, TipoAtividade.LISTA_PALAVRAS, "Assista a cena e liste 3 pronomes (em inglês) que são possíveis de identificar.", dadosP4);

                    // 5. Fast Car (Tracy Chapman) -> Preencher Lacunas
                    Map<String, Object> dadosP5 = new HashMap<>();
                    dadosP5.put("video_url", "https://youtu.be/AIOAlaACuv4?si=EqFzQnbjtjtH1_7V");
                    dadosP5.put("frase_com_lacuna", "You got a fast car, ___ want a ticket to anywhere.");
                    dadosP5.put("resposta_correta", "I"); // "I want a ticket..."
                    criarPractice(modPronouns, TipoAtividade.PREENCHER_LACUNA, "Complete a letra da música.", dadosP5);
                    
                    // ==========================================
                    // ETAPA 3: PRODUCTION (Os Desafios Criativos)
                    // ==========================================

                    // 1. Meme Generator
                    Map<String, Object> dadosProd1 = new HashMap<>();
                    dadosProd1.put("link_externo", "https://imgflip.com/memegenerator");
                    dadosProd1.put("formatos_aceitos", List.of("png", "jpg", "jpeg"));
                    criarProduction(modPronouns, TipoDesafio.FOTO_E_TEXTO, 
                        "Crie um meme usando pelo menos um pronome (I, You, He...). Use o site sugerido e faça o upload da imagem aqui. Depois, explique em o contexto do meme e o significado do pronome usado.", 
                        null, dadosProd1);

                    // 2. Vídeo Pergunta (Qual o único pronome?)
                    Map<String, Object> dadosProd2 = new HashMap<>();
                    dadosProd2.put("tipo_resposta", "texto_curto");
                    criarProduction(modPronouns, TipoDesafio.TEXTO_LONGO, 
                        "Assista ao vídeo e faça um breve texto em inglês respondendo: Qual é o único 'Subject Pronoun' que é o nome de um dos personagens e onde está o humor deste trecho?",
                        "https://www.youtube.com/watch?v=DE8qVfNW5B0", dadosProd2);

                    System.out.println(">>> Módulo 'Subject Pronouns' criado com sucesso!");
                }
            );

        moduloRepository.findByTitulo("Present Simple (‘To Be’) - Am, Is, Are")
            .ifPresentOrElse(
                (mod) -> System.out.println(">>> Módulo 'Present Simple (‘To Be’)' já existe. ID: " + mod.getId()),
                () -> {
                    System.out.println(">>> Cadastrando Módulo: Present Simple (‘To Be’)...");
                    Modulo modToBe = new Modulo();
                    modToBe.setTopico(topicoIniciante);
                    modToBe.setTitulo("Present Simple (‘To Be’) - Am, Is, Are");
                    modToBe.setDescricao("Domine o verbo mais famoso do inglês: entenda quando usar Am, Is e Are com Star Wars, The Beatles, Poemas, HQs e muito mais!");
                    modToBe.setImagemCapaUrl("https://img.youtube.com/vi/t1Jm5epJr10/hqdefault.jpg"); // Capa dos Beatles
                    modToBe.setPublicado(true);
                    modToBe = moduloRepository.save(modToBe);

                     // ==========================================
                    // ETAPA 1: PRESENTATION (Os Vídeos de Estudo)
                    // ==========================================
                    
                    // 1. I Am The Walrus (Beatles)
                    criarRecurso(modToBe, TipoRecurso.VIDEO, 
                        "https://youtu.be/Ws5klxbI87I?si=67ncPJWJq32alQYl", 
                        "I **am** he, as you **are** he \nAs you **are** me, and we **are** all together \nSee how they run like pigs from a gun \nSee how they fly, I'm crying!\n\nSitting on a cornflake \nWaiting for the van to come \nCorporation t-shirt \nStupid bloody Tuesday \n Man, you've been a naughty boy\n You let your face grow long\n\nI **am** the egg man!\n They **are** the egg men! \nI **am** the walrus!\n Goo, goo, goo, joob!\n\nMister City, policeman sitting \nPretty little policemen in a row \n See how they fly like Lucy in the sky!\nSee how they run!\n\nI'm crying! I'm crying!\nI'm crying! I'm crying!\n\nYellow matter custard\nDripping from a dead dog's eye\nCrabalocker fishwife\nPornographic priestess\nBoy, you've been a naughty girl\nYou let your knickers down\n\nI **am** the egg man!\nThey **are** the egg men!\nI **am** the walrus!\nGoo, goo, goo, joob!\n\nSitting in an English garden\nWaiting for the Sun\nIf the Sun don't come, you get a tan\nFrom standing in the English rain\n\nI **am** the egg man!\nThey **are** the egg men!\nI **am** the walrus\nGoo, goo, goo, joob!\n\nExpert, textpert, choking smokers\nDon't you think the joker laughs at you?\nSee how they smile like pigs in a sty\nSee how they snide, I'm crying!\n\nSemolina Pilchard\nClimbing up the Eiffel Tower\nElementary penguin singing Hare Krishna\nMan, you should have seen them\nKicking Edgar Allan Poe\n\nI **am** the egg man!\nThey **are** the egg men!\nI **am** the walrus!\nGoo, goo, goo, joob!\n\nGoo, goo, goo, goo, joob!\nGoo, goo, goo, joob\nGoo, goo, goo, goo, job\nGoo, goo!\n\nJoob! Joob! Joob!\nJoob! Joob! Joob!\nJoob! Joob! Joob!\nJoob! Joob! Joob!\nJoob! Joob! Joob!",
                        "# I Am, You Are, We Are\n\nO Verbo **To Be** (Ser ou Estar) muda de forma dependendo de *quem* estamos falando. Nesta música psicodélica dos Beatles, John Lennon brinca com a identidade, misturando várias pessoas na mesma frase. É um exemplo perfeito de como conectar os pronomes às formas corretas do verbo.\n\nObserve a linha mais famosa da música:\n*'I **am** he as you **are** he as you **are** me and we **are** all together.'*\n\nAqui vemos a regra em ação:\n1.  **I am:** O 'Am' é exclusivo do 'I'. Sempre que falar de você mesmo ('Eu sou' ou 'Eu estou'), use **Am**.\n2.  **You are / We are:** O 'Are' é a forma do plural (e do 'Você'). Usamos com **You** (Você/Vocês), **We** (Nós) e **They** (Eles).\n\nNa música, eles cantam que 'nós estamos todos juntos' (*we are all together*).", 1);
                   
                    // 3. Imagine (John Lennon)
                    criarRecurso(modToBe, TipoRecurso.VIDEO, 
                        "https://youtu.be/YkgkThdzX-8?si=WE4YbJxWqoNW7jFo", 
                        "Imagine there**'s** no heaven\nIt**'s** easy if you try\nNo hell below us\nAbove us only sky\nImagine all the people\nLiving for today\n\nImagine there**'s** no countries\nIt **is**n't hard to do\nNothing to kill or die for\nAnd no religion too\nImagine all the people\nLiving life in peace\n\nYou may say I**'m** a dreamer\nBut I**'m** not the only one\nI hope someday you'll join us\nAnd the world will be as one\n\nImagine no possessions\nI wonder if you can\nNo need for greed or hunger\nA brotherhood of man\nImagine all the people\nSharing all the world\n\nYou may say I**'m** a dreamer\nBut I**'m** not the only one\nI hope someday you'll join us\nAnd the world will live as one",
                        "# It Is: Descrevendo o Mundo\n\nEnquanto 'I Am The Walrus' foca nas pessoas, 'Imagine' foca nas coisas, nas ideias e nos lugares. Para isso, usamos a forma singular do Verbo To Be: **Is**.\n\nO **Is** é usado sempre com a terceira pessoa do singular: **He** (Ele), **She** (Ela) e **It** (Ele/Ela para coisas/ideias).\n\nNa letra, Lennon nos convida a imaginar um mundo diferente:\n* *'Imagine there's no heaven'* -> 'There's' é a contração de **There Is** (Há/Existe). O céu (*heaven*) é uma coisa singular, por isso usamos *Is*.\n* *'It's easy if you try'* -> 'It's' é a contração de **It Is** (É fácil / Isso é fácil).\n\nSempre que você estiver descrevendo uma situação, um objeto ou um sentimento no singular, o **Is** será sua escolha.\n\n\n# O Verbo To Be: A Regra de Três\n\nO verbo mais importante do inglês tem apenas três formas no presente. A escolha depende do sujeito:\n\n| Sujeito | Verbo To Be | Exemplo |\n| :--- | :--- | :--- |\n| **I** | **Am** | I am happy. (Eu estou feliz) |\n| **He / She / It** | **Is** | It is easy. (É fácil) |\n| **You / We / They** | **Are** | We are together. (Nós estamos juntos) |", 2);

                    // ==========================================
                    // ETAPA 2: PRACTICE (Os Quizzes com Vídeo no JSON)
                    // ==========================================

                    Map<String, Object> dadosPrac1 = new HashMap<>();
                    dadosPrac1.put("video_url", "https://youtu.be/2Xmja9Ih99w?si=rtJu_IOJcFXAdOvr"); 
                    dadosPrac1.put("instrucao_video", "Assista à cena. Ligue a frase incompleta ao verbo 'To Be' que a completa corretamente.");
                    
                    // Coluna A (Frases com lacuna)
                    List<Map<String, String>> colA = new ArrayList<>();
                    colA.add(Map.of("id", "a1", "text", "You ___ beaten"));
                    colA.add(Map.of("id", "a2", "text", "It ___ useless to resist"));
                    colA.add(Map.of("id", "a3", "text", "I ___ your father"));
                    
                    // Coluna B (Verbos)
                    List<Map<String, String>> colB = new ArrayList<>();
                    colB.add(Map.of("id", "b1", "name", "is"));
                    colB.add(Map.of("id", "b2", "name", "am"));
                    colB.add(Map.of("id", "b3", "name", "are"));

                    // Gabarito
                    Map<String, String> gabarito = new HashMap<>();
                    gabarito.put("a1", "b3"); // You -> are
                    gabarito.put("a2", "b1"); // It -> is
                    gabarito.put("a3", "b2"); // I -> am

                    dadosPrac1.put("quotes", colA);
                    dadosPrac1.put("characters", colB);
                    dadosPrac1.put("resposta_correta", gabarito);
                    
                    criarPractice(modToBe, TipoAtividade.RELACIONAR_COLUNAS, 
                        "Relacione as colunas para completar as falas icônicas de Darth Vader.", dadosPrac1);

                    // 2. Snoopy (Peanuts) -> Preencher Lacuna (Mudança de Sujeito)
                    // TIPO: PREENCHER_LACUNA
                    Map<String, Object> dadosPrac2 = new HashMap<>();
                    dadosPrac2.put("imagem_url", "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/03/peanuts-lucy-tells-an-indifferent-snoopy-he-s-a-tiny-insignificant-speck-amongst-the-cosmos-1.jpg"); 
                    
                    // Contexto: Alteramos "We" para "They". O verbo continua o mesmo?
                    dadosPrac2.put("frase_com_lacuna", "They ___ only the tiniest speck in an enormous universe!");
                    dadosPrac2.put("resposta_correta", "are");
                    
                    criarPractice(modToBe, TipoAtividade.PREENCHER_LACUNA, 
                        "Na tirinha original, Lucy diz 'You are'. Se mudarmos o sujeito para 'They' (Eles), qual verbo devemos usar?", dadosPrac2);

                    // 3. We Are The World -> Substituir Palavras (Grammar Check / Concordância)
                    // TIPO: SUBSTITUIR_PALAVRAS
                    Map<String, Object> dadosPrac3 = new HashMap<>();
                    dadosPrac3.put("video_url", "https://youtu.be/s3wNuru4U0I?si=SlkAGJbUSZbIoena");
                    dadosPrac3.put("instrucao_video", "Analise a gramática. Substitua 'We are' por outra opção que também esteja GRAMATICALMENTE correta.");
                    
                    // Montando a letra com os "buracos" interativos (IDs w1, w2, w3)
                    dadosPrac3.put("initialText", List.of(
                        Map.of("type", "word", "content", "We are", "id", "w1"),
                        Map.of("type", "text", "content", " the world,\n"),
                        Map.of("type", "word", "content", "we are", "id", "w2"),
                        Map.of("type", "text", "content", " the children,\n"),
                        Map.of("type", "word", "content", "we are", "id", "w3"),
                        Map.of("type", "text", "content", " the ones who make a brighter day")
                    ));

                    // As opções que aparecem no pop-up quando o aluno clica
                    // Aqui a gente mistura a Certa com as Erradas que tu definiu
                    dadosPrac3.put("substitutions", Map.of(
                        "w1", List.of("I am", "you am", "they is"),      // Certo: I am
                        "w2", List.of("She is", "I are", "he am"),       // Certo: She is
                        "w3", List.of("They are", "we am", "she are")    // Certo: They are
                    ));
                    
                    // O Gabarito pro sistema saber qual validar como 'true'
                    dadosPrac3.put("respostas_corretas", Map.of(
                        "w1", "I am",
                        "w2", "She is",
                        "w3", "They are"
                    ));
                    
                    criarPractice(modToBe, TipoAtividade.SUBSTITUIR_PALAVRAS, 
                        "Clique nos trechos destacados e escolha a única opção que respeita a regra de conjugação do Verbo To Be.", dadosPrac3);

                    Map<String, Object> dadosProdWhitman = new HashMap<>();
                    dadosProdWhitman.put("tipo_resposta", "texto_curto");
                    String citacaoWhitman = "\"[...] I **am** the poet of the Body and I **am** the poet of the Soul, [...]\"\n" + "\"...I believe a leaf of grass **is** no less than the journey-work of the stars,...\"\n" + "\"...These **are** really the thoughts of all men in all ages and lands, they **are** not original with me,...\"";
                    criarProduction(modToBe, TipoDesafio.TEXTO_LONGO, "Agora é sua vez de ser poeta! Inspire-se no trecho de Walt Whitman abaixo e escreva uma letra de música ou poema curto usando as estruturas do Verbo To Be (I am, It is, They are).\n\n ex:" + citacaoWhitman ,null, dadosProdWhitman);

                    System.out.println(">>> Módulo 'Present Simple (‘To Be’)' criado com sucesso!");
                }
            );

        moduloRepository.findByTitulo("Articles (A, An, The)")
            .ifPresentOrElse(
                (mod) -> System.out.println(">>> Módulo 'Articles (A, An, The)' já existe. ID: " + mod.getId()),
                () -> {
                    System.out.println(">>> Cadastrando Módulo: Articles (A, An, The)...");
                    Modulo modArticles = new Modulo();
                    modArticles.setTopico(topicoIniciante);
                    modArticles.setTitulo("Articles (A, An, The)");
                    modArticles.setDescricao("Um, uma ou o específico? Aprenda a usar os artigos A, An e The pra não se confundir na hora de falar.");
                    modArticles.setImagemCapaUrl("https://m.media-amazon.com/images/I/51wckS2zxwL._AC_UF894,1000_QL80_.jpg"); // Capa dos Beatles
                    modArticles.setPublicado(true);
                    modArticles = moduloRepository.save(modArticles);

                    criarRecurso(modArticles, TipoRecurso.VIDEO, 
                        "https://youtu.be/HhNH2V-K-9g?si=pIL6FA7Eheo8DEao", 
                        "Dear Mr. Vernon, we accept **the** fact that we had to sacrifice **a** whole Saturday in detention for whatever it was we did wrong. But we think you’re crazy to make us write **an** essay telling you who we think we are. You see us as you want to see us – in **the** simplest terms, in **the** most convenient definitions. But what we found out is that each one of us is **a** brain, and **an** athlete, and **a** basketcase, **a** princess, and **a** criminal. Does that answer your question? Sincerely yours, **The** Breakfast Club",
                        "# Definindo Identidades: A, An & The\n\nOs **Artigos** são pequenas palavras que vêm antes dos substantivos para definir se estamos falando de algo específico ou geral. Em inglês, temos dois tipos:\n\n1.  **Definite Article (The):** O artigo definido ('O', 'A', 'Os', 'As'). Usado para algo específico, único ou já conhecido.\n2.  **Indefinite Articles (A / An):** Os artigos indefinidos ('Um', 'Uma'). Usados para algo geral ou mencionado pela primeira vez.\n\nNesta cena icônica de *O Clube dos Cinco (The Breakfast Club)*, os personagens usam esses artigos para explicar quem eles realmente são. Vamos analisar:\n\n### 1. O Específico: 'The'\nO **'The'** é usado quando sabemos exatamente do que estamos falando.\n\n*   *'We accept **the** fact...'* (Nós aceitamos **o** fato). Não é qualquer fato, é aquele fato específico de estarem na detenção.\n*   *'Sincerely yours, **The** Breakfast Club.'* Eles não são qualquer clube, eles são **O** Clube dos Cinco. O artigo dá um título e uma identidade única ao grupo.\n\n### 2. O Geral: 'A' vs 'An'\nQuando eles se descrevem individualmente, eles usam artigos indefinidos, pois estão se colocando como exemplos de 'tipos' de alunos. A regra para escolher entre **A** e **An** depende do **som** da próxima palavra:\n\n*   **Use 'A' antes de som de consoante:**\n    *   *'...**a** brain...'* (um cérebro/nerd)\n    *   *'...**a** basketcase...'* (um caso perdido)\n    *   *'...**a** princess...'* (uma princesa)\n    *   *'...**a** criminal.'* (um criminoso)\n\n*   **Use 'An' antes de som de vogal:**\n    *   *'...and **an** athlete...'* (e um atleta). Como 'Athlete' começa com som de 'A', usamos **'An'** para a fala fluir melhor.\n\n**Resumo da Ópera:**\nBrian (o narrador) usa **'A'** e **'An'** para listar os rótulos genéricos que a sociedade dá a eles, mas assina como **'The'** Breakfast Club para mostrar que, juntos, eles formaram algo único e específico.", 1);

                    // ==========================================
                    // ETAPA 2: PRACTICE - Módulo Articles (A, An, The)
                    // ==========================================

                    // 1. The Godfather -> Preencher Lacuna (A vs An)
                    // TIPO: PREENCHER_LACUNA
                    Map<String, Object> dadosPracGodfather = new HashMap<>();
                    // Link da cena exata no YouTube
                    dadosPracGodfather.put("video_url", "https://youtu.be/D6me2-OurCw?si=FYD0X729HynqqlB7"); 
                    dadosPracGodfather.put("frase_com_lacuna", "I'm gonna make him ___ offer he can't refuse.");
                    dadosPracGodfather.put("resposta_correta", "an"); 
                    
                    criarPractice(modArticles, TipoAtividade.PREENCHER_LACUNA,
                    "Don Corleone vai fazer uma proposta irrecusável. Preste atenção no artigo que ele usa antes da palavra 'offer'. Assista à cena icônica e complete a fala com o artigo indefinido correto (a ou an).",dadosPracGodfather);

                    // 3. Garfield (Adaptação) -> Preencher Lacuna (A vs An)
                    // TIPO: PREENCHER_LACUNA
                    Map<String, Object> dadosPracGarfield = new HashMap<>();
                    dadosPracGarfield.put("imagem_url", "https://uploads.tudosaladeaula.com/2024/09/321-2.png"); 
                    dadosPracGarfield.put("frase_com_lacuna", "Once upon a time there was a house with ___ ant.");
                    dadosPracGarfield.put("resposta_correta", "an"); 
                    
                    criarPractice(modArticles, TipoAtividade.PREENCHER_LACUNA, 
                        "Na tirinha original, Jon diz 'a dog' e 'a cat'. Se mudássemos o animal para uma **formiga (ant)**, como ficaria o artigo?",dadosPracGarfield);

                     // TIPO: SELECIONAR_PALAVRAS
                    Map<String, Object> dadosPracHappy = new HashMap<>();
                    
                    // Link do vídeo oficial
                    dadosPracHappy.put("video_url", "https://youtu.be/ZbZSe6N_BXs?si=dQ6BO4FgdKclnDxc"); 
                    dadosPracHappy.put("instrucao_video", "Sinta a vibe! Ouça o trecho e clique em todos os artigos (A, An, The) que encontrar.");
                    // A letra formatada com quebras de linha
                    dadosPracHappy.put("texto_base", "Sunshine, she's here, you can take a break \n I'm a hot air balloon that could go to space\n With the air, like I don't care, baby, by the way \n Clap along if you feel like a room without a roof Clap along if you feel like happiness is the truth");
                    dadosPracHappy.put("palavras_corretas", List.of("a", "the")); 
                    
                    criarPractice(modArticles, TipoAtividade.SELECIONAR_PALAVRAS, 
                        "Identifique os artigos definidos e indefinidos na letra de 'Happy'.", dadosPracHappy);

                    // ==========================================
                    // ETAPA 3: PRODUCTION - Módulo Articles (A, An, The)
                    // ==========================================

                    // 1. Criador de Quadrinhos -> FOTO_E_TEXTO
                    Map<String, Object> dadosProdComic = new HashMap<>();
                    
                    // O link da ferramenta externa
                    dadosProdComic.put("link_externo", "https://www.storyboardthat.com/pt/criador-de-quadrinhos");
                    
                    // Formatos de imagem aceitos
                    dadosProdComic.put("formatos_aceitos", List.of("png", "jpg", "jpeg"));
                    
                    criarProduction(modArticles, TipoDesafio.FOTO_E_TEXTO, 
                        "Agora é sua vez de contar uma história! Crie uma tirinha curta (3 quadros) usando corretamente os artigos 'A', 'An' e 'The'. Use o site sugerido para criar, salve a imagem e faça o upload aqui. Em seguida, descreva brevemente a história em inglês no campo abaixo.", 
                        null, dadosProdComic);

                    System.out.println(">>> Módulo 'Articles (A, An, The)' criado com sucesso!");
                }
            );

        moduloRepository.findByTitulo("Present Simple (‘to have’ & other verbs)")
            .ifPresentOrElse(
                (mod) -> System.out.println(">>> Módulo 'Present Simple (‘to have’ & other verbs)' já existe. ID: " + mod.getId()),
                () -> {
                    System.out.println(">>> Cadastrando Módulo: Present Simple (‘to have’ & other verbs)...");
                    Modulo modPresent = new Modulo();
                    modPresent.setTopico(topicoIniciante);
                    modPresent.setTitulo("Present Simple (‘to have’ & other verbs)");
                    modPresent.setDescricao("Saia do básico! Aprenda a usar 'To Have' e outros verbos essenciais pra falar da tua rotina.");
                    modPresent.setImagemCapaUrl("https://img.youtube.com/vi/Yjyj8qnqkYI/hqdefault.jpg"); // Capa dos Beatles
                    modPresent.setPublicado(true);
                    modPresent = moduloRepository.save(modPresent);

                    criarRecurso(modPresent, TipoRecurso.VIDEO, 
                        "https://youtu.be/Yjyj8qnqkYI?si=zP2ODZTk4__4Dr2t", 
                        "It's been a hard day's night\nAnd I've been workin' like a dog\nIt's been a hard day's night\nI should be sleepin' like a log\n\nBut when I **get** home to you\nI **find** the things that you **do**\nWill make me feel alright\n\nYou **know** I **work** all day\nTo get you money to buy you things\nAnd it**'s** worth it just to hear you **say**\nYou're gonna give me everything\n\nSo why on Earth should I moan?\n'Cause when I **get** you alone\nYou **know** I **feel** okay\n\nWhen I**'m** home\nEverything **seems** to be right\nWhen I**'m** home\nFeeling you holding me tight, tight, yeah\n\nIt's been a hard day's night\nAnd I've been workin' like a dog\nIt's been a hard day's night\nI should be sleepin' like a log\n\nBut when I **get** home to you\nI **find** the things that you **do**\nWill make me feel alright\n\nSo why on Earth should I moan?\n'Cause when I **get** you alone\nYou **know** I **feel** okay\n\nWhen I**'m** home\nEverything **seems** to be right\nWhen I**'m** home\nFeeling you holding me tight, tight, yeah\nIt's been a hard day's night\nAnd I've been workin' like a dog\nIt's been a hard day's night\nI should be sleepin' like a log\n\nBut when I **get** home to you\nI **find** the things that you **do**\nWill make me feel alright\nYou **know** I **feel** alright\nYou **know** I **feel** alright",
                        "# O Present Simple: O que você Sente e Sabe\n\nAlém de rotinas, o **Present Simple** é fundamental para expressar o que sentimos, pensamos ou percebemos no momento. Chamamos estes de *Stative Verbs* (Verbos de Estado).\n\nNesta música, os Beatles contrastam o cansaço do trabalho com a alegria de chegar em casa. Observe como os verbos no presente simples descrevem essa mudança de estado emocional:\n\n### 1. Sentimentos e Certezas ('Feel' & 'Know')\n\nQuando o cantor chega em casa, o cansaço desaparece.\n> *'So why on earth should I moan, 'cause when I get you alone, you **know** I **feel** okay.'*\n\n* **You know:** (Você sabe) - Um fato, uma certeza.\n* **I feel:** (Eu me sinto) - O estado emocional dele agora.\n\n### 2. Percepção da Realidade ('Find' & 'Seem')\n> *'But when I get home to you, I **find** the things that you **do** will make me feel alright.'*\n> *'When I'm home, everything **seems** to be right.'*\n\n* **I find:** (Eu encontro/percebo) - A ação de perceber algo.\n* **You do:** (Você faz) - Ações gerais que a pessoa faz.\n* **Everything seems:** (Tudo parece) - Como a realidade aparenta ser.\n\n### Regra Básica para I, You, We, They:\nA estrutura continua direta: **Sujeito + Verbo**.\n* *I **feel** good.* (Eu me sinto bem).\n* *You **know** me.* (Você me conhece).\n* *We **find** peace.* (Nós encontramos paz).", 1);

                    Map<String, Object> dadosPracClapton = new HashMap<>();
                    dadosPracClapton.put("video_url", "https://youtu.be/b78RfUCw_fU?si=q-2ldbA6NnrCB5yy");
                    dadosPracClapton.put("instrucao_video", "Ouça a música e clique em todos os verbos de ação e estado que estão no Present Simple.");
                    dadosPracClapton.put("texto_base", "She puts on her make up \n And brushes her long blonde hair \n And then she asks me \n Do I look alright? \n And I say, Yes, you look wonderful tonight \n And then she asks me \n Do you feel alright? \n And I say, Yes, I feel wonderful tonight");
                    dadosPracClapton.put("palavras_corretas", List.of("puts", "brushes", "asks", "Do", "look", "say", "feel")); 
                    
                    criarPractice(modPresent, TipoAtividade.SELECIONAR_PALAVRAS, 
                        "Identifique e selecione os verbos no Present Simple na letra da música.", dadosPracClapton);

                    // X. Ob-La-Di, Ob-La-Da (The Beatles) -> Relacionar Colunas (Quem faz o quê?)
                    // TIPO: RELACIONAR_COLUNAS
                    Map<String, Object> dadosPracObladi = new HashMap<>();
                    dadosPracObladi.put("video_url", "https://youtu.be/_J9NpHKrKMw?si=sR6hfv4mCqAFNqbI"); 
                    dadosPracObladi.put("instrucao_video", "Ouça a música e preste atenção na história de Desmond e Molly. Relacione a ação ao personagem correto.");
                    
                    // Coluna A (Perguntas / Ações)
                    List<Map<String, String>> colA_Obladi = new ArrayList<>();
                    colA_Obladi.add(Map.of("id", "a1", "text", "Who has a barrow in the marketplace?"));
                    colA_Obladi.add(Map.of("id", "a2", "text", "Who is the singer in a band?"));
                    
                    // Coluna B (Personagens / Respostas)
                    List<Map<String, String>> colB_Obladi = new ArrayList<>();
                    colB_Obladi.add(Map.of("id", "b1", "name", "Desmond"));
                    colB_Obladi.add(Map.of("id", "b2", "name", "Molly"));

                    // Gabarito
                    Map<String, String> gabaritoObladi = new HashMap<>();
                    gabaritoObladi.put("a1", "b1"); // Barrow -> Desmond
                    gabaritoObladi.put("a2", "b2"); // Singer -> Molly

                    dadosPracObladi.put("quotes", colA_Obladi);
                    dadosPracObladi.put("characters", colB_Obladi);
                    dadosPracObladi.put("resposta_correta", gabaritoObladi);
                    
                    criarPractice(modPresent, TipoAtividade.RELACIONAR_COLUNAS, 
                        "Ligue as perguntas aos personagens corretos baseando-se na letra da música.", dadosPracObladi);

                    Map<String, Object> dadosProdForNoOne = new HashMap<>();
                    dadosProdForNoOne.put("tipo_resposta", "texto_curto"); // Espera um texto maior (parágrafo)
                    
                    criarProduction(modPresent, TipoDesafio.TEXTO_LONGO, 
                        "Ouça a música e escreva um curto parágrafo em inglês descrevendo uma rotina diária (sua ou de outra pessoa). Tente usar verbos no Present Simple como na música ('She wakes up', 'She makes up').", 
                        "https://youtu.be/ELlLIwhvknk?si=ugldUc0nTXZ1jClM", dadosProdForNoOne);
                    
                    System.out.println(">>> Módulo 'Present Simple (‘to have’ & other verbs)' criado com sucesso!");
                }
            );

            moduloRepository.findByTitulo("Adverbs of frequency")
                .ifPresentOrElse(
                    (mod) -> System.out.println(">>> Módulo 'Adverbs of frequency' já existe. ID: " + mod.getId()),
                    () -> {
                        System.out.println(">>> Cadastrando Módulo: Adverbs of frequency...");
                        Modulo modFrequency = new Modulo();
                        modFrequency.setTopico(topicoIniciante);
                        modFrequency.setTitulo("Adverbs of frequency");
                        modFrequency.setDescricao("Sempre, às vezes ou nunca? Aprenda a dizer com que frequência as coisas acontecem na tua vida.");
                        modFrequency.setImagemCapaUrl("https://m.media-amazon.com/images/M/MV5BZTk0ZmUxZTktMDBlNC00YmZhLWJlNzgtMmY4M2NlNWIyYWZhXkEyXkFqcGc@._V1_.jpg"); // Capa dos Beatles
                        modFrequency.setPublicado(true);
                        modFrequency = moduloRepository.save(modFrequency);

                        criarRecurso(modFrequency, TipoRecurso.VIDEO, 
                        "https://youtu.be/Z2ZFTeRQ89w?si=gKuOXJAUQUNN0Ozi", 
                        "**Once in a while**, although she would smile,\nIt **usually** meant she was thinking of him.\nThough **sometimes** we talked, more **often** than not,\nI didn't really hear what she had to say.\n\n**Now and then**\nSince we're apart\nI wonder how to mend a broken heart\n\nI was **never** there, when she needed me,\nAnd **constantly** I was out drinking with friends.\nI was **always** the one who was out having fun,\nYet she **rarely** complained about being ignored\n\n**Now and then**\nSince we're apart\nI wonder how to mend a broken heart\n\n**Occasionally** she sits under our tree,\n**Often** to see if I come back to her.\nBy now she should know that I'm not coming home,\nIn fact now I **hardly ever** think about her\n\nBut **now and then**\nsince we're apart\nI wonder how to mend\nHer broken heart",
                        "# Adverbs of Frequency: Com que frequência?\n\nOs **Adverbs of Frequency** (Advérbios de Frequência) respondem à pergunta: 'Com que frequência isso acontece?'. Eles indicam a rotina e a regularidade das ações, variando de 100% (sempre) a 0% (nunca).\n\nNesta música, o cantor narra os hábitos de um relacionamento que acabou, usando uma escala completa de frequência para mostrar seus erros e arrependimentos.\n\n### 1. Alta Frequência (100% - 80%)\nUsamos quando a ação é constante ou quase certa.\n\n* **Always** (Sempre - 100%): *'I was **always** the one who was out having fun'* (Eu era **sempre** aquele que estava se divertindo).\n* **Constantly** (Constantemente): *'And **constantly** I was out drinking with friends'* (E **constantemente** eu estava fora bebendo).\n* **Usually** (Geralmente - 80%): *'It **usually** meant she was thinking of him'* (Isso **geralmente** significava que ela estava pensando nele).\n\n### 2. Média Frequência (70% - 30%)\nUsamos quando a ação acontece, mas não é uma regra fixa.\n\n* **Often** (Frequentemente - 70%): *'**Often** to see if I come back'* (**Frequentemente** para ver se eu volto).\n* **Sometimes** (Às vezes - 50%): *'Though **sometimes** we talked'* (Embora **às vezes** a gente conversasse).\n* **Occasionally / Once in a while** (Ocasionalmente / De vez em quando - 30%): *'**Occasionally** she sits under our tree'* (**Ocasionalmente** ela senta debaixo da nossa árvore).\n\n### 3. Baixa Frequência (20% - 0%)\nUsamos quando a ação é rara ou inexistente.\n\n* **Rarely** (Raramente - 10%): *'Yet she **rarely** complained'* (Mas ela **raramente** reclamava).\n* **Hardly ever** (Quase nunca - 5%): *'In fact now I **hardly ever** think about her'* (De fato, agora eu **quase nunca** penso nela).\n* **Never** (Nunca - 0%): *'I was **never** there when she needed me'* (Eu **nunca** estava lá quando ela precisava de mim).\n\n### 💡 Regra de Ouro da Posição:\nObserve na letra:\n1.  O advérbio geralmente vem **ANTES** do verbo principal: *She **rarely** complained*.\n2.  Mas ele vem **DEPOIS** do verbo To Be (am/is/was/were): *I **was never** there*.", 1);

                        Map<String, Object> dadosPracForrest = new HashMap<>();
                        dadosPracForrest.put("video_url", "https://youtu.be/vdtqSaJO-iM?si=GYJYb2zkfU5F4ZSz"); 
                        dadosPracForrest.put("instrucao_video", "Ouça o conselho que Forrest nunca esqueceu. Com que frequência a mãe dele dizia isso?");
                        dadosPracForrest.put("frase_com_lacuna", "My mama ___ said life was like a box of chocolates.");
                        dadosPracForrest.put("resposta_correta", "always"); 
                        criarPractice(modFrequency, TipoAtividade.PREENCHER_LACUNA, 
                            "Assista à cena e complete a frase icônica com o advérbio de frequência correto.", dadosPracForrest);

                        Map<String, Object> dadosPracElvis = new HashMap<>();
                        dadosPracElvis.put("video_url", "https://youtu.be/ZotVMxuXBo0?si=sGhvxMVPkguh2aAK");
                        dadosPracElvis.put("numberOfInputs", 3);
                        dadosPracElvis.put("respostas_possiveis", List.of("Always", "Never", "Often"));
                        criarPractice(modFrequency, TipoAtividade.LISTA_PALAVRAS, 
                            "Ouça a canção e liste os 3 advérbios de frequência diferentes que Elvis usa para expressar seus sentimentos.", dadosPracElvis);

                        // X. Gita (Raul Seixas - English Version) -> Substituir por Sinônimos
                        // TIPO: SUBSTITUIR_PALAVRAS
                        Map<String, Object> dadosPracRaul = new HashMap<>();
                        dadosPracRaul.put("video_url", "https://youtu.be/QE5znOAKAP0?si=ym-UhrSKAqcD2zDA"); 
                        dadosPracRaul.put("instrucao_video", "Analise a letra. Clique nos advérbios destacados e substitua-os por outro que tenha o MESMO SENTIDO (Sinônimo).");

                        // Montando a letra com os "buracos" interativos (IDs w1, w2)
                        dadosPracRaul.put("initialText", List.of(
                            // Linha 1: "Sometimes you ask me a question"
                            Map.of("type", "word", "content", "Sometimes", "id", "w1"),
                            Map.of("type", "text", "content", " you ask me a question,\n"),
                            
                            // Linha 2: "I hardly ever speak of love"
                            Map.of("type", "text", "content", "I "),
                            Map.of("type", "word", "content", "hardly ever", "id", "w2"),
                            Map.of("type", "text", "content", " speak of love.")
                        ));

                        // As opções que aparecem no pop-up (Certa misturada com Erradas/Distratores)
                        dadosPracRaul.put("substitutions", Map.of(
                            // Sinônimo de Sometimes -> Occasionally
                            // Erradas: Always (Sempre), Never (Nunca)
                            "w1", List.of("Occasionally", "Always", "Never"), 

                            // Sinônimo de Hardly ever -> Rarely
                            // Erradas: Usually (Geralmente), Frequently (Frequentemente)
                            "w2", List.of("Rarely", "Usually", "Frequently") 
                        ));

                        // O Gabarito
                        dadosPracRaul.put("respostas_corretas", Map.of(
                            "w1", "Occasionally",
                            "w2", "Rarely"
                        ));

                        criarPractice(modFrequency, TipoAtividade.SUBSTITUIR_PALAVRAS, 
                            "Expanda seu vocabulário encontrando os sinônimos dos advérbios de frequência na música.", dadosPracRaul);

                        Map<String, Object> dadosProdFreeTime = new HashMap<>(); 
                        dadosProdFreeTime.put("formatos_aceitos", List.of("png", "jpg", "jpeg"));
                        criarProduction(modFrequency, TipoDesafio.FOTO_E_TEXTO, 
                            "Hora de ser influencer! Escolha uma foto de uma atividade de lazer (Free time activity). Pode ser uma foto sua ou uma imagem da internet (use o Unsplash se precisar). Faça o upload e, na descrição, escreva uma frase dizendo COM QUE FREQUÊNCIA você faz isso (Ex: 'I always play soccer on Sundays', 'I sometimes read books').", 
                            null, dadosProdFreeTime);

                        System.out.println(">>> Módulo 'Adverbs of frequency' criado com sucesso!");
                    }
                );
    }

    private void criarRecurso(Modulo mod, TipoRecurso tipo, String url, String letra, String transcricao, int ordem) {
        RecursoApresentacao rec = new RecursoApresentacao();
        rec.setModulo(mod);
        rec.setTipoRecurso(tipo);
        rec.setUrlRecurso(url);
        rec.setLetra(letra);
        rec.setTranscricao(transcricao);
        rec.setOrdem(ordem);
        recursoRepository.save(rec);
    }

    private void criarPractice(Modulo mod, TipoAtividade tipo, String instrucao, Map<String, Object> dados) {
        PracticeAtividade prac = new PracticeAtividade();
        prac.setModulo(mod);
        prac.setTipoAtividade(tipo);
        prac.setInstrucao(instrucao);
        prac.setDadosAtividade(dados);
        practiceRepository.save(prac);
    }

    private void criarProduction(Modulo mod, TipoDesafio tipo, String instrucao, String urlMidia, Map<String, Object> dados) {
        ProductionChallenge prod = new ProductionChallenge();
        prod.setModulo(mod);
        prod.setTipoDesafio(tipo);
        prod.setInstrucaoDesafio(instrucao);
        prod.setMidiaDesafioUrl(urlMidia); // Pode ser null se não tiver mídia específica
        prod.setDadosDesafio(dados);
        productionRepository.save(prod);
    }
}

