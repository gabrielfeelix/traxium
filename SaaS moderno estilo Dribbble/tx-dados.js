/* Traxium protótipo v2: base de dados comum.
 * Uma semente coerente + um log de operações gravado em localStorage ('tx-v2').
 * O estado da viagem nunca é campo: TX.decidir(viagem) deriva tudo dos fatos.
 * Carregado no <head> de cada tela v2, antes do support.js. Também roda em Node (scripts/testar-tx-dados.mjs).
 */
(function (root) {
  'use strict';

  const HOJE = '2026-10-08';
  const VERSAO_SEMENTE = 7;
  const CHAVE = 'tx-v2';
  const CHAVE_SESSAO = 'tx-v2-sessao';
  const DECLARACAO_CTE = 'O serviço fornecido é assegurado GMP+FSA';
  const ITENS_CHECKLIST = [
    { k: 'lona', n: 'Lona', pergunta: 'A lona está inteira, sem rasgo e bem amarrada?', foto: 'lona esticada sobre a carreta, de lado', critico: false },
    { k: 'correntes', n: 'Correntes', pergunta: 'As correntes estão presas e sem ferrugem solta?', foto: 'correntes presas na lateral', critico: false },
    { k: 'cintas', n: 'Cintas', pergunta: 'As cintas estão inteiras e sem óleo?', foto: 'cintas enroladas ou presas', critico: false },
    { k: 'carroceria', n: 'Carroceria', pergunta: 'A carroceria está sem furo, sem tábua solta e sem vazamento?', foto: 'carroceria por fora, de ponta a ponta', critico: false },
    { k: 'interior', n: 'Interior', pergunta: 'O interior está varrido, seco e sem resto da carga anterior?', foto: 'interior vazio, de cima', critico: true }
  ];
  const REGIMES = {
    A: { n: 'Seco', desc: 'varrição e limpeza a seco', ordem: 1 },
    B: { n: 'Água', desc: 'lavagem com água', ordem: 2 },
    C: { n: 'Água e detergente', desc: 'lavagem com água e detergente', ordem: 3 },
    D: { n: 'Desinfecção', desc: 'lavagem e desinfecção', ordem: 4 },
    X: { n: 'Proibida', desc: 'carga anterior proibida: nenhuma limpeza resolve', ordem: 9 }
  };

  // ------------------------------------------------------------------ utilidades
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const soDigitos = s => String(s || '').replace(/\D/g, '');
  const addDias = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const difDias = (a, b) => Math.round((new Date(a + 'T12:00:00Z') - new Date(b + 'T12:00:00Z')) / 86400000);
  const clone = o => JSON.parse(JSON.stringify(o));
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmt = {
    data: iso => iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : '',
    curta: iso => iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '',
    extenso: iso => { if (!iso) return ''; const d = new Date(iso.slice(0, 10) + 'T12:00:00Z'); return DIAS[d.getUTCDay()] + ', ' + (+iso.slice(8, 10)) + ' ' + MESES[+iso.slice(5, 7) - 1]; },
    hora: ts => ts && ts.length > 10 ? ts.slice(11, 16) : '',
    quando: ts => {
      if (!ts) return '';
      const d = ts.slice(0, 10), h = ts.length > 10 ? ts.slice(11, 16) : '';
      const dd = difDias(HOJE, d);
      const base = dd === 0 ? 'hoje' : dd === 1 ? 'ontem' : fmt.curta(d);
      return h ? base + ' ' + h : base;
    },
    relativo: iso => { const n = difDias(iso, HOJE); if (n === 0) return 'hoje'; if (n === 1) return 'amanhã'; if (n === -1) return 'ontem'; return n > 0 ? 'em ' + n + ' dias' : 'há ' + (-n) + ' dias'; },
    cpf: c => { const d = soDigitos(c); return d.length === 11 ? d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9) : c; },
    cpfMascara: c => { const d = soDigitos(c); return d.length === 11 ? d.slice(0, 3) + '.***.***-' + d.slice(9) : c; },
    peso: t => String(t).replace('.', ',') + ' t',
    iniciais: n => { const ps = String(n || '').split(' ').filter(p => p.length > 2); return ((ps[0] || '?')[0] + (ps.length > 1 ? ps[ps.length - 1][0] : '')).toUpperCase(); }
  };
  // Relógio da demonstração: o dia é sempre HOJE; fora do expediente, a hora cai entre 10:00 e 10:59.
  function agoraHM() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    const h = d.getHours() >= 6 && d.getHours() < 18 ? d.getHours() : 10;
    return p(h) + ':' + p(d.getMinutes());
  }
  function agoraTs() { return HOJE + 'T' + agoraHM(); }

  // ------------------------------------------------------------------ semente
  function semente() {
    const db = {};
    db.tenant = { nome: 'Transrural Log Ltda', cnpj: '12.408.551/0001-37', matriz: 'RON', escopos: ['Road Transport of Feed', 'Affreightment of Road Transport'], certificadora: 'Organismo certificador acreditado GMP+' };

    db.filiais = [
      { id: 'RON', nome: 'Rondonópolis', uf: 'MT', matriz: true, registro: 'GMP+ 105744', afretador: 'u-paula', comunicacaoOC: { data: '2026-01-12', protocolo: 'OC-GK-2026-0112', por: 'u-rafael' } },
      { id: 'SOR', nome: 'Sorriso', uf: 'MT', matriz: false, registro: 'GMP+ 105745', afretador: 'u-diego', comunicacaoOC: { data: '2026-01-12', protocolo: 'OC-GK-2026-0113', por: 'u-rafael' } },
      { id: 'RVD', nome: 'Rio Verde', uf: 'GO', matriz: false, registro: 'GMP+ 105746', afretador: 'u-camila', comunicacaoOC: { data: '2026-02-03', protocolo: 'OC-GK-2026-0203', por: 'u-rafael' } },
      { id: 'PNG', nome: 'Paranaguá', uf: 'PR', matriz: false, registro: 'GMP+ 105791', afretador: 'u-marcos', comunicacaoOC: null, abertaEm: '2026-09-01' }
    ];

    db.alcadas = [
      { k: 'qualidade', n: 'Gestor da qualidade', nivel: 1, libera: 'Pendência corrigível: documento vencido com renovação em curso, troca de veículo, foto insuficiente.' },
      { k: 'direcao', n: 'Direção e RT', nivel: 2, libera: 'Risco residual aceito: transportador em revisão após ocorrência, transportador emergencial.' },
      { k: 'tecnico', n: 'Técnico', nivel: 9, libera: 'Ninguém. Contaminação não se aprova: se regulariza conforme a TS1.9.' }
    ];

    db.usuarios = [
      { id: 'u-rafael', nome: 'Rafael Antunes', papel: 'qualidade', cargo: 'Gestor da qualidade', filiais: ['RON', 'SOR', 'RVD', 'PNG'], alcada: 'qualidade', email: 'rafael.antunes@transrural.com.br', g1: '#e8a33d', g2: '#d97544' },
      { id: 'u-luiz', nome: 'Luiz Fernando Bastos', papel: 'direcao', cargo: 'Direção e Responsável Técnico', filiais: ['RON', 'SOR', 'RVD', 'PNG'], alcada: 'direcao', email: 'luiz.bastos@transrural.com.br', g1: '#5b8def', g2: '#4c5bc0' },
      { id: 'u-diego', nome: 'Diego Saldanha', papel: 'afretador', cargo: 'Afretador', filiais: ['SOR'], alcada: null, email: 'diego.saldanha@transrural.com.br', g1: '#127670', g2: '#0E78B5' },
      { id: 'u-paula', nome: 'Paula Menezes', papel: 'afretador', cargo: 'Afretadora', filiais: ['RON'], alcada: null, email: 'paula.menezes@transrural.com.br', g1: '#48c78e', g2: '#127670' },
      { id: 'u-camila', nome: 'Camila Rezende', papel: 'afretador', cargo: 'Afretadora', filiais: ['RVD'], alcada: null, email: 'camila.rezende@transrural.com.br', g1: '#c46ba0', g2: '#8f4f9a' },
      { id: 'u-marcos', nome: 'Marcos Tavares', papel: 'afretador', cargo: 'Afretador', filiais: ['PNG'], alcada: null, email: 'marcos.tavares@transrural.com.br', g1: '#0E78B5', g2: '#4c5bc0' },
      { id: 'u-sergio', nome: 'Sérgio Okada', papel: 'frota', cargo: 'Gestor de frota', filiais: ['RON', 'SOR', 'RVD', 'PNG'], alcada: null, email: 'sergio.okada@transrural.com.br', g1: '#7c8f8d', g2: '#3c4f4e' },
      { id: 'u-ana', nome: 'Ana Prates', papel: 'consultoria', cargo: 'Consultoria externa (leitura e exportação)', filiais: ['RON', 'SOR', 'RVD', 'PNG'], alcada: null, email: 'ana.prates@consultoria.com.br', g1: '#9fc9c6', g2: '#6ba8a4' }
    ];

    // Produtos e regimes (consulta à base IDTF mantida pela Traxium, v2026.09).
    // regime: limpeza exigida DEPOIS de transportar este produto, antes de carregar ração. X = proibida.
    const P = (id, nome, sin, en, cat, regime, racao) => ({ id, nome, sin, en, cat, regime, racao });
    db.produtos = [
      P('soja', 'Soja em grãos', ['soja', 'grão de soja', 'soja grão'], 'Soybeans', 'Grãos', 'A', true),
      P('milho', 'Milho em grãos', ['milho', 'milho a granel', 'milho grão'], 'Maize', 'Grãos', 'A', true),
      P('farelo-soja', 'Farelo de soja', ['farelo', 'farelo 46', 'farelão'], 'Soybean meal', 'Farelos e coprodutos', 'A', true),
      P('casca-soja', 'Casca de soja peletizada', ['casquinha', 'casca de soja', 'pelete de casca'], 'Soybean hulls', 'Farelos e coprodutos', 'A', true),
      P('trigo', 'Trigo em grãos', ['trigo'], 'Wheat', 'Grãos', 'A', true),
      P('farelo-trigo', 'Farelo de trigo', ['farelinho', 'triguilho'], 'Wheat middlings', 'Farelos e coprodutos', 'A', true),
      P('sorgo', 'Sorgo granífero', ['sorgo'], 'Sorghum', 'Grãos', 'A', true),
      P('milheto', 'Milheto', ['milheto'], 'Millet', 'Grãos', 'A', true),
      P('arroz', 'Arroz em casca', ['arroz'], 'Paddy rice', 'Grãos', 'A', true),
      P('ddg', 'DDG de milho', ['ddg', 'ddgs', 'resíduo de etanol de milho'], 'Distillers dried grains', 'Farelos e coprodutos', 'A', true),
      P('caroco-algodao', 'Caroço de algodão', ['caroço', 'semente de algodão'], 'Cottonseed', 'Farelos e coprodutos', 'A', true),
      P('farelo-algodao', 'Farelo de algodão', ['farelo de algodão'], 'Cottonseed meal', 'Farelos e coprodutos', 'A', true),
      P('polpa-citrica', 'Polpa cítrica peletizada', ['polpa cítrica', 'polpa de laranja'], 'Citrus pulp', 'Farelos e coprodutos', 'A', true),
      P('acucar', 'Açúcar cristal', ['açúcar'], 'Sugar', 'Alimentos', 'A', true),
      P('sal-mineral', 'Sal mineral bovino', ['sal mineral', 'núcleo mineral', 'sal'], 'Mineral feed', 'Ração e minerais', 'B', true),
      P('calcario', 'Calcário calcítico', ['calcário', 'pó calcário', 'calcário dolomítico'], 'Limestone', 'Corretivos', 'A', false),
      P('gesso', 'Gesso agrícola', ['gesso'], 'Gypsum', 'Corretivos', 'A', false),
      P('ureia', 'Ureia agrícola', ['ureia', 'uréia'], 'Urea', 'Fertilizantes', 'A', false),
      P('sulfato-amonio', 'Sulfato de amônio', ['sulfato', 'sulfato de amônia'], 'Ammonium sulphate', 'Fertilizantes', 'A', false),
      P('npk', 'Fertilizante NPK', ['adubo', 'adubo npk', 'formulado', 'fertilizante'], 'NPK fertilizer', 'Fertilizantes', 'A', false),
      P('kcl', 'Cloreto de potássio', ['potássio', 'kcl', 'cloreto'], 'Potassium chloride', 'Fertilizantes', 'A', false),
      P('ssp', 'Superfosfato simples', ['superfosfato', 'ssp'], 'Single superphosphate', 'Fertilizantes', 'B', false),
      P('map', 'Fosfato monoamônico', ['map', 'fosfato'], 'Monoammonium phosphate', 'Fertilizantes', 'B', false),
      P('cimento', 'Cimento a granel', ['cimento'], 'Cement', 'Construção', 'B', false),
      P('areia', 'Areia', ['areia'], 'Sand', 'Construção', 'A', false),
      P('carvao', 'Carvão vegetal', ['carvão'], 'Charcoal', 'Outros', 'B', false),
      P('farinha-carne', 'Farinha de carne e ossos', ['farinha de osso', 'fco', 'farinha de carne'], 'Meat and bone meal', 'Origem animal', 'D', false),
      P('cama-frango', 'Cama de frango', ['cama de aviário', 'esterco de frango', 'cama'], 'Poultry litter', 'Resíduos', 'X', false),
      P('torta-mamona', 'Torta de mamona', ['mamona'], 'Castor bean meal', 'Resíduos', 'X', false),
      P('lodo', 'Lodo de esgoto', ['lodo'], 'Sewage sludge', 'Resíduos', 'X', false)
    ];
    db.baseIDTF = { versao: 'v2026.09', publicadaEm: '2026-09-01', mantidaPor: 'Traxium' };
    db.pedidosClassificacao = [
      { id: 'PC-014', texto: 'escória de alto-forno', pedidoEm: '2026-10-06', por: 'u-camila', viagem: null, estado: 'na fila da Traxium' }
    ];

    // Pessoas: chave é o CPF.
    const PS = (id, nome, cpf, tel, cnh, cnhVal, vinc, g1, g2) => ({ id, nome, cpf, telefone: tel, cnh: cnh ? { numero: cnh, validade: cnhVal, categoria: 'E' } : null, vinculo: vinc, g1, g2 });
    db.pessoas = [
      PS('p-josue', 'Josué Ribeiro', '41277803915', '(66) 99812-4410', '04821390211', '2028-02-14', 'tac', '#127670', '#0E78B5'),
      PS('p-ademir', 'Ademir Kunz', '52093418877', '(66) 99631-0928', '05530912844', '2027-08-30', 'tac', '#c43d3d', '#93313f'),
      PS('p-valmir', 'Valmir Schneider', '30418877201', '(66) 99904-7715', '03318740972', '2029-01-20', 'tac', '#5b8def', '#4c5bc0'),
      PS('p-rosana', 'Rosana Teles', '71520933804', '(65) 99218-3307', '06622091355', '2028-11-03', 'tac', '#c46ba0', '#8f4f9a'),
      PS('p-genivaldo', 'Genivaldo Souza', '20981733450', '(66) 99742-1189', '02209817734', '2027-04-17', 'tac', '#e8a33d', '#b97514'),
      PS('p-claudio', 'Cláudio Brandão', '63308127719', '(66) 99655-2043', '07733081200', '2028-06-09', 'tac', '#48c78e', '#127670'),
      PS('p-edimar', 'Edimar Pires', '84417290366', '(64) 99318-5520', '05544172911', '2027-12-01', 'tac', '#0E78B5', '#4c5bc0'),
      PS('p-luciano', 'Luciano Farias', '19830471288', '(64) 99127-6634', '04419830473', '2028-03-22', 'tac', '#9fc9c6', '#6ba8a4'),
      PS('p-joao', 'João Bortolini', '58831620940', '(66) 99403-8812', '03358831628', '2026-10-28', 'tac', '#d97544', '#b85a2e'),
      PS('p-marcelo', 'Marcelo Dias', '90217744531', '(41) 99880-1276', '08890217740', '2029-05-11', 'tac', '#127670', '#48c78e'),
      PS('p-ivo', 'Ivo Barcellos', '37719022184', '(66) 99571-3390', '02237719020', '2026-10-04', 'tac', '#7c8f8d', '#3c4f4e'),
      PS('p-ivan', 'Ivan Prado', '44812093370', '(66) 99360-4471', '04448120933', '2028-09-15', 'etc:e-lima', '#0C5862', '#0E78B5'),
      PS('p-reinaldo', 'Reinaldo Matos', '29177340815', '(64) 99611-0284', '01129177348', '2027-10-10', 'etc:e-cerrado', '#48c78e', '#127670'),
      PS('p-cicero', 'Cícero Alves', '66120938417', '(64) 99223-7810', '06612093840', '2028-01-29', 'etc:e-cerrado', '#5b8def', '#0E78B5'),
      PS('p-wellington', 'Wellington Rocha', '81340227756', '(64) 99702-6153', '08134022775', '2027-06-30', 'etc:e-transrocha', '#e8a33d', '#d97544'),
      PS('p-paulo', 'Paulo Lima', '12093381746', '(66) 99410-2237', '01209338170', '2028-04-04', 'propria', '#48c78e', '#127670'),
      PS('p-renato', 'Renato Silva', '23381904417', '(66) 99520-8814', '02338190440', '2027-09-19', 'propria', '#5b8def', '#4c5bc0'),
      PS('p-valdir', 'Valdir Nunes', '34490127763', '(64) 99331-0472', '03449012770', '2028-12-12', 'propria', '#127670', '#0E78B5'),
      PS('p-edson', 'Edson Farias', '45501238819', '(66) 99207-5541', '04550123880', '2027-05-25', 'propria', '#c43d3d', '#93313f'),
      PS('p-sergior', 'Sérgio Ramos', '56612349920', '(66) 99118-3360', '05661234990', '2029-02-02', 'propria', '#0E78B5', '#4c5bc0'),
      PS('p-milton', 'Milton Costa', '67723450031', '(66) 99830-1145', '06772345000', '2028-07-07', 'propria', '#e8a33d', '#d97544')
    ];

    // Transportadores: TAC é pessoa com conjunto; ETC é empresa com motoristas e conjuntos.
    db.transportadores = [
      { id: 't-josue', tipo: 'TAC', pessoa: 'p-josue', rntrc: { numero: '048213977', validade: '2027-05-30' }, cobertura: 'gatekeeper', conjuntos: ['c-josue'], convite: { estado: 'aceito', em: '2026-09-03' }, desde: '2026-09-03' },
      { id: 't-ademir', tipo: 'TAC', pessoa: 'p-ademir', rntrc: { numero: '051177340', validade: '2027-02-11' }, cobertura: 'gatekeeper', conjuntos: ['c-ademir'], convite: { estado: 'nao_convidado' }, desde: '2026-10-08' },
      { id: 't-valmir', tipo: 'TAC', pessoa: 'p-valmir', rntrc: { numero: '039920114', validade: '2028-01-15' }, cobertura: 'gatekeeper', conjuntos: ['c-valmir'], convite: { estado: 'enviado', em: '2026-10-06' }, desde: '2026-10-06' },
      { id: 't-rosana', tipo: 'TAC', pessoa: 'p-rosana', rntrc: { numero: '060318872', validade: '2027-09-09' }, cobertura: 'gatekeeper', conjuntos: ['c-rosana'], convite: { estado: 'aceito', em: '2026-10-02' }, desde: '2026-10-02' },
      { id: 't-genivaldo', tipo: 'TAC', pessoa: 'p-genivaldo', rntrc: { numero: '027781190', validade: '2027-03-30' }, cobertura: 'gatekeeper', conjuntos: ['c-genivaldo'], convite: { estado: 'expirado', em: '2026-08-20' }, desde: '2026-08-20' },
      { id: 't-claudio', tipo: 'TAC', pessoa: 'p-claudio', rntrc: { numero: '071190335', validade: '2028-08-08' }, cobertura: 'gatekeeper', conjuntos: ['c-claudio'], convite: { estado: 'nao_convidado' }, desde: '2026-10-08' },
      { id: 't-edimar', tipo: 'TAC', pessoa: 'p-edimar', rntrc: { numero: '052240981', validade: '2027-11-20' }, cobertura: 'gatekeeper', conjuntos: ['c-edimar'], convite: { estado: 'nao_convidado' }, desde: '2026-10-08' },
      { id: 't-luciano', tipo: 'TAC', pessoa: 'p-luciano', rntrc: { numero: '044401287', validade: '2027-07-01' }, cobertura: 'gatekeeper', conjuntos: ['c-luciano'], convite: { estado: 'revogado', em: '2026-10-01' }, desde: '2026-09-25' },
      { id: 't-joao', tipo: 'TAC', pessoa: 'p-joao', rntrc: { numero: '033588316', validade: '2027-04-04' }, cobertura: 'gatekeeper', conjuntos: ['c-joao'], convite: { estado: 'aceito', em: '2026-09-26' }, desde: '2026-09-26' },
      { id: 't-marcelo', tipo: 'TAC', pessoa: 'p-marcelo', rntrc: { numero: '090217701', validade: '2028-10-30' }, cobertura: 'gatekeeper', conjuntos: ['c-marcelo'], convite: { estado: 'nao_convidado' }, desde: '2026-10-08' },
      { id: 't-ivo', tipo: 'TAC', pessoa: 'p-ivo', rntrc: { numero: '037719044', validade: '2026-11-22' }, cobertura: 'gatekeeper', conjuntos: ['c-ivo'], convite: { estado: 'aceito', em: '2026-10-07' }, desde: '2026-10-07' },
      { id: 'e-cerrado', tipo: 'ETC', nome: 'Cerrado Cargas Ltda', cnpj: '08.771.320/0001-54', cidade: 'Rio Verde GO', telefone: '(64) 3611-2290', rntrc: { numero: '008771320', validade: '2028-05-31' }, cobertura: 'certificado', certificado: { numero: 'GMP+ FSA 108221', validade: '2027-03-31', escopo: 'Road Transport of Feed', certificadora: 'Organismo acreditado GMP+' }, motoristas: ['p-reinaldo', 'p-cicero'], conjuntos: ['c-cerrado1', 'c-cerrado2'], convite: { estado: 'aceito', em: '2026-04-10' }, desde: '2026-04-10' },
      { id: 'e-lima', tipo: 'ETC', nome: 'Lima Logística Ltda', cnpj: '19.302.448/0001-09', cidade: 'Sorriso MT', telefone: '(66) 3544-7012', rntrc: { numero: '019302448', validade: '2027-08-15' }, cobertura: 'gatekeeper', certificado: null, motoristas: ['p-ivan'], conjuntos: ['c-lima1'], convite: { estado: 'aceito', em: '2026-05-02' }, desde: '2026-05-02' },
      { id: 'e-transrocha', tipo: 'ETC', nome: 'Transrocha Transportes Ltda', cnpj: '27.115.903/0001-81', cidade: 'Jataí GO', telefone: '(64) 3632-9918', rntrc: { numero: '027115903', validade: '2027-12-12' }, cobertura: 'certificado', certificado: { numero: 'GMP+ FSA 104377', validade: '2026-10-20', escopo: 'Road Transport of Feed', certificadora: 'Organismo acreditado GMP+' }, motoristas: ['p-wellington'], conjuntos: ['c-transrocha1'], convite: { estado: 'enviado', em: '2026-10-01' }, desde: '2026-06-18' }
    ];

    // Placas: cavalo e carretas, cada uma com CRLV. Compartimento = placa da carreta + posição.
    const CV = (placa, dono, val, modelo) => ({ placa, tipo: 'cavalo', dono, crlv: { validade: val }, modelo: modelo || 'Cavalo mecânico 6x4' });
    const CR = (placa, dono, val, comps, modelo) => ({ placa, tipo: 'carreta', dono, crlv: { validade: val }, comps: comps || ['C1'], modelo: modelo || 'Graneleira' });
    db.placas = [
      CV('RBK 2F41', 't-josue', '2027-04-30'), CR('QWM 4H57', 't-josue', '2027-04-30'), CR('QWM 4H58', 't-josue', '2027-04-30'),
      CV('QAU 6J12', 't-ademir', '2027-03-31'), CR('RAD 3K20', 't-ademir', '2027-03-31', ['C1'], 'Graneleira 3 eixos'),
      CV('QVT 1A90', 't-valmir', '2027-06-30'), CR('QVT 1A91', 't-valmir', '2027-06-30'), CR('QVT 1A92', 't-valmir', '2027-06-30'),
      CV('RRT 5E06', 't-rosana', '2027-01-31'), CR('RRT 5E07', 't-rosana', '2026-10-15', ['C1'], 'Graneleira 3 eixos'),
      CV('QHG 7L33', 't-genivaldo', '2027-02-28'), CR('QHG 7L34', 't-genivaldo', '2026-10-01', ['C1'], 'Graneleira 3 eixos'),
      CV('RCB 9M15', 't-claudio', '2027-07-31'), CR('RCB 9M16', 't-claudio', '2027-07-31'),
      CV('PJE 2B48', 't-edimar', '2027-05-31'), CR('PJE 2B49', 't-edimar', '2027-05-31'),
      CV('QLF 8N02', 't-luciano', '2027-08-31'), CR('QLF 8N03', 't-luciano', '2027-08-31'),
      CV('QJB 4R71', 't-joao', '2027-03-31'), CR('QJB 4R72', 't-joao', '2027-03-31'), CR('QJB 4R73', 't-joao', '2027-03-31'),
      CV('AYK 6P19', 't-marcelo', '2027-09-30'), CR('AYK 6P20', 't-marcelo', '2027-09-30'),
      CV('QIB 3S55', 't-ivo', '2027-01-31'), CR('QIB 3S56', 't-ivo', '2027-01-31'),
      CV('QAS 7C31', 'e-lima', '2027-05-31'), CR('SQT 9E18', 'e-lima', '2027-05-31', ['C1', 'C2'], 'Graneleira bipartida'),
      CV('QCE 1T10', 'e-cerrado', '2027-06-30'), CR('QCE 1T11', 'e-cerrado', '2027-06-30'),
      CV('QCE 1T20', 'e-cerrado', '2027-06-30'), CR('QCE 1T21', 'e-cerrado', '2027-06-30'),
      CV('RTR 7U44', 'e-transrocha', '2027-04-30'), CR('RTR 7U45', 'e-transrocha', '2027-04-30'),
      CV('QBD 3E90', 'propria', '2027-03-31'), CR('SQT 6B77', 'propria', '2027-03-31'),
      CV('QJC 1D77', 'propria', '2027-03-31'), CR('SQT 7D22', 'propria', '2027-03-31'),
      CV('QCP 8A55', 'propria', '2027-03-31'), CR('SQT 5F31', 'propria', '2027-03-31'), CR('SQT 5F32', 'propria', '2027-03-31'),
      CV('RTQ 8B44', 'propria', '2027-03-31'), CR('SQT 1A02', 'propria', '2027-03-31', ['C1', 'C2'], 'Graneleira bipartida'),
      CV('QJD 9F03', 'propria', '2027-03-31'), CR('SQT 4A66', 'propria', '2027-03-31', ['C1'], 'Basculante'),
      CV('RXQ 4B19', 'propria', '2027-03-31'), CR('SQT 2C08', 'propria', '2027-03-31')
    ];

    const CJ = (id, dono, cavalo, carretas, extra) => Object.assign({ id, dono, cavalo, carretas }, extra || {});
    db.conjuntos = [
      CJ('c-josue', 't-josue', 'RBK 2F41', ['QWM 4H57', 'QWM 4H58']),
      CJ('c-ademir', 't-ademir', 'QAU 6J12', ['RAD 3K20']),
      CJ('c-valmir', 't-valmir', 'QVT 1A90', ['QVT 1A91', 'QVT 1A92']),
      CJ('c-rosana', 't-rosana', 'RRT 5E06', ['RRT 5E07']),
      CJ('c-genivaldo', 't-genivaldo', 'QHG 7L33', ['QHG 7L34']),
      CJ('c-claudio', 't-claudio', 'RCB 9M15', ['RCB 9M16']),
      CJ('c-edimar', 't-edimar', 'PJE 2B48', ['PJE 2B49']),
      CJ('c-luciano', 't-luciano', 'QLF 8N02', ['QLF 8N03']),
      CJ('c-joao', 't-joao', 'QJB 4R71', ['QJB 4R72', 'QJB 4R73']),
      CJ('c-marcelo', 't-marcelo', 'AYK 6P19', ['AYK 6P20']),
      CJ('c-ivo', 't-ivo', 'QIB 3S55', ['QIB 3S56']),
      CJ('c-lima1', 'e-lima', 'QAS 7C31', ['SQT 9E18']),
      CJ('c-cerrado1', 'e-cerrado', 'QCE 1T10', ['QCE 1T11']),
      CJ('c-cerrado2', 'e-cerrado', 'QCE 1T20', ['QCE 1T21']),
      CJ('c-transrocha1', 'e-transrocha', 'RTR 7U44', ['RTR 7U45']),
      CJ('c-p01', 'propria', 'QBD 3E90', ['SQT 6B77'], { filial: 'RON', motorista: 'p-paulo', escopo: { no: true, desde: '2026-01-10', ate: null } }),
      CJ('c-p02', 'propria', 'QJC 1D77', ['SQT 7D22'], { filial: 'RON', motorista: 'p-renato', escopo: { no: true, desde: '2026-01-10', ate: null } }),
      CJ('c-p03', 'propria', 'QCP 8A55', ['SQT 5F31', 'SQT 5F32'], { filial: 'RVD', motorista: 'p-valdir', escopo: { no: true, desde: '2026-02-03', ate: null } }),
      CJ('c-p04', 'propria', 'RTQ 8B44', ['SQT 1A02'], { filial: 'SOR', motorista: 'p-edson', escopo: { no: true, desde: '2026-01-10', ate: null } }),
      CJ('c-p05', 'propria', 'QJD 9F03', ['SQT 4A66'], { filial: 'PNG', motorista: 'p-sergior', escopo: { no: false, desde: null, ate: null, motivo: 'Basculante dedicado a calcário e fertilizante' } }),
      CJ('c-p06', 'propria', 'RXQ 4B19', ['SQT 2C08'], { filial: 'RON', motorista: 'p-milton', escopo: { no: false, desde: '2026-01-10', ate: '2026-06-30', motivo: 'Saiu do escopo em 30/06: dedicado a cimento' } })
    ];

    // Cargas registradas antes de o compartimento ter viagem no Traxium (registro inicial da frota própria).
    db.cargasIniciais = [
      { comp: 'SQT 6B77#C1', data: '2026-08-11', produto: 'soja' }, { comp: 'SQT 6B77#C1', data: '2026-08-20', produto: 'milho' }, { comp: 'SQT 6B77#C1', data: '2026-08-28', produto: 'milho' },
      { comp: 'SQT 7D22#C1', data: '2026-08-30', produto: 'milho' }, { comp: 'SQT 7D22#C1', data: '2026-09-08', produto: 'soja' }, { comp: 'SQT 7D22#C1', data: '2026-09-19', produto: 'farelo-soja' },
      { comp: 'SQT 5F31#C1', data: '2026-08-13', produto: 'milho' }, { comp: 'SQT 5F31#C1', data: '2026-08-22', produto: 'sorgo' }, { comp: 'SQT 5F31#C1', data: '2026-09-01', produto: 'soja' },
      { comp: 'SQT 5F32#C1', data: '2026-08-13', produto: 'milho' }, { comp: 'SQT 5F32#C1', data: '2026-08-22', produto: 'sorgo' }, { comp: 'SQT 5F32#C1', data: '2026-09-01', produto: 'soja' },
      { comp: 'SQT 1A02#C1', data: '2026-09-12', produto: 'soja' }, { comp: 'SQT 1A02#C1', data: '2026-09-20', produto: 'milho' }, { comp: 'SQT 1A02#C1', data: '2026-09-29', produto: 'farelo-soja' },
      { comp: 'SQT 1A02#C2', data: '2026-09-12', produto: 'soja' }, { comp: 'SQT 1A02#C2', data: '2026-09-20', produto: 'milho' }, { comp: 'SQT 1A02#C2', data: '2026-09-29', produto: 'farelo-soja' },
      { comp: 'SQT 4A66#C1', data: '2026-09-05', produto: 'npk' }, { comp: 'SQT 4A66#C1', data: '2026-09-18', produto: 'calcario' },
      { comp: 'SQT 2C08#C1', data: '2026-09-09', produto: 'cimento' }, { comp: 'SQT 2C08#C1', data: '2026-09-23', produto: 'cimento' }
    ];

    db.embarcadores = [
      { id: 'em-agrosorriso', nome: 'Agro Sorriso Armazéns', cidade: 'Sorriso MT' },
      { id: 'em-telespires', nome: 'Coop. Vale do Teles Pires', cidade: 'Lucas do Rio Verde MT' },
      { id: 'em-planalto', nome: 'Esmagadora Planalto', cidade: 'Rondonópolis MT' },
      { id: 'em-granosrv', nome: 'Granos Rio Verde', cidade: 'Rio Verde GO' },
      { id: 'em-litoral', nome: 'Terminal Litoral Granéis', cidade: 'Paranaguá PR' }
    ];
    db.destinatarios = [
      { id: 'de-nutrimax', nome: 'NutriMax Rações', cidade: 'Uberlândia MG', certificado: true },
      { id: 'de-expedito', nome: 'Granja Santo Expedito', cidade: 'Rio Verde GO', certificado: true },
      { id: 'de-oeste', nome: 'Coop. Oeste Rações', cidade: 'Chapecó SC', certificado: true },
      { id: 'de-belavista', nome: 'Bela Vista Nutrição Animal', cidade: 'Campo Grande MS', certificado: true },
      { id: 'de-vitale', nome: 'Rações Vitale', cidade: 'Dourados MS', certificado: true },
      { id: 'de-santaclara', nome: 'Confinamento Santa Clara', cidade: 'Nova Mutum MT', certificado: true },
      { id: 'de-solo', nome: 'Solo Fértil Insumos', cidade: 'Ponta Grossa PR', certificado: false }
    ];

    db.fornecedores = [
      { id: 'f-trevo', nome: 'Lavador Posto Trevo', servico: 'lavagem', cidade: 'Sorriso MT', cnpj: '33.102.884/0001-20', regimeMax: 'C', docs: [{ n: 'Licença ambiental', validade: '2027-01-31' }, { n: 'Laudo de potabilidade da água', validade: '2026-12-10' }] },
      { id: 'f-br163', nome: 'Estação de Lavagem BR-163', servico: 'lavagem', cidade: 'Rondonópolis MT', cnpj: '21.884.017/0001-63', regimeMax: 'D', docs: [{ n: 'Licença ambiental', validade: '2027-06-30' }, { n: 'Laudo de potabilidade da água', validade: '2026-11-02' }, { n: 'Registro do desinfetante', validade: '2027-03-15' }] },
      { id: 'f-lavarv', nome: 'Lava Cargas Rio Verde', servico: 'lavagem', cidade: 'Rio Verde GO', cnpj: '40.229.513/0001-08', regimeMax: 'B', docs: [{ n: 'Licença ambiental', validade: '2026-10-25' }, { n: 'Laudo de potabilidade da água', validade: '2027-01-14' }] },
      { id: 'f-lonas', nome: 'Lonas Ribeiro', servico: 'lonas e amarração', cidade: 'Sorriso MT', cnpj: '17.660.392/0001-45', regimeMax: null, docs: [{ n: 'Alvará de funcionamento', validade: '2027-02-28' }] }
    ];

    db.manual = {
      titulo: 'Manual de boas práticas GMP+ para o motorista',
      versoes: [
        { v: '3.1', desde: '2026-03-02', ate: '2026-09-14', mudancas: 'Versão inicial do manual em cartões.' },
        { v: '3.2', desde: '2026-09-15', ate: null, mudancas: 'Cartão "Cargas proibidas" ganhou cama de frango e torta de mamona como exemplos; "Se algo der errado" passou a pedir foto.' }
      ],
      cartoes: [
        { t: 'Antes de carregar', txt: 'Carreta vazia, varrida e seca. Nada de resto da carga anterior, nem no canto da tampa.' },
        { t: 'Cargas proibidas', txt: 'Se a carreta levou cama de frango, torta de mamona, lodo ou lixo nas últimas 3 viagens, ela não carrega ração. Avise o afretador antes de ir ao armazém.' },
        { t: 'Limpeza seca', txt: 'Varra o assoalho e as laterais, tire o pó das bicas e confira as tampas. Se a última carga pedir água, a lavagem é em lavador credenciado.' },
        { t: 'Lona e vedação', txt: 'Lona inteira e bem amarrada protege a carga da chuva e de sujeira. Rasgo maior que a palma da mão: troque antes de carregar.' },
        { t: 'Se algo der errado', txt: 'Vazamento, chuva na carga, resto de outra carga, acidente: pare, tire foto e ligue para o afretador. Não descarregue sem falar com ele.' }
      ]
    };
    db.termo = { titulo: 'Termo de compromisso do transportador', versao: '2026.1', texto: 'Declaro que o veículo e os compartimentos usados nesta viagem estão limpos, secos e livres de resíduos; que as três últimas cargas informadas são verdadeiras; que li o manual de boas práticas e vou cumpri-lo durante todo o transporte; e que aviso a transportadora contratante de qualquer ocorrência com a carga.' };

    db.treinamentos = [
      { id: 'TR-01', data: '2026-03-05', tema: 'Boas práticas GMP+ no transporte de ração', instrutor: 'Ana Prates (consultoria externa)', carga: '4 h', participantes: ['u-diego', 'u-paula', 'u-camila', 'p-paulo', 'p-renato', 'p-valdir', 'p-edson', 'p-sergior', 'p-milton'], anexo: 'lista-presenca-2026-03-05.pdf' },
      { id: 'TR-02', data: '2026-06-18', tema: 'Regimes de limpeza e cargas proibidas (IDTF)', instrutor: 'Rafael Antunes', carga: '2 h', participantes: ['p-paulo', 'p-renato', 'p-valdir', 'p-edson', 'p-sergior', 'p-milton'], anexo: 'lista-presenca-2026-06-18.pdf' },
      { id: 'TR-03', data: '2026-09-16', tema: 'Manual GMP v3.2: o que mudou', instrutor: 'Rafael Antunes', carga: '1 h', participantes: ['u-diego', 'u-paula', 'u-camila', 'u-marcos'], anexo: 'lista-presenca-2026-09-16.pdf' }
    ];

    db.simulacoes = [
      { id: 'SIM-01', em: '2026-07-14T09:20', por: 'u-rafael', pedido: 'Placa QBD 3E90, 01/04/2026 a 30/06/2026', encontradas: 9, duracaoMin: 73, obs: 'Simulação interna antes da auditoria de manutenção.' }
    ];

    db.ocorrencias = [
      { id: 'OC-0001', viagem: 'VG-3104', transportador: 'e-lima', em: '2026-09-22T16:40', por: 'u-diego', tipo: 'Resíduo no compartimento', gravidade: 'grave', descricao: 'Na descarga, o destinatário encontrou resto de adubo no canto da carreta SQT 9E18 (C2). Carga segregada pelo cliente.', fotos: 2, revisao: null },
      { id: 'OC-0002', viagem: 'VG-3109', transportador: 't-rosana', em: '2026-10-02T11:05', por: 'u-diego', tipo: 'Lona danificada', gravidade: 'leve', descricao: 'Rasgo de cerca de 20 cm na lona da RRT 5E07, percebido na conferência das fotos. Trocada antes da viagem seguinte.', fotos: 1, revisao: null },
      { id: 'OC-0003', viagem: 'VG-3106', transportador: 't-joao', em: '2026-09-29T08:30', por: 'u-paula', tipo: 'Reclamação no destino', gravidade: 'leve', descricao: 'Destinatário relatou cheiro de diesel na carreta QJB 4R72. Conferência no pátio não confirmou contaminação.', fotos: 1, revisao: null }
    ];

    db.config = {
      regras: [
        { k: 't3', n: 'T-3 completo por compartimento', classe: 'bloqueio', piso: 'bloqueio', travada: true, base: 'TS1.9' },
        { k: 'regime', n: 'Carga anterior proibida ou não classificada', classe: 'bloqueio', piso: 'bloqueio', travada: true, base: 'TS1.9' },
        { k: 'verificacao', n: 'Verificação do compartimento aprovada', classe: 'bloqueio', piso: 'bloqueio', travada: true, base: 'Procedimento de afretamento' },
        { k: 'termo', n: 'Termo de compromisso assinado', classe: 'bloqueio', piso: 'bloqueio', travada: true, base: 'TS1.2 gatekeeper' },
        { k: 'manual', n: 'Ciência do manual vigente', classe: 'bloqueio', piso: 'alerta', travada: false, base: 'Procedimento interno' },
        { k: 'docs', n: 'Documentos válidos (RNTRC, CNH, CRLV)', classe: 'bloqueio', piso: 'alerta', travada: false, base: 'Procedimento de afretamento' },
        { k: 'fotos', n: 'Foto em todo item do checklist', classe: 'bloqueio', piso: 'alerta', travada: false, base: 'Procedimento interno' }
      ],
      avisos: [60, 30, 15],
      retencaoAnos: 5,
      lgpd: { base: 'Execução de contrato e obrigação regulatória', finalidade: 'Qualificar transportador e provar a viagem em auditoria GMP+' },
      integracoes: [
        { k: 'tms', n: 'TMS (planilha ou XML de CT-e)', estado: 'manual', sub: 'conciliação em lote por placa e data' },
        { k: 'whatsapp', n: 'WhatsApp do afretador', estado: 'ativo', sub: 'mensagem pronta copiada para o WhatsApp de quem envia' },
        { k: 'antt', n: 'Consulta RNTRC (ANTT)', estado: 'ativo', sub: 'confere situação do RNTRC no cadastro' },
        { k: 'gmp', n: 'Base pública de certificados GMP+', estado: 'ativo', sub: 'confere certificado de ETC certificada toda semana' }
      ]
    };

    db.viagens = viagensSemente();
    return db;
  }

  // Viagens da semente. t3: cargas declaradas pelo motorista no link, por compartimento.
  function viagensSemente() {
    const L = (d, h) => d + 'T' + h;
    // link completo: enviado, aberto, t3, checklist, manual, assinatura (minutos a partir de h0)
    function linkCompleto(d, h0, opts) {
      const o = opts || {};
      const [hh, mm] = h0.split(':').map(Number);
      const t = add => { const m = hh * 60 + mm + add; return L(d, String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')); };
      return {
        link: { enviadoEm: t(0), abertoEm: t(9), cpfEm: t(10), docsEm: o.docs ? t(12) : null, t3Em: t(14), checklistEm: t(21), manualEm: t(24), assinadoEm: t(26) },
        checklist: { enviadoEm: t(21), itens: { lona: 'ok', correntes: 'ok', cintas: 'ok', carroceria: 'ok', interior: 'ok' }, fotos: { lona: 1, correntes: 1, cintas: 1, carroceria: 1, interior: 1 }, gps: o.gps || null },
        verificacao: o.semVerif ? null : { estado: 'aprovada', por: o.afretador, em: t(o.conf || 38), motivo: '' },
        manual: { versao: d >= '2026-09-15' ? '3.2' : '3.1', em: t(24) },
        termo: o.semTermo ? null : { versao: '2026.1', em: t(26) }
      };
    }
    const V = (o) => Object.assign({
      id: '', filial: 'SOR', data: HOJE, janela: '14:00', descarga: null, tipo: 'afretamento', transportador: null, motorista: null, conjunto: null,
      produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', ordem: '', assegurada: true,
      t3: {}, link: {}, checklist: null, verificacao: null, manual: null, termo: null, limpezas: [], cte: null, liberacoes: [], manutencoes: [],
      regularizacoes: [], cancelada: null, retificacoes: [], criadaEm: null, criadaPor: null
    }, o);
    const C = (data, prod) => ({ data, produto: prod });

    const vs = [];
    // ---------- passadas
    vs.push(V(Object.assign({ id: 'VG-3101', filial: 'SOR', data: '2026-09-03', janela: '07:30', descarga: '2026-09-05', transportador: 't-josue', motorista: 'p-josue', conjunto: 'c-josue', produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', ordem: 'OC 47702',
      t3: { 'QWM 4H57#C1': [C('2026-08-28', 'soja'), C('2026-08-20', 'milho'), C('2026-08-12', 'npk')], 'QWM 4H58#C1': [C('2026-08-28', 'soja'), C('2026-08-20', 'milho'), C('2026-08-12', 'npk')] },
      cte: { numero: '018101', nf: '022814', conciliadoEm: '2026-09-08', lote: 'ctes-set-1.xml' }, criadaEm: '2026-09-02T16:10', criadaPor: 'u-diego' }, linkCompleto('2026-09-03', '05:40', { afretador: 'u-diego', docs: true }))));
    vs.push(V(Object.assign({ id: 'VG-3102', filial: 'RON', data: '2026-09-10', janela: '06:00', descarga: '2026-09-11', tipo: 'propria', transportador: 'propria', motorista: 'p-paulo', conjunto: 'c-p01', produto: 'farelo-soja', peso: 38, embarcador: 'em-planalto', destinatario: 'de-belavista', ordem: 'OC 47781',
      cte: { numero: '018133', nf: '022901', conciliadoEm: '2026-09-15', lote: 'ctes-set-1.xml' }, criadaEm: '2026-09-09T15:00', criadaPor: 'u-paula' }, linkCompleto('2026-09-10', '04:50', { afretador: 'u-paula', semTermo: true }))));
    vs.push(V(Object.assign({ id: 'VG-3103', filial: 'RVD', data: '2026-09-15', janela: '08:00', descarga: '2026-09-15', tipo: 'propria', transportador: 'propria', motorista: 'p-valdir', conjunto: 'c-p03', produto: 'milho', peso: 48, embarcador: 'em-granosrv', destinatario: 'de-expedito', ordem: 'OC 47840',
      cte: { numero: '018170', nf: '023011', conciliadoEm: '2026-09-22', lote: 'ctes-set-2.xml' }, criadaEm: '2026-09-14T17:20', criadaPor: 'u-camila' }, linkCompleto('2026-09-15', '06:30', { afretador: 'u-camila', semTermo: true }))));
    vs.push(V(Object.assign({ id: 'VG-3104', filial: 'SOR', data: '2026-09-17', janela: '10:00', descarga: '2026-09-18', transportador: 'e-lima', motorista: 'p-ivan', conjunto: 'c-lima1', produto: 'casca-soja', peso: 32, embarcador: 'em-telespires', destinatario: 'de-santaclara', ordem: 'OC 47861',
      t3: { 'SQT 9E18#C1': [C('2026-09-12', 'milho'), C('2026-09-06', 'soja'), C('2026-08-30', 'soja')], 'SQT 9E18#C2': [C('2026-09-12', 'npk'), C('2026-09-06', 'soja'), C('2026-08-30', 'soja')] },
      cte: { numero: '018188', nf: '023044', conciliadoEm: '2026-09-22', lote: 'ctes-set-2.xml' }, criadaEm: '2026-09-16T14:30', criadaPor: 'u-diego' }, linkCompleto('2026-09-17', '07:50', { afretador: 'u-diego' }))));
    vs.push(V(Object.assign({ id: 'VG-3105', filial: 'SOR', data: '2026-09-24', janela: '09:00', descarga: '2026-09-26', transportador: 't-josue', motorista: 'p-josue', conjunto: 'c-josue', produto: 'milho', peso: 49, embarcador: 'em-telespires', destinatario: 'de-oeste', ordem: 'OC 47930',
      t3: { 'QWM 4H57#C1': [C('2026-09-18', 'soja'), C('2026-09-10', 'npk'), C('2026-09-03', 'farelo-soja')], 'QWM 4H58#C1': [C('2026-09-18', 'soja'), C('2026-09-10', 'npk'), C('2026-09-03', 'farelo-soja')] },
      cte: { numero: '018240', nf: '023187', conciliadoEm: '2026-09-29', lote: 'ctes-set-3.xml' }, criadaEm: '2026-09-23T17:45', criadaPor: 'u-diego' }, linkCompleto('2026-09-24', '06:15', { afretador: 'u-diego' }))));
    vs.push(V(Object.assign({ id: 'VG-3106', filial: 'RON', data: '2026-09-26', janela: '07:00', descarga: '2026-09-28', transportador: 't-joao', motorista: 'p-joao', conjunto: 'c-joao', produto: 'farelo-soja', peso: 48, embarcador: 'em-planalto', destinatario: 'de-vitale', ordem: 'OC 47955',
      t3: { 'QJB 4R72#C1': [C('2026-09-20', 'soja'), C('2026-09-13', 'kcl'), C('2026-09-05', 'milho')], 'QJB 4R73#C1': [C('2026-09-20', 'soja'), C('2026-09-13', 'kcl'), C('2026-09-05', 'milho')] },
      cte: { numero: '018262', nf: '023230', conciliadoEm: '2026-09-29', lote: 'ctes-set-3.xml' }, criadaEm: '2026-09-25T16:00', criadaPor: 'u-paula' }, linkCompleto('2026-09-26', '05:30', { afretador: 'u-paula', docs: true }))));
    vs.push(V(Object.assign({ id: 'VG-3107', filial: 'RVD', data: '2026-09-29', janela: '13:00', descarga: '2026-10-01', transportador: 'e-cerrado', motorista: 'p-reinaldo', conjunto: 'c-cerrado1', produto: 'farelo-soja', peso: 37, embarcador: 'em-granosrv', destinatario: 'de-nutrimax', ordem: 'OC 47990',
      t3: { 'QCE 1T11#C1': [C('2026-09-25', 'milho'), C('2026-09-19', 'soja'), C('2026-09-12', 'soja')] },
      cte: { numero: '018281', nf: '023301', conciliadoEm: '2026-10-05', lote: 'ctes-out-1.xml' }, criadaEm: '2026-09-28T10:00', criadaPor: 'u-camila' }, linkCompleto('2026-09-29', '10:40', { afretador: 'u-camila', semTermo: true }))));
    vs.push(V(Object.assign({ id: 'VG-3108', filial: 'RON', data: '2026-10-01', janela: '06:30', descarga: '2026-10-02', tipo: 'propria', transportador: 'propria', motorista: 'p-renato', conjunto: 'c-p02', produto: 'milho', peso: 38, embarcador: 'em-planalto', destinatario: 'de-santaclara', ordem: 'OC 48012',
      cte: { numero: '018297', nf: '023340', conciliadoEm: '2026-10-05', lote: 'ctes-out-1.xml' }, criadaEm: '2026-09-30T15:30', criadaPor: 'u-paula' }, linkCompleto('2026-10-01', '05:10', { afretador: 'u-paula', semTermo: true }))));
    vs.push(V(Object.assign({ id: 'VG-3109', filial: 'SOR', data: '2026-10-02', janela: '08:30', descarga: '2026-10-04', transportador: 't-rosana', motorista: 'p-rosana', conjunto: 'c-rosana', produto: 'farelo-soja', peso: 33, embarcador: 'em-agrosorriso', destinatario: 'de-belavista', ordem: 'OC 48020',
      t3: { 'RRT 5E07#C1': [C('2026-09-27', 'soja'), C('2026-09-21', 'sulfato-amonio'), C('2026-09-14', 'milho')] },
      cte: { numero: '018305', nf: '023355', conciliadoEm: '2026-10-05', lote: 'ctes-out-1.xml' }, criadaEm: '2026-10-01T17:10', criadaPor: 'u-diego' }, linkCompleto('2026-10-02', '06:20', { afretador: 'u-diego', docs: true }))));
    vs.push(V(Object.assign({ id: 'VG-3110', filial: 'RON', data: '2026-10-05', janela: '06:00', descarga: '2026-10-06', tipo: 'propria', transportador: 'propria', motorista: 'p-paulo', conjunto: 'c-p01', produto: 'farelo-soja', peso: 38, embarcador: 'em-planalto', destinatario: 'de-belavista', ordem: 'OC 48061',
      criadaEm: '2026-10-04T15:20', criadaPor: 'u-paula' }, linkCompleto('2026-10-05', '04:40', { afretador: 'u-paula', semTermo: true }))));
    vs.push(V(Object.assign({ id: 'VG-3111', filial: 'SOR', data: '2026-10-06', janela: '10:00', descarga: '2026-10-07', transportador: 't-valmir', motorista: 'p-valmir', conjunto: 'c-valmir', produto: 'casca-soja', peso: 34, embarcador: 'em-telespires', destinatario: 'de-santaclara', ordem: 'OC 48077',
      t3: { 'QVT 1A91#C1': [C('2026-10-01', 'milho'), C('2026-09-25', 'soja'), C('2026-09-17', 'ureia')], 'QVT 1A92#C1': [C('2026-10-01', 'milho'), C('2026-09-25', 'soja'), C('2026-09-17', 'ureia')] },
      criadaEm: '2026-10-05T16:40', criadaPor: 'u-diego' }, linkCompleto('2026-10-06', '07:30', { afretador: 'u-diego', docs: true }))));
    vs.push(V(Object.assign({ id: 'VG-3112', filial: 'RVD', data: '2026-10-06', janela: '15:00', descarga: '2026-10-09', transportador: 'e-transrocha', motorista: 'p-wellington', conjunto: 'c-transrocha1', produto: 'milho', peso: 37, embarcador: 'em-granosrv', destinatario: 'de-oeste', ordem: 'OC 48080',
      t3: { 'RTR 7U45#C1': [C('2026-10-02', 'soja'), C('2026-09-26', 'milho'), C('2026-09-19', 'calcario')] },
      cte: { numero: '018331', nf: '023402', conciliadoEm: '2026-10-07', lote: 'ctes-out-2.xml' }, criadaEm: '2026-10-05T11:00', criadaPor: 'u-camila' }, linkCompleto('2026-10-06', '12:10', { afretador: 'u-camila', semTermo: true }))));
    vs.push(V(Object.assign({ id: 'VG-3113', filial: 'SOR', data: '2026-10-07', janela: '09:30', descarga: '2026-10-09', transportador: 't-ivo', motorista: 'p-ivo', conjunto: 'c-ivo', produto: 'farelo-soja', peso: 36, embarcador: 'em-agrosorriso', destinatario: 'de-oeste', ordem: 'OC 48095',
      t3: { 'QIB 3S56#C1': [C('2026-10-02', 'milho'), C('2026-09-26', 'soja'), C('2026-09-20', 'milho')] },
      liberacoes: [{ checagem: 'docs-mot', motivo: 'Renovação em andamento com protocolo do Detran', justificativa: 'CNH vencida em 04/10. Protocolo de renovação 2026/884512 e exame médico aprovado apresentados pelo motorista.', alcada: 'qualidade', assinante: 'u-rafael', risco: 'Baixo: documento administrativo, sem efeito sobre a condição da carga', validade: 'Somente esta viagem', evidencia: 'protocolo-detran-884512.pdf', escopo: 'Vale só para a VG-3113. Não cria precedente para outras viagens.', ciencia: true, em: '2026-10-07T07:40' }],
      criadaEm: '2026-10-06T18:00', criadaPor: 'u-diego' }, linkCompleto('2026-10-07', '06:00', { afretador: 'u-diego' }))));
    vs.push(V(Object.assign({ id: 'VG-3114', filial: 'PNG', data: '2026-09-30', janela: '08:00', descarga: '2026-09-30', tipo: 'propria', transportador: 'propria', motorista: 'p-sergior', conjunto: 'c-p05', produto: 'calcario', peso: 30, embarcador: 'em-litoral', destinatario: 'de-solo', ordem: 'OC 48001', assegurada: false,
      cte: { numero: '018290', nf: '023322', conciliadoEm: '2026-10-05', lote: 'ctes-out-1.xml' }, criadaEm: '2026-09-29T14:00', criadaPor: 'u-marcos' })));
    vs.push(V({ id: 'VG-3115', filial: 'RVD', data: '2026-10-01', janela: '11:00', descarga: '2026-10-02', transportador: 't-luciano', motorista: 'p-luciano', conjunto: 'c-luciano', produto: 'milho', peso: 37, embarcador: 'em-granosrv', destinatario: 'de-expedito', ordem: 'OC 48015',
      link: { enviadoEm: '2026-10-01T07:10' }, cancelada: { em: '2026-10-01T09:30', por: 'u-camila', motivo: 'Embarcador adiou o carregamento para a semana seguinte; nova ordem será emitida.' }, criadaEm: '2026-09-30T16:00', criadaPor: 'u-camila' }));

    // ---------- hoje (08/10/2026)
    // Canônica 1: TAC liberada, pronta para assegurar.
    vs.push(V(Object.assign({ id: 'VG-3116', filial: 'SOR', data: HOJE, janela: '14:00', descarga: '2026-10-10', transportador: 't-josue', motorista: 'p-josue', conjunto: 'c-josue', produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', ordem: 'OC 48120',
      t3: { 'QWM 4H57#C1': [C('2026-10-03', 'npk'), C('2026-09-24', 'milho'), C('2026-09-18', 'soja')], 'QWM 4H58#C1': [C('2026-10-03', 'npk'), C('2026-09-24', 'milho'), C('2026-09-18', 'soja')] },
      criadaEm: '2026-10-07T17:30', criadaPor: 'u-diego' }, linkCompleto(HOJE, '07:12', { afretador: 'u-diego', gps: 'Agro Sorriso Armazéns, pátio 2', conf: 41 }))));
    // Canônica 2: frota própria liberada.
    vs.push(V(Object.assign({ id: 'VG-3117', filial: 'RON', data: HOJE, janela: '11:00', descarga: '2026-10-09', tipo: 'propria', transportador: 'propria', motorista: 'p-paulo', conjunto: 'c-p01', produto: 'farelo-soja', peso: 38, embarcador: 'em-planalto', destinatario: 'de-belavista', ordem: 'OC 48118',
      criadaEm: '2026-10-07T15:10', criadaPor: 'u-paula' }, linkCompleto(HOJE, '06:05', { afretador: 'u-paula', semTermo: true, gps: 'Esmagadora Planalto, balança 1' }))));
    // Canônica 3: TAC bloqueada por carga anterior proibida (cama de frango no T-2).
    vs.push(V(Object.assign({ id: 'VG-3118', filial: 'SOR', data: HOJE, janela: '15:30', descarga: '2026-10-11', transportador: 't-ademir', motorista: 'p-ademir', conjunto: 'c-ademir', produto: 'milho', peso: 33, embarcador: 'em-telespires', destinatario: 'de-oeste', ordem: 'OC 48124',
      t3: { 'RAD 3K20#C1': [C('2026-10-04', 'milho'), C('2026-09-29', 'cama-frango'), C('2026-09-21', 'soja')] },
      criadaEm: HOJE + 'T07:20', criadaPor: 'u-diego' }, linkCompleto(HOJE, '07:35', { afretador: 'u-diego', docs: true, gps: 'Coop. Vale do Teles Pires, fila externa' }))));
    // Em preenchimento pelo motorista.
    vs.push(V({ id: 'VG-3119', filial: 'SOR', data: HOJE, janela: '13:00', descarga: '2026-10-09', transportador: 't-valmir', motorista: 'p-valmir', conjunto: 'c-valmir', produto: 'casca-soja', peso: 34, embarcador: 'em-telespires', destinatario: 'de-santaclara', ordem: 'OC 48121',
      t3: { 'QVT 1A91#C1': [C('2026-10-06', 'casca-soja'), C('2026-10-01', 'milho'), C('2026-09-25', 'soja')], 'QVT 1A92#C1': [C('2026-10-06', 'casca-soja'), C('2026-10-01', 'milho'), C('2026-09-25', 'soja')] },
      link: { enviadoEm: HOJE + 'T08:40', abertoEm: HOJE + 'T09:05', cpfEm: HOJE + 'T09:06', t3Em: HOJE + 'T09:09' },
      checklist: { enviadoEm: null, itens: { lona: 'ok', correntes: 'ok' }, fotos: { lona: 1, correntes: 1 } }, criadaEm: HOJE + 'T08:30', criadaPor: 'u-diego' }));
    // Fotos a conferir.
    vs.push(V({ id: 'VG-3120', filial: 'SOR', data: HOJE, janela: '12:00', descarga: '2026-10-10', transportador: 't-rosana', motorista: 'p-rosana', conjunto: 'c-rosana', produto: 'farelo-soja', peso: 33, embarcador: 'em-agrosorriso', destinatario: 'de-vitale', ordem: 'OC 48119',
      t3: { 'RRT 5E07#C1': [C('2026-10-05', 'soja'), C('2026-10-02', 'farelo-soja'), C('2026-09-27', 'soja')] },
      link: { enviadoEm: HOJE + 'T07:50', abertoEm: HOJE + 'T08:58', cpfEm: HOJE + 'T08:59', t3Em: HOJE + 'T09:02', checklistEm: HOJE + 'T09:14', manualEm: HOJE + 'T09:17', assinadoEm: HOJE + 'T09:18' },
      checklist: { enviadoEm: HOJE + 'T09:14', itens: { lona: 'ok', correntes: 'ok', cintas: 'ok', carroceria: 'ok', interior: 'ok' }, fotos: { lona: 1, correntes: 1, cintas: 1, carroceria: 1, interior: 1 }, gps: 'Agro Sorriso Armazéns, pátio 1' },
      manual: { versao: '3.2', em: HOJE + 'T09:17' }, termo: { versao: '2026.1', em: HOJE + 'T09:18' }, criadaEm: '2026-10-07T18:05', criadaPor: 'u-diego' }));
    // Bloqueada por CRLV vencido da carreta (corrigível).
    vs.push(V(Object.assign({ id: 'VG-3121', filial: 'SOR', data: HOJE, janela: '16:00', descarga: '2026-10-11', transportador: 't-genivaldo', motorista: 'p-genivaldo', conjunto: 'c-genivaldo', produto: 'milho', peso: 35, embarcador: 'em-telespires', destinatario: 'de-expedito', ordem: 'OC 48126',
      t3: { 'QHG 7L34#C1': [C('2026-10-03', 'milho'), C('2026-09-27', 'soja'), C('2026-09-20', 'gesso')] },
      criadaEm: HOJE + 'T07:45', criadaPor: 'u-diego' }, linkCompleto(HOJE, '08:00', { afretador: 'u-diego', gps: 'Coop. Vale do Teles Pires, pátio' }))));
    // Recém-criada: link ainda não enviado (ponto de partida do fluxo F1 na demonstração).
    vs.push(V({ id: 'VG-3122', filial: 'SOR', data: HOJE, janela: '17:00', descarga: '2026-10-10', transportador: 't-claudio', motorista: 'p-claudio', conjunto: 'c-claudio', produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', ordem: 'OC 48130',
      criadaEm: HOJE + 'T10:05', criadaPor: 'u-diego' }));
    // Link enviado, ainda não aberto.
    vs.push(V({ id: 'VG-3123', filial: 'RON', data: HOJE, janela: '15:00', descarga: '2026-10-10', transportador: 't-joao', motorista: 'p-joao', conjunto: 'c-joao', produto: 'farelo-soja', peso: 48, embarcador: 'em-planalto', destinatario: 'de-vitale', ordem: 'OC 48127',
      link: { enviadoEm: HOJE + 'T08:30' }, criadaEm: HOJE + 'T08:20', criadaPor: 'u-paula' }));
    // Frota própria: checklist do motorista enviado, conferência pendente.
    vs.push(V({ id: 'VG-3124', filial: 'RVD', data: HOJE, janela: '13:30', descarga: '2026-10-08', tipo: 'propria', transportador: 'propria', motorista: 'p-valdir', conjunto: 'c-p03', produto: 'milho', peso: 48, embarcador: 'em-granosrv', destinatario: 'de-expedito', ordem: 'OC 48122',
      link: { enviadoEm: HOJE + 'T07:00', abertoEm: HOJE + 'T07:31', cpfEm: HOJE + 'T07:31', checklistEm: HOJE + 'T07:44', manualEm: HOJE + 'T07:46' },
      checklist: { enviadoEm: HOJE + 'T07:44', itens: { lona: 'ok', correntes: 'ok', cintas: 'ok', carroceria: 'ok', interior: 'ok' }, fotos: { lona: 1, correntes: 1, cintas: 1, carroceria: 1, interior: 1 }, gps: 'Granos Rio Verde, pátio' },
      manual: { versao: '3.2', em: HOJE + 'T07:46' }, criadaEm: '2026-10-07T16:30', criadaPor: 'u-camila' }));
    // Verificação devolvida ao motorista.
    vs.push(V({ id: 'VG-3125', filial: 'RVD', data: HOJE, janela: '14:30', descarga: '2026-10-10', transportador: 't-edimar', motorista: 'p-edimar', conjunto: 'c-edimar', produto: 'farelo-soja', peso: 36, embarcador: 'em-granosrv', destinatario: 'de-belavista', ordem: 'OC 48123',
      t3: { 'PJE 2B49#C1': [C('2026-10-04', 'soja'), C('2026-09-28', 'milho'), C('2026-09-22', 'soja')] },
      link: { enviadoEm: HOJE + 'T07:20', abertoEm: HOJE + 'T08:02', cpfEm: HOJE + 'T08:03', docsEm: HOJE + 'T08:05', t3Em: HOJE + 'T08:07', checklistEm: HOJE + 'T08:15', manualEm: HOJE + 'T08:18', assinadoEm: HOJE + 'T08:19' },
      checklist: { enviadoEm: HOJE + 'T08:15', itens: { lona: 'ok', correntes: 'ok', cintas: 'ok', carroceria: 'ok', interior: 'ok' }, fotos: { lona: 1, correntes: 1, cintas: 1, carroceria: 1, interior: 1 }, gps: 'Granos Rio Verde, fila' },
      verificacao: { estado: 'devolvida', por: 'u-camila', em: HOJE + 'T09:12', motivo: 'Foto da lona sem foco: não dá para ver as amarrações. Tire de novo, de lado, com a carreta inteira.', itens: ['lona'] },
      manual: { versao: '3.2', em: HOJE + 'T08:18' }, termo: { versao: '2026.1', em: HOJE + 'T08:19' }, criadaEm: HOJE + 'T07:10', criadaPor: 'u-camila' }));
    // Filial sem comunicação ao organismo certificador.
    vs.push(V(Object.assign({ id: 'VG-3126', filial: 'PNG', data: HOJE, janela: '16:30', descarga: '2026-10-09', transportador: 't-marcelo', motorista: 'p-marcelo', conjunto: 'c-marcelo', produto: 'farelo-soja', peso: 37, embarcador: 'em-litoral', destinatario: 'de-oeste', ordem: 'OC 48128',
      t3: { 'AYK 6P20#C1': [C('2026-10-03', 'soja'), C('2026-09-28', 'trigo'), C('2026-09-22', 'soja')] },
      criadaEm: HOJE + 'T08:00', criadaPor: 'u-marcos' }, linkCompleto(HOJE, '08:10', { afretador: 'u-marcos', docs: true, gps: 'Terminal Litoral Granéis' }))));
    // ETC em revisão após ocorrência grave: só a Direção libera.
    vs.push(V(Object.assign({ id: 'VG-3127', filial: 'SOR', data: HOJE, janela: '18:00', descarga: '2026-10-10', transportador: 'e-lima', motorista: 'p-ivan', conjunto: 'c-lima1', produto: 'casca-soja', peso: 32, embarcador: 'em-telespires', destinatario: 'de-santaclara', ordem: 'OC 48131',
      t3: { 'SQT 9E18#C1': [C('2026-10-03', 'soja'), C('2026-09-27', 'milho'), C('2026-09-17', 'casca-soja')], 'SQT 9E18#C2': [C('2026-10-03', 'soja'), C('2026-09-27', 'milho'), C('2026-09-17', 'casca-soja')] },
      criadaEm: HOJE + 'T09:00', criadaPor: 'u-diego' }, linkCompleto(HOJE, '09:10', { afretador: 'u-diego', gps: 'Coop. Vale do Teles Pires, pátio' }))));
    // ETC certificada, pronta.
    vs.push(V(Object.assign({ id: 'VG-3128', filial: 'RVD', data: HOJE, janela: '10:30', descarga: '2026-10-10', transportador: 'e-cerrado', motorista: 'p-cicero', conjunto: 'c-cerrado2', produto: 'farelo-soja', peso: 37, embarcador: 'em-granosrv', destinatario: 'de-nutrimax', ordem: 'OC 48117',
      t3: { 'QCE 1T21#C1': [C('2026-10-04', 'milho'), C('2026-09-30', 'soja'), C('2026-09-24', 'soja')] },
      criadaEm: '2026-10-07T14:00', criadaPor: 'u-camila' }, linkCompleto(HOJE, '06:40', { afretador: 'u-camila', semTermo: true, gps: 'Granos Rio Verde, balança' }))));

    // ---------- próximas
    vs.push(V({ id: 'VG-3129', filial: 'SOR', data: '2026-10-09', janela: '07:00', descarga: '2026-10-11', tipo: 'propria', transportador: 'propria', motorista: 'p-edson', conjunto: 'c-p04', produto: 'milho', peso: 46, embarcador: 'em-telespires', destinatario: 'de-oeste', ordem: 'OC 48133', criadaEm: HOJE + 'T10:30', criadaPor: 'u-diego' }));
    vs.push(V({ id: 'VG-3130', filial: 'RVD', data: '2026-10-09', janela: '09:00', descarga: '2026-10-10', transportador: 't-luciano', motorista: 'p-luciano', conjunto: 'c-luciano', produto: 'farelo-soja', peso: 37, embarcador: 'em-granosrv', destinatario: 'de-expedito', ordem: 'OC 48134', criadaEm: HOJE + 'T11:00', criadaPor: 'u-camila' }));
    return vs;
  }

  // ------------------------------------------------------------------ persistência por log de operações
  const mem = { ops: [], db: null, versao: 0, ouvintes: [] };
  function storage() {
    try { return root.localStorage || null; } catch (e) { return null; }
  }
  function lerOps() {
    const ls = storage();
    if (!ls) return [];
    try {
      const raw = JSON.parse(ls.getItem(CHAVE) || 'null');
      if (!raw || raw.v !== VERSAO_SEMENTE || !Array.isArray(raw.ops)) return [];
      return raw.ops;
    } catch (e) { return []; }
  }
  function gravarOps() {
    const ls = storage();
    if (!ls) return;
    try { ls.setItem(CHAVE, JSON.stringify({ v: VERSAO_SEMENTE, ops: mem.ops })); } catch (e) { /* sem armazenamento: segue em memória */ }
  }
  function reconstruir() {
    const db = semente();
    db.eventos = [];
    for (const op of mem.ops) {
      try { aplicar(db, op); } catch (e) { if (root.console) console.warn('[TX] operação ignorada', op.tipo, e.message); }
    }
    mem.db = db;
    mem.versao++;
  }
  function avisarOuvintes() { mem.ouvintes.slice().forEach(fn => { try { fn(mem.versao); } catch (e) { /* ouvinte desmontado */ } }); }

  function proximoIdViagem(db) {
    const n = Math.max(...db.viagens.map(v => +v.id.slice(3)));
    return 'VG-' + (n + 1);
  }
  function evento(db, op, viagem, texto, extra) {
    db.eventos.push(Object.assign({ em: op.em, por: op.por, viagem: viagem || null, texto, tipo: op.tipo }, extra || {}));
  }

  // Aplica uma operação sobre o db. Toda escrita da interface passa por aqui.
  function aplicar(db, op) {
    const d = op.dados || {};
    const v = d.id ? db.viagens.find(x => x.id === d.id) : null;
    const nome = id => (db.usuarios.find(u => u.id === id) || {}).nome || 'Motorista';
    switch (op.tipo) {
      case 'criarViagem': {
        let transportador = d.transportador, conjunto = d.conjunto, motorista = d.motorista;
        if (d.novoTAC) {
          const n = d.novoTAC;
          const pid = 'p-n' + (db.pessoas.length + 1);
          const tid = 't-n' + (db.transportadores.length + 1);
          const cid = 'c-n' + (db.conjuntos.length + 1);
          db.pessoas.push({ id: pid, nome: n.nome, cpf: soDigitos(n.cpf || ''), telefone: n.telefone, cnh: null, vinculo: 'tac', g1: '#5b8def', g2: '#0E78B5' });
          (n.placas || []).forEach((pl, i) => {
            if (!db.placas.find(p => p.placa === pl)) db.placas.push(i === 0 ? { placa: pl, tipo: 'cavalo', dono: tid, crlv: null, modelo: 'Cavalo mecânico' } : { placa: pl, tipo: 'carreta', dono: tid, crlv: null, comps: ['C1'], modelo: 'Graneleira' });
          });
          db.conjuntos.push({ id: cid, dono: tid, cavalo: n.placas[0], carretas: n.placas.slice(1) });
          db.transportadores.push({ id: tid, tipo: 'TAC', pessoa: pid, rntrc: null, cobertura: 'gatekeeper', conjuntos: [cid], convite: { estado: 'nao_convidado' }, desde: HOJE, cadastroMinimo: true });
          transportador = tid; conjunto = cid; motorista = pid;
        }
        const id = proximoIdViagem(db);
        const dest = db.destinatarios.find(x => x.id === d.destinatario);
        const prod = db.produtos.find(p => p.id === d.produto);
        db.viagens.push({ id, filial: d.filial, data: d.data || HOJE, janela: d.janela || '14:00', descarga: d.descarga || addDias(d.data || HOJE, 2), tipo: d.tipo || 'afretamento',
          transportador, motorista, conjunto, produto: d.produto, peso: +d.peso || 0, embarcador: d.embarcador, destinatario: d.destinatario, ordem: d.ordem || '',
          assegurada: !!(prod && prod.racao && dest && dest.certificado), origemOrdem: d.origemOrdem || 'digitada',
          t3: {}, link: {}, checklist: null, verificacao: null, manual: null, termo: null, limpezas: [], cte: null, liberacoes: [], manutencoes: [], regularizacoes: [], cancelada: null, retificacoes: [],
          criadaEm: op.em, criadaPor: op.por });
        evento(db, op, id, 'Viagem criada' + (d.origemOrdem === 'pdf' ? ' a partir do PDF da ordem ' + (d.ordem || '') : '') + (d.novoTAC ? '; transportador novo com cadastro mínimo' : ''));
        op.resultado = id;
        return;
      }
      case 'enviarLink':
        v.link = Object.assign({}, v.link, { enviadoEm: op.em, canal: d.canal || 'whatsapp' });
        evento(db, op, v.id, d.canal === 'copiado' ? 'Mensagem do link copiada para o WhatsApp' : 'Link enviado ao motorista');
        return;
      case 'linkAberto':
        if (!v.link.abertoEm) { v.link.abertoEm = op.em; evento(db, op, v.id, 'Motorista abriu o link', { motorista: true }); }
        return;
      case 'linkCpf':
        v.link.cpfEm = op.em; evento(db, op, v.id, 'Motorista confirmou identidade e placas', { motorista: true });
        return;
      case 'linkDocs': {
        v.link.docsEm = op.em;
        (d.docs || []).forEach(doc => {
          if (doc.tipo === 'CNH') { const p = db.pessoas.find(x => x.id === v.motorista); p.cnh = { numero: doc.numero || (p.cnh && p.cnh.numero) || '0' + soDigitos(p.cpf).slice(0, 10), validade: doc.validade, categoria: 'E', origem: 'link' }; }
          if (doc.tipo === 'RNTRC') { const t = db.transportadores.find(x => x.id === v.transportador); t.rntrc = { numero: doc.numero || '0' + soDigitos(op.em).slice(-8), validade: doc.validade, origem: 'link' }; }
          if (doc.tipo === 'CRLV') { const p = db.placas.find(x => x.placa === doc.placa); p.crlv = { validade: doc.validade, origem: 'link' }; }
        });
        evento(db, op, v.id, 'Motorista enviou ' + (d.docs || []).map(x => x.tipo + (x.placa ? ' ' + x.placa : '')).join(', '), { motorista: true });
        return;
      }
      case 'linkT3':
        v.t3 = clone(d.t3);
        v.link.t3Em = op.em;
        evento(db, op, v.id, 'Motorista informou as três últimas cargas', { motorista: true });
        return;
      case 'linkChecklist':
        v.checklist = { enviadoEm: op.em, itens: clone(d.itens), fotos: clone(d.fotos || {}), gps: d.gps || null, obs: d.obs || '' };
        v.link.checklistEm = op.em;
        if (v.verificacao && v.verificacao.estado === 'devolvida') v.verificacao = Object.assign({}, v.verificacao, { reenviadoEm: op.em });
        evento(db, op, v.id, 'Motorista enviou o checklist com fotos', { motorista: true });
        return;
      case 'linkManual':
        v.manual = { versao: d.versao, em: op.em }; v.link.manualEm = op.em;
        evento(db, op, v.id, 'Motorista leu o manual v' + d.versao + ' e deu ciência', { motorista: true });
        return;
      case 'linkAssinar':
        v.termo = { versao: d.versao, em: op.em }; v.link.assinadoEm = op.em;
        evento(db, op, v.id, 'Motorista assinou o termo de compromisso ' + d.versao, { motorista: true });
        return;
      case 'conferir':
        v.verificacao = { estado: d.decisao === 'aprovar' ? 'aprovada' : 'devolvida', por: op.por, em: op.em, motivo: d.motivo || '', itens: d.itens || [] };
        evento(db, op, v.id, d.decisao === 'aprovar' ? 'Verificação do compartimento aprovada por ' + nome(op.por) : 'Checklist devolvido ao motorista: ' + d.motivo);
        return;
      case 'registrarLimpeza':
        v.limpezas.push({ comp: d.comp, regime: d.regime, lavador: d.lavador, comprovante: d.comprovante, em: op.em, por: op.por });
        evento(db, op, v.id, 'Limpeza regime ' + d.regime + ' registrada em ' + d.comp.replace('#', ' ') + ' com comprovante ' + d.comprovante);
        return;
      case 'liberar':
        v.liberacoes.push(Object.assign({}, d.registro, { em: op.em, assinante: op.por }));
        evento(db, op, v.id, 'Liberada por autoridade (' + d.registro.alcadaNome + '): ' + d.registro.motivo);
        return;
      case 'manterBloqueio':
        v.manutencoes.push({ checagem: d.checagem, motivo: d.motivo, acao: d.acao, em: op.em, por: op.por });
        evento(db, op, v.id, 'Bloqueio mantido por ' + nome(op.por) + ': ' + d.motivo);
        return;
      case 'regularizar':
        v.regularizacoes.push({ comp: d.comp, opcao: d.opcao, inspetor: d.inspetor, entidade: d.entidade, laudo: d.laudo, em: op.em, por: op.por });
        evento(db, op, v.id, 'Regularização TS1.9 opção ' + d.opcao + ' registrada para ' + d.comp.replace('#', ' ') + ' (inspetor ' + d.inspetor + ')');
        return;
      case 'trocarConjunto': {
        const antes = v.conjunto;
        const novo = db.conjuntos.find(x => x.id === d.conjunto);
        if (!novo) throw new Error('conjunto inexistente');
        v.conjunto = d.conjunto; v.t3 = {}; v.checklist = null; v.verificacao = null; v.termo = null; v.manual = null; v.liberacoes = []; v.regularizacoes = [];
        if (novo.dono === 'propria') { v.tipo = 'propria'; v.transportador = 'propria'; v.motorista = novo.motorista; }
        else {
          const tn = db.transportadores.find(x => x.id === novo.dono);
          v.tipo = 'afretamento'; v.transportador = tn.id; v.motorista = tn.tipo === 'TAC' ? tn.pessoa : (d.motorista || tn.motoristas[0]);
        }
        v.link = v.link.enviadoEm ? { enviadoEm: v.link.enviadoEm } : {};
        evento(db, op, v.id, 'Conjunto trocado (' + d.motivo + '). T-3, checklist e termo voltam a ser pedidos.');
        v.retificacoes.push({ campo: 'conjunto', de: antes, para: d.conjunto, motivo: d.motivo || 'troca de conjunto', em: op.em, por: op.por });
        return;
      }
      case 'registrarOcorrencia': {
        const id = 'OC-' + String(db.ocorrencias.length + 1).padStart(4, '0');
        const via = db.viagens.find(x => x.id === d.viagem);
        db.ocorrencias.push({ id, viagem: d.viagem, transportador: via ? via.transportador : d.transportador, em: op.em, por: op.por, tipo: d.tipo, gravidade: d.gravidade, descricao: d.descricao, fotos: d.fotos || 0, revisao: null });
        evento(db, op, d.viagem, 'Ocorrência ' + id + ' registrada (' + d.gravidade + '): ' + d.tipo);
        op.resultado = id;
        return;
      }
      case 'revisarTransportador':
        db.ocorrencias.filter(o => o.transportador === d.transportador && o.gravidade === 'grave' && !o.revisao).forEach(o => { o.revisao = { em: op.em, por: op.por, motivo: d.motivo }; });
        evento(db, op, null, 'Transportador reabilitado após revisão: ' + d.motivo, { transportador: d.transportador });
        return;
      case 'cadastrarTransportador': {
        if (d.tipo === 'ETC') {
          const id = 'e-n' + (db.transportadores.length + 1);
          db.transportadores.push({ id, tipo: 'ETC', nome: d.nome, cnpj: d.cnpj, cidade: d.cidade || '', telefone: d.telefone || '', rntrc: null, cobertura: d.certificado ? 'certificado' : 'gatekeeper', certificado: d.certificado || null, motoristas: [], conjuntos: [], convite: { estado: 'nao_convidado' }, desde: HOJE, cadastroMinimo: true });
          op.resultado = id;
        } else {
          const pid = 'p-n' + (db.pessoas.length + 1), tid = 't-n' + (db.transportadores.length + 1), cid = 'c-n' + (db.conjuntos.length + 1);
          db.pessoas.push({ id: pid, nome: d.nome, cpf: soDigitos(d.cpf || ''), telefone: d.telefone, cnh: null, vinculo: 'tac', g1: '#5b8def', g2: '#0E78B5' });
          (d.placas || []).forEach((pl, i) => { if (!db.placas.find(p => p.placa === pl)) db.placas.push(i === 0 ? { placa: pl, tipo: 'cavalo', dono: tid, crlv: null, modelo: 'Cavalo mecânico' } : { placa: pl, tipo: 'carreta', dono: tid, crlv: null, comps: ['C1'], modelo: 'Graneleira' }); });
          const conjs = (d.placas || []).length ? [cid] : [];
          if (conjs.length) db.conjuntos.push({ id: cid, dono: tid, cavalo: d.placas[0], carretas: d.placas.slice(1) });
          db.transportadores.push({ id: tid, tipo: 'TAC', pessoa: pid, rntrc: null, cobertura: 'gatekeeper', conjuntos: conjs, convite: { estado: 'nao_convidado' }, desde: HOJE, cadastroMinimo: true });
          op.resultado = tid;
        }
        evento(db, op, null, 'Transportador cadastrado: ' + d.nome, { transportador: op.resultado });
        return;
      }
      case 'convidar': {
        const t = db.transportadores.find(x => x.id === d.transportador);
        t.convite = { estado: d.acao === 'revogar' ? 'revogado' : 'enviado', em: HOJE, por: op.por };
        evento(db, op, null, (d.acao === 'revogar' ? 'Acesso revogado: ' : 'Convite enviado para manter documentos: ') + (t.nome || (db.pessoas.find(p => p.id === t.pessoa) || {}).nome), { transportador: t.id });
        return;
      }
      case 'atualizarDocumento': {
        if (d.tipo === 'CRLV') { const p = db.placas.find(x => x.placa === d.ref); p.crlv = { validade: d.validade, origem: 'cadastro' }; }
        if (d.tipo === 'CNH') { const p = db.pessoas.find(x => x.id === d.ref); p.cnh = Object.assign({}, p.cnh || { categoria: 'E', numero: '0' + soDigitos(p.cpf).slice(0, 10) }, { validade: d.validade, origem: 'cadastro' }); }
        if (d.tipo === 'RNTRC') { const t = db.transportadores.find(x => x.id === d.ref); t.rntrc = Object.assign({}, t.rntrc || { numero: d.numero || '0' + soDigitos(op.em).slice(-8) }, { validade: d.validade, origem: 'cadastro' }); }
        if (d.tipo === 'Certificado GMP+') { const t = db.transportadores.find(x => x.id === d.ref); t.certificado = Object.assign({}, t.certificado, { validade: d.validade }); }
        evento(db, op, null, d.tipo + ' de ' + d.refNome + ' atualizado: válido até ' + fmt.data(d.validade));
        return;
      }
      case 'escopoFrota': {
        const c = db.conjuntos.find(x => x.id === d.conjunto);
        c.escopo = d.no ? { no: true, desde: HOJE, ate: null } : { no: false, desde: c.escopo && c.escopo.desde, ate: HOJE, motivo: d.motivo };
        evento(db, op, null, 'Conjunto ' + c.cavalo + (d.no ? ' entrou no escopo GMP+' : ' saiu do escopo GMP+: ' + d.motivo));
        return;
      }
      case 'conciliarCTe':
        (d.linhas || []).forEach(l => {
          const via = db.viagens.find(x => x.id === l.viagem);
          if (via && !via.cte) { via.cte = { numero: l.cte, nf: l.nf, conciliadoEm: HOJE, lote: d.arquivo }; evento(db, op, via.id, 'CT-e ' + l.cte + ' e NF ' + l.nf + ' conciliados pelo lote ' + d.arquivo); }
        });
        return;
      case 'cancelarViagem':
        v.cancelada = { em: op.em, por: op.por, motivo: d.motivo };
        evento(db, op, v.id, 'Viagem cancelada: ' + d.motivo);
        return;
      case 'retificar':
        v.retificacoes.push({ campo: d.campo, de: d.de, para: d.para, motivo: d.motivo, em: op.em, por: op.por });
        if (d.campo === 'peso') v.peso = +d.para;
        if (d.campo === 'janela') v.janela = d.para;
        if (d.campo === 'ordem') v.ordem = d.para;
        if (d.campo === 'destinatario') v.destinatario = d.para;
        evento(db, op, v.id, 'Retificação de ' + d.campo + ': ' + d.deTxt + ' para ' + d.paraTxt + '. Motivo: ' + d.motivo);
        return;
      case 'comunicarOC': {
        const f = db.filiais.find(x => x.id === d.filial);
        f.comunicacaoOC = { data: d.data, protocolo: d.protocolo, por: op.por };
        evento(db, op, null, 'Comunicação do gatekeeper ao organismo certificador registrada para ' + f.nome + ' (' + d.protocolo + ')');
        return;
      }
      case 'registrarTreinamento': {
        const id = 'TR-' + String(db.treinamentos.length + 1).padStart(2, '0');
        db.treinamentos.push({ id, data: d.data, tema: d.tema, instrutor: d.instrutor, carga: d.carga, participantes: d.participantes, anexo: d.anexo || null });
        evento(db, op, null, 'Treinamento registrado: ' + d.tema);
        op.resultado = id;
        return;
      }
      case 'registrarSimulacao': {
        const id = 'SIM-' + String(db.simulacoes.length + 1).padStart(2, '0');
        db.simulacoes.push({ id, em: op.em, por: op.por, pedido: d.pedido, encontradas: d.encontradas, duracaoMin: d.duracaoMin, obs: d.obs || '' });
        evento(db, op, null, 'Simulação de rastreabilidade registrada: ' + d.pedido);
        op.resultado = id;
        return;
      }
      case 'pedirClassificacao': {
        const id = 'PC-' + String(14 + db.pedidosClassificacao.length).padStart(3, '0');
        db.pedidosClassificacao.push({ id, texto: d.texto, pedidoEm: HOJE, por: op.por, viagem: d.viagem || null, estado: 'na fila da Traxium' });
        evento(db, op, d.viagem || null, 'Classificação pedida à Traxium: "' + d.texto + '"');
        op.resultado = id;
        return;
      }
      case 'cadastrarFornecedor': {
        const id = 'f-n' + (db.fornecedores.length + 1);
        db.fornecedores.push({ id, nome: d.nome, servico: d.servico, cidade: d.cidade, cnpj: d.cnpj, regimeMax: d.regimeMax || null, docs: d.docs || [] });
        evento(db, op, null, 'Fornecedor cadastrado: ' + d.nome);
        op.resultado = id;
        return;
      }
      case 'publicarManual': {
        const atual = db.manual.versoes[db.manual.versoes.length - 1];
        atual.ate = addDias(HOJE, -1);
        db.manual.versoes.push({ v: d.versao, desde: HOJE, ate: null, mudancas: d.mudancas });
        evento(db, op, null, 'Manual v' + d.versao + ' publicado. As próximas ciências gravam esta versão.');
        return;
      }
      case 'classeRegra': {
        const r = db.config.regras.find(x => x.k === d.regra);
        r.classe = d.classe; r.alteradaEm = op.em; r.alteradaPor = op.por; r.motivo = d.motivo;
        evento(db, op, null, 'Regra "' + r.n + '" passou a ' + d.classe + ': ' + d.motivo);
        return;
      }
      default:
        throw new Error('operação desconhecida: ' + op.tipo);
    }
  }

  // ------------------------------------------------------------------ consultas
  const db = () => mem.db;
  const byId = (lista, id) => db()[lista].find(x => x.id === id) || null;
  const produto = id => byId('produtos', id);
  const pessoa = id => byId('pessoas', id);
  const transportador = id => id === 'propria' ? null : byId('transportadores', id);
  const conjunto = id => byId('conjuntos', id);
  const placa = p => db().placas.find(x => x.placa === p) || null;
  const filial = id => byId('filiais', id);
  const usuario = id => byId('usuarios', id);
  const viagem = id => byId('viagens', id);
  const embarcador = id => byId('embarcadores', id);
  const destinatario = id => byId('destinatarios', id);
  const fornecedor = id => byId('fornecedores', id);

  function nomeTransportador(t) {
    if (!t) return 'Frota própria';
    if (typeof t === 'string') t = transportador(t);
    if (!t) return 'Frota própria';
    return t.tipo === 'ETC' ? t.nome : (pessoa(t.pessoa) || {}).nome;
  }
  function produtoPorTexto(txt) {
    const q = norm(txt);
    if (!q) return null;
    return db().produtos.find(p => norm(p.nome) === q || p.sin.some(s => norm(s) === q) || norm(p.en) === q) || null;
  }
  function buscarProdutos(txt, lim) {
    const q = norm(txt);
    if (!q) return [];
    const out = [];
    for (const p of db().produtos) {
      const nomes = [p.nome, ...p.sin, p.en];
      const hit = nomes.find(n => norm(n).includes(q));
      if (hit) out.push({ produto: p, via: norm(hit) === norm(p.nome) ? null : hit, exato: nomes.some(n => norm(n) === q) });
    }
    out.sort((a, b) => (b.exato - a.exato) || a.produto.nome.localeCompare(b.produto.nome));
    return out.slice(0, lim || 8);
  }
  function compsDoConjunto(c) {
    if (typeof c === 'string') c = conjunto(c);
    if (!c) return [];
    const out = [];
    c.carretas.forEach(pl => { const p = placa(pl); (p && p.comps ? p.comps : ['C1']).forEach(pos => out.push({ placa: pl, pos, key: pl + '#' + pos })); });
    return out;
  }
  function placasDoConjunto(c) {
    if (typeof c === 'string') c = conjunto(c);
    return c ? [c.cavalo, ...c.carretas] : [];
  }

  // Situação de um documento por validade.
  function docEstado(validade, ref) {
    const base = ref || HOJE;
    if (!validade) return { estado: 'falta', dias: null, rotulo: 'não informado' };
    const dias = difDias(validade, base);
    if (dias < 0) return { estado: 'vencido', dias, rotulo: 'vencido em ' + fmt.data(validade) };
    if (dias <= 30) return { estado: 'vence', dias, rotulo: 'vence em ' + dias + (dias === 1 ? ' dia' : ' dias') };
    return { estado: 'ok', dias, rotulo: 'válido até ' + fmt.data(validade) };
  }

  // Histórico do compartimento: cargas das viagens carregadas + cargas declaradas no link + registro inicial.
  function historico(placaStr, pos) {
    const key = placaStr + '#' + (pos || 'C1');
    const linhas = [];
    db().cargasIniciais.filter(c => c.comp === key).forEach(c => linhas.push({ data: c.data, produto: c.produto, texto: null, fonte: 'registro', viagem: null }));
    db().viagens.forEach(v => {
      if (v.cancelada) return;
      const comps = compsDoConjunto(v.conjunto).map(c => c.key);
      if (!comps.includes(key)) return;
      if (v.data < HOJE || (v.data === HOJE && v.cte)) linhas.push({ data: v.data, produto: v.produto, texto: null, fonte: 'viagem', viagem: v.id });
      (v.t3[key] || []).forEach(c => linhas.push({ data: c.data, produto: c.produto || null, texto: c.texto || null, fonte: 'declarada', viagem: v.id }));
    });
    // Deduplica por data + produto, preferindo a carga feita em viagem do Traxium.
    const peso = f => f === 'viagem' ? 0 : f === 'registro' ? 1 : 2;
    const mapa = {};
    linhas.sort((a, b) => peso(a.fonte) - peso(b.fonte)).forEach(l => { const k = l.data + '|' + (l.produto || norm(l.texto)); if (!mapa[k]) mapa[k] = l; });
    return Object.values(mapa).sort((a, b) => b.data.localeCompare(a.data));
  }

  // T-3 por compartimento para a viagem: declarado no link (afretamento) ou lido do histórico (frota própria).
  function t3(v) {
    return compsDoConjunto(v.conjunto).map(c => {
      let cargas, origem;
      if (v.tipo === 'propria') {
        cargas = historico(c.placa, c.pos).filter(h => h.data < v.data && h.viagem !== v.id).slice(0, 3);
        origem = 'historico';
      } else {
        cargas = (v.t3[c.key] || []).slice(0, 3).map(x => ({ data: x.data, produto: x.produto || null, texto: x.texto || null, fonte: 'declarada' }));
        origem = 'declarada';
        // confere com viagens anteriores do Traxium no mesmo compartimento
        cargas = cargas.map(x => {
          const via = db().viagens.find(o => o.id !== v.id && !o.cancelada && o.data === x.data && compsDoConjunto(o.conjunto).some(k => k.key === c.key));
          return via ? Object.assign({}, x, { confere: via.id, fonte: 'viagem' }) : x;
        });
      }
      const regs = cargas.map(x => {
        const p = x.produto ? produto(x.produto) : (x.texto ? produtoPorTexto(x.texto) : null);
        return { data: x.data, produto: p, texto: x.texto, fonte: x.fonte, confere: x.confere || x.viagem || null, regime: p ? p.regime : null, reconhecido: !!p };
      });
      const completo = regs.length >= 3;
      const proibida = regs.find(r => r.regime === 'X');
      const naoClass = regs.find(r => !r.reconhecido);
      const t1 = regs[0];
      const regime = proibida ? 'X' : naoClass ? '?' : t1 ? t1.regime : null;
      return Object.assign({}, c, { cargas: regs, completo, origem, proibida: proibida || null, naoClassificada: naoClass || null, regimeExigido: regime });
    });
  }

  function linkEstado(v) {
    const l = v.link || {};
    if (v.cancelada) return { k: 'cancelado', n: 'cancelada', em: null, passo: 0 };
    if (!l.enviadoEm) return { k: 'nao_enviado', n: 'link não enviado', em: null, passo: 0 };
    const fim = v.tipo === 'propria' || coberturaDe(v) === 'certificado' ? (l.checklistEm && l.manualEm) : l.assinadoEm;
    if (fim) return { k: 'concluido', n: 'enviado pelo motorista', em: l.assinadoEm || l.manualEm || l.checklistEm, passo: 4 };
    if (l.cpfEm || l.t3Em || l.checklistEm) return { k: 'preenchendo', n: 'em preenchimento', em: l.t3Em || l.cpfEm, passo: 3 };
    if (l.abertoEm) return { k: 'aberto', n: 'aberto pelo motorista', em: l.abertoEm, passo: 2 };
    return { k: 'enviado', n: 'link enviado', em: l.enviadoEm, passo: 1 };
  }

  function coberturaDe(v) {
    if (v.tipo === 'propria') return 'propria';
    const t = transportador(v.transportador);
    return t ? t.cobertura : 'gatekeeper';
  }
  function ocorrenciaGraveAberta(tid) {
    return db().ocorrencias.find(o => o.transportador === tid && o.gravidade === 'grave' && !o.revisao) || null;
  }
  function manualVigente(dataIso) {
    const d = dataIso || HOJE;
    const vs = db().manual.versoes;
    return vs.find(x => x.desde <= d && (!x.ate || x.ate >= d)) || vs[vs.length - 1];
  }
  function ciclo(v) {
    if (v.cancelada) return { k: 'cancelada', n: 'Cancelada' };
    if (v.data > HOJE) return { k: 'agendada', n: 'Agendada', sub: fmt.extenso(v.data) + ', ' + v.janela };
    if (v.data === HOJE && !v.cte) return { k: 'hoje', n: 'Carrega hoje', sub: 'hoje, ' + v.janela };
    if (!v.cte) return { k: 'sem_cte', n: 'Aguardando CT-e', sub: 'carregou ' + fmt.curta(v.data) };
    if (v.descarga && v.descarga < HOJE) return { k: 'concluida', n: 'Concluída', sub: 'descarga ' + fmt.curta(v.descarga) };
    return { k: 'transito', n: 'Em trânsito', sub: 'descarga prevista ' + fmt.curta(v.descarga) };
  }

  // ------------------------------------------------------------------ motor de decisão
  // Deriva das fatos as checagens, o resultado e o que falta, com quem resolve.
  function decidir(v) {
    if (typeof v === 'string') v = viagem(v);
    const ch = [];
    const cob = coberturaDe(v);
    const t = transportador(v.transportador);
    const mot = pessoa(v.motorista);
    const conj = conjunto(v.conjunto);
    const fil = filial(v.filial);
    const prod = produto(v.produto);
    const add = (k, nome, estado, detalhe, quem, extra) => ch.push(Object.assign({ k, nome, estado, detalhe, quem: quem || '' }, extra || {}));
    const ref = v.data < HOJE ? v.data : HOJE;

    // 1. Cobertura do transportador
    if (cob === 'propria') {
      const e = conj && conj.escopo;
      if (e && e.no) add('cobertura', 'Conjunto no escopo GMP+', 'ok', 'Frota própria no escopo desde ' + fmt.data(e.desde), 'Gestor de frota');
      else add('cobertura', 'Conjunto no escopo GMP+', v.assegurada ? 'bloqueio' : 'na', 'Conjunto fora do escopo GMP+' + (e && e.motivo ? ': ' + e.motivo : ''), 'Gestor de frota', { alcada: 'nenhuma', resolver: 'Trocar por um conjunto no escopo ou incluir este no escopo em Frota própria.' });
    } else if (cob === 'certificado') {
      const de = docEstado(t.certificado && t.certificado.validade, ref);
      if (de.estado === 'vencido' || de.estado === 'falta') add('cobertura', 'Certificado GMP+ do transportador', 'bloqueio', 'Certificado ' + (t.certificado ? t.certificado.numero + ' ' : '') + de.rotulo, 'Qualidade', { alcada: 'nenhuma', resolver: 'Conferir o certificado renovado na base pública e atualizar o cadastro.' });
      else add('cobertura', 'Certificado GMP+ do transportador', 'ok', t.certificado.numero + ', ' + t.certificado.escopo + ', ' + de.rotulo, 'Qualidade', { aviso: de.estado === 'vence' });
    } else {
      if (fil && fil.comunicacaoOC && fil.comunicacaoOC.data <= v.data) add('cobertura', 'Gatekeeper comunicado ao organismo certificador', 'ok', 'Filial ' + fil.nome + ' comunicou em ' + fmt.data(fil.comunicacaoOC.data), 'Qualidade');
      else add('cobertura', 'Gatekeeper comunicado ao organismo certificador', 'bloqueio', 'A filial ' + (fil ? fil.nome : '') + ' ainda não registrou a comunicação ao organismo certificador. A TS1.2 exige comunicar antes do primeiro protocolo gatekeeper.', 'Qualidade', { alcada: 'nenhuma', resolver: 'Registrar a comunicação em Cadastros, Filiais.', href: 'Cadastros.dc.html?aba=filiais' });
    }
    if (t) {
      const oc = ocorrenciaGraveAberta(t.id);
      if (oc && oc.em.slice(0, 10) <= v.data) add('ocorrencia', 'Transportador sem ocorrência grave em aberto', 'bloqueio', oc.id + ' em ' + fmt.data(oc.em.slice(0, 10)) + ': ' + oc.tipo.toLowerCase() + '. Viagens asseguradas ficam suspensas até a revisão.', 'Direção e RT', { alcada: 'direcao', resolver: 'Revisar a ocorrência em Transportadores ou liberar esta viagem com registro da Direção.' });
    }

    // 2. Documentos
    if (t) {
      const de = docEstado(t.rntrc && t.rntrc.validade, ref);
      add('docs-transp', 'RNTRC do transportador', de.estado === 'falta' ? 'falta' : de.estado === 'vencido' ? 'bloqueio' : 'ok', (t.rntrc ? t.rntrc.numero + ', ' : '') + de.rotulo, de.estado === 'falta' ? 'Motorista pelo link' : 'Qualidade', { alcada: 'qualidade', aviso: de.estado === 'vence', grupo: 'docs' });
    }
    if (mot) {
      const de = docEstado(mot.cnh && mot.cnh.validade, ref);
      add('docs-mot', 'CNH de ' + mot.nome.split(' ')[0], de.estado === 'falta' ? 'falta' : de.estado === 'vencido' ? 'bloqueio' : 'ok', de.rotulo, de.estado === 'falta' ? 'Motorista pelo link' : 'Qualidade', { alcada: 'qualidade', aviso: de.estado === 'vence', grupo: 'docs' });
    }
    if (conj) {
      const ruins = [], faltam = [], vencendo = [];
      placasDoConjunto(conj).forEach(pl => { const p = placa(pl); const de = docEstado(p && p.crlv && p.crlv.validade, ref); if (de.estado === 'vencido') ruins.push(pl + ' ' + de.rotulo); else if (de.estado === 'falta') faltam.push(pl); else if (de.estado === 'vence') vencendo.push(pl + ' ' + de.rotulo); });
      if (ruins.length) add('docs-conj', 'CRLV das placas do conjunto', 'bloqueio', 'CRLV ' + ruins.join('; '), 'Qualidade', { alcada: 'qualidade', grupo: 'docs' });
      else if (faltam.length) add('docs-conj', 'CRLV das placas do conjunto', 'falta', 'Falta o CRLV de ' + faltam.join(', '), 'Motorista pelo link', { grupo: 'docs' });
      else add('docs-conj', 'CRLV das placas do conjunto', 'ok', placasDoConjunto(conj).length + ' placas com CRLV válido' + (vencendo.length ? '; ' + vencendo.join('; ') : ''), 'Qualidade', { aviso: vencendo.length > 0, grupo: 'docs' });
    }

    // 3. Produto carregado
    if (!prod) add('produto', 'Produto reconhecido na base IDTF', 'bloqueio', 'Produto não reconhecido', 'Traxium classifica', { tecnico: true, alcada: 'tecnico' });
    else if (v.assegurada && !prod.racao) add('produto', 'Produto reconhecido na base IDTF', 'bloqueio', prod.nome + ' não é ração: a viagem não pode levar a declaração GMP+', 'Afretador', { alcada: 'nenhuma' });
    else add('produto', 'Produto reconhecido na base IDTF', 'ok', prod.nome + ' (' + prod.en + '), base ' + db().baseIDTF.versao, 'Traxium');

    // 4. T-3 e regime
    const comps = t3(v);
    const quemT3 = v.tipo === 'propria' ? 'Gestor de frota' : 'Motorista pelo link';
    const incompletos = comps.filter(c => !c.completo);
    if (!comps.length) add('t3', 'Três últimas cargas por compartimento', 'falta', 'Conjunto sem carreta informada', 'Afretador');
    else if (incompletos.length) add('t3', 'Três últimas cargas por compartimento', 'falta', incompletos.length === comps.length ? 'Ainda não informadas' : 'Faltam em ' + incompletos.map(c => c.placa + ' ' + c.pos).join(', '), quemT3);
    else add('t3', 'Três últimas cargas por compartimento', 'ok', comps.length + (comps.length === 1 ? ' compartimento' : ' compartimentos') + ' com T-3 completo (' + (v.tipo === 'propria' ? 'histórico da frota' : 'declarado pelo motorista') + ')', quemT3);

    const regs = v.regularizacoes || [];
    const regimeComps = comps.filter(c => c.cargas.length).map(c => {
      const reg = regs.find(r => r.comp === c.key);
      return Object.assign({}, c, { regularizado: reg || null });
    });
    const proibidos = regimeComps.filter(c => c.proibida && !c.regularizado);
    const naoClass = regimeComps.filter(c => !c.proibida && c.naoClassificada);
    if (proibidos.length) {
      const c = proibidos[0];
      add('regime', 'Carga anterior permitida', 'bloqueio', c.placa + ' ' + c.pos + ' levou ' + c.proibida.produto.nome.toLowerCase() + ' em ' + fmt.data(c.proibida.data) + ': carga proibida pela IDTF. Nenhuma limpeza resolve.', 'Ninguém aprova', { tecnico: true, alcada: 'tecnico', resolver: 'Trocar o conjunto ou regularizar conforme a TS1.9.' });
    } else if (naoClass.length) {
      const c = naoClass[0];
      add('regime', 'Carga anterior classificada', 'bloqueio', '"' + c.naoClassificada.texto + '" em ' + c.placa + ' ' + c.pos + ' não está na base IDTF. Carga não classificada não pode ser carga anterior.', 'Traxium classifica', { tecnico: true, alcada: 'tecnico', resolver: 'Pedir classificação à Traxium ou trocar o conjunto.' });
    } else if (regimeComps.length && !incompletos.length) {
      const exig = regimeComps.map(c => ({ c, r: c.regularizado ? 'A' : c.regimeExigido }));
      const pend = exig.filter(x => x.r && x.r !== 'A' && !(v.limpezas || []).some(l => l.comp === x.c.key && REGIMES[l.regime].ordem >= REGIMES[x.r].ordem));
      const maior = exig.reduce((m, x) => (REGIMES[x.r] && REGIMES[x.r].ordem > REGIMES[m].ordem ? x.r : m), 'A');
      if (pend.length) add('regime', 'Limpeza conforme o regime', 'falta', 'Regime ' + pend[0].r + ' (' + REGIMES[pend[0].r].n.toLowerCase() + ') exigido em ' + pend.map(x => x.c.placa + ' ' + x.c.pos).join(', ') + ': falta o comprovante do lavador', 'Afretador anexa o comprovante', { regime: maior });
      else add('regime', 'Regime de limpeza', 'ok', 'Regime ' + maior + ' (' + REGIMES[maior].n.toLowerCase() + ')' + (maior === 'A' ? ': limpeza seca declarada no checklist' : ': comprovante anexado') + (regs.length ? '; compartimento regularizado conforme TS1.9' : ''), 'Motorista', { regime: maior });
    }

    // 5. Verificação do compartimento
    const ck = v.checklist;
    const vf = v.verificacao;
    if (ck && ck.enviadoEm && ck.itens && ck.itens.interior === 'nao') add('verificacao', 'Verificação do compartimento', 'bloqueio', 'Motorista declarou resto de carga no interior. Item crítico reprovado.', 'Ninguém aprova', { tecnico: true, alcada: 'tecnico', resolver: 'Limpar e reenviar as fotos, ou trocar o conjunto.' });
    else if (!ck || !ck.enviadoEm) add('verificacao', 'Verificação do compartimento', 'falta', ck && Object.keys(ck.itens || {}).length ? 'Motorista respondeu ' + Object.keys(ck.itens).length + ' de 5 itens' : 'Checklist e fotos ainda não enviados', 'Motorista pelo link');
    else if (vf && vf.estado === 'devolvida' && !(vf.reenviadoEm)) add('verificacao', 'Verificação do compartimento', 'falta', 'Devolvido ao motorista: ' + vf.motivo, 'Motorista pelo link', { devolvida: true });
    else if (vf && vf.estado === 'aprovada' && (!ck.enviadoEm || vf.em >= ck.enviadoEm)) add('verificacao', 'Verificação do compartimento', 'ok', 'Aprovada por ' + (usuario(vf.por) || {}).nome + ' em ' + fmt.quando(vf.em), 'Afretador');
    else add('verificacao', 'Verificação do compartimento', 'falta', 'Fotos enviadas ' + fmt.quando(ck.enviadoEm) + ', esperando conferência', 'Afretador confere as fotos', { conferir: true });

    // 6. Termo e manual
    if (cob === 'gatekeeper') {
      if (v.termo) add('termo', 'Termo de compromisso assinado', 'ok', 'Versão ' + v.termo.versao + ', assinado ' + fmt.quando(v.termo.em), 'Motorista pelo link');
      else add('termo', 'Termo de compromisso assinado', 'falta', 'Ainda não assinado', 'Motorista pelo link');
    } else add('termo', 'Termo de compromisso assinado', 'na', cob === 'certificado' ? 'Não se aplica: transportador certificado' : 'Não se aplica: motorista da frota própria, com treinamento registrado', '');
    if (cob === 'certificado') add('manual', 'Ciência do manual vigente', 'na', 'Não se aplica: transportador certificado segue o próprio sistema', '');
    else {
      const vig = manualVigente(v.data);
      if (v.manual && v.manual.versao === vig.v) add('manual', 'Ciência do manual vigente', 'ok', 'Manual v' + v.manual.versao + ' lido ' + fmt.quando(v.manual.em), 'Motorista pelo link');
      else if (v.manual) add('manual', 'Ciência do manual vigente', 'falta', 'Ciência registrada na v' + v.manual.versao + '; vigente é a v' + vig.v, 'Motorista pelo link');
      else add('manual', 'Ciência do manual vigente', 'falta', 'Manual v' + vig.v + ' ainda não lido', 'Motorista pelo link');
    }

    // Liberações por autoridade cobrem bloqueios não técnicos; o motor continua reprovando.
    const libs = v.liberacoes || [];
    ch.forEach(c => {
      const lib = libs.find(l => l.checagem === c.k);
      if (lib && c.estado === 'bloqueio' && !c.tecnico) { c.liberadaPor = lib; }
    });

    let resultado;
    const aplicaveis = ch;
    const tecnico = aplicaveis.find(c => c.estado === 'bloqueio' && c.tecnico);
    const bloq = aplicaveis.filter(c => c.estado === 'bloqueio' && !c.tecnico && !c.liberadaPor);
    const faltas = aplicaveis.filter(c => c.estado === 'falta');
    const porAutoridade = aplicaveis.some(c => c.liberadaPor);
    if (v.cancelada) resultado = 'cancelada';
    else if (!v.assegurada) resultado = 'nao_assegurada';
    else if (tecnico) resultado = 'tecnico';
    else if (bloq.length) resultado = 'bloqueada';
    else if (faltas.length) resultado = 'falta';
    else resultado = 'pronta';
    const ROT = {
      pronta: porAutoridade ? 'Pronta, liberada por autoridade' : 'Pronta para assegurar',
      falta: 'Falta algo', bloqueada: 'Bloqueada', tecnico: 'Bloqueio técnico', cancelada: 'Cancelada', nao_assegurada: 'Sem declaração GMP+'
    };
    const falta = [...(tecnico ? [tecnico] : []), ...bloq, ...faltas].map(c => ({ k: c.k, o: c.nome, detalhe: c.detalhe, quem: c.quem, estado: c.estado, tecnico: !!c.tecnico, alcada: c.alcada || null, resolver: c.resolver || null, href: c.href || null }));
    const okN = aplicaveis.filter(c => c.estado === 'ok' || c.liberadaPor).length;
    const total = aplicaveis.filter(c => c.estado !== 'na').length;
    return { viagem: v.id, resultado, rotulo: ROT[resultado], porAutoridade, checagens: ch, falta, t3: comps, okN, total, cobertura: cob, regime: (ch.find(c => c.k === 'regime') || {}).regime || null };
  }

  // Linha do tempo derivada dos fatos da viagem (nada é campo de estado).
  function linhaDoTempo(v) {
    if (typeof v === 'string') v = viagem(v);
    const nomeU = id => id === 'motorista' ? (pessoa(v.motorista) || {}).nome : ((usuario(id) || {}).nome || 'Sistema');
    const mot = (pessoa(v.motorista) || {}).nome || 'Motorista';
    const out = [];
    const e = (em, texto, quem, tipo) => { if (em) out.push({ em, texto, quem, tipo }); };
    e(v.criadaEm, 'Viagem criada' + (v.origemOrdem === 'pdf' ? ' a partir do PDF da ordem' : '') + (v.ordem ? ', ' + v.ordem : ''), nomeU(v.criadaPor), 'equipe');
    const l = v.link || {};
    e(l.enviadoEm, 'Link enviado ao motorista pelo WhatsApp', nomeU(v.criadaPor), 'equipe');
    e(l.abertoEm, 'Abriu o link', mot, 'motorista');
    e(l.cpfEm, 'Confirmou CPF e placas', mot, 'motorista');
    e(l.docsEm, 'Enviou os documentos que faltavam', mot, 'motorista');
    e(l.t3Em, 'Informou as três últimas cargas', mot, 'motorista');
    if (v.checklist) e(v.checklist.enviadoEm, 'Enviou o checklist com ' + Object.keys(v.checklist.fotos || {}).length + ' fotos' + (v.checklist.gps ? ' (' + v.checklist.gps + ')' : ''), mot, 'motorista');
    if (v.manual) e(v.manual.em, 'Leu o manual v' + v.manual.versao + ' e deu ciência', mot, 'motorista');
    if (v.termo) e(v.termo.em, 'Assinou o termo de compromisso ' + v.termo.versao, mot, 'motorista');
    if (v.verificacao) {
      e(v.verificacao.em, v.verificacao.estado === 'aprovada' ? 'Verificação do compartimento aprovada' : 'Checklist devolvido: ' + v.verificacao.motivo, nomeU(v.verificacao.por), v.verificacao.estado === 'aprovada' ? 'equipe' : 'alerta');
      e(v.verificacao.reenviadoEm, 'Reenviou o checklist corrigido', mot, 'motorista');
    }
    (v.limpezas || []).forEach(x => e(x.em, 'Limpeza regime ' + x.regime + ' em ' + x.comp.replace('#', ' ') + ', comprovante ' + x.comprovante, nomeU(x.por), 'equipe'));
    (v.regularizacoes || []).forEach(x => e(x.em, 'Regularização TS1.9 opção ' + x.opcao + ' em ' + x.comp.replace('#', ' ') + ', inspetor ' + x.inspetor, nomeU(x.por), 'equipe'));
    (v.liberacoes || []).forEach(x => e(x.em, 'Liberada por autoridade: ' + x.motivo + '. O motor continua reprovando a regra.', nomeU(x.assinante), 'alerta'));
    (v.manutencoes || []).forEach(x => e(x.em, 'Bloqueio mantido: ' + x.motivo, nomeU(x.por), 'alerta'));
    (v.retificacoes || []).forEach(x => e(x.em, 'Retificação de ' + x.campo + ' (' + x.motivo + ')', nomeU(x.por), 'equipe'));
    db().ocorrencias.filter(o => o.viagem === v.id).forEach(o => e(o.em, 'Ocorrência ' + o.id + ' (' + o.gravidade + '): ' + o.tipo, nomeU(o.por), 'alerta'));
    if (v.cte) e(v.cte.conciliadoEm + 'T23:59', 'CT-e ' + v.cte.numero + ' e NF ' + v.cte.nf + ' conciliados (lote ' + v.cte.lote + ')', 'Sistema', 'sistema');
    if (v.cte && v.descarga && v.descarga < HOJE) e(v.descarga + 'T23:59', 'Concluída: CT-e conciliado e descarga passada. Cargas entram no histórico dos compartimentos.', 'Sistema', 'sistema');
    if (v.cancelada) e(v.cancelada.em, 'Cancelada: ' + v.cancelada.motivo, nomeU(v.cancelada.por), 'alerta');
    return out.sort((a, b) => a.em.localeCompare(b.em));
  }

  // ------------------------------------------------------------------ agregados para as telas
  function viagensDaFilial(filialId) {
    return db().viagens.filter(v => !filialId || filialId === 'todas' || v.filial === filialId);
  }
  function viagensDoDia(filialId, dia) {
    const d = dia || HOJE;
    return viagensDaFilial(filialId).filter(v => v.data === d);
  }
  function sessao() {
    const ls = storage();
    let id = null;
    try { id = ls && ls.getItem(CHAVE_SESSAO); } catch (e) { id = null; }
    return usuario(id) || usuario('u-rafael');
  }
  function entrarComo(id) {
    const ls = storage();
    try { if (ls) ls.setItem(CHAVE_SESSAO, id); } catch (e) { /* segue em memória */ }
    mem.versao++;
    avisarOuvintes();
  }

  // Vencimentos: documentos de transportadores, motoristas, placas e fornecedores.
  function vencimentos(janela) {
    const lim = janela || 60;
    const out = [];
    const push = (tipo, ref, dono, validade, href, extra) => { const de = docEstado(validade); if (de.estado === 'falta') return; if (de.dias <= lim) out.push(Object.assign({ tipo, ref, dono, validade, dias: de.dias, estado: de.estado, rotulo: de.rotulo, href }, extra || {})); };
    db().transportadores.forEach(t => {
      const nome = nomeTransportador(t);
      const href = 'Transportadores.dc.html?id=' + t.id;
      if (t.rntrc) push('RNTRC', t.rntrc.numero, nome, t.rntrc.validade, href, { transportador: t.id });
      if (t.certificado) push('Certificado GMP+', t.certificado.numero, nome, t.certificado.validade, href, { transportador: t.id });
      const pessoas = t.tipo === 'TAC' ? [t.pessoa] : (t.motoristas || []);
      pessoas.forEach(pid => { const p = pessoa(pid); if (p && p.cnh) push('CNH', p.nome, t.tipo === 'TAC' ? nome : nome + ', motorista ' + p.nome, p.cnh.validade, href, { transportador: t.id, pessoa: pid }); });
      (t.conjuntos || []).forEach(cid => placasDoConjunto(cid).forEach(pl => { const p = placa(pl); if (p && p.crlv) push('CRLV', pl, nome, p.crlv.validade, href, { transportador: t.id, placa: pl }); }));
    });
    db().conjuntos.filter(c => c.dono === 'propria').forEach(c => placasDoConjunto(c).forEach(pl => { const p = placa(pl); if (p && p.crlv) push('CRLV', pl, 'Frota própria', p.crlv.validade, 'Frota.dc.html', { placa: pl }); }));
    db().pessoas.filter(p => p.vinculo === 'propria').forEach(p => { if (p.cnh) push('CNH', p.nome, 'Frota própria, motorista ' + p.nome, p.cnh.validade, 'Frota.dc.html', { pessoa: p.id }); });
    db().fornecedores.forEach(f => f.docs.forEach(d => push(d.n, f.nome, f.nome, d.validade, 'Cadastros.dc.html?aba=fornecedores', { fornecedor: f.id })));
    return out.sort((a, b) => a.dias - b.dias);
  }

  // Pendências de registro da qualidade: viagens asseguradas carregadas sem algum item.
  function pendenciasRegistro(filialId, desde) {
    const ini = desde || addDias(HOJE, -45);
    const out = [];
    viagensDaFilial(filialId).filter(v => !v.cancelada && v.assegurada && v.data >= ini && v.data <= HOJE).forEach(v => {
      const dec = decidir(v);
      const itens = [];
      if (v.data < HOJE && !v.cte) itens.push({ k: 'cte', n: 'CT-e não conciliado' });
      if (dec.cobertura === 'gatekeeper' && !v.termo && v.data < HOJE) itens.push({ k: 'termo', n: 'sem termo assinado' });
      if (v.data < HOJE && !(v.verificacao && v.verificacao.estado === 'aprovada')) itens.push({ k: 'verif', n: 'sem verificação aprovada' });
      if (dec.porAutoridade) itens.push({ k: 'lib', n: 'liberada por autoridade', leve: true });
      if (itens.length) out.push({ viagem: v, itens });
    });
    return out;
  }

  // Prontidão para auditoria: viagens asseguradas concluídas no período com os itens que o auditor anota.
  function prontidao(filialId, desde) {
    const ini = desde || addDias(HOJE, -45);
    const vs = viagensDaFilial(filialId).filter(v => !v.cancelada && v.assegurada && v.data >= ini && v.data < HOJE);
    const completas = vs.filter(v => {
      const dec = decidir(v);
      return v.cte && (dec.cobertura !== 'gatekeeper' || v.termo) && v.verificacao && v.verificacao.estado === 'aprovada' && dec.t3.every(c => c.completo);
    });
    return { total: vs.length, completas: completas.length, pct: vs.length ? Math.round(completas.length / vs.length * 100) : 100 };
  }

  function badges(usuarioObj) {
    const u = usuarioObj || sessao();
    const hoje = db().viagens.filter(v => v.data === HOJE && u.filiais.includes(v.filial) && !v.cancelada).filter(v => { const r = decidir(v).resultado; return r !== 'pronta' && r !== 'nao_assegurada'; }).length;
    const venc = vencimentos(15).filter(x => x.transportador).length;
    return { hoje, transportadores: venc };
  }

  // Qualificação de ETC (estados derivados); TAC tem resumo por viagem.
  function qualificacao(t) {
    if (typeof t === 'string') t = transportador(t);
    const oc = ocorrenciaGraveAberta(t.id);
    const docs = [];
    if (t.rntrc) docs.push(docEstado(t.rntrc.validade)); else docs.push({ estado: 'falta' });
    if (t.cobertura === 'certificado') docs.push(docEstado(t.certificado && t.certificado.validade));
    const pessoas = t.tipo === 'TAC' ? [t.pessoa] : (t.motoristas || []);
    pessoas.forEach(pid => { const p = pessoa(pid); docs.push(docEstado(p && p.cnh && p.cnh.validade)); });
    (t.conjuntos || []).forEach(cid => placasDoConjunto(cid).forEach(pl => { const p = placa(pl); docs.push(docEstado(p && p.crlv && p.crlv.validade)); }));
    const vencido = docs.some(d => d.estado === 'vencido');
    const falta = docs.some(d => d.estado === 'falta');
    const vence = docs.some(d => d.estado === 'vence');
    let k, n;
    if (oc) { k = 'bloqueado'; n = 'Em revisão'; }
    else if (vencido) { k = 'pendente'; n = 'Documento vencido'; }
    else if (falta) { k = 'pendente'; n = t.cadastroMinimo ? 'Cadastro mínimo' : 'Documento faltando'; }
    else if (vence) { k = 'restricao'; n = 'Documento a vencer'; }
    else { k = 'apto'; n = t.tipo === 'ETC' ? 'Apto' : 'Documentos em dia'; }
    return { k, n, ocorrencia: oc, docs };
  }

  // Mensagem pronta para o WhatsApp do afretador.
  function mensagemLink(v) {
    const mot = pessoa(v.motorista);
    const f = filial(v.filial);
    const p = produto(v.produto);
    const emb = embarcador(v.embarcador);
    return 'Olá, ' + (mot ? mot.nome.split(' ')[0] : 'motorista') + '. Aqui é da ' + db().tenant.nome + ', filial ' + f.nome + '. Para a carga de ' + (p ? p.nome.toLowerCase() : '') + ' em ' + (emb ? emb.nome : '') + ' (' + fmt.extenso(v.data) + ', ' + v.janela + '), preencha pelo link: confirme seus dados, informe as 3 últimas cargas da carreta, mande as fotos do checklist e assine. Leva uns 5 minutos e não precisa instalar nada. ' + urlLink(v.id);
  }
  function urlLink(id) { return 'traxium.app/v/' + id.replace('VG-', '') + '-' + (('' + id.charCodeAt(4) * 7919).slice(-4)); }

  // Lote de CT-e simulado (planilha ou XML exportado do TMS): uma linha por viagem carregada sem CT-e, mais uma sem correspondência.
  function loteCTe() {
    const pend = db().viagens.filter(v => !v.cancelada && v.data < HOJE && !v.cte);
    let n = 18402, nf = 23510;
    const linhas = pend.sort((a, b) => a.data.localeCompare(b.data)).map(v => ({ cte: String(n++).padStart(6, '0'), nf: String(nf++).padStart(6, '0'), placa: conjunto(v.conjunto).cavalo, data: v.data, viagem: v.id, casou: true }));
    linhas.push({ cte: String(n++).padStart(6, '0'), nf: String(nf++).padStart(6, '0'), placa: 'QJD 9F03', data: '2026-10-07', viagem: null, casou: false, motivo: 'Nenhuma viagem com esta placa e data. Provável carga não assegurada.' });
    return { arquivo: 'ctes-out-' + HOJE.slice(8) + '.xml', linhas };
  }

  // ------------------------------------------------------------------ escrita
  function fazer(tipo, dados) {
    const op = { tipo, dados: clone(dados || {}), em: agoraTs(), por: (sessao() || {}).id || 'u-rafael' };
    if (dados && dados.porMotorista) op.por = 'motorista';
    const teste = clone(mem.db);
    teste.eventos = mem.db.eventos.slice();
    aplicar(teste, op); // valida antes de gravar; lança se a operação for inválida
    mem.ops.push(op);
    gravarOps();
    reconstruir();
    avisarOuvintes();
    return op.resultado || true;
  }
  function ouvir(fn) {
    mem.ouvintes.push(fn);
    return () => { mem.ouvintes = mem.ouvintes.filter(f => f !== fn); };
  }
  function reset() {
    mem.ops = [];
    const ls = storage();
    try { if (ls) ls.removeItem(CHAVE); } catch (e) { /* ignorado */ }
    reconstruir();
    avisarOuvintes();
  }
  function recarregar() { mem.ops = lerOps(); reconstruir(); avisarOuvintes(); }

  // Outra aba (o link do motorista, por exemplo) gravou: recarrega e avisa as telas.
  if (root.addEventListener) {
    root.addEventListener('storage', e => { if (e.key === CHAVE || e.key === CHAVE_SESSAO) recarregar(); });
  }

  mem.ops = lerOps();
  reconstruir();

  const TX = {
    HOJE, DECLARACAO_CTE, ITENS_CHECKLIST, REGIMES, agoraHM,
    get db() { return mem.db; }, get versao() { return mem.versao; }, get ops() { return mem.ops.slice(); },
    fmt, norm, soDigitos, addDias, difDias,
    produto, pessoa, transportador, conjunto, placa, filial, usuario, viagem, embarcador, destinatario, fornecedor,
    nomeTransportador, produtoPorTexto, buscarProdutos, compsDoConjunto, placasDoConjunto, docEstado, historico, t3,
    linkEstado, coberturaDe, ocorrenciaGraveAberta, manualVigente, ciclo, decidir, linhaDoTempo,
    viagensDaFilial, viagensDoDia, sessao, entrarComo, vencimentos, pendenciasRegistro, prontidao, badges, qualificacao,
    mensagemLink, urlLink, loteCTe, fazer, ouvir, reset, recarregar
  };
  root.TX = TX;
  if (typeof module !== 'undefined' && module.exports) module.exports = TX;
})(typeof window !== 'undefined' ? window : globalThis);
