export const aulasTeclado = [
  {
    id: '1',
    titulo: 'Postura e Partes do Teclado',
    descricao: 'Conheça o instrumento e aprenda a posição correta para tocar.',
    secoes: [
      {
        titulo: 'Partes do teclado',
        conteudo: 'O teclado/piano é composto por:\n\n• Teclas brancas: as 7 notas naturais (C D E F G A B)\n• Teclas pretas: as notas alteradas (sustenidos e bemóis)\n• Pedais: o pedal sustain (direito) mantém as notas soando\n• Oitavas: grupos de 12 teclas que se repetem ao longo do teclado\n\nA nota C (Dó) fica sempre à esquerda de um grupo de 2 teclas pretas.',
      },
      {
        titulo: 'Postura correta',
        conteudo: 'Sentado: ajuste o banco para que os cotovelos fiquem na altura das teclas. Sente-se ereto, sem tensão nos ombros.\n\nMãos: os dedos devem estar levemente curvados, como se segurasse uma laranja. Os pulsos ficam no mesmo nível das teclas — não abaixados nem levantados.\n\nDedos: numerados de 1 (polegar) a 5 (mínimo) em cada mão.',
      },
      {
        titulo: 'Dica importante',
        conteudo: '💡 Nunca toque com os dedos esticados e rígidos — isso causa tensão e dificulta a velocidade. Mantenha sempre os dedos curvados e o pulso relaxado.',
      },
    ],
  },
  {
    id: '2',
    titulo: 'Notas e Leitura do Teclado',
    descricao: 'Aprenda os nomes das notas e onde elas ficam no teclado.',
    secoes: [
      {
        titulo: 'As 7 notas naturais',
        conteudo: 'As notas em ordem: C – D – E – F – G – A – B (e volta ao C)\n\nEm português: Dó – Ré – Mi – Fá – Sol – Lá – Si\n\nTruque para encontrar qualquer nota:\n• C (Dó): à esquerda do grupo de 2 teclas pretas\n• D (Ré): no meio do grupo de 2 teclas pretas\n• E (Mi): à direita do grupo de 2 teclas pretas\n• F (Fá): à esquerda do grupo de 3 teclas pretas',
      },
      {
        titulo: 'Sustenidos e bemóis',
        conteudo: 'As teclas pretas têm dois nomes:\n\n• C# (Dó sustenido) = Db (Ré bemol)\n• D# (Ré sustenido) = Eb (Mi bemol)\n• F# (Fá sustenido) = Gb (Sol bemol)\n• G# (Sol sustenido) = Ab (Lá bemol)\n• A# (Lá sustenido) = Bb (Si bemol)\n\nSustenido (#) sobe meio tom; bemol (b) desce meio tom.',
      },
      {
        titulo: 'Exercício de localização',
        conteudo: '💡 Exercício: toque todas as notas C do teclado da esquerda para a direita. Depois todas as notas G. Depois tente tocar C – D – E – F – G – A – B – C subindo e descendo com o dedo 1, 2, 3, 1, 2, 3, 4, 5.',
      },
    ],
  },
  {
    id: '3',
    titulo: 'Primeiros Acordes',
    descricao: 'Aprenda C, F e G — os três acordes mais usados no louvor.',
    secoes: [
      {
        titulo: 'Acorde C (Dó maior)',
        conteudo: 'C maior é formado pelas notas C – E – G:\n\n• Dedo 1 (polegar): tecla C\n• Dedo 3 (médio): tecla E\n• Dedo 5 (mínimo): tecla G\n\nToque as três teclas ao mesmo tempo com a mão direita. Mantenha os dedos curvados.\n\nUse o Campo Harmônico nas Ferramentas para ver as teclas destacadas no teclado visual!',
        acordes: ['C'],
      },
      {
        titulo: 'Acorde F (Fá maior)',
        conteudo: 'F maior é formado pelas notas F – A – C:\n\n• Dedo 1 (polegar): tecla F\n• Dedo 3 (médio): tecla A\n• Dedo 5 (mínimo): tecla C (próxima oitava)\n\nA tecla C do final fica na oitava acima do F inicial.',
        acordes: ['F'],
      },
      {
        titulo: 'Acorde G (Sol maior)',
        conteudo: 'G maior é formado pelas notas G – B – D:\n\n• Dedo 1 (polegar): tecla G\n• Dedo 3 (médio): tecla B\n• Dedo 5 (mínimo): tecla D (próxima oitava)\n\nC – F – G é a progressão I – IV – V, a base de inúmeras músicas de louvor!',
        acordes: ['G'],
      },
      {
        titulo: 'Praticando a progressão',
        conteudo: '💡 Exercício: toque C (4 batidas) → F (4 batidas) → G (4 batidas) → C. Repita devagar. Foque em trocar os acordes sem pausar o ritmo.',
      },
    ],
  },
  {
    id: '4',
    titulo: 'Acordes Menores',
    descricao: 'Aprenda Am, Dm e Em para expandir seu repertório.',
    secoes: [
      {
        titulo: 'Acorde Am (Lá menor)',
        conteudo: 'Am menor é formado pelas notas A – C – E:\n\n• Dedo 1 (polegar): tecla A\n• Dedo 3 (médio): tecla C\n• Dedo 5 (mínimo): tecla E\n\nCompare com A maior (A – C# – E): a única diferença é o C contra C#. Um semitom abaixo transforma o maior em menor!',
        acordes: ['Am'],
      },
      {
        titulo: 'Acorde Dm (Ré menor)',
        conteudo: 'Dm menor é formado pelas notas D – F – A:\n\n• Dedo 1 (polegar): tecla D\n• Dedo 3 (médio): tecla F\n• Dedo 5 (mínimo): tecla A\n\nDm tem um som suave e melancólico, muito usado em músicas de adoração íntima.',
        acordes: ['Dm'],
      },
      {
        titulo: 'Acorde Em (Mi menor)',
        conteudo: 'Em menor é formado pelas notas E – G – B:\n\n• Dedo 1 (polegar): tecla E\n• Dedo 3 (médio): tecla G\n• Dedo 5 (mínimo): tecla B\n\nEm é um dos acordes mais expressivos. Muito presente em músicas como "Oceans" e "Reckless Love".',
        acordes: ['Em'],
      },
      {
        titulo: 'A fórmula dos acordes',
        conteudo: '💡 Acordes maiores = nota raiz + 4 semitons + 3 semitons\nAcordes menores = nota raiz + 3 semitons + 4 semitons\n\nCom isso você pode construir qualquer acorde maior ou menor em qualquer tecla!',
      },
    ],
  },
  {
    id: '5',
    titulo: 'Campo Harmônico Maior',
    descricao: 'Entenda como as músicas são construídas com 7 acordes.',
    secoes: [
      {
        titulo: 'O que é campo harmônico?',
        conteudo: 'Campo harmônico é o conjunto de acordes que "pertencem" a uma tonalidade. Em uma tonalidade maior, existem exatamente 7 acordes — e a maioria das músicas usa apenas esses 7!\n\nCada acorde tem um número (grau) que indica sua função harmônica.',
      },
      {
        titulo: 'Campo harmônico de C Maior',
        conteudo: 'Os 7 acordes de Dó Maior:\n\n• I   — C  (maior)\n• ii  — Dm (menor)\n• iii — Em (menor)\n• IV  — F  (maior)\n• V   — G  (maior)\n• vi  — Am (menor)\n• vii° — Bdim (diminuto)\n\nA maioria das músicas de louvor usa os graus I, IV, V e vi.',
      },
      {
        titulo: 'Progressões famosas',
        conteudo: 'Usando os graus de C Maior:\n\n• I – V – vi – IV:  C – G – Am – F  (a mais popular do mundo!)\n• I – IV – V:       C – F – G\n• vi – IV – I – V:  Am – F – C – G\n\nExplore o Campo Harmônico nas Ferramentas para visualizar os acordes de qualquer tonalidade!',
      },
      {
        titulo: 'Por que isso importa?',
        conteudo: '💡 Conhecendo os graus, você pode tocar em qualquer tonalidade e comunicar com outros músicos usando números. "Vamos tocar em Ré, I – IV – V" é linguagem universal entre músicos!',
      },
    ],
  },
  {
    id: '6',
    titulo: 'Campo Harmônico Menor',
    descricao: 'Explore o campo harmônico menor e suas progressões.',
    secoes: [
      {
        titulo: 'Tom menor vs. maior',
        conteudo: 'O modo menor tem um som mais profundo, melancólico ou intenso. Muitas músicas de adoração usam o modo menor para expressar profundidade espiritual.\n\nA escala menor natural é a relativa da maior — elas compartilham as mesmas notas. Am é a relativa de C Maior!',
      },
      {
        titulo: 'Campo harmônico de A menor',
        conteudo: 'Os 7 acordes de Lá Menor:\n\n• i   — Am   (menor)\n• ii° — Bdim (diminuto)\n• III — C    (maior)\n• iv  — Dm   (menor)\n• v   — Em   (menor)\n• VI  — F    (maior)\n• VII — G    (maior)\n\nSão os mesmos 7 acordes de C Maior, mas com Am como centro!',
      },
      {
        titulo: 'Progressões em menor',
        conteudo: 'Progressões populares em Am:\n\n• i – VII – VI – VII:  Am – G – F – G\n• i – VI – III – VII:  Am – F – C – G\n• i – iv – VII – III:  Am – Dm – G – C\n\nToque cada progressão e sinta a diferença emocional em relação ao modo maior.',
      },
      {
        titulo: 'Dominante maior no menor',
        conteudo: '💡 Em músicas de louvor, o acorde V frequentemente aparece como maior mesmo no campo menor. Exemplo: em Am, o v seria Em — mas muitas músicas usam E maior para criar mais tensão e resolução de volta ao Am.',
      },
    ],
  },
  {
    id: '7',
    titulo: 'Ritmo e Marcação',
    descricao: 'Aprenda a tocar com ritmo e marcar o tempo no teclado.',
    secoes: [
      {
        titulo: 'Marcação básica',
        conteudo: 'A forma mais simples de tocar acordes no teclado é "marcar" — tocar o acorde completo em cada tempo do compasso:\n\n4/4: 1 – 2 – 3 – 4 (4 batidas por compasso)\n3/4: 1 – 2 – 3 (valsa)\n\nComece apenas marcando os acordes em cada tempo. Use o Metrônomo nas Ferramentas!',
      },
      {
        titulo: 'Padrão de arpejo',
        conteudo: 'Em vez de tocar todas as notas juntas, toque-as em sequência (arpejo):\n\nC maior: C → E → G → E → C → E → G → E\n\nIsso cria um acompanhamento mais fluido e musical. Experimente com todos os acordes que você aprendeu.',
      },
      {
        titulo: 'Baixo + acordes',
        conteudo: 'Padrão clássico de acompanhamento com duas mãos:\n\n• Mão esquerda: toca a nota raiz do acorde no tempo 1 e 3\n• Mão direita: toca o acorde completo nos tempos 2 e 4\n\nExemplo em C Maior:\n• Esquerda: C ... C ... C ... C ...\n• Direita: ... C–E–G ... C–E–G',
      },
      {
        titulo: 'Dica de tempo',
        conteudo: '💡 A consistência do tempo é mais importante que a velocidade. É melhor tocar devagar e no ritmo do que rápido e irregular. Use o metrônomo em toda prática!',
      },
    ],
  },
  {
    id: '8',
    titulo: 'Inversões de Acordes',
    descricao: 'Aprenda a tocar acordes em diferentes posições no teclado.',
    secoes: [
      {
        titulo: 'O que são inversões?',
        conteudo: 'Um acorde pode ser tocado em diferentes "arranjos" das suas notas. C maior tem 3 notas: C – E – G.\n\n• Posição fundamental: C embaixo (C – E – G)\n• 1ª inversão: E embaixo (E – G – C)\n• 2ª inversão: G embaixo (G – C – E)\n\nTodas as formas soam como C maior, mas com cores diferentes!',
      },
      {
        titulo: 'Por que usar inversões?',
        conteudo: 'Inversões permitem:\n\n• Trocas mais suaves entre acordes (menos movimento das mãos)\n• Vozes mais próximas (condução de vozes)\n• Sons mais ricos e variados\n\nExemplo: ao trocar de C para Am, é mais suave usar C em posição fundamental → Am em 1ª inversão (A – C – E → C – E – A).',
      },
      {
        titulo: 'Praticando inversões',
        conteudo: 'Exercício: toque C maior nas 3 inversões, subindo e descendo:\n\nC–E–G → E–G–C → G–C–E → E–G–C → C–E–G\n\nDepois aplique o mesmo em F maior e G maior. Use o Campo Harmônico nas Ferramentas para ver cada acorde!',
      },
      {
        titulo: 'Condução de vozes',
        conteudo: '💡 A "condução de vozes" é o princípio de mover cada nota o mínimo possível entre acordes. É o segredo do som "profissional" — acordes que fluem naturalmente uns nos outros sem saltos bruscos.',
      },
    ],
  },
  {
    id: '9',
    titulo: 'Acompanhamento com Duas Mãos',
    descricao: 'Coordene as duas mãos para um acompanhamento completo.',
    secoes: [
      {
        titulo: 'Dividindo as funções',
        conteudo: 'No acompanhamento com duas mãos:\n\n• Mão esquerda: responsável pelo baixo (fundação harmônica)\n• Mão direita: responsável pelos acordes e melodia\n\nComece praticando cada mão separadamente até cada parte ficar automática. Só depois junte as duas.',
      },
      {
        titulo: 'Padrão de baixo básico',
        conteudo: 'Padrão popular para mão esquerda (tempo 1 e 3):\n\nEm C Maior:\n• Tempo 1: nota C (grave)\n• Tempo 3: nota G ou E\n\nA mão esquerda sustenta a harmonia enquanto a direita preenche com o acorde.',
      },
      {
        titulo: 'Exercício progressivo',
        conteudo: 'Prática em 4 etapas para a progressão Am – F – C – G:\n\n1. Só mão esquerda (notas raízes: A – F – C – G)\n2. Só mão direita (acordes completos)\n3. Esquerda: raiz; Direita: acordes juntos\n4. Esquerda: padrão baixo; Direita: arpejo\n\nDomine cada etapa antes de avançar!',
      },
      {
        titulo: 'Dica de coordenação',
        conteudo: '💡 Se as mãos "brigam" entre si, volte ao passo 1. A coordenação vem com a prática — não tente forçar o processo. Em 2-3 semanas de prática diária a independência das mãos melhora muito.',
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
        conteudo: 'Até aqui você aprendeu:\n\n✅ Postura e localização das notas\n✅ Acordes maiores: C, F, G\n✅ Acordes menores: Am, Dm, Em\n✅ Campo harmônico maior e menor\n✅ Ritmo, arpejo e marcação\n✅ Inversões de acordes\n✅ Acompanhamento com duas mãos\n\nVocê tem base para tocar dezenas de músicas de louvor!',
      },
      {
        titulo: 'Escolhendo sua música',
        conteudo: 'Comece com uma música que você já conhece. Sugestões com C, Am, F, G:\n\n• "Quão Grande é o Meu Deus"\n• "10.000 Reasons" — Matt Redman\n• "Oceans" — Hillsong UNITED\n• "Preciso de Ti" — Gabriela Rocha\n\nBusque a cifra, identifique os acordes e verifique se você já os conhece.',
      },
      {
        titulo: 'Método de aprendizado',
        conteudo: 'Para aprender uma música nova:\n\n1. Ouça a música várias vezes prestando atenção nas trocas de acordes\n2. Toque só os acordes sem ritmo\n3. Adicione o ritmo bem devagar (50 BPM)\n4. Aumente a velocidade gradualmente\n5. Adicione a mão esquerda depois que a direita estiver automática\n\nNão tente tocar na velocidade original imediatamente!',
      },
      {
        titulo: 'Continue crescendo',
        conteudo: '💡 O teclado é uma jornada de vida. Com 15-20 minutos de prática diária consistente, em 6 meses você tocará com confiança no culto. Que Deus abençoe seu ministério!\n\n"Cantai-lhe um cântico novo; tocai bem e com júbilo." — Salmo 33:3',
      },
    ],
  },
]
