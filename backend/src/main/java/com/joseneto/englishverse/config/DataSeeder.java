package com.joseneto.englishverse.config;

import java.util.ArrayList;
import java.util.Comparator;
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
                    modPronouns.setDescricao("Aprenda os pronomes pessoais com clássicos da música.");
                    modPronouns.setImagemCapaUrl("https://img.youtube.com/vi/5tc0gLSSU1M/hqdefault.jpg"); // Capa dos Beatles
                    modPronouns.setPublicado(true);
                    modPronouns = moduloRepository.save(modPronouns);

                    // ==========================================
                    // ETAPA 1: PRESENTATION (Os Vídeos de Estudo)
                    // ==========================================
                    
                    // 1. And I Love Her (Beatles)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/5tc0gLSSU1M?si=mi-GCh9941-MoVUx", 
                        "Observe como Paul McCartney usa o 'I' (Eu) e 'She' (Ela) para falar de amor nesta canção clássica.", 1);

                    // 2. We Can Work It Out (Beatles)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/IgRrWPdzkao?si=hV1_iiHQmqVQQYHt", 
                        "Aqui o foco é no 'We' (Nós). 'We can work it out' significa 'Nós podemos resolver isso'.", 2);

                    // 3. He Is They Are (Harry Connick JR)
                    criarRecurso(modPronouns, TipoRecurso.VIDEO, 
                        "https://youtu.be/YuzEs_Yo1W8?si=UlQKHaPwun5n5Vw1", 
                        "Uma aula cantada! Preste atenção na diferença entre singular (He is) e plural (They are).", 3);


                    // ==========================================
                    // ETAPA 2: PRACTICE (Os Quizzes com Vídeo no JSON)
                    // ==========================================

                    // 1. Happy Together (The Turtles) -> Identificar Pronomes
                    Map<String, Object> dadosP1 = new HashMap<>();
                    dadosP1.put("video_url", "https://youtu.be/BqZ6sRHpWIk?si=wx1kOFBgQUA-7ZfQ");
                    dadosP1.put("instrucao_video", "Ouça o refrão: 'Imagine me and you, I do...'");
                    dadosP1.put("texto_base", "Imagine me and you, I do, I think about you day and night...");
                    dadosP1.put("palavras_corretas", List.of("I", "you")); // O sistema valida essas
                    criarPractice(modPronouns, TipoAtividade.SELECIONAR_PALAVRAS, "Clique nos pronomes (Subject Pronouns) que aparecem na letra.", dadosP1);

                    // 2. She's Leaving Home (Beatles) -> Identificar Pronomes
                    Map<String, Object> dadosP2 = new HashMap<>();
                    dadosP2.put("video_url", "https://youtu.be/VaBPY78D88g?si=tzMxMWiwFR7jGQZS");
                    dadosP2.put("texto_base", "She is leaving home after living alone for so many years...");
                    dadosP2.put("palavras_corretas", List.of("She"));
                    criarPractice(modPronouns, TipoAtividade.SELECIONAR_PALAVRAS, "Identifique quem está saindo de casa.", dadosP2);

                    // 3. Rei Leão -> Identificar Pronomes
                    Map<String, Object> dadosP3 = new HashMap<>();
                    dadosP3.put("video_url", "https://youtu.be/leDXfrt2r9A?si=_8QEf89wWZ_ZGlzi"); // Trecho específico
                    dadosP3.put("pergunta", "Quem Timão diz que é um 'menino mau'? (He/She/It?)");
                    dadosP3.put("opcoes", List.of("He (Pumba)", "She (Nala)", "It (The Bug)", "They (The Lions)"));
                    dadosP3.put("resposta_correta", "He (Pumba)");
                    criarPractice(modPronouns, TipoAtividade.MULTIPLA_ESCOLHA, "Assista ao trecho e responda.", dadosP3);

                    // 4. Atividade de Listar Palavras
                    Map<String, Object> dadosP4 = new HashMap<>();
                    dadosP4.put("video_url", "https://youtu.be/i2mTGBRVRr0?si=KFRXRQ8IZv1xESsy"); // Thumbnail from the original video
                    dadosP4.put("numberOfInputs", 3);
                    dadosP4.put("palavras_esperadas", List.of("I", "You", "He", "She", "It", "We", "They")); // Pronomes esperados
                    criarPractice(modPronouns, TipoAtividade.LISTA_PALAVRAS, "Observe a imagem e liste 3 pronomes que você pode inferir da cena.", dadosP4);

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
                        "Crie um meme usando pelo menos um pronome (I, You, He...). Use o site sugerido (https://imgflip.com/memegenerator) e faça o upload da imagem aqui.", 
                        null, dadosProd1);

                    // 2. Vídeo Pergunta (Qual o único pronome?)
                    Map<String, Object> dadosProd2 = new HashMap<>();
                    dadosProd2.put("tipo_resposta", "texto_curto"); // Espera uma palavra
                    criarProduction(modPronouns, TipoDesafio.TEXTO_LONGO, 
                        "Assista ao vídeo e responda: Qual é o único Pronome Pessoal Sujeito mencionado neste trecho?", 
                        "https://www.youtube.com/watch?v=DE8qVfNW5B0", dadosProd2);


                    // 3. AUDIO (Ouvir e Escrever - Forrest Gump)
                    Map<String, Object> dadosOuvirTexto = new HashMap<>();
                    
                    List<Object> textParts = new ArrayList<>();
                    textParts.add(Map.of(
                        "label", "De acordo com Forrest Gump, com o que a vida se parece?",
                        "placeholder", "Digite sua resposta aqui..."
                    ));
                    textParts.add(Map.of(
                        "label", "Qual a implicação dessa comparação em relação ao que você vai receber?",
                        "placeholder", "Digite sua resposta aqui..."
                    ));
                    textParts.add(Map.of(
                        "label", "Qual a frase famosa que Forrest Gump diz sobre a vida e chocolates?",
                        "placeholder", "Digite sua resposta aqui..."
                    ));

                    dadosOuvirTexto.put("title", "Forrest Gump - Caixa de Chocolates");
                    dadosOuvirTexto.put("subtitle", "Ouça o áudio e responda às perguntas.");
                    dadosOuvirTexto.put("textParts", textParts);
                    
                    criarProduction(modPronouns, TipoDesafio.AUDIO, 
                        "Ouça o áudio do filme 'Forrest Gump' e responda às perguntas com base no que você ouviu.", 
                        "https://youtu.be/vdtqSaJO-iM?si=2I5_R3C_8qREitij", 
                        dadosOuvirTexto);
            
                    // 4. UPLOAD_ARQUIVO
                    Map<String, Object> dadosProdUpload = new HashMap<>();
                    dadosProdUpload.put("formatos_aceitos", List.of("pdf", "docx", "txt"));
                    
                    criarProduction(modPronouns, TipoDesafio.UPLOAD_ARQUIVO, 
                        "Escreva um pequeno parágrafo (em arquivo de texto ou PDF) descrevendo sua rotina diária. Use pelo menos 4 pronomes pessoais diferentes. Faça o upload do arquivo aqui.", 
                        null, dadosProdUpload);
            
            
                    // 5. RELACIONAR_COLUNAS
                    Map<String, Object> dadosProdRelacionar = new HashMap<>();
                    
                    List<Map<String, String>> charactersList = new ArrayList<>();
                    charactersList.add(Map.of("id", "a1", "name", "Um grupo de pessoas (incluindo você)"));
                    charactersList.add(Map.of("id", "a2", "name", "Um homem"));
                    charactersList.add(Map.of("id", "a3", "name", "Uma coisa ou animal"));
                    charactersList.add(Map.of("id", "a4", "name", "Um grupo de pessoas (sem você)"));
                    
                    List<Map<String, String>> quotesList = new ArrayList<>();
                    quotesList.add(Map.of("id", "b1", "text", "He"));
                    quotesList.add(Map.of("id", "b2", "text", "It"));
                    quotesList.add(Map.of("id", "b3", "text", "We"));
                    quotesList.add(Map.of("id", "b4", "text", "They"));
            
                    Map<String, String> gabaritoRelacionar = new HashMap<>();
                    gabaritoRelacionar.put("a1", "b3");
                    gabaritoRelacionar.put("a2", "b1");
                    gabaritoRelacionar.put("a3", "b2");
                    gabaritoRelacionar.put("a4", "b4");
            
                    dadosProdRelacionar.put("characters", charactersList);
                    dadosProdRelacionar.put("quotes", quotesList);
                    dadosProdRelacionar.put("gabarito", gabaritoRelacionar);
            
                    criarProduction(modPronouns, TipoDesafio.RELACIONAR_COLUNAS, 
                        "Relacione a descrição ao pronome pessoal correto.", 
                        null, dadosProdRelacionar);
            
            
                    // 6. SUBSTITUIR_PALAVRAS (I Will Always Love You)
                    String textoBaseSubstituir = "Bittersweet memories\nThat is all I'm taking with me\nSo goodbye, please don't cry\nWe both know I'm not what you, you need\nAnd I will always love you\nI will always love you";
                    
                    List<Map<String, Object>> alvosSubstituir = new ArrayList<>();
                    alvosSubstituir.add(Map.of(
                        "palavra", "memories",
                        "opcoes", List.of("recollections", "pasts", "souvenirs"),
                        "correta", "recollections"
                    ));
                    alvosSubstituir.add(Map.of(
                        "palavra", "goodbye",
                        "opcoes", List.of("hello", "farewell", "done"),
                        "correta", "farewell"
                    ));
                    alvosSubstituir.add(Map.of(
                        "palavra", "love",
                        "opcoes", List.of("like", "adore", "hate"),
                        "correta", "adore"
                    ));

                    List<Map<String, Object>> initialTextParts = new ArrayList<>();
                    Map<String, List<String>> synonymsMap = new HashMap<>();
                    Map<String, String> correctAnswersMap = new HashMap<>();

                    String remainingText = textoBaseSubstituir;
                    int wordIndex = 0;

                    alvosSubstituir.sort(Comparator.comparingInt(alvo -> textoBaseSubstituir.indexOf((String)alvo.get("palavra"))));

                    for (Map<String, Object> alvo : alvosSubstituir) {
                        String palavraAlvo = (String) alvo.get("palavra");
                        @SuppressWarnings("unchecked")
                        List<String> opcoes = (List<String>) alvo.get("opcoes");
                        String correta = (String) alvo.get("correta");

                        int index = remainingText.indexOf(palavraAlvo);
                        if (index != -1) {
                            if (index > 0) {
                                initialTextParts.add(Map.of("type", "text", "content", remainingText.substring(0, index)));
                            }

                            String wordId = "word_" + wordIndex++;
                            initialTextParts.add(Map.of("type", "word", "id", wordId, "content", palavraAlvo));
                            synonymsMap.put(wordId, opcoes);
                            correctAnswersMap.put(wordId, correta);

                            remainingText = remainingText.substring(index + palavraAlvo.length());
                        }
                    }
                    if (!remainingText.isEmpty()) {
                        initialTextParts.add(Map.of("type", "text", "content", remainingText));
                    }

                    Map<String, Object> dadosProdSubstituir = new HashMap<>();
                    dadosProdSubstituir.put("initialText", initialTextParts);
                    dadosProdSubstituir.put("synonyms", synonymsMap);
                    dadosProdSubstituir.put("correctAnswers", correctAnswersMap);
                    dadosProdSubstituir.put("songTitle", "I Will Always Love You");
                    dadosProdSubstituir.put("artistName", "Whitney Houston");

                    criarProduction(modPronouns, TipoDesafio.SUBSTITUIR_PALAVRAS, 
                        "Ouça a música e clique nas palavras destacadas para escolher a que melhor se encaixa no contexto da letra.", 
                        "https://youtu.be/3JWTaaS7LdU?si=199N19lM0xdtyikD", 
                        dadosProdSubstituir);
            


                    System.out.println(">>> Módulo 'Subject Pronouns' criado com sucesso!");
                }
            );
    }

    private void criarRecurso(Modulo mod, TipoRecurso tipo, String url, String transcricao, int ordem) {
        RecursoApresentacao rec = new RecursoApresentacao();
        rec.setModulo(mod);
        rec.setTipoRecurso(tipo);
        rec.setUrlRecurso(url);
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

