// Confere a coerência da base comum do protótipo v2 (tx-dados.js).
// Uso: node scripts/testar-tx-dados.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const armazenado = new Map();
globalThis.localStorage = {
  getItem: k => (armazenado.has(k) ? armazenado.get(k) : null),
  setItem: (k, v) => armazenado.set(k, String(v)),
  removeItem: k => armazenado.delete(k)
};
const require = createRequire(import.meta.url);
const TX = require(path.join(aqui, '..', 'src', 'lib', 'tx', 'tx-dados.js'));

let falhas = 0, ok = 0;
function confere(cond, msg) {
  if (cond) ok++;
  else { falhas++; console.log('  FALHOU: ' + msg); }
}
function secao(t) { console.log('\n' + t); }

const db = TX.db;

secao('1. Referências');
const ids = lista => new Set(db[lista].map(x => x.id));
for (const lista of ['filiais', 'usuarios', 'produtos', 'pessoas', 'transportadores', 'conjuntos', 'viagens', 'ocorrencias', 'fornecedores', 'treinamentos']) {
  confere(ids(lista).size === db[lista].length, lista + ': ids únicos');
}
const placas = new Set(db.placas.map(p => p.placa));
confere(placas.size === db.placas.length, 'placas únicas');
for (const c of db.conjuntos) {
  confere(placas.has(c.cavalo), c.id + ': cavalo ' + c.cavalo + ' existe');
  confere(TX.placa(c.cavalo) && TX.placa(c.cavalo).tipo === 'cavalo', c.id + ': ' + c.cavalo + ' é cavalo');
  for (const pl of c.carretas) {
    confere(placas.has(pl), c.id + ': carreta ' + pl + ' existe');
    confere(TX.placa(pl) && TX.placa(pl).tipo === 'carreta', c.id + ': ' + pl + ' é carreta');
  }
  const donoOk = c.dono === 'propria' ? true : !!TX.transportador(c.dono);
  confere(donoOk, c.id + ': dono existe');
  for (const pl of [c.cavalo, ...c.carretas]) confere(TX.placa(pl).dono === c.dono, c.id + ': placa ' + pl + ' tem o mesmo dono do conjunto');
}
for (const t of db.transportadores) {
  if (t.tipo === 'TAC') confere(!!TX.pessoa(t.pessoa), t.id + ': pessoa existe');
  else (t.motoristas || []).forEach(m => confere(TX.pessoa(m) && TX.pessoa(m).vinculo === 'etc:' + t.id, t.id + ': motorista ' + m + ' vinculado à ETC'));
  (t.conjuntos || []).forEach(c => confere(TX.conjunto(c) && TX.conjunto(c).dono === t.id, t.id + ': conjunto ' + c + ' é dele'));
}
const cpfs = db.pessoas.map(p => TX.soDigitos(p.cpf));
confere(new Set(cpfs).size === cpfs.length, 'CPF único por pessoa (chave do motorista)');
for (const f of db.filiais) confere(!!TX.usuario(f.afretador) && TX.usuario(f.afretador).papel === 'afretador', f.id + ': afretador existe');
for (const ci of db.cargasIniciais) confere(!!TX.produto(ci.produto) && placas.has(ci.comp.split('#')[0]), 'carga inicial ' + ci.comp + ' ' + ci.data + ' coerente');

secao('2. Viagens');
for (const v of db.viagens) {
  const c = TX.conjunto(v.conjunto);
  confere(!!c, v.id + ': conjunto existe');
  confere(!!TX.filial(v.filial), v.id + ': filial existe');
  confere(!!TX.produto(v.produto), v.id + ': produto existe');
  confere(!!TX.pessoa(v.motorista), v.id + ': motorista existe');
  confere(!!TX.embarcador(v.embarcador) && !!TX.destinatario(v.destinatario), v.id + ': embarcador e destinatário existem');
  if (v.tipo === 'propria') confere(c && c.dono === 'propria' && v.transportador === 'propria', v.id + ': frota própria usa conjunto próprio');
  else {
    confere(c && c.dono === v.transportador, v.id + ': conjunto pertence ao transportador');
    const t = TX.transportador(v.transportador);
    confere(t && (t.tipo === 'TAC' ? t.pessoa === v.motorista : t.motoristas.includes(v.motorista)), v.id + ': motorista é do transportador');
  }
  const comps = TX.compsDoConjunto(c).map(x => x.key);
  Object.keys(v.t3 || {}).forEach(k => confere(comps.includes(k), v.id + ': T-3 declarado para compartimento do conjunto (' + k + ')'));
  Object.values(v.t3 || {}).forEach(lista => lista.forEach(x => confere(x.data < v.data, v.id + ': carga anterior ' + x.data + ' é antes da viagem')));
  let dec;
  try { dec = TX.decidir(v); } catch (e) { dec = null; console.log('  erro ao decidir ' + v.id + ': ' + e.message); }
  confere(dec && ['pronta', 'falta', 'bloqueada', 'tecnico', 'cancelada', 'nao_assegurada'].includes(dec.resultado), v.id + ': toda viagem decide');
  if (dec && v.cte && !v.cancelada && v.assegurada) confere(dec.resultado === 'pronta', v.id + ': viagem com CT-e conciliado estava pronta (' + (dec && dec.resultado) + ')');
  if (v.cte) confere(v.data < TX.HOJE, v.id + ': CT-e só em viagem já carregada');
  const lt = TX.linhaDoTempo(v);
  confere(lt.length > 0 && lt.every((e, i) => i === 0 || lt[i - 1].em <= e.em), v.id + ': linha do tempo ordenada');
}

secao('3. Três viagens canônicas');
const r = id => TX.decidir(id).resultado;
confere(r('VG-3116') === 'pronta' && TX.coberturaDe(TX.viagem('VG-3116')) === 'gatekeeper', 'VG-3116 TAC liberada, pronta para assegurar');
confere(r('VG-3117') === 'pronta' && TX.viagem('VG-3117').tipo === 'propria', 'VG-3117 frota própria liberada');
confere(TX.decidir('VG-3117').t3.every(c => c.origem === 'historico' && c.completo), 'VG-3117 T-3 lido do histórico do compartimento');
confere(r('VG-3118') === 'tecnico', 'VG-3118 TAC com bloqueio técnico');
const d3118 = TX.decidir('VG-3118');
confere(d3118.falta[0].k === 'regime' && /cama de frango/.test(d3118.falta[0].detalhe), 'VG-3118 bloqueada por cama de frango no T-3');
confere(TX.decidir('VG-3116').t3[0].cargas.some(x => x.confere === 'VG-3105'), 'VG-3116: T-2 declarado confere com a VG-3105');

secao('4. Contagens');
const hoje = db.viagens.filter(v => v.data === TX.HOJE);
confere(hoje.length >= 10, 'há ao menos 10 viagens hoje (' + hoje.length + ')');
const resultadosHoje = new Set(hoje.map(v => TX.decidir(v).resultado));
['pronta', 'falta', 'bloqueada', 'tecnico'].forEach(k => confere(resultadosHoje.has(k), 'hoje tem viagem em "' + k + '"'));
const estadosLink = new Set(hoje.map(v => TX.linkEstado(v).k));
['nao_enviado', 'enviado', 'preenchendo', 'concluido'].forEach(k => confere(estadosLink.has(k), 'hoje tem link em "' + k + '"'));
const b = TX.badges(TX.usuario('u-rafael'));
const esperadoHoje = hoje.filter(v => !v.cancelada && !['pronta', 'nao_assegurada'].includes(TX.decidir(v).resultado)).length;
confere(b.hoje === esperadoHoje, 'badge Hoje = viagens do dia com pendência (' + b.hoje + ')');
confere(b.transportadores === TX.vencimentos(15).filter(x => x.transportador).length && b.transportadores > 0, 'badge Transportadores = documentos vencidos ou vencendo em 15 dias (' + b.transportadores + ')');
const bDiego = TX.badges(TX.usuario('u-diego'));
confere(bDiego.hoje === hoje.filter(v => v.filial === 'SOR' && !['pronta', 'nao_assegurada'].includes(TX.decidir(v).resultado)).length, 'badge Hoje do afretador conta só a filial dele (' + bDiego.hoje + ')');
const tacs = db.transportadores.filter(t => t.tipo === 'TAC').length, etcs = db.transportadores.filter(t => t.tipo === 'ETC').length;
confere(tacs > etcs && etcs === 3, 'maioria TAC, 3 ETC (' + tacs + ' TAC)');
const propria = db.conjuntos.filter(c => c.dono === 'propria');
confere(propria.length === 6 && propria.filter(c => c.escopo && c.escopo.no).length === 4, 'frota própria de 6 conjuntos, 4 no escopo');
confere(db.produtos.length >= 30, 'ao menos 30 produtos (' + db.produtos.length + ')');
confere(db.manual.versoes.length === 2, 'manual em duas versões');
const lote = TX.loteCTe();
confere(lote.linhas.filter(l => l.casou).every(l => { const v = TX.viagem(l.viagem); return TX.conjunto(v.conjunto).cavalo === l.placa && v.data === l.data; }), 'lote de CT-e casa por placa e data');
confere(lote.linhas.some(l => !l.casou), 'lote de CT-e tem linha sem correspondência');
confere(TX.produtoPorTexto('casquinha') && TX.produtoPorTexto('casquinha').id === 'casca-soja', 'busca entende "casquinha"');
confere(TX.produtoPorTexto('adubo') && TX.produtoPorTexto('adubo').id === 'npk', 'busca entende "adubo"');
confere(TX.produtoPorTexto('escória') === null, 'produto fora da base não é reconhecido');

secao('5. Fluxos (persistência por log de operações)');
TX.reset();
// F1: link enviado, motorista preenche, afretador confere.
const F1 = 'VG-3122';
TX.entrarComo('u-diego');
TX.fazer('enviarLink', { id: F1, canal: 'copiado' });
confere(TX.linkEstado(TX.viagem(F1)).k === 'enviado', 'F1: link enviado');
const comps = TX.compsDoConjunto(TX.viagem(F1).conjunto);
const t3 = {}; comps.forEach(c => { t3[c.key] = [{ data: '2026-10-04', produto: 'soja' }, { data: '2026-09-28', produto: 'milho' }, { data: '2026-09-20', produto: 'npk' }]; });
TX.fazer('linkAberto', { id: F1, porMotorista: true });
TX.fazer('linkCpf', { id: F1, porMotorista: true });
TX.fazer('linkT3', { id: F1, t3, porMotorista: true });
confere(TX.linkEstado(TX.viagem(F1)).k === 'preenchendo', 'F1: link em preenchimento');
TX.fazer('linkChecklist', { id: F1, itens: { lona: 'ok', correntes: 'ok', cintas: 'ok', carroceria: 'ok', interior: 'ok' }, fotos: { lona: 1, correntes: 1, cintas: 1, carroceria: 1, interior: 1 }, porMotorista: true });
TX.fazer('linkManual', { id: F1, versao: '3.2', porMotorista: true });
TX.fazer('linkAssinar', { id: F1, versao: '2026.1', porMotorista: true });
confere(TX.linkEstado(TX.viagem(F1)).k === 'concluido', 'F1: motorista concluiu o link');
confere(TX.decidir(F1).resultado === 'falta' && TX.decidir(F1).falta.some(f => f.k === 'verificacao'), 'F1: falta só a conferência do afretador');
TX.fazer('conferir', { id: F1, decisao: 'aprovar' });
confere(TX.decidir(F1).resultado === 'pronta', 'F1: pronta para assegurar após a conferência');
// Persistência: outra instância lê o mesmo log
const ops = JSON.parse(globalThis.localStorage.getItem('tx-v2')).ops;
confere(ops.length === 8 && ops.every(o => o.em && o.por), 'F1: 8 operações gravadas com autor e hora');
TX.recarregar();
confere(TX.decidir(F1).resultado === 'pronta', 'F1: estado reconstruído do log continua pronto');
confere(TX.linhaDoTempo(F1).some(e => e.tipo === 'motorista') && TX.linhaDoTempo(F1).some(e => /aprovada/.test(e.texto)), 'F1: linha do tempo mostra motorista e conferência');

// F3a: fila de assinatura e pedido de liberação
const filaR = TX.filaAssinatura(TX.db.usuarios.find(u => u.id === 'u-rafael'));
const filaL = TX.filaAssinatura(TX.db.usuarios.find(u => u.id === 'u-luiz'));
const filaD = TX.filaAssinatura(TX.db.usuarios.find(u => u.id === 'u-diego'));
confere(filaR.minhas.some(x => x.viagem.id === 'VG-3121') && !filaR.minhas.some(x => x.viagem.id === 'VG-3127'), 'fila: qualidade assina a VG-3121 (CRLV) e não a VG-3127 (ocorrência)');
confere(filaR.acima.some(x => x.viagem.id === 'VG-3127'), 'fila: VG-3127 aparece para a qualidade como esperando a Direção');
confere(filaL.minhas.some(x => x.viagem.id === 'VG-3121') && filaL.minhas.some(x => x.viagem.id === 'VG-3127'), 'fila: Direção assina as duas');
confere(filaD.minhas.length === 0, 'fila: afretador não tem alçada');
confere(![...filaL.minhas, ...filaL.acima].some(x => ['VG-3118', 'VG-3126'].includes(x.viagem.id)), 'fila: bloqueio técnico e falta de comunicação ao OC não entram');
TX.entrarComo('u-diego');
TX.fazer('pedirLiberacao', { id: 'VG-3121', checagem: 'docs-conj', alcada: 'qualidade', nota: 'Motorista diz que o licenciamento foi pago' });
const lib3121 = TX.liberacaoDe(TX.viagem('VG-3121'));
confere(lib3121 && lib3121.pedido && lib3121.pedido.por === 'u-diego', 'pedido: fica registrado com autor');
confere(TX.filaAssinatura(TX.db.usuarios.find(u => u.id === 'u-rafael')).minhas[0].viagem.id === 'VG-3121', 'pedido: viagem pedida vai para o topo da fila');
confere(TX.linhaDoTempo(TX.viagem('VG-3121')).some(e => /Pediu liberação/.test(e.texto)), 'pedido: aparece na linha do tempo');

// F3: liberação por autoridade (documento) e alçada
TX.entrarComo('u-rafael');
const reg = { checagem: 'docs-conj', motivo: 'Licenciamento pago, aguardando CRLV digital', justificativa: 'Comprovante de pagamento do licenciamento 2026 apresentado.', alcada: 'qualidade', alcadaNome: 'Gestor da qualidade', risco: 'Baixo', validade: 'Somente esta viagem', evidencia: 'boleto.pdf', escopo: 'Só a VG-3121', ciencia: true };
TX.fazer('liberar', { id: 'VG-3121', registro: reg });
const d3121 = TX.decidir('VG-3121');
confere(d3121.resultado === 'pronta' && d3121.porAutoridade, 'F3: VG-3121 pronta por autoridade');
confere(d3121.checagens.find(c => c.k === 'docs-conj').estado === 'bloqueio', 'F3: o motor continua reprovando a regra liberada');
confere(!TX.filaAssinatura(TX.db.usuarios.find(u => u.id === 'u-rafael')).minhas.some(x => x.viagem.id === 'VG-3121'), 'F3: viagem liberada sai da fila de assinatura');
// Bloqueio técnico não aceita liberação
const recusou = (fn, re) => { try { fn(); return false; } catch (e) { return !!e.recusada && (!re || re.test(e.motivo)); } };
confere(recusou(() => TX.fazer('liberar', { id: 'VG-3118', registro: Object.assign({}, reg, { checagem: 'regime' }) }), /não se libera por alçada/), 'F3: motor recusa liberação por autoridade de bloqueio técnico');
confere(TX.decidir('VG-3118').resultado === 'tecnico', 'F3: bloqueio técnico continua técnico');
TX.fazer('regularizar', { id: 'VG-3118', comp: 'RAD 3K20#C1', opcao: 'A', inspetor: 'Carlos Menegat', entidade: 'Inspeção independente credenciada', laudo: 'LI-2026-0931' });
confere(TX.decidir('VG-3118').resultado === 'pronta', 'F3: regularização TS1.9 opção A resolve o bloqueio técnico');
// Filial e ocorrência
TX.fazer('comunicarOC', { filial: 'PNG', data: '2026-10-08', protocolo: 'OC-GK-2026-1008' });
confere(TX.decidir('VG-3126').resultado === 'pronta', 'TS1.2: comunicação ao OC libera a viagem de Paranaguá');
TX.entrarComo('u-luiz');
TX.fazer('revisarTransportador', { transportador: 'e-lima', motivo: 'Treinamento de limpeza refeito e inspeção da carreta aprovada' });
confere(TX.decidir('VG-3127').resultado === 'pronta', 'F6: revisão da ocorrência grave reabilita a Lima');
// Documento de fornecedor atualizado em Cadastros
TX.fazer('atualizarDocumento', { tipo: 'Laudo de potabilidade da água', fornecedor: 'f-br163', ref: 'f-br163', refNome: 'Estação de Lavagem BR-163', validade: '2027-11-02' });
confere(TX.fornecedor('f-br163').docs.find(x => x.n === 'Laudo de potabilidade da água').validade === '2027-11-02', 'Cadastros: documento de fornecedor atualizado');
confere(!TX.vencimentos(60).some(x => x.fornecedor === 'f-br163' && x.tipo === 'Laudo de potabilidade da água'), 'Cadastros: documento atualizado sai dos vencimentos');
confere(TX.vencimentos(60).filter(x => x.fornecedor).every(x => x.href === '/cadastros?aba=fornecedores&id=' + x.fornecedor), 'Cadastros: vencimento de fornecedor abre o fornecedor');
// Convite de usuário em Configurações
const cv = TX.fazer('convidarUsuario', { nome: 'Joana Freitas', email: 'joana.freitas@transrural.com.br', papel: 'afretador', filiais: ['SOR'] });
confere(TX.db.convitesUsuario.length === 1 && TX.db.convitesUsuario[0].estado === 'enviado' && !TX.db.usuarios.some(u => u.nome === 'Joana Freitas'), 'Configurações: convite fica à parte até o primeiro acesso (' + cv + ')');
TX.fazer('cancelarConviteUsuario', { convite: cv });
confere(TX.db.convitesUsuario[0].estado === 'cancelado', 'Configurações: convite cancelado');
// Criação de viagem com TAC novo
TX.entrarComo('u-diego');
const novo = TX.fazer('criarViagem', { filial: 'SOR', produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', data: TX.HOJE, janela: '18:30', ordem: 'OC 48140', origemOrdem: 'pdf', novoTAC: { nome: 'Teodoro Lins', telefone: '(66) 99100-2030', cpf: '11122233396', placas: ['RZZ 1A11', 'RZZ 1A12'] } });
const vn = TX.viagem(novo);
confere(!!vn && vn.assegurada && TX.placa('RZZ 1A12') && TX.decidir(vn).resultado === 'falta', 'F1: viagem nova com cadastro mínimo de TAC (' + novo + ')');
confere(TX.decidir(vn).falta.some(f => f.k === 'docs-mot' && f.quem === 'Motorista pelo link'), 'F1: documentos do TAC novo são pedidos pelo link');
// Conciliação de CT-e em lote (pela qualidade, que vê todas as filiais)
TX.entrarComo('u-rafael');
const l2 = TX.loteCTe();
TX.fazer('conciliarCTe', { arquivo: l2.arquivo, linhas: l2.linhas.filter(x => x.casou) });
confere(db.viagens.length > 0 && TX.db.viagens.filter(v => !v.cancelada && v.data < TX.HOJE && !v.cte).length === 0, 'F1: conciliação em lote cobre todas as viagens carregadas');
confere(TX.ciclo(TX.viagem('VG-3110')).k === 'concluida', 'VG-3110 concluída sozinha (CT-e conciliado e descarga passada)');
TX.reset();
confere(TX.decidir('VG-3121').resultado === 'bloqueada' && !TX.viagem(novo), 'reset volta à semente');


secao('6. Revisão do MVP (11-revisao-mvp.md): permissões, escopo, desfechos e motor');
const tenta = (fn, re) => { try { fn(); return false; } catch (e) { return !!e.recusada && (!re || re.test(e.motivo)); } };
const reg3121 = { checagem: 'docs-conj', motivo: 'Licenciamento pago', justificativa: 'Comprovante apresentado.', alcada: 'qualidade', alcadaNome: 'Gestor da qualidade', risco: 'Baixo', validade: 'Somente esta viagem', evidencia: 'boleto.pdf', escopo: 'Só a VG-3121', ciencia: true };

// M40 e M37: consultoria só lê
TX.reset(); TX.entrarComo('u-ana');
for (const [op, alvo] of [['criarViagem', 'SOR'], ['enviarLink', 'VG-3122'], ['classeRegra', null], ['convidarUsuario', null], ['escopoFrota', 'c-p01'], ['cadastrarTransportador', null], ['publicarManual', null], ['registrarTreinamento', null], ['manterBloqueio', 'VG-3121'], ['reset', null]])
  confere(!TX.pode(op, alvo) && /leitura/.test(TX.porque(op, alvo)), 'M40: consultoria não faz ' + op);
confere(tenta(() => TX.fazer('classeRegra', { regra: 'manual', classe: 'alerta', motivo: 'Teste da consultoria externa' }), /leitura/) && TX.db.config.regras.find(r => r.k === 'manual').classe === 'bloqueio', 'M37: motor recusa a regra mudada pela consultoria e nada muda');
confere(TX.tentar('convidarUsuario', { nome: 'X', email: 'x@x.com', papel: 'afretador', filiais: ['SOR'] }).ok === false && TX.db.convitesUsuario.length === 0, 'M37: tentar devolve ok:false sem gravar');
confere(TX.ops.length === 0, 'M40: operação recusada não entra no log');
confere(TX.porque('criarViagem') !== null && TX.pode('criarViagem') === false, 'porque e pode concordam');

// M40: afretador
TX.entrarComo('u-diego');
confere(TX.pode('criarViagem', 'SOR') && !TX.pode('criarViagem', 'RON'), 'M40: afretador cria viagem só na própria filial');
confere(TX.pode('pedirLiberacao', 'VG-3121') && TX.pode('conferir', 'VG-3120') && TX.pode('trocarConjunto', 'VG-3118') && TX.pode('cancelarViagem', 'VG-3122'), 'M40: afretador pede, confere, troca e cancela');
confere(!TX.pode('liberar', 'VG-3121') && /alçada/.test(TX.porque('liberar', 'VG-3121')), 'M40: afretador não libera');
confere(!TX.pode('manterBloqueio', 'VG-3121') && tenta(() => TX.fazer('manterBloqueio', { id: 'VG-3121', checagem: 'docs-conj', motivo: 'teste', acao: 'Trocar' })), 'M14: afretador não mantém bloqueio, nem pelo motor');
for (const op of ['classeRegra', 'convidarUsuario', 'publicarManual', 'comunicarOC', 'cadastrarFornecedor', 'revisarTransportador', 'atualizarDocumento', 'escopoFrota', 'regularizar', 'reset'])
  confere(!TX.pode(op), 'M40: afretador não faz ' + op);
confere(!TX.pode('conferir', 'VG-3122') && /checklist/.test(TX.porque('conferir', 'VG-3122')), 'M40: conferir sem checklist enviado é recusado com o motivo');

// M40: qualidade, direção, frota
TX.entrarComo('u-rafael');
confere(TX.pode('liberar', 'VG-3121') && TX.pode('manterBloqueio', 'VG-3121') && !TX.pode('liberar', 'VG-3127') && /Direção e RT/.test(TX.porque('liberar', 'VG-3127')), 'M40: qualidade libera pela alçada dela, não a da Direção');
confere(!TX.pode('revisarTransportador', 'e-lima') && TX.pode('classeRegra') && TX.pode('convidarUsuario') && TX.pode('regularizar', 'VG-3118'), 'M40: qualidade cuida das regras e convites; revisão de transportador é da Direção');
confere(!TX.pode('liberar', 'VG-3118') && /técnico|alçada/.test(TX.porque('liberar', 'VG-3118')), 'M40: bloqueio técnico não se libera por ninguém');
TX.entrarComo('u-luiz');
confere(TX.pode('revisarTransportador', 'e-lima') && TX.pode('liberar', 'VG-3127'), 'M40: Direção reabilita e libera o que é da alçada dela');
TX.entrarComo('u-sergio');
confere(TX.pode('escopoFrota', 'c-p01') && !TX.pode('escopoFrota', 'c-josue'), 'M40: frota mexe no escopo da frota própria');
confere(TX.pode('atualizarDocumento', 'SQT 6B77') && TX.pode('atualizarDocumento', 'p-paulo') && !TX.pode('atualizarDocumento', 'QHG 7L34') && !TX.pode('atualizarDocumento', 'f-trevo'), 'M40: frota atualiza só documento da frota própria');
confere(!TX.pode('criarViagem') && !TX.pode('classeRegra') && !TX.pode('liberar', 'VG-3121'), 'M40: frota não cria viagem, não muda regra nem libera');
TX.fazer('atualizarDocumento', { tipo: 'CRLV', ref: 'SQT 6B77', refNome: 'SQT 6B77', validade: '2028-03-31' });
confere(TX.placa('SQT 6B77').crlv.validade === '2028-03-31', 'M29: frota atualiza CRLV da frota própria pelo motor');

// Etapas do link: só o motorista, só com link enviado
TX.reset(); TX.entrarComo('u-diego');
confere(!TX.pode('linkCpf', 'VG-3122') && tenta(() => TX.fazer('linkCpf', { id: 'VG-3122', porMotorista: true }), /não enviado/), 'Link: etapa recusada antes do envio');
confere(tenta(() => TX.fazer('linkT3', { id: 'VG-3116', t3: {} }), /link/), 'Link: escritório não grava etapa do motorista');
TX.fazer('enviarLink', { id: 'VG-3122', canal: 'copiado' });
confere(TX.pode('linkCpf', 'VG-3122'), 'Link: depois do envio o motorista preenche');

// M41: escopo de filial
TX.reset(); TX.entrarComo('u-diego');
confere(JSON.stringify(TX.filiaisVisiveis()) === '["SOR"]', 'M41: afretador vê só Sorriso');
confere(TX.podeVer('viagem', 'VG-3121') && !TX.podeVer('viagem', 'VG-3123') && TX.podeVer('transportador', 't-joao'), 'M41: viagem segue a filial; base de transportadores é compartilhada');
confere(!TX.podeVer('conjunto', 'c-p01') && TX.podeVer('conjunto', 'c-p04') && !TX.podeVer('placa', 'SQT 6B77'), 'M41: frota própria de outra filial fica fora');
confere(TX.viagensVisiveis().every(v => v.filial === 'SOR') && TX.viagensDaFilial('RON').length === 0 && TX.viagensDaFilial('todas').length === TX.db.viagens.filter(v => v.filial === 'SOR').length, 'M41: listas de viagem só com a filial da sessão');
confere(!TX.pode('enviarLink', 'VG-3123') && /outra filial/.test(TX.porque('enviarLink', 'VG-3123')) && tenta(() => TX.fazer('cancelarViagem', { id: 'VG-3123', motivo: 'teste de escopo de filial' }), /outra filial/), 'M41: ação em viagem de outra filial pela URL é recusada');
const lDiego = TX.loteCTe();
confere(lDiego.linhas.filter(l => l.casou).every(l => TX.viagem(l.viagem).filial === 'SOR') && lDiego.linhas.some(l => l.outraFilial === 'RON' && !l.casou), 'M41: lote de CT-e só casa viagem da filial; a de outra filial vem sem correspondência');
confere(tenta(() => TX.fazer('conciliarCTe', { arquivo: 'x.xml', linhas: [{ viagem: 'VG-3110', cte: '1', nf: '2' }] }), /outra filial/) && !TX.viagem('VG-3110').cte, 'M41: conciliação com viagem de outra filial é recusada');
confere(TX.pendenciasRegistro('todas').every(x => x.viagem.filial === 'SOR') && TX.filaAssinatura().minhas.length === 0, 'M41: pendências e fila respeitam a filial');

// M01: TAC novo precisa de CPF para receber o link
const baseNova = { filial: 'SOR', produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', data: TX.HOJE, janela: '18:30', ordem: 'OC 48141', origemOrdem: 'pdf' };
confere(tenta(() => TX.fazer('criarViagem', Object.assign({}, baseNova, { novoTAC: { nome: 'Teodoro Lins', telefone: '(66) 99100-2030', cpf: '', placas: ['RZZ 1A11', 'RZZ 1A12'] } })), /CPF/), 'M01: TAC novo sem CPF é recusado');
confere(tenta(() => TX.fazer('criarViagem', Object.assign({}, baseNova, { novoTAC: { nome: 'Outro', telefone: '', cpf: '633.081.277-19', placas: ['RZZ 1A11'] } })), /já cadastrado/), 'M01: CPF de pessoa já cadastrada é recusado');
confere(tenta(() => TX.fazer('cadastrarTransportador', { tipo: 'TAC', nome: 'Sem Documento', telefone: '', placas: [] }), /CPF/), 'M01: cadastro de TAC sem CPF é recusado');
const vTeo = TX.fazer('criarViagem', Object.assign({}, baseNova, { novoTAC: { nome: 'Teodoro Lins', telefone: '(66) 99100-2030', cpf: '111.222.333-96', placas: ['RZZ 1A11', 'RZZ 1A12'] } }));
confere(TX.pode('enviarLink', vTeo), 'M01: TAC novo com CPF recebe o link');
TX.db.pessoas.find(p => p.id === 'p-claudio').cpf = '';
confere(!TX.pode('enviarLink', 'VG-3122') && /CPF/.test(TX.porque('enviarLink', 'VG-3122')), 'M01: motorista sem CPF não recebe link (o link não teria com que conferir)');
TX.recarregar();
// M04 e M21 do lado do motor
confere(tenta(() => TX.fazer('criarViagem', Object.assign({}, baseNova, { ordem: 'OC 48130', transportador: 't-josue', conjunto: 'c-josue', motorista: 'p-josue' })), /já tem viagem/), 'M04: ordem repetida na filial é recusada');
confere(tenta(() => TX.fazer('criarViagem', Object.assign({}, baseNova, { ordem: 'OC 48142', janela: 'fim da tarde', transportador: 't-josue', conjunto: 'c-josue', motorista: 'p-josue' })), /HH:MM/), 'M21: janela em texto livre é recusada na criação');
confere(tenta(() => TX.fazer('retificar', { id: 'VG-3122', campo: 'janela', de: '17:00', para: 'fim da tarde', motivo: 'motorista atrasou' }), /HH:MM/) && TX.viagem('VG-3122').janela === '17:00', 'M21: retificar janela em texto livre é recusado');
TX.fazer('retificar', { id: 'VG-3122', campo: 'janela', de: '17:00', para: '18:45', deTxt: '17:00', paraTxt: '18:45', motivo: 'motorista atrasou' });
confere(TX.viagem('VG-3122').janela === '18:45', 'M21: janela HH:MM retificada');
TX.fazer('retificar', { id: 'VG-3122', campo: 'data', de: TX.HOJE, para: '2026-10-10', motivo: 'embarcador adiou a ordem' });
confere(TX.viagem('VG-3122').data === '2026-10-10' && TX.linhaDoTempo('VG-3122').some(e => /Retificação de data/.test(e.texto)), 'M21: data de carregamento se retifica com registro');
TX.fazer('retificar', { id: 'VG-3122', campo: 'destinatario', de: 'de-nutrimax', para: 'de-solo', deTxt: 'NutriMax', paraTxt: 'Solo Fértil', motivo: 'ordem corrigida pelo embarcador' });
confere(TX.viagem('VG-3122').assegurada === false && TX.decidir('VG-3122').resultado === 'nao_assegurada', 'M48: destinatário não certificado tira a declaração');

// M42: um rótulo de falha por checagem
TX.reset();
const motF = id => TX.decidir(id).falta[0].motivo;
confere(motF('VG-3121') === 'CRLV vencido no conjunto' && motF('VG-3126') === 'filial sem comunicação ao organismo certificador' && motF('VG-3127') === 'transportador em revisão após ocorrência grave' && motF('VG-3118') === 'carga anterior proibida', 'M42: motivo em forma de falha (' + [motF('VG-3121'), motF('VG-3126'), motF('VG-3127'), motF('VG-3118')].join(' / ') + ')');
confere(TX.db.viagens.every(v => TX.decidir(v).falta.every(f => typeof f.motivo === 'string' && f.motivo && f.motivo !== f.o)), 'M42: todo item de falta traz motivo diferente do nome da checagem');
confere(TX.rotuloFalha('docs-mot') === 'CNH vencida' && TX.rotuloFalha('ocorrencia') === 'transportador em revisão após ocorrência grave', 'M42: rotuloFalha também sem o item');

// M43: Manter bloqueio fecha o pedido
TX.reset(); TX.entrarComo('u-diego');
TX.fazer('pedirLiberacao', { id: 'VG-3121', checagem: 'docs-conj', alcada: 'qualidade', nota: 'CRLV pago' });
TX.entrarComo('u-rafael');
TX.fazer('manterBloqueio', { id: 'VG-3121', checagem: 'docs-conj', motivo: 'Sem comprovante do Detran', acao: 'Trocar o conjunto' });
const lm = TX.liberacaoDe(TX.viagem('VG-3121'));
confere(lm.mantido && !lm.pedido && /Bloqueio mantido por Rafael Antunes: trocar o conjunto/.test(lm.decisao), 'M43: decisão visível (' + lm.decisao + ')');
confere(!TX.filaAssinatura().minhas.some(x => x.viagem.id === 'VG-3121') && !TX.filaAssinatura(TX.usuario('u-luiz')).minhas.some(x => x.viagem.id === 'VG-3121'), 'M43: bloqueio mantido sai da fila de assinatura');
confere(!TX.pode('manterBloqueio', 'VG-3121'), 'M43: não se mantém duas vezes o mesmo bloqueio');
TX.entrarComo('u-diego');
confere(!TX.pode('pedirLiberacao', 'VG-3121') && /mantido.*fato novo/.test(TX.porque('pedirLiberacao', 'VG-3121')), 'M43: sem fato novo, não se pede de novo');
confere(TX.linhaDoTempo('VG-3121').some(e => /Bloqueio mantido: Sem comprovante do Detran\. Ação indicada: Trocar o conjunto/.test(e.texto)), 'M43: linha do tempo traz a ação indicada');
TX.entrarComo('u-rafael');
TX.fazer('atualizarDocumento', { tipo: 'CRLV', ref: 'QHG 7L33', refNome: 'QHG 7L33', validade: '2026-09-30' });
TX.entrarComo('u-diego');
confere(TX.decidir('VG-3121').resultado === 'bloqueada' && TX.pode('pedirLiberacao', 'VG-3121'), 'M43: fato novo (outro documento) reabre o pedido');
TX.fazer('pedirLiberacao', { id: 'VG-3121', checagem: 'docs-conj', alcada: 'qualidade' });
confere(TX.filaAssinatura(TX.usuario('u-rafael')).minhas.some(x => x.viagem.id === 'VG-3121') && TX.liberacaoDe(TX.viagem('VG-3121')).pedido, 'M43: pedido novo volta à fila');

// M16: revogar liberação é evento novo
TX.reset(); TX.entrarComo('u-rafael');
TX.fazer('liberar', { id: 'VG-3121', registro: reg3121 });
confere(TX.decidir('VG-3121').porAutoridade && TX.pode('revogarLiberacao', 'VG-3121'), 'M16: liberação em vigor pode ser revogada por quem tem a alçada');
TX.fazer('revogarLiberacao', { id: 'VG-3121', checagem: 'docs-conj', motivo: 'Comprovante não confere com o Detran' });
confere(TX.decidir('VG-3121').resultado === 'bloqueada' && TX.viagem('VG-3121').liberacoes.length === 1 && TX.linhaDoTempo('VG-3121').some(e => /revogada/.test(e.texto)), 'M16: revogada, a viagem volta a bloqueada e a liberação continua no registro');

// M45: troca de conjunto com motorista novo zera o link
TX.reset(); TX.entrarComo('u-diego');
confere(TX.linkEstado(TX.viagem('VG-3118')).k === 'concluido', 'M45: VG-3118 começa com link concluído pelo Ademir');
TX.fazer('trocarConjunto', { id: 'VG-3118', conjunto: 'c-claudio', motivo: 'cama de frango no T-2' });
const v18 = TX.viagem('VG-3118');
confere(v18.motorista === 'p-claudio' && TX.linkEstado(v18).k === 'nao_enviado', 'M45: motorista novo, link volta a não enviado');
confere(v18.linksAnteriores.length === 1 && v18.linksAnteriores[0].motorista === 'p-ademir' && TX.linhaDoTempo(v18).some(e => /Ademir Kunz \(motorista anterior\)/.test(e.texto)), 'M45: envio anterior fica na linha do tempo em nome do motorista antigo');
confere(!TX.pode('linkCpf', 'VG-3118') && TX.pode('enviarLink', 'VG-3118'), 'M45: link antigo não vale; a ação vira Enviar link');
TX.entrarComo('u-rafael');
TX.fazer('enviarLink', { id: 'VG-3128', canal: 'copiado' });
TX.fazer('trocarConjunto', { id: 'VG-3128', conjunto: 'c-cerrado1', motorista: 'p-cicero', motivo: 'carreta na oficina' });
confere(TX.viagem('VG-3128').motorista === 'p-cicero' && TX.linkEstado(TX.viagem('VG-3128')).k === 'enviado', 'M45: mesmo motorista, o link continua enviado e as etapas recomeçam');

// M12 e M44: desfechos terminais e conciliação
TX.reset(); TX.entrarComo('u-diego');
confere(!TX.pode('carregarSemDeclaracao', 'VG-3116') && !TX.pode('carregarSemDeclaracao', 'VG-3129') && TX.pode('carregarSemDeclaracao', 'VG-3118'), 'M12: carregar sem declaração só para viagem de hoje ou passada que não ficou pronta');
TX.fazer('carregarSemDeclaracao', { id: 'VG-3118', motivo: 'Embarcador não esperou a troca do conjunto' });
const d18 = TX.decidir('VG-3118');
confere(d18.resultado === 'nao_assegurada' && d18.rotulo === 'Carregou sem declaração GMP+' && d18.semDeclaracao.resultadoAntes === 'tecnico' && /carga anterior proibida/.test(d18.semDeclaracao.faltava.join()), 'M12: desfecho registrado com o que faltava (' + d18.rotulo + ')');
confere(!TX.pode('carregarSemDeclaracao', 'VG-3118') && !TX.pendenciasRegistro('SOR').some(x => x.viagem.id === 'VG-3118') && TX.badges().hoje === TX.db.viagens.filter(v => v.data === TX.HOJE && v.filial === 'SOR' && !['pronta', 'nao_assegurada'].includes(TX.decidir(v).resultado)).length, 'M12: sai das pendências e da contagem do dia');
confere(TX.linhaDoTempo('VG-3118').some(e => /Carregou sem declaração GMP\+/.test(e.texto)), 'M12: linha do tempo mostra o desfecho');
// Viagens viram passadas por retificação de data: uma bloqueada e a que carregou sem declaração
TX.fazer('retificar', { id: 'VG-3121', campo: 'data', de: TX.HOJE, para: '2026-10-07', motivo: 'carregou ontem, registro atrasado' });
TX.fazer('retificar', { id: 'VG-3118', campo: 'data', de: TX.HOJE, para: '2026-10-07', motivo: 'carregou ontem, registro atrasado' });
const loteM44 = TX.loteCTe();
const l21 = loteM44.linhas.find(l => l.viagem === "VG-3121"), l18 = loteM44.linhas.find(l => l.viagem === "VG-3118"), l13 = loteM44.linhas.find(l => l.viagem === "VG-3113");
confere(l21 && l21.situacao.resultado === 'bloqueada' && /não estava pronta/.test(l21.situacao.alerta), 'M44: lote marca viagem que não estava pronta (' + (l21 && l21.situacao.alerta) + ')');
confere(l18 && !l18.situacao.alerta && /sem a declaração/.test(l18.situacao.esperado), 'M44: viagem que carregou sem declaração espera CT-e sem a frase');
confere(l13 && l13.situacao.pronta && l13.situacao.porAutoridade && !l13.situacao.alerta, 'M44: liberada por autoridade concilia sem alerta');
TX.fazer("conciliarCTe", { arquivo: loteM44.arquivo, linhas: loteM44.linhas.filter(l => l.casou) });
confere(TX.viagem('VG-3121').cte.decisao.resultado === 'bloqueada' && /DACTE/.test(TX.viagem('VG-3121').cte.alerta), 'M44: a decisão na hora da conciliação fica gravada no CT-e');
confere(TX.pendenciasRegistro('SOR').some(x => x.viagem.id === 'VG-3121' && x.itens.some(i => i.k === 'cte-nao-pronta')), 'M44: CT-e de viagem não pronta entra nas pendências da qualidade');
confere(TX.linhaDoTempo('VG-3121').some(e => e.tipo === 'alerta' && /CT-e .*DACTE/.test(e.texto)), 'M44: linha do tempo do CT-e traz o alerta');

// M46: regra de foto por item
TX.reset(); TX.entrarComo('u-diego');
TX.fazer('enviarLink', { id: 'VG-3122', canal: 'copiado' });
const t3b = {}; TX.compsDoConjunto('c-claudio').forEach(c => { t3b[c.key] = [{ data: '2026-10-04', produto: 'soja' }, { data: '2026-09-28', produto: 'milho' }, { data: '2026-09-20', produto: 'soja' }]; });
for (const [op, d] of [['linkCpf', {}], ['linkT3', { t3: t3b }], ['linkChecklist', { itens: { lona: 'ok', correntes: 'ok', cintas: 'ok', carroceria: 'ok', interior: 'ok' }, fotos: { lona: 1, correntes: 1, cintas: 0, carroceria: 1, interior: 1 } }], ['linkManual', { versao: '3.2' }], ['linkAssinar', { versao: '2026.1' }]])
  TX.fazer(op, Object.assign({ id: 'VG-3122', porMotorista: true }, d));
TX.fazer('conferir', { id: 'VG-3122', decisao: 'aprovar' });
const d22 = TX.decidir('VG-3122');
confere(d22.resultado === 'falta' && d22.falta.length === 1 && d22.falta[0].k === 'fotos' && /cintas/.test(d22.falta[0].detalhe), 'M46: item sem foto trava a viagem com a regra em bloqueio');
TX.entrarComo('u-rafael');
TX.fazer('classeRegra', { regra: 'fotos', classe: 'alerta', motivo: 'Piloto: foto de cinta opcional' });
const d22b = TX.decidir('VG-3122');
confere(d22b.resultado === 'pronta' && d22b.alertas.some(a => a.k === 'fotos'), 'M46: com a regra em alerta, a viagem fica pronta com 1 alerta');
confere(tenta(() => TX.fazer('classeRegra', { regra: 't3', classe: 'alerta', motivo: 'tentativa de relaxar norma' }), /norma/), 'Regras de norma ficam travadas no motor');

// M47: mudar a regra não reescreve decisão passada
TX.reset(); TX.entrarComo('u-rafael');
const antes13 = TX.decidir('VG-3113');
TX.fazer('classeRegra', { regra: 'docs', classe: 'alerta', motivo: 'Teste: documentos só alertam' });
const depois13 = TX.decidir('VG-3113');
confere(antes13.porAutoridade && depois13.porAutoridade && depois13.rotulo === 'Liberada por autoridade', 'M47: VG-3113 (07/10) continua liberada por autoridade depois da regra virar alerta');
confere(TX.classeRegra('docs') === 'alerta' && TX.classeRegra('docs', '2026-10-07T23:59') === 'bloqueio' && TX.db.config.regras.find(r => r.k === 'docs').historico.length === 2, 'M47: histórico da regra guarda desde quando cada classe vale');
const d21 = TX.decidir('VG-3121');
confere(d21.resultado === 'pronta' && !d21.porAutoridade && d21.alertas.length === 1 && d21.alertas[0].motivo === 'CRLV vencido no conjunto', 'M47: viagem de hoje segue a regra nova, com o alerta escrito (M11, M24)');
TX.fazer('classeRegra', { regra: 'docs', classe: 'bloqueio', motivo: 'Fim do teste' });
confere(TX.decidir('VG-3121').resultado === 'bloqueada' && TX.decidir('VG-3113').porAutoridade, 'M47: regra de volta a bloqueio');

// M31: registro da amostra de auditoria
TX.reset();
const ra13 = TX.registroAuditoria('VG-3113'), linha = (r, k) => (r.linhas.find(x => x[0] === k) || [])[1] || '';
confere(/CNH de Ivo/.test(linha(ra13, 'Liberação por autoridade')) && /Rafael Antunes/.test(linha(ra13, 'Liberação por autoridade')) && /Gestor da qualidade/.test(linha(ra13, 'Liberação por autoridade')), 'M31: amostra traz a liberação por autoridade (' + linha(ra13, 'Liberação por autoridade') + ')');
confere(ra13.liberacoes[0].campos.length >= 9 && ra13.liberacoes[0].campos.some(c => c[0] === 'Evidência' && /884512/.test(c[1])), 'M31: registro de 9 campos da liberação');
confere(/v3\.2 .*vigente/.test(linha(ra13, 'Ciência do manual')), 'M31: ciência do manual com a versão (' + linha(ra13, 'Ciência do manual') + ')');
const ra16 = TX.registroAuditoria('VG-3116');
confere(/Lavador Posto Trevo/.test(linha(ra16, 'Limpeza')) && /LPT 2210/.test(linha(ra16, 'Limpeza')) && ra16.limpezas[0].lavadorCnpj, 'M31: limpeza com lavador e comprovante (' + linha(ra16, 'Limpeza') + ')');
confere(ra16.linhas.every(x => !/\bhoje\b|\bontem\b/.test(x[1])), 'M26: registro exportado só com datas absolutas');
confere(/018240/.test(linha(TX.registroAuditoria('VG-3105'), 'DACTE')) && /assegurado GMP\+FSA/.test(linha(TX.registroAuditoria('VG-3105'), 'DACTE')), 'M31: DACTE com a declaração em viagem pronta');

// Integrações que não consultam nada não aparecem como ativas (M38)
confere(TX.db.config.integracoes.filter(i => i.k === 'antt' || i.k === 'gmp').every(i => i.estado === 'planejado'), 'M38: ANTT e base GMP+ como planejadas');
TX.reset(); TX.entrarComo('u-rafael');

console.log('\n' + ok + ' conferências passaram, ' + falhas + ' falharam.');
process.exit(falhas ? 1 : 0);
