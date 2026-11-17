'use client';
/*
 * Protótipo mobile: o link do motorista (/link?id=...) dentro de um celular de 390 x 844,
 * ao lado do roteiro das etapas, do que a filial vê e dos eventos que chegam ao escritório.
 *
 * O celular é um iframe da página real do motorista: é a mesma tela que vai pelo WhatsApp.
 * Os dois lados conversam por postMessage (ver o topo de src/telas/LinkDaViagem.jsx).
 * Os dados são os do protótipo (localStorage 'tx-v2'), então o que o motorista faz aqui
 * aparece em Hoje e na Viagem na hora.
 */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import TXmod from '@/lib/tx/tx-ui';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TX: any = TXmod;

type Op = { tipo: string; dados?: Record<string, unknown> };
type Passo = { k: string; n: string; feito: boolean };
type Estado = { id: string; enviado: boolean; passo: string; passos: Passo[]; offline: boolean; fila: number; camera: boolean };

// Viagens de exemplo, uma por situação. "preparo" aplica o que a semente não tem.
const CENARIOS: { k: string; id: string; t: string; sub: string; preparo?: Op[] }[] = [
  { k: 'novo', id: 'VG-3123', t: 'Link recém-chegado', sub: 'Começa com o link enviado e ainda não aberto. Conjunto com duas carretas.' },
  { k: 'meio', id: 'VG-3119', t: 'Parou no meio', sub: 'Começa com CPF e cargas enviados e o checklist com 2 de 5 fotos.' },
  {
    k: 'doc', id: 'VG-3130', t: 'CNH vencida', sub: 'Começa com a CNH do motorista vencida: o link pede a foto da nova.',
    preparo: [
      { tipo: 'enviarLink', dados: { id: 'VG-3130', canal: 'whatsapp' } },
      { tipo: 'atualizarDocumento', dados: { tipo: 'CNH', ref: 'p-luciano', refNome: 'Luciano Farias', validade: '2026-09-30' } },
    ],
  },
  { k: 'devolvido', id: 'VG-3125', t: 'Foto devolvida', sub: 'Começa com a filial pedindo a foto da lona de novo.' },
  { k: 'completo', id: 'VG-3120', t: 'Tudo enviado', sub: 'Começa com o link concluído, esperando a conferência da filial.' },
];

// O que cada etapa é, para o motorista e para a filial, e o evento que vai ao back-end.
const ETAPAS: Record<string, { mot: string; fil: string; ev: string }> = {
  nao_enviado: {
    mot: 'Nada ainda: o link só chega quando o afretador envia a mensagem pelo WhatsApp. Aqui há um botão para simular o envio.',
    fil: 'Em Hoje, a viagem aparece com "link não enviado" e a ação de enviar.',
    ev: 'enviarLink',
  },
  capa: {
    mot: 'Quem mandou o link, a carga, as placas e as etapas. Se já começou, vê o que foi feito, com a hora, e continua de onde parou.',
    fil: 'Ao abrir, a viagem passa de "link enviado" para "aberto pelo motorista" na mesa.',
    ev: 'linkAberto',
  },
  id: {
    mot: 'Digita os 3 primeiros números do CPF e confere as placas do conjunto. Placa errada: o link pede para parar e avisar o afretador.',
    fil: 'Identidade e placas confirmadas, com a hora, na linha do tempo da viagem.',
    ev: 'linkCpf',
  },
  docs: {
    mot: 'Só aparece quando falta ou venceu CNH, RNTRC ou CRLV. Tira foto do documento em dia ou escolhe mandar depois.',
    fil: 'O documento entra no cadastro com origem "link" e a checagem de documentos é refeita. Se ficou para depois, a viagem segue bloqueada por documento.',
    ev: 'linkDocs',
  },
  t3: {
    mot: 'Informa as 3 últimas cargas de cada compartimento. Quando o sistema já conhece o histórico, vem preenchido para conferir.',
    fil: 'A base IDTF classifica cada carga: proibida bloqueia; regime B, C ou D pede limpeza com comprovante.',
    ev: 'linkT3',
  },
  check: {
    mot: 'Cinco itens com Sim ou Não e uma foto de câmera por item, com hora e local. Resposta Não abre o que fazer e um campo para contar.',
    fil: 'As fotos chegam para o afretador aprovar ou devolver com motivo. Devolvida, o link mostra só o item pedido.',
    ev: 'linkChecklist',
  },
  manual: {
    mot: 'Lê o manual de boas práticas em 5 cartões e confirma que entendeu.',
    fil: 'Ciência da versão vigente do manual, com a hora.',
    ev: 'linkManual',
  },
  termo: {
    mot: 'Lê o termo de compromisso e assina com o dedo. Só para transportador sem certificado GMP+ (gatekeeper).',
    fil: 'Termo assinado com versão e hora. Com ele, o link fica completo.',
    ev: 'linkAssinar',
  },
  fim: {
    mot: 'Confirmação do envio e o que acontece depois. Sem sinal, mostra que ficou guardado no celular. Documento adiado aparece como pendente.',
    fil: 'Link "enviado pelo motorista". A viagem vai para a conferência das fotos e para a decisão do sistema.',
    ev: 'nenhum novo',
  },
};

const OPS_DO_LINK = ['enviarLink', 'linkAberto', 'linkCpf', 'linkDocs', 'linkT3', 'linkChecklist', 'linkManual', 'linkAssinar', 'conferir'];

function lerLS(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
function gravarLS(k: string, v: string | null) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* sem armazenamento */ } }

function preparar(c: (typeof CENARIOS)[number]) {
  if (!c.preparo) return;
  const ja = TX.ops.some((o: Op) => o.dados && o.dados.cenario === c.id);
  if (ja) return;
  c.preparo.forEach(o => TX.fazer(o.tipo, Object.assign({ cenario: c.id }, o.dados)));
}

// Tira do log tudo o que o link e a conferência gravaram nesta viagem e o que o cenário preparou.
function reiniciar(c: (typeof CENARIOS)[number]) {
  try {
    const raw = JSON.parse(lerLS('tx-v2') || 'null');
    if (raw && Array.isArray(raw.ops)) {
      raw.ops = raw.ops.filter((o: Op) => {
        const d = o.dados || {};
        if (d.cenario === c.id) return false;
        return !(d.id === c.id && OPS_DO_LINK.includes(o.tipo));
      });
      gravarLS('tx-v2', JSON.stringify(raw));
    }
  } catch { /* log ilegível: recarregar resolve */ }
  gravarLS('tx-v2-fila-' + c.id, null);
  gravarLS('tx-v2-rascunho-' + c.id, null);
  TX.recarregar();
  preparar(c);
}

const ALTURA_TELA = 844;
const LARGURA_TELA = 390;
const BORDA = 12;

export function PrototipoMobile() {
  const [cen, setCen] = useState(() => {
    const k = lerLS('tx-mobile-cenario');
    return CENARIOS.find(c => c.k === k) || CENARIOS[0];
  });
  const [recarga, setRecarga] = useState(0);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [, setVersao] = useState(0);
  const [escala, setEscala] = useState(1);
  const frame = useRef<HTMLIFrameElement>(null);
  const palco = useRef<HTMLDivElement>(null);

  // Aviso no toast da moldura.
  const avisar = (m: string) => window.dispatchEvent(new CustomEvent('tx-aviso', { detail: m }));

  // Prepara os cenários (só o que a semente não tem, uma vez) antes de o celular abrir a viagem.
  useEffect(() => { CENARIOS.forEach(preparar); }, []);
  useEffect(() => { preparar(cen); gravarLS('tx-mobile-cenario', cen.k); }, [cen]);

  useEffect(() => {
    const off = TX.ouvir((v: number) => setVersao(v));
    const msg = (e: MessageEvent) => {
      if (e.origin !== location.origin || !e.data || e.data.tx !== 'link-estado') return;
      if (frame.current && e.source !== frame.current.contentWindow) return;
      setEstado(e.data as Estado);
      setVersao(x => x + 1);
    };
    window.addEventListener('message', msg);
    return () => { off(); window.removeEventListener('message', msg); };
  }, []);

  // O celular cabe na altura da janela: abaixo disso, encolhe por inteiro (nunca corta a tela).
  useEffect(() => {
    const medir = () => {
      const el = palco.current;
      if (!el) return;
      const topo = el.getBoundingClientRect().top + (el.closest('[data-tx-conteudo]')?.scrollTop || 0);
      const livre = window.innerHeight - Math.max(topo, 96) - 24;
      setEscala(Math.max(0.62, Math.min(1, livre / (ALTURA_TELA + BORDA * 2))));
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const enviarAoCelular = (m: Record<string, unknown>) => frame.current?.contentWindow?.postMessage(m, location.origin);
  const escolher = (c: (typeof CENARIOS)[number]) => {
    if (c.k === cen.k) return;
    setEstado(null);
    setCen(c);
  };
  const reiniciarLink = () => {
    reiniciar(cen);
    setEstado(null);
    setRecarga(x => x + 1);
    avisar('Link de ' + cen.id + ' voltou ao começo do exemplo. A mesa da filial já mostra.');
  };

  const v = TX.viagem(cen.id);
  const mot = TX.pessoa(v.motorista);
  const le = TX.linkEstado(v);
  const passoAtual = estado && estado.id === cen.id ? estado.passo : null;
  const passos = estado && estado.id === cen.id ? estado.passos : [];
  const info = ETAPAS[passoAtual || 'capa'];
  const eventos = TX.db.eventos.filter((e: { viagem: string }) => e.viagem === cen.id).slice(-6).reverse();
  const offline = !!(estado && estado.offline);
  const fila = estado ? estado.fila : 0;
  const hora = TX.agoraHM();
  const altura = (ALTURA_TELA + BORDA * 2) * escala;
  const largura = (LARGURA_TELA + BORDA * 2) * escala;

  return (
    <div className="mb" data-tela="PrototipoMobile">
      <div className="mb-cab">
        <div>
          <h1 className="mb-tit">Protótipo mobile</h1>
          <div className="mb-sub">O link que o motorista recebe pelo WhatsApp, num celular. O que ele faz aqui chega na mesa da filial na hora.</div>
        </div>
        <div className="mb-cab-acoes">
          <a className="mb-bt mb-bt-sec" href={'/link?id=' + cen.id} target="_blank" rel="noopener">Abrir em outra aba</a>
          <button type="button" className="mb-bt mb-bt-sec" onClick={reiniciarLink} data-tx-reiniciar="">Reiniciar este link</button>
        </div>
      </div>

      <div className="mb-grade">
        <div className="mb-palco" ref={palco} style={{ width: largura, height: altura }}>
          <div className="mb-celular" style={{ transform: 'scale(' + escala + ')' }} data-tx-celular="">
            <div className="mb-tela">
              <div className="mb-status" data-k={estado && estado.camera ? 'camera' : undefined}>
                <span className="mb-status-hora">{hora}</span>
                <span className="mb-camera-furo" aria-hidden />
                <span className="mb-status-ic" aria-label={offline ? 'sem sinal' : 'com sinal'}>
                  <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
                    {[0, 1, 2, 3].map(i => <rect key={i} x={i * 4.5} y={9 - i * 3} width="3" height={3 + i * 3} rx="1" fill="currentColor" opacity={offline && i > 0 ? 0.3 : 1} />)}
                  </svg>
                  {offline ? <span className="mb-status-x">sem sinal</span> : <span>4G</span>}
                  <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden><rect x=".5" y=".5" width="20" height="11" rx="3" fill="none" stroke="currentColor" opacity=".6" /><rect x="2" y="2" width="14" height="8" rx="1.6" fill="currentColor" /><rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".6" /></svg>
                </span>
              </div>
              <iframe
                key={cen.id + '-' + recarga}
                ref={frame}
                src={'/link?id=' + cen.id}
                title={'Link da viagem ' + cen.id + ' no celular do motorista'}
                className="mb-iframe"
                data-tx-iframe=""
              />
              <div className="mb-gesto" aria-hidden><span /></div>
            </div>
          </div>
        </div>

        <div className="mb-painel">
          <section className="mb-cartao" aria-labelledby="mb-cen-t">
            <div className="mb-cartao-cab">
              <h2 id="mb-cen-t" className="mb-h2">Viagem de exemplo</h2>
              <span className="mb-dica">cada uma em uma situação</span>
            </div>
            <div className="mb-cenarios" role="radiogroup" aria-labelledby="mb-cen-t">
              {CENARIOS.map(c => {
                const on = c.k === cen.k;
                const vv = TX.viagem(c.id);
                const pp = TX.pessoa(vv.motorista);
                const e = TX.linkEstado(vv);
                return (
                  <button key={c.k} type="button" role="radio" aria-checked={on} className="mb-cenario" onClick={() => escolher(c)} data-tx-cenario={c.k}>
                    <span className="mb-radio" aria-hidden />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="mb-cenario-t">{c.t}</span>
                      <span className="mb-cenario-sub">{c.sub}</span>
                      <span className="mb-cenario-meta"><span className="mb-mono">{c.id}</span>, {pp.nome}, CPF para testar: <strong className="mb-mono">{TX.soDigitos(pp.cpf).slice(0, 3)}</strong></span>
                    </span>
                    <span className="mb-estado" data-k={e.k}>{e.n}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-cartao" aria-labelledby="mb-pas-t">
            <div className="mb-cartao-cab">
              <h2 id="mb-pas-t" className="mb-h2">Etapas de {mot.nome.split(' ')[0]}</h2>
              <span className="mb-dica">tocar leva o celular até a etapa</span>
            </div>
            {passos.length ? (
              <ol className="mb-passos">
                {passos.map((p, i) => {
                  const atual = p.k === passoAtual;
                  return (
                    <li key={p.k}>
                      <button type="button" className="mb-passo" aria-current={atual ? 'step' : undefined} data-feito={p.feito ? '1' : undefined}
                        disabled={!estado?.enviado} onClick={() => enviarAoCelular({ tx: 'link-ir', passo: p.k })} data-tx-ir={p.k}>
                        <span className="mb-passo-n">{p.feito ? '✓' : i + 1}</span>
                        <span className="mb-passo-t">{p.n}</span>
                        {atual ? <span className="mb-passo-aqui">no celular agora</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="mb-dica" style={{ padding: '8px 0' }}>Abrindo o link no celular...</div>
            )}
            {estado && !estado.enviado ? <div className="mb-nota">Link ainda não enviado: use o botão no celular para simular o envio.</div> : null}
          </section>

          <section className="mb-cartao" aria-labelledby="mb-agora-t" data-tx-explica={passoAtual || ''}>
            <div className="mb-cartao-cab">
              <h2 id="mb-agora-t" className="mb-h2">Nesta etapa</h2>
              <span className="mb-evento">evento: <span className="mb-mono">{info.ev}</span></span>
            </div>
            <div className="mb-lados">
              <div>
                <div className="mb-rotulo">O motorista vê</div>
                <p className="mb-p">{info.mot}</p>
              </div>
              <div>
                <div className="mb-rotulo">A filial vê</div>
                <p className="mb-p">{info.fil}</p>
              </div>
            </div>
          </section>

          <section className="mb-cartao" aria-labelledby="mb-sinal-t">
            <div className="mb-cartao-cab">
              <h2 id="mb-sinal-t" className="mb-h2">Sinal do celular</h2>
              <button type="button" role="switch" aria-checked={!offline} className="mb-switch" onClick={() => enviarAoCelular({ tx: 'link-sinal', offline: !offline })} data-tx-mb-sinal="" disabled={!estado}>
                <span className="mb-switch-trilho" aria-hidden><span /></span>
                {offline ? 'Sem sinal' : 'Com sinal'}
              </button>
            </div>
            <p className="mb-p" style={{ marginTop: 4 }}>
              {offline
                ? fila
                  ? fila + (fila === 1 ? ' etapa guardada' : ' etapas guardadas') + ' no celular. Ligue o sinal para enviar e ver chegar na filial.'
                  : 'Sem sinal: o motorista continua e cada etapa enviada fica guardada no celular.'
                : 'Desligue para ver o que o motorista vê numa fila de balança sem cobertura.'}
            </p>
          </section>

          <section className="mb-cartao" aria-labelledby="mb-ev-t">
            <div className="mb-cartao-cab">
              <h2 id="mb-ev-t" className="mb-h2">Chegou no escritório</h2>
              <Link href={'/viagem?id=' + cen.id} className="mb-link" data-tx-abrir-viagem="">Abrir {cen.id} na Viagem</Link>
            </div>
            <div className="mb-dica" style={{ marginBottom: 8 }}>Situação na mesa: <strong>{le.n}</strong></div>
            {eventos.length ? (
              <ul className="mb-eventos">
                {eventos.map((e: { em: string; texto: string; motorista?: boolean }, i: number) => (
                  <li key={i} className="mb-ev" data-k={e.motorista ? 'mot' : undefined}>
                    <span className="mb-ev-h">{TX.fmt.quando(e.em)}</span>
                    <span>{e.texto}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mb-dica">Nenhum evento registrado nesta demonstração ainda. O que já veio na semente aparece na linha do tempo da Viagem.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
