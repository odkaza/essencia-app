export const aulasViolao = [
  {
    id: '1',
    titulo: 'Postura e Partes do Violão',
    descricao: 'Conheça o instrumento e aprenda a posição correta para tocar.',
    secoes: [
      {
        titulo: 'Partes do violão',
        conteudo: 'O violão é composto por:\n\n• Corpo: a caixa de ressonância que amplifica o som\n• Braço: onde ficam as casas e os trastes\n• Cabeça: a parte superior com as tarraxas\n• Tarraxas: servem para afinar as cordas\n• Cordas: são 6, numeradas de 1 (mais fina) a 6 (mais grossa)\n• Boca: o buraco central que projeta o som\n• Cavalete/Rastilho: onde as cordas são fixadas no corpo',
      },
      {
        titulo: 'Postura correta',
        conteudo: 'Sentado: apoie o violão na coxa direita (ou esquerda se for canhoto), com o braço do violão apontando para a esquerda. Mantenha as costas retas e relaxadas.\n\nMão esquerda (mão do braço): o polegar fica atrás do braço, os dedos curvados pressionam as cordas com a ponta — não com a barriga do dedo.\n\nMão direita (mão da boca): fica posicionada sobre a boca do violão, dedos e pulso relaxados.',
      },
      {
        titulo: 'Dica importante',
        conteudo: '💡 Antes de tocar, verifique se o violão está afinado. Use o Afinador nas Ferramentas do app para conferir cada corda!',
      },
    ],
  },
  {
    id: '2',
    titulo: 'Lendo Cifras',
    descricao: 'Aprenda a interpretar cifras e diagramas de acordes.',
    secoes: [
      {
        titulo: 'O que é uma cifra?',
        conteudo: 'Cifra é uma forma simplificada de escrever músicas para violão. Em vez de partitura, usamos letras que indicam os acordes:\n\nC = Dó maior\nD = Ré maior\nEm = Mi menor\nAm = Lá menor\n\nA letra indica a nota raiz. Sufixos indicam a qualidade: "m" = menor, sem sufixo = maior, "dim" = diminuto.',
      },
      {
        titulo: 'Diagramas de acorde',
        conteudo: 'Um diagrama mostra como posicionar os dedos no braço do violão:\n\n• As linhas verticais representam as 6 cordas (da grossa à fina, da esquerda para a direita)\n• As linhas horizontais representam os trastes\n• Os pontos indicam onde pressionar\n• X = corda abafada (não toca)\n• O = corda solta (toca sem pressionar)\n\nUse o Campo Harmônico nas Ferramentas para ver os diagramas interativos!',
      },
      {
        titulo: 'Lendo a letra com cifra',
        conteudo: 'Na cifra, o acorde aparece acima da sílaba onde a troca deve acontecer:\n\n Am          Em\nAlegria, alegria\n\nIsso significa: toque Am no começo de "Alegria" e troque para Em em "a-le" de "alegria".',
      },
    ],
  },
  {
    id: '3',
    titulo: 'Primeiros Acordes',
    descricao: 'Aprenda Am, E e Em — os três primeiros acordes do violão.',
    secoes: [
      {
        titulo: 'Acorde Am (Lá menor)',
        conteudo: 'Am é um dos acordes mais fáceis e bonitos do violão:\n\n• Dedo 1 (indicador): 2ª corda, 1ª casa\n• Dedo 2 (médio): 4ª corda, 2ª casa\n• Dedo 3 (anelar): 3ª corda, 2ª casa\n• Cordas 1 e 5 são soltas (tocam livres)\n• Corda 6 (Mi grave): não toca (X)\n\nPressione com a ponta dos dedos, bem pertinho do traste metálico.',
        acordes: ['Am'],
      },
      {
        titulo: 'Acorde E (Mi maior)',
        conteudo: 'E é um acorde cheio — todas as 6 cordas tocam:\n\n• Dedo 1 (indicador): 3ª corda, 1ª casa\n• Dedo 2 (médio): 5ª corda, 2ª casa\n• Dedo 3 (anelar): 4ª corda, 2ª casa\n• Cordas 1, 2 e 6 são soltas\n\nQuando todas as cordas soam bem, você ouve um acorde poderoso e cheio!',
        acordes: ['E'],
      },
      {
        titulo: 'Acorde Em (Mi menor)',
        conteudo: 'Em é o E maior sem o dedo 1 — ainda mais fácil!\n\n• Dedo 2 (médio): 5ª corda, 2ª casa\n• Dedo 3 (anelar): 4ª corda, 2ª casa\n• Todas as outras cordas são soltas\n\nEm tem um som melancólico e bonito. É muito usado em músicas de adoração.',
        acordes: ['Em'],
      },
      {
        titulo: 'Praticando',
        conteudo: '💡 Exercício: toque Am por 4 batidas, depois Em por 4 batidas. Repita devagar. Não se preocupe com a velocidade — o importante é cada nota soar limpa.',
      },
    ],
  },
  {
    id: '4',
    titulo: 'Acordes G, C e D',
    descricao: 'Complete o set básico com os acordes mais usados no louvor.',
    secoes: [
      {
        titulo: 'Acorde G (Sol maior)',
        conteudo: 'G é um acorde aberto e ressonante:\n\n• Dedo 2 (médio): 6ª corda (Mi grave), 3ª casa\n• Dedo 1 (indicador): 5ª corda, 2ª casa\n• Dedo 3 (anelar): 1ª corda (Mi agudo), 3ª casa\n• Cordas 2, 3 e 4 são soltas\n\nVariação popular: alguns tocam G com os dedos 2, 3 e 4 para facilitar a troca para C.',
        acordes: ['G'],
      },
      {
        titulo: 'Acorde C (Dó maior)',
        conteudo: 'C é muito usado em músicas de louvor:\n\n• Dedo 1 (indicador): 2ª corda, 1ª casa\n• Dedo 2 (médio): 4ª corda, 2ª casa\n• Dedo 3 (anelar): 5ª corda, 3ª casa\n• Cordas 1 e 3 são soltas\n• Corda 6: não toca (X)\n\nA troca G → C é muito comum. Pratique bastante!',
        acordes: ['C'],
      },
      {
        titulo: 'Acorde D (Ré maior)',
        conteudo: 'D tem uma forma de diamante no braço:\n\n• Dedo 1 (indicador): 3ª corda, 2ª casa\n• Dedo 2 (médio): 1ª corda (Mi agudo), 2ª casa\n• Dedo 3 (anelar): 2ª corda, 3ª casa\n• Corda 4 solta; cordas 5 e 6 não tocam (X)\n\nNote que apenas 4 cordas tocam no D.',
        acordes: ['D'],
      },
      {
        titulo: 'A progressão G – C – D',
        conteudo: '💡 G - C - D é a progressão mais famosa do louvor! Corresponde aos graus I - IV - V no campo harmônico de Sol Maior.\n\nTente: G (4 batidas) → C (4 batidas) → D (4 batidas) → G. Dezenas de músicas usam exatamente esse padrão!',
      },
    ],
  },
  {
    id: '5',
    titulo: 'Seu Primeiro Ritmo',
    descricao: 'Aprenda a batida básica de violão e marque o tempo.',
    secoes: [
      {
        titulo: 'O que é ritmo?',
        conteudo: 'Ritmo é a pulsação regular da música — o "batimento cardíaco" da canção. Antes de tocar qualquer ritmo, conte mentalmente: 1, 2, 3, 4, 1, 2, 3, 4...\n\nUse o Metrônomo nas Ferramentas para manter o tempo. Comece com 60 BPM (lento) e vá aumentando gradualmente.',
      },
      {
        titulo: 'Batida para baixo (↓)',
        conteudo: 'A batida mais básica é tocar todas as cordas de cima para baixo com a mão direita:\n\n• Relaxe o pulso\n• Use a ponta das unhas ou uma palheta\n• Passe por todas as cordas em um único movimento fluido\n• Não trave o pulso — mantenha-o solto\n\nPratique só batidas para baixo, 4 por compasso: ↓ ↓ ↓ ↓',
      },
      {
        titulo: 'Batida simples: ↓ ↓ ↑ ↓ ↑',
        conteudo: 'O padrão mais comum em músicas de louvor:\n\n  ↓  ↓  ↑  ↓  ↑\n  1  2  e  3  e\n\n• Tempos 1 e 2: batida forte para baixo\n• "e" do 2: batida para cima (mais suave)\n• Tempo 3: batida para baixo\n• "e" do 3: batida para cima\n\nComece bem devagar. A fluência vem com a prática diária.',
      },
      {
        titulo: 'Dica de prática',
        conteudo: '💡 Pratique o ritmo primeiro sem trocar acordes. Fique no Am por 2 minutos só trabalhando a batida. Depois adicione a troca para Em. Separe os problemas para resolver um de cada vez!',
      },
    ],
  },
  {
    id: '6',
    titulo: 'Trocas de Acordes',
    descricao: 'Fluidez nas trocas é o segredo para tocar músicas completas.',
    secoes: [
      {
        titulo: 'Por que as trocas são difíceis?',
        conteudo: 'No início, as trocas de acordes parecem lentas e interrompem o ritmo. Isso é completamente normal! O cérebro precisa criar novos caminhos neurais para lembrar o formato de cada acorde automaticamente.\n\nCom prática diária de 15-20 minutos, em 2-3 semanas as trocas ficam notavelmente mais fluidas.',
      },
      {
        titulo: 'Técnica: mover os dedos juntos',
        conteudo: 'Quando possível, mova todos os dedos ao mesmo tempo ao trocar de acorde:\n\n• Pense no "desenho" do próximo acorde antes de levantar os dedos\n• Levante e reposicione todos os dedos de uma vez\n• Evite mover um dedo de cada vez\n\nIsso reduz o tempo de troca significativamente.',
      },
      {
        titulo: 'Exercício de trocas',
        conteudo: 'Pratique estas progressões com 4 batidas por acorde:\n\n1. Am → Em → Am → Em\n2. G → C → G → C\n3. G → Em → C → D\n4. Am → F → C → G  (a mais popular do louvor!)\n\nComece bem lento (50 BPM no metrônomo). A velocidade vem depois.',
      },
      {
        titulo: 'Dedos guia',
        conteudo: '💡 Um "dedo guia" permanece na mesma corda entre dois acordes — ele desliza em vez de levantar. Exemplo: Am → C, o dedo 1 permanece na 2ª corda, 1ª casa. Identifique esses dedos guia e use-os a seu favor!',
      },
    ],
  },
  {
    id: '7',
    titulo: 'Acorde F e Pestana',
    descricao: 'Domine o acorde mais desafiador para iniciantes.',
    secoes: [
      {
        titulo: 'O que é uma pestana?',
        conteudo: 'Pestana é quando o dedo indicador pressiona todas as cordas em uma mesma casa simultaneamente, funcionando como um "capotraste móvel".\n\nO acorde F (Fá maior) é o primeiro acorde com pestana que a maioria dos violonistas aprende — e também o primeiro grande desafio!',
      },
      {
        titulo: 'Como fazer a pestana',
        conteudo: 'Para o F na 1ª casa:\n\n1. Coloque o indicador deitado sobre todas as 6 cordas na 1ª casa\n2. Role levemente o dedo para o lado (a borda lateral é mais dura que a barriga)\n3. Dedo 2 (médio): 3ª corda, 2ª casa\n4. Dedo 3 (anelar): 5ª corda, 3ª casa\n5. Dedo 4 (mínimo): 4ª corda, 3ª casa\n\nToque corda por corda e ajuste até todas soarem limpas.',
        acordes: ['F'],
      },
      {
        titulo: 'Fortalecendo os dedos',
        conteudo: 'A pestana exige força e calosidade. Se doer muito, faça pausas e não force em excesso. Dicas:\n\n• Posicione o indicador bem pertinho do traste metálico\n• Pratique 5 minutos por dia — em 2-3 semanas fica mais fácil\n• Exercício: coloque o F, toque, tire, repita devagar\n• Cordas mais finas (0.009 ou 0.010) facilitam no início',
      },
      {
        titulo: 'F simplificado',
        conteudo: '💡 Versão alternativa: F mini — pestana só nas 2 primeiras cordas:\n\n• Indicador: 1ª e 2ª cordas, 1ª casa\n• Médio: 3ª corda, 2ª casa\n\nMuitos músicos profissionais usam esta versão! É igualmente válida em músicas de louvor.',
      },
    ],
  },
  {
    id: '8',
    titulo: 'Campo Harmônico Maior',
    descricao: 'Entenda como as músicas são construídas com 7 acordes.',
    secoes: [
      {
        titulo: 'O que é campo harmônico?',
        conteudo: 'Campo harmônico é o conjunto de acordes que "pertencem" a uma tonalidade. Em uma tonalidade maior, existem exatamente 7 acordes — e a maioria das músicas usa apenas esses 7!\n\nCada acorde tem um número (grau) que indica sua função harmônica na tonalidade.',
      },
      {
        titulo: 'Campo harmônico de C Maior',
        conteudo: 'Os 7 acordes de Dó Maior:\n\n• I   — C  (maior)\n• ii  — Dm (menor)\n• iii — Em (menor)\n• IV  — F  (maior)\n• V   — G  (maior)\n• vi  — Am (menor)\n• vii° — Bdim (diminuto)\n\nA maioria das músicas de louvor usa os graus I, IV, V e vi.',
      },
      {
        titulo: 'Progressões famosas',
        conteudo: 'Usando os graus de C Maior:\n\n• I – V – vi – IV:  C – G – Am – F  (a mais popular do mundo!)\n• I – IV – V:       C – F – G\n• vi – IV – I – V:  Am – F – C – G\n\nExplore o Campo Harmônico nas Ferramentas para ver os acordes de qualquer tonalidade!',
      },
      {
        titulo: 'Por que isso importa?',
        conteudo: '💡 Conhecendo o campo harmônico, você pode cifrar qualquer música na hora, transpor de tonalidade facilmente e comunicar com outros músicos usando números de graus. É o "mapa" da música!',
      },
    ],
  },
  {
    id: '9',
    titulo: 'Campo Harmônico Menor',
    descricao: 'Explore o campo harmônico menor e suas progressões.',
    secoes: [
      {
        titulo: 'Tom menor vs. maior',
        conteudo: 'O modo menor tem um som mais profundo, melancólico ou intenso comparado ao maior. Muitas músicas de adoração usam o modo menor para expressar profundidade espiritual e intimidade com Deus.\n\nA escala menor natural é a relativa da maior — elas compartilham as mesmas notas!',
      },
      {
        titulo: 'Campo harmônico de A menor',
        conteudo: 'Os 7 acordes de Lá Menor:\n\n• i   — Am   (menor)\n• ii° — Bdim (diminuto)\n• III — C    (maior)\n• iv  — Dm   (menor)\n• v   — Em   (menor)\n• VI  — F    (maior)\n• VII — G    (maior)\n\nLa Menor é a relativa de C Maior — compartilham os mesmos 7 acordes!',
      },
      {
        titulo: 'Progressões em menor',
        conteudo: 'Progressões populares em Am:\n\n• i – VII – VI – VII:  Am – G – F – G\n• i – VI – III – VII:  Am – F – C – G\n• i – iv – v – i:      Am – Dm – Em – Am\n\nToque cada progressão e sinta a diferença de emoção em relação às progressões maiores.',
      },
      {
        titulo: 'Dominante maior no menor',
        conteudo: '💡 Em músicas de louvor, o acorde V frequentemente aparece como maior mesmo no campo menor. Exemplo: em Am, o v seria Em — mas muitas músicas usam E maior para criar mais tensão e resolução de volta ao Am.',
      },
    ],
  },
  {
    id: '10',
    titulo: 'Sua Primeira Música',
    descricao: 'Junte tudo e toque uma música completa de adoração.',
    secoes: [
      {
        titulo: 'Revisão do que aprendemos',
        conteudo: 'Até aqui você aprendeu:\n\n✅ Postura correta\n✅ Como ler cifras e diagramas\n✅ Acordes: Am, Em, E, G, C, D, F\n✅ Ritmo básico: ↓ ↓ ↑ ↓ ↑\n✅ Trocas fluidas de acordes\n✅ Campo harmônico maior e menor\n\nIsso é muito! Você já tem base para tocar dezenas de músicas de louvor.',
      },
      {
        titulo: 'Escolhendo sua música',
        conteudo: 'Comece com uma música que você já conhece e que use acordes simples. Sugestões com Am, C, F, G:\n\n• "Preciso de Ti" — Gabriela Rocha\n• "Quão Grande é o Meu Deus"\n• "Oceans" — Hillsong UNITED\n\nBusque a cifra, identifique todos os acordes e verifique se você já os conhece.',
      },
      {
        titulo: 'Método de aprendizado',
        conteudo: 'Para aprender uma música nova:\n\n1. Ouça a música várias vezes prestando atenção nas trocas\n2. Toque a progressão de acordes sem ritmo (só trocando)\n3. Adicione o ritmo bem devagar (50 BPM)\n4. Aumente a velocidade gradualmente\n5. Cante por cima quando se sentir confortável\n\nNão tente tocar na velocidade original imediatamente!',
      },
      {
        titulo: 'Continue crescendo',
        conteudo: '💡 O violão é uma jornada de vida. Com 15-20 minutos de prática diária consistente, em 6 meses você tocará com confiança no culto. Que Deus abençoe seu ministério!\n\n"Louvai ao Senhor com a harpa; cantai-lhe louvores com o saltério." — Salmo 33:2',
      },
    ],
  },
]
