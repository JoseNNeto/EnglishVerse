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
                    dadosP1.put("texto_base", "Imagine me and you , I do \n I think about you day and night \n It 's only right \n To think about the girl you love \n And hold her tight \n So happy together \n ...");
                    dadosP1.put("palavras_corretas", List.of("I", "you", "It")); // O sistema valida essas
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

                    // 4. Atividade de Listar Palavras (Don't Stop Me Now)
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

                    // 6. The Breakfast Club -> Relacionar Colunas
                    Map<String, Object> dadosP6 = new HashMap<>();
                    dadosP6.put("video_url", "https://youtu.be/HhNH2V-K-9g?si=YQVoBMje2P2JJmHs");
                    dadosP6.put("characters", List.of(
                        Map.of("id", "1", "name", "Andrew Clark"),
                        Map.of("id", "2", "name", "Brian Johnson"),
                        Map.of("id", "3", "name", "Allison Reynolds"),
                        Map.of("id", "4", "name", "Claire Standish"),
                        Map.of("id", "5", "name", "John Bender")
                    ));
                    dadosP6.put("quotes", List.of(
                        Map.of("id", "a", "text", "an athlete"),
                        Map.of("id", "b", "text", "a brain"),
                        Map.of("id", "c", "text", "a basket case"),
                        Map.of("id", "d", "text", "a princess"),
                        Map.of("id", "e", "text", "a criminal")
                    ));
                    dadosP6.put("resposta_correta", Map.of(
                        "a", "1", // athlete -> Andrew
                        "b", "2", // brain -> Brian
                        "c", "3", // basket case -> Allison
                        "d", "4", // princess -> Claire
                        "e", "5"  // criminal -> Bender
                    ));
                    criarPractice(modPronouns, TipoAtividade.RELACIONAR_COLUNAS, "Associe cada estereótipo ao personagem que o representa na carta final.", dadosP6);

                    // 7. I Will Always Love You (Whitney Houston) -> Substituir Palavras
                    Map<String, Object> dadosP7 = new HashMap<>();
                    dadosP7.put("video_url", "https://youtu.be/3JWTaaS7LdU?si=RgVOg5HDo3dWZkqo");
                    dadosP7.put("initialText", List.of(
                        Map.of("type", "word", "content", "Bittersweet", "id", "w1"),
                        Map.of("type", "text", "content", " "),
                        Map.of("type", "word", "content", "memories", "id", "w2"),
                        Map.of("type", "text", "content", ", that is all I'm "),
                        Map.of("type", "word", "content", "taking", "id", "w3"),
                        Map.of("type", "text", "content", " with me. So "),
                        Map.of("type", "word", "content", "goodbye", "id", "w4"),
                        Map.of("type", "text", "content", ", please don't cry.")
                    ));
                    dadosP7.put("synonyms", Map.of(
                        "w1", List.of("Poignant", "Nostalgic", "Touching"),
                        "w2", List.of("recollections", "remembrances", "echoes"),
                        "w3", List.of("keeping", "holding", "carrying"),
                        "w4", List.of("farewell", "adieu")
                    ));
                    criarPractice(modPronouns, TipoAtividade.SUBSTITUIR_PALAVRAS, "Reescreva o trecho da letra. Clique nas palavras destacadas e escolha um sinônimo.", dadosP7);

                    
                    // ==========================================
                    // ETAPA 3: PRODUCTION (Os Desafios Criativos)
                    // ==========================================

                    // 1. Meme Generator
                    Map<String, Object> dadosProd1 = new HashMap<>();
                    dadosProd1.put("link_externo", "https://imgflip.com/memegenerator");
                    dadosProd1.put("formatos_aceitos", List.of("png", "jpg", "jpeg"));
                    criarProduction(modPronouns, TipoDesafio.FOTO_E_TEXTO, 
                        "Crie um meme usando pelo menos um pronome (I, You, He...). Use o site sugerido e faça o upload da imagem aqui.", 
                        null, dadosProd1);

                    // 2. Vídeo Pergunta (Qual o único pronome?)
                    Map<String, Object> dadosProd2 = new HashMap<>();
                    dadosProd2.put("tipo_resposta", "texto_curto"); // Espera uma palavra
                    criarProduction(modPronouns, TipoDesafio.TEXTO_LONGO, 
                        "Assista ao vídeo e responda: Qual é o único Pronome Pessoal Sujeito mencionado neste trecho?", 
                        "https://www.youtube.com/watch?v=DE8qVfNW5B0", dadosProd2);

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

