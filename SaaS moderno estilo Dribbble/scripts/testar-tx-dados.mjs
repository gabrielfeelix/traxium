// Confere a coerência da base comum do protótipo v2 (tx-dados.js).
// Uso: node "SaaS moderno estilo Dribbble/scripts/testar-tx-dados.mjs"
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
const TX = require(path.join(aqui, '..', 'tx-dados.js'));

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

// F3: liberação por autoridade (documento) e alçada
TX.entrarComo('u-rafael');
const reg = { checagem: 'docs-conj', motivo: 'Licenciamento pago, aguardando CRLV digital', justificativa: 'Comprovante de pagamento do licenciamento 2026 apresentado.', alcada: 'qualidade', alcadaNome: 'Gestor da qualidade', risco: 'Baixo', validade: 'Somente esta viagem', evidencia: 'boleto.pdf', escopo: 'Só a VG-3121', ciencia: true };
TX.fazer('liberar', { id: 'VG-3121', registro: reg });
const d3121 = TX.decidir('VG-3121');
confere(d3121.resultado === 'pronta' && d3121.porAutoridade, 'F3: VG-3121 pronta por autoridade');
confere(d3121.checagens.find(c => c.k === 'docs-conj').estado === 'bloqueio', 'F3: o motor continua reprovando a regra liberada');
// Bloqueio técnico não aceita liberação
TX.fazer('liberar', { id: 'VG-3118', registro: Object.assign({}, reg, { checagem: 'regime' }) });
confere(TX.decidir('VG-3118').resultado === 'tecnico', 'F3: bloqueio técnico ignora liberação por autoridade');
TX.fazer('regularizar', { id: 'VG-3118', comp: 'RAD 3K20#C1', opcao: 'A', inspetor: 'Carlos Menegat', entidade: 'Inspeção independente credenciada', laudo: 'LI-2026-0931' });
confere(TX.decidir('VG-3118').resultado === 'pronta', 'F3: regularização TS1.9 opção A resolve o bloqueio técnico');
// Filial e ocorrência
TX.fazer('comunicarOC', { filial: 'PNG', data: '2026-10-08', protocolo: 'OC-GK-2026-1008' });
confere(TX.decidir('VG-3126').resultado === 'pronta', 'TS1.2: comunicação ao OC libera a viagem de Paranaguá');
TX.entrarComo('u-luiz');
TX.fazer('revisarTransportador', { transportador: 'e-lima', motivo: 'Treinamento de limpeza refeito e inspeção da carreta aprovada' });
confere(TX.decidir('VG-3127').resultado === 'pronta', 'F6: revisão da ocorrência grave reabilita a Lima');
// Criação de viagem com TAC novo
TX.entrarComo('u-diego');
const novo = TX.fazer('criarViagem', { filial: 'SOR', produto: 'farelo-soja', peso: 37, embarcador: 'em-agrosorriso', destinatario: 'de-nutrimax', data: TX.HOJE, janela: '18:30', ordem: 'OC 48140', origemOrdem: 'pdf', novoTAC: { nome: 'Teodoro Lins', telefone: '(66) 99100-2030', cpf: '11122233396', placas: ['RZZ 1A11', 'RZZ 1A12'] } });
const vn = TX.viagem(novo);
confere(!!vn && vn.assegurada && TX.placa('RZZ 1A12') && TX.decidir(vn).resultado === 'falta', 'F1: viagem nova com cadastro mínimo de TAC (' + novo + ')');
confere(TX.decidir(vn).falta.some(f => f.k === 'docs-mot' && f.quem === 'Motorista pelo link'), 'F1: documentos do TAC novo são pedidos pelo link');
// Conciliação de CT-e em lote
const l2 = TX.loteCTe();
TX.fazer('conciliarCTe', { arquivo: l2.arquivo, linhas: l2.linhas.filter(x => x.casou) });
confere(db.viagens.length > 0 && TX.db.viagens.filter(v => !v.cancelada && v.data < TX.HOJE && !v.cte).length === 0, 'F1: conciliação em lote cobre todas as viagens carregadas');
confere(TX.ciclo(TX.viagem('VG-3110')).k === 'concluida', 'VG-3110 concluída sozinha (CT-e conciliado e descarga passada)');
TX.reset();
confere(TX.decidir('VG-3121').resultado === 'bloqueada' && !TX.viagem(novo), 'reset volta à semente');

console.log('\n' + ok + ' conferências passaram, ' + falhas + ' falharam.');
process.exit(falhas ? 1 : 0);
