package com.joseneto.englishverse.config;

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
                        "# O Básico: Quem fala e de quem se fala \nOs **Subject Pronouns** (Pronomes Pessoais do Caso Reto) são palavras usadas para substituir os nomes das pessoas ou coisas que realizam a ação em uma frase. Eles são essenciais para evitar repetições desnecessárias. \n O ponto de partida é entender os dois papéis principais em uma conversa: \n1.  **I (Eu):** Refere-se a quem está falando. *⚠️**Regra de Ouro:** Em inglês, o pronome 'I' deve ser escrito **sempre com letra maiúscula**, independente de sua posição na frase. \n 2. **She (Ela):** Refere-se a uma terceira pessoa do gênero feminino (uma mulher ou menina). \n ### Conexão com a Mídia \nNa música **'And I Love Her'**, dos Beatles, observe essa dinâmica em ação. A letra é uma declaração direta onde o cantor utiliza o **'I'** para expressar o que *ele* sente (*'I give her all my love'*) e refere-se à mulher amada como **'She'** ('*She* brings to me').", 1);
                   
                    // 3. He Is They Are (Harry Connick JR)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/YuzEs_Yo1W8?si=UlQKHaPwun5n5Vw1", 
                        "**He** is good\n**They** are happy\n**He** is strong\n**They** are secure\n**He** is right\n**They** are unquestioning\n**He** is wrong\n**They** are demure\n\nWhen **she** left\n**He** was tortured\n**She** was gone\n**They** were confused\n**He** was forgetful\n**They** were supportive\n**He** was funny\n**They** were amused\n\n**He** did things that only superman could do\nThings that sis and **I** could not believe were true\n\n**He** is older\n**They** are loving\n**He** is hardened\n**They** are grown\n**He** is needing\n**They** are giving\n**He** is glad **they** are his own",
                        "# Singular vs. Plural: Diferenciando Quantidades \n\nAo falar sobre terceiros, é fundamental saber distinguir entre uma única pessoa e um grupo. \n\n1.  **He (Ele):** É o equivalente masculino de 'She'. Usamos exclusivamente para se referir a **um** homem ou menino.\n 2. **They (Eles ou Elas):** É o pronome do plural. Ele é utilizado para se referir a um grupo de pessoas, animais ou objetos. *💡*Dica:* O 'They' não tem gênero. Serve tanto para um grupo só de homens, só de mulheres ou misto. \n\n ### Conexão com a Mídia \n\nA música **'He Is They Are'**, de Harry Connick Jr., foi desenhada justamente para ensinar essa gramática. O cantor alterna frases mostrando o singular masculino (**'He is'**) e contrasta imediatamente com o plural (**'They are'**), tornando a distinção auditiva muito clara.", 2);

                    // 2. We Can Work It Out (Beatles)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/IgRrWPdzkao?si=hV1_iiHQmqVQQYHt", 
                        "Try to see **it** my way \nDo **I** have to keep on talking 'til **I** can't go on? \nWhile **you** see **it** your way \nRun the risk of knowing that our love may soon be gone \n**We** can work **it** out \n**We** can work **it** out \n\nThink of what **you**'re saying\n**You** can get **it** wrong and still **you** think that **it**'s alright\nThink of what **I**'m saying \n**We** can work **it** out and get **it** straight, or say good night\n**We** can work **it** out\n**We** can work **it** out\n\nLife is very short, and there's no time\nFor fussing and fighting, my friend\n**I** have always thought that **it**'s a crime\nSo, **I** will ask you once again\nTry to see **it** my way\nOnly time will tell if **I** am right or **I** am wrong\nWhile you see **it** your way\nThere's a chance that **we** might fall apart before too long\n**We** can work **it** out \n**We** can work **it** out\n\n Life is very short, and there's no time\nFor fussing and fighting, my friend\n**I** have always thought that **it**'s a crime\nSo **I** will ask you once again\nTry to see **it** my way\nOnly time will tell if **I** am right or **I** am wrong\nWhile you see **it** your way\nThere's a chance that **we** might fall apart before too long\n**We** can work **it** out\n**We** can work **it** out",
                        "# O Grupo, O Ouvinte e o 'Neutro'\n\nPara completar os pronomes, precisamos falar sobre interação e objetos.\n\n1. **We (Nós):** Usado quando você se inclui no grupo. A fórmula é simples: *Eu + Outra(s) pessoa(s) = We*\n2.  **You (Você/Vocês):** Usado para falar diretamente com alguém. Em inglês, a palavra é a mesma tanto para o singular quanto para o plural. \n3.  **It (Ele/Ela/Isso):** Este é o pronome 'neutro'. Usamos para objetos, lugares, sentimentos e animais (quando não têm nome próprio). * 🚫 Nunca usamos 'He' ou 'She' para coisas inanimadas. \n\n### Conexão com a Mídia\n\nEm **'We Can Work It Out'**, dos Beatles, a letra gira em torno de um conflito entre duas pessoas. Paul McCartney canta sobre como **'You'** (a outra pessoa) vê as coisas de um jeito, enquanto ele vê de outro. O refrão traz a solução: **'We'** (Nós) podemos resolver isso juntos. É o uso perfeito do pronome para unir os dois lados.", 3);


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
                    dadosP2.put("texto_base", "She is leaving home after living alone for so many years...");
                    dadosP2.put("palavras_corretas", List.of("She"));
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
                    criarPractice(modPronouns, TipoAtividade.LISTA_PALAVRAS, "Assista a cena e liste 3 pronomes (em inglês) que você pode inferir.", dadosP4);

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
                        "Crie um meme usando pelo menos um pronome (I, You, He...). Use o site sugerido e faça o upload da imagem aqui. Depois, explique em inglês o contexto do meme e o significado do pronome usado.", 
                        null, dadosProd1);

                    // 2. Vídeo Pergunta (Qual o único pronome?)
                    Map<String, Object> dadosProd2 = new HashMap<>();
                    dadosProd2.put("tipo_resposta", "texto_curto"); // Espera uma palavra
                    criarProduction(modPronouns, TipoDesafio.TEXTO_LONGO, 
                        "Assista ao vídeo e faça um breve texto em inglês respondendo: Qual é o único 'Subject Pronoun' que é o nome de um dos personagens e onde está o humor deste trecho:",
                        "https://www.youtube.com/watch?v=DE8qVfNW5B0", dadosProd2);

                    System.out.println(">>> Módulo 'Subject Pronouns' criado com sucesso!");
                }
            );

        // moduloRepository.findByTitulo("Present Simple (‘To Be’) - Am, Is, Are")
        //     .ifPresentOrElse(
        //         (mod) -> System.out.println(">>> Módulo 'Present Simple (‘To Be’)' já existe. ID: " + mod.getId()),
        //         () -> {
        //             System.out.println(">>> Cadastrando Módulo: Present Simple (‘To Be’)...");
        //             Modulo modPronouns = new Modulo();
        //             modPronouns.setTopico(topicoIniciante);
        //             modPronouns.setTitulo("Present Simple (‘To Be’) - Am, Is, Are");
        //             modPronouns.setDescricao("Domine o verbo mais famoso do inglês: entenda quando usar Am, Is e Are com Star Wars, The Beatles, Poemas, HQs e muito mais!");
        //             modPronouns.setImagemCapaUrl("https://img.youtube.com/vi/t1Jm5epJr10/hqdefault.jpg"); // Capa dos Beatles
        //             modPronouns.setPublicado(true);
        //             modPronouns = moduloRepository.save(modPronouns);

        //             System.out.println(">>> Módulo 'Present Simple (‘To Be’)' criado com sucesso!");
        //         }
        //     );

        // moduloRepository.findByTitulo("Articles (A, An, The)")
        //     .ifPresentOrElse(
        //         (mod) -> System.out.println(">>> Módulo 'Articles (A, An, The)' já existe. ID: " + mod.getId()),
        //         () -> {
        //             System.out.println(">>> Cadastrando Módulo: Articles (A, An, The)...");
        //             Modulo modPronouns = new Modulo();
        //             modPronouns.setTopico(topicoIniciante);
        //             modPronouns.setTitulo("Articles (A, An, The)");
        //             modPronouns.setDescricao("Um, uma ou o específico? Aprenda a usar os artigos A, An e The pra não se confundir na hora de falar.");
        //             modPronouns.setImagemCapaUrl("https://m.media-amazon.com/images/I/51wckS2zxwL._AC_UF894,1000_QL80_.jpg"); // Capa dos Beatles
        //             modPronouns.setPublicado(true);
        //             modPronouns = moduloRepository.save(modPronouns);

        //             System.out.println(">>> Módulo 'Articles (A, An, The)' criado com sucesso!");
        //         }
        //     );

        // moduloRepository.findByTitulo("Present Simple (‘to have’ & other verbs)")
        //     .ifPresentOrElse(
        //         (mod) -> System.out.println(">>> Módulo 'Present Simple (‘to have’ & other verbs)' já existe. ID: " + mod.getId()),
        //         () -> {
        //             System.out.println(">>> Cadastrando Módulo: Present Simple (‘to have’ & other verbs)...");
        //             Modulo modPronouns = new Modulo();
        //             modPronouns.setTopico(topicoIniciante);
        //             modPronouns.setTitulo("Present Simple (‘to have’ & other verbs)");
        //             modPronouns.setDescricao("Saia do básico! Aprenda a usar 'To Have' e outros verbos essenciais pra falar da tua rotina.");
        //             modPronouns.setImagemCapaUrl("https://img.youtube.com/vi/Yjyj8qnqkYI/hqdefault.jpg"); // Capa dos Beatles
        //             modPronouns.setPublicado(true);
        //             modPronouns = moduloRepository.save(modPronouns);

        //             System.out.println(">>> Módulo 'Present Simple (‘to have’ & other verbs)' criado com sucesso!");
        //         }
        //     );

        // moduloRepository.findByTitulo("Adverbs of frequency")
        //     .ifPresentOrElse(
        //         (mod) -> System.out.println(">>> Módulo 'Adverbs of frequency' já existe. ID: " + mod.getId()),
        //         () -> {
        //             System.out.println(">>> Cadastrando Módulo: Adverbs of frequency...");
        //             Modulo modPronouns = new Modulo();
        //             modPronouns.setTopico(topicoIniciante);
        //             modPronouns.setTitulo("Adverbs of frequency");
        //             modPronouns.setDescricao("Sempre, às vezes ou nunca? Aprenda a dizer com que frequência as coisas acontecem na tua vida.");
        //             modPronouns.setImagemCapaUrl("https://m.media-amazon.com/images/M/MV5BZTk0ZmUxZTktMDBlNC00YmZhLWJlNzgtMmY4M2NlNWIyYWZhXkEyXkFqcGc@._V1_.jpg"); // Capa dos Beatles
        //             modPronouns.setPublicado(true);
        //             modPronouns = moduloRepository.save(modPronouns);

        //             System.out.println(">>> Módulo 'Adverbs of frequency' criado com sucesso!");
        //         }
        //     );
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

