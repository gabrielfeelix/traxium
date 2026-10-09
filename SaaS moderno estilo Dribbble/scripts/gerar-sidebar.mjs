// Gera, a partir de uma definição única, a sidebar, o bloco de perfil e os modais do topo
// das telas v2. Cada tela marca os pontos com <!-- TX:SIDEBAR -->...<!-- /TX:SIDEBAR -->,
// <!-- TX:PERFIL -->...<!-- /TX:PERFIL --> e <!-- TX:MODAIS -->...<!-- /TX:MODAIS -->.
// Uso: node scripts/gerar-sidebar.mjs            (reescreve os blocos)
//      node scripts/gerar-sidebar.mjs --conferir (só confere a assinatura em todas as telas)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pasta = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Tela -> item ativo. Telas de detalhe destacam o item pai, que continua sendo link.
export const TELAS = {
  'Hoje.dc.html': { ativo: 'hoje' },
  'Viagens v2.dc.html': { ativo: 'viagens' },
  'Viagem.dc.html': { ativo: 'viagens', detalhe: true },
  'Transportadores.dc.html': { ativo: 'transportadores' },
  'Frota.dc.html': { ativo: 'frota' },
  'Compartimento v2.dc.html': { ativo: 'frota', detalhe: true },
  'Auditoria.dc.html': { ativo: 'auditoria' },
  'Cadastros.dc.html': { ativo: 'cadastros' },
  'Configuracoes v2.dc.html': { ativo: 'config' }
};

const I = {
  hoje: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><rect x="2.5" y="3.2" width="11" height="10.3" rx="2.4"></rect><line x1="2.5" y1="6.6" x2="13.5" y2="6.6"></line><line x1="5.6" y1="1.8" x2="5.6" y2="4.2"></line><line x1="10.4" y1="1.8" x2="10.4" y2="4.2"></line><circle cx="8" cy="10" r="1.3" fill="currentColor" stroke="none"></circle></svg>',
  viagens: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M2.5 8h9"></path><path d="M8 4.5 11.5 8 8 11.5"></path></svg>',
  transportadores: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" style="flex:none"><circle cx="5.4" cy="6.2" r="2.4"></circle><circle cx="10.8" cy="6.2" r="2.4"></circle><path d="M2.5 13c.6-2 1.7-3 3-3s2.3 1 2.9 3" stroke-linecap="round"></path></svg>',
  frota: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" style="flex:none"><rect x="2" y="4.5" width="8" height="5.5" rx="1.4"></rect><path d="M10 6.5h2.4l1.6 2v1.5h-4z" stroke-linejoin="round"></path><circle cx="5" cy="11.8" r="1.4"></circle><circle cx="11.6" cy="11.8" r="1.4"></circle></svg>',
  auditoria: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" style="flex:none"><rect x="2.6" y="2.2" width="8" height="10.5" rx="1.8"></rect><line x1="4.8" y1="5.4" x2="8.4" y2="5.4"></line><line x1="4.8" y1="8" x2="7.2" y2="8"></line><circle cx="10.6" cy="10.4" r="2.3"></circle><line x1="12.3" y1="12.1" x2="14" y2="13.8"></line></svg>',
  cadastros: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" style="flex:none"><path d="M8 2.2 13.5 5 8 7.8 2.5 5z"></path><path d="M2.5 8 8 10.8 13.5 8" stroke-linecap="round"></path><path d="M2.5 11 8 13.8 13.5 11" stroke-linecap="round"></path></svg>',
  config: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" style="flex:none"><circle cx="8" cy="8" r="2.3"></circle><path d="M8 1.8v1.9M8 12.3v1.9M14.2 8h-1.9M3.7 8H1.8M12.4 3.6l-1.3 1.3M4.9 11.1l-1.3 1.3M12.4 12.4l-1.3-1.3M4.9 4.9 3.6 3.6" stroke-linecap="round"></path></svg>',
  link: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><rect x="3.5" y="1.8" width="9" height="12.4" rx="2"></rect><line x1="6.5" y1="4" x2="9.5" y2="4"></line><circle cx="8" cy="11.7" r=".65" fill="currentColor" stroke="none"></circle></svg>',
  anterior: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M2.6 8a5.4 5.4 0 1 0 1.6-3.8"></path><path d="M2.4 2.6v2.6H5"></path><path d="M8 5.2V8l1.9 1.3"></path></svg>'
};

export const PRINCIPAIS = [
  { k: 'hoje', n: 'Hoje', href: 'Hoje.dc.html', badge: 'sbHoje', badgeD: 'sbHojeD', badgeTip: 'viagens de hoje com pendência' },
  { k: 'viagens', n: 'Viagens', href: 'Viagens v2.dc.html' },
  { k: 'transportadores', n: 'Transportadores', href: 'Transportadores.dc.html', badge: 'sbTransp', badgeD: 'sbTranspD', badgeTip: 'documentos vencidos ou vencendo em 15 dias' },
  { k: 'frota', n: 'Frota própria', href: 'Frota.dc.html' },
  { k: 'auditoria', n: 'Auditoria', href: 'Auditoria.dc.html' }
];
export const CADASTROS = [
  { k: 'produtos', n: 'Produtos e regimes' },
  { k: 'manual', n: 'Manual e treinamentos' },
  { k: 'fornecedores', n: 'Fornecedores' },
  { k: 'filiais', n: 'Filiais' }
];
export const RODAPE = [
  { k: 'config', n: 'Configurações', href: 'Configuracoes v2.dc.html' },
  { k: 'link', n: 'Link do motorista', tag: 'demo', href: 'Link da Viagem.dc.html?id=VG-3122', novaAba: true, tip: 'Abre em outra aba a página que o motorista recebe pelo WhatsApp' },
  { k: 'anterior', n: 'Versão anterior', href: 'versao-anterior.html' }
];

const ESTILO_ATIVO = 'display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:11px;background:linear-gradient(90deg,rgba(26,158,147,.35),rgba(14,120,181,.28));border:1px solid rgba(255,255,255,.14);font-size:14px;font-weight:700;color:#fff';
const ESTILO_ITEM = 'display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:11px;border:1px solid transparent;color:rgba(255,255,255,.66);font-size:14px';
const HOVER = 'style-hover="background:rgba(255,255,255,.07);color:#fff"';

function item(def, ativo, detalhe) {
  const on = def.k === ativo;
  const badge = def.badge ? `<span title="${def.badgeTip}" data-tx-badge="${def.k}" style="margin-left:auto;display:{{ ${def.badgeD} }};background:rgba(255,255,255,.14);font-size:11.5px;font-weight:700;padding:1px 8px;border-radius:99px;font-family:'Spline Sans Mono',monospace">{{ ${def.badge} }}</span>` : '';
  const tag = def.tag ? `<span style="margin-left:auto;display:{{ navL }};font-size:10px;font-weight:700;letter-spacing:.4px;padding:1px 7px;border-radius:99px;border:1px solid rgba(255,255,255,.22);color:rgba(255,255,255,.7)">${def.tag}</span>` : '';
  const miolo = `${I[def.k]}<span data-tx-item="${def.k}" style="display:{{ navL }};white-space:nowrap">${def.n}</span>${badge}${tag}`;
  if (on && !detalhe) return `<div title="${def.n}" style="${ESTILO_ATIVO}">${miolo}</div>`;
  const estilo = on ? ESTILO_ATIVO : ESTILO_ITEM;
  const alvo = def.novaAba ? ' target="_blank" rel="noopener"' : '';
  return `<a href="${def.href}"${alvo} title="${def.tip || def.n}" style="${estilo}" ${on ? '' : HOVER}>${miolo}</a>`;
}

export function sidebar(ativo, detalhe) {
  const cadOn = ativo === 'cadastros';
  const subs = CADASTROS.map(s => `<a href="Cadastros.dc.html?aba=${s.k}" data-tx-sub="${s.k}" style="display:flex;align-items:center;gap:10px;padding:7px 12px 7px 39px;border-radius:9px;font-size:13px;font-weight:{{ sbc.${s.k}.fw }};color:{{ sbc.${s.k}.c }};background:{{ sbc.${s.k}.bg }}" style-hover="color:#fff;background:rgba(255,255,255,.06)"><span style="width:5px;height:5px;border-radius:99px;background:{{ sbc.${s.k}.dot }};flex:none"></span>${s.n}</a>`).join('\n          ');
  return `
  <div data-tx-sidebar style="width:{{ navW }};flex:none;background:linear-gradient(178deg,#093D44,#0A4650);color:#fff;display:flex;flex-direction:column;padding:22px {{ navPad }};position:sticky;top:0;height:100vh;transition:width .25s ease;overflow-x:hidden;overflow-y:auto;z-index:20">
    <a href="Hoje.dc.html" title="Traxium: ir para Hoje" style="display:flex;align-items:center;gap:10px;padding:4px 8px 20px;color:#fff">
      <svg width="34" height="34" viewBox="0 0 32 32" style="flex:none"><defs><linearGradient id="txLogo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a9e93"></stop><stop offset="1" stop-color="#0E78B5"></stop></linearGradient></defs><polygon points="16,2.5 27.5,9 27.5,23 16,29.5 4.5,23 4.5,9" fill="url(#txLogo)"></polygon><polyline points="9,20 13,13 18,17 23,10" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline><circle cx="9" cy="20" r="1.6" fill="#fff"></circle><circle cx="13" cy="13" r="1.6" fill="#fff"></circle><circle cx="18" cy="17" r="1.6" fill="#fff"></circle><circle cx="23" cy="10" r="1.6" fill="#fff"></circle></svg>
      <div style="display:{{ navL }}"><div style="font-weight:800;font-size:17px;letter-spacing:.2px">Traxium</div><div style="font-size:10.5px;letter-spacing:1.6px;color:rgba(255,255,255,.5);text-transform:uppercase;white-space:nowrap">{{ tenantNome }}</div></div>
    </a>
    <div style="display:flex;flex-direction:column;gap:3px">
      ${PRINCIPAIS.map(d => item(d, ativo, detalhe)).join('\n      ')}
    </div>
    <div style="margin-top:14px;display:flex;flex-direction:column;gap:2px">
      <div onClick="{{ cadToggle }}" title="Cadastros" style="${cadOn ? ESTILO_ATIVO : ESTILO_ITEM};cursor:pointer" ${cadOn ? '' : HOVER}>${I.cadastros}<span data-tx-item="cadastros" style="display:{{ navL }};white-space:nowrap">Cadastros</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-left:auto;display:{{ navL }};transform:{{ cadChev }};transition:transform .2s;opacity:.7"><path d="M4.5 2.5 8 6l-3.5 3.5"></path></svg></div>
      <sc-if value="{{ cadOpen }}" hint-placeholder-val="{{ false }}">
        <div style="display:flex;flex-direction:column;gap:1px;margin-top:2px">
          ${subs}
        </div>
      </sc-if>
    </div>
    <div style="margin-top:auto;padding-top:18px;display:flex;flex-direction:column;gap:2px">
      ${RODAPE.map(d => item(d, ativo, detalhe)).join('\n      ')}
      <div onClick="{{ navToggle }}" title="Recolher ou expandir o menu" style="display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:11px;cursor:pointer;font-size:13px;font-weight:600;color:rgba(255,255,255,.55)" style-hover="background:rgba(255,255,255,.08);color:#fff"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="transform:{{ navFlip }};transition:transform .25s;flex:none"><path d="M9.5 3 4.5 8l5 5"></path><line x1="12" y1="3" x2="12" y2="13"></line></svg><span style="display:{{ navL }};white-space:nowrap">Recolher menu</span></div>
      <div style="display:{{ navL }};margin-top:10px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);padding:12px 14px">
        <div style="font-size:11.5px;color:rgba(255,255,255,.5)">Base IDTF mantida pela Traxium</div>
        <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;margin-top:5px"><span style="width:8px;height:8px;border-radius:99px;background:#3ddc97;box-shadow:0 0 0 4px rgba(61,220,151,.18)"></span>{{ baseVersao }} vigente</div>
      </div>
    </div>
  </div>
  `;
}

export const PERFIL = `
        <div data-tx-pop style="position:relative">
          <div onClick="{{ onPerfil }}" title="{{ uNome }}" data-tx-avatar style="width:38px;height:38px;border-radius:99px;background:linear-gradient(135deg,{{ uG1 }},{{ uG2 }});color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13.5px;box-shadow:0 0 0 3px #fff,0 0 0 4.5px #d8e4e2;cursor:pointer" style-hover="box-shadow:0 0 0 3px #fff,0 0 0 4.5px #127670">{{ uIni }}</div>
          <sc-if value="{{ perfilOpen }}" hint-placeholder-val="{{ false }}">
            <div style="position:absolute;right:0;top:48px;background:#fff;border:1px solid #e4eae8;border-radius:16px;box-shadow:0 16px 40px rgba(9,61,68,.16);padding:6px;width:268px;z-index:80;display:flex;flex-direction:column">
              <div style="display:flex;align-items:center;gap:11px;padding:11px 12px;border-bottom:1px solid #f0f4f3;margin-bottom:4px">
                <span style="width:38px;height:38px;border-radius:99px;background:linear-gradient(135deg,{{ uG1 }},{{ uG2 }});color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none">{{ uIni }}</span>
                <div style="min-width:0"><div style="font-size:13.5px;font-weight:800">{{ uNome }}</div><div style="font-size:11.5px;color:#5c706e">{{ uCargo }}</div></div>
              </div>
              <div onClick="{{ abrirPerfil }}" style="font-size:13px;font-weight:600;padding:9px 12px;border-radius:9px;cursor:pointer" style-hover="background:#f6f9f8">Meu perfil</div>
              <div onClick="{{ abrirPrefs }}" style="font-size:13px;font-weight:600;padding:9px 12px;border-radius:9px;cursor:pointer" style-hover="background:#f6f9f8">Avisos</div>
              <div onClick="{{ abrirEntrar }}" style="font-size:13px;font-weight:600;padding:9px 12px;border-radius:9px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px" style-hover="background:#f6f9f8">Entrar como<span style="font-size:10.5px;font-weight:700;color:#0C5862;border:1px solid #cfe3e1;border-radius:99px;padding:1px 9px;white-space:nowrap">{{ uPapel }}</span></div>
              <div style="height:1px;background:#f0f4f3;margin:5px 8px"></div>
              <div onClick="{{ abrirSair }}" style="font-size:13px;font-weight:600;padding:9px 12px;border-radius:9px;cursor:pointer;color:#c43d3d" style-hover="background:#fdf6f6">Sair</div>
            </div>
          </sc-if>
        </div>
`;

const FECHAR = (acao) => `<span onClick="{{ ${acao} }}" title="Fechar" style="margin-left:auto;width:32px;height:32px;border-radius:99px;background:#f0f4f3;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;flex:none" style-hover="background:#e4ebe9">✕</span>`;
const OVERLAY = (acao) => `<div onClick="{{ ${acao} }}" style="position:fixed;inset:0;background:rgba(9,34,36,.45);backdrop-filter:blur(3px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:32px">`;

export const MODAIS = `
  <sc-if value="{{ modalPerfil }}" hint-placeholder-val="{{ false }}">
    ${OVERLAY('fecharModalTopo')}
      <div onClick="{{ pararClique }}" style="background:#fff;border-radius:24px;width:470px;box-shadow:0 40px 100px rgba(9,34,36,.4);padding:26px 28px">
        <div style="display:flex;align-items:center"><div style="font-size:16px;font-weight:800">Meu perfil</div>${FECHAR('fecharModalTopo')}</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:14px">
          <span style="width:72px;height:72px;border-radius:99px;background:linear-gradient(135deg,{{ uG1 }},{{ uG2 }});color:#fff;font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #fff,0 0 0 6px #e4eae8">{{ uIni }}</span>
          <div style="font-size:17px;font-weight:800;margin-top:4px">{{ uNome }}</div>
          <div style="font-size:12.5px;color:#5c706e">{{ uEmail }}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:18px">
          <div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;background:#f7faf9;border-radius:12px;padding:10px 14px"><span style="color:#5c706e">Papel</span><span style="font-weight:700;text-align:right">{{ uCargo }}</span></div>
          <div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;background:#f7faf9;border-radius:12px;padding:10px 14px"><span style="color:#5c706e">Escopo</span><span style="font-weight:700;text-align:right">{{ uFiliais }}</span></div>
          <div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;background:#f7faf9;border-radius:12px;padding:10px 14px"><span style="color:#5c706e">Alçada de liberação</span><span style="font-weight:700;text-align:right">{{ uAlcada }}</span></div>
          <div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;background:#f7faf9;border-radius:12px;padding:10px 14px"><span style="color:#5c706e">Liberações assinadas</span><span style="font-family:'Spline Sans Mono',monospace;font-weight:600">{{ uAssinadas }}</span></div>
        </div>
        <div style="font-size:12px;color:#5c706e;margin-top:12px;line-height:1.55">{{ uAlcadaSub }}</div>
      </div>
    </div>
  </sc-if>
  <sc-if value="{{ modalPrefs }}" hint-placeholder-val="{{ false }}">
    ${OVERLAY('fecharModalTopo')}
      <div onClick="{{ pararClique }}" style="background:#fff;border-radius:24px;width:520px;box-shadow:0 40px 100px rgba(9,34,36,.4);padding:26px 28px">
        <div style="display:flex;align-items:center"><div style="font-size:16px;font-weight:800">Avisos</div>${FECHAR('fecharModalTopo')}</div>
        <div style="font-size:12.5px;color:#5c706e;margin-top:3px">O que chega para você, na tela e no celular.</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:14px">
          <sc-for list="{{ prefs }}" as="pf" hint-placeholder-count="4">
            <div onClick="{{ pf.onClick }}" style="display:flex;align-items:center;gap:12px;border:1px solid #eef2f1;border-radius:14px;padding:12px 14px;cursor:pointer" style-hover="border-color:#c9d5d3">
              <div style="flex:1"><div style="font-size:13.5px;font-weight:700">{{ pf.t }}</div><div style="font-size:11.5px;color:#5c706e">{{ pf.sub }}</div></div>
              <span style="width:40px;height:23px;border-radius:99px;background:{{ pf.swBg }};position:relative;flex:none;transition:background .2s"><span style="position:absolute;top:2.5px;left:{{ pf.swPos }};width:18px;height:18px;border-radius:99px;background:#fff;box-shadow:0 1px 4px rgba(9,34,36,.25);transition:left .2s"></span></span>
            </div>
          </sc-for>
        </div>
      </div>
    </div>
  </sc-if>
  <sc-if value="{{ modalEntrar }}" hint-placeholder-val="{{ false }}">
    ${OVERLAY('fecharModalTopo')}
      <div onClick="{{ pararClique }}" style="background:#fff;border-radius:24px;width:540px;max-height:88vh;overflow:auto;box-shadow:0 40px 100px rgba(9,34,36,.4);padding:26px 28px">
        <div style="display:flex;align-items:center"><div style="font-size:16px;font-weight:800">{{ entrarTitulo }}</div>${FECHAR('fecharModalTopo')}</div>
        <div style="font-size:12.5px;color:#5c706e;margin-top:3px;line-height:1.55">{{ entrarSub }}</div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:14px">
          <sc-for list="{{ usuariosLista }}" as="ul" hint-placeholder-count="6">
            <div onClick="{{ ul.onClick }}" data-tx-usuario="{{ ul.id }}" style="display:flex;align-items:center;gap:12px;border:1.5px solid {{ ul.bd }};background:{{ ul.bg }};border-radius:15px;padding:11px 14px;cursor:pointer;transition:all .15s" style-hover="border-color:#127670">
              <span style="width:18px;height:18px;border-radius:99px;border:2.5px solid {{ ul.dotBd }};background:{{ ul.dot }};flex:none"></span>
              <span style="width:34px;height:34px;border-radius:99px;flex:none;background:linear-gradient(135deg,{{ ul.g1 }},{{ ul.g2 }});color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">{{ ul.ini }}</span>
              <div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:800">{{ ul.nome }}</div><div style="font-size:11.5px;color:#5c706e;margin-top:1px">{{ ul.cargo }}, {{ ul.escopo }}</div></div>
            </div>
          </sc-for>
        </div>
      </div>
    </div>
  </sc-if>
  <sc-if value="{{ modalSair }}" hint-placeholder-val="{{ false }}">
    ${OVERLAY('fecharModalTopo')}
      <div onClick="{{ pararClique }}" style="background:#fff;border-radius:24px;width:440px;box-shadow:0 40px 100px rgba(9,34,36,.4);padding:26px 28px">
        <div style="display:flex;align-items:center"><div style="font-size:16px;font-weight:800">Sair da conta</div>${FECHAR('fecharModalTopo')}</div>
        <div style="display:flex;align-items:center;gap:12px;background:#f7faf9;border-radius:15px;padding:13px 15px;margin-top:16px">
          <span style="width:40px;height:40px;border-radius:99px;flex:none;background:linear-gradient(135deg,{{ uG1 }},{{ uG2 }});color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center">{{ uIni }}</span>
          <div><div style="font-size:13.5px;font-weight:800">{{ uNome }}</div><div style="font-size:11.5px;color:#5c706e">{{ uCargo }}</div></div>
        </div>
        <div style="font-size:12.5px;color:#5c706e;margin-top:14px;line-height:1.6">O que você registrou continua na viagem, com seu nome e a hora. O que estava aberto num formulário sem confirmar não foi gravado.</div>
        <div style="display:flex;gap:8px;margin-top:18px;justify-content:flex-end">
          <span onClick="{{ fecharModalTopo }}" style="background:#f0f4f3;font-size:13.5px;font-weight:700;border-radius:99px;padding:10px 20px;cursor:pointer" style-hover="background:#e4ebe9">Cancelar</span>
          <span onClick="{{ confirmarSair }}" style="background:linear-gradient(135deg,#e46969,#c43d3d);color:#fff;font-size:13.5px;font-weight:800;border-radius:99px;padding:10px 22px;cursor:pointer;box-shadow:0 8px 18px rgba(196,61,61,.3)" style-hover="transform:translateY(-1px)">Sair</span>
        </div>
      </div>
    </div>
  </sc-if>
  <sc-if value="{{ toast }}" hint-placeholder-val="{{ false }}">
    <div data-tx-toast style="position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:1200;background:#0b2224;color:#fff;border-radius:99px;padding:12px 22px;font-size:13.5px;font-weight:600;box-shadow:0 16px 40px rgba(9,34,36,.35);display:flex;align-items:center;gap:10px;max-width:760px"><span style="width:20px;height:20px;border-radius:99px;background:linear-gradient(135deg,#48c78e,#127670);display:flex;align-items:center;justify-content:center;font-size:11px;flex:none">✓</span>{{ toastMsg }}</div>
  </sc-if>
`;

function trocar(src, marca, conteudo) {
  const re = new RegExp('<!-- TX:' + marca + ' -->[\\s\\S]*?<!-- /TX:' + marca + ' -->');
  if (!re.test(src)) return src;
  return src.replace(re, () => '<!-- TX:' + marca + ' -->' + conteudo + '<!-- /TX:' + marca + ' -->');
}

// Assinatura da sidebar: ordem dos itens, badges e destinos (o item ativo só muda de estilo).
export function assinatura(src) {
  const m = src.match(/<!-- TX:SIDEBAR -->([\s\S]*?)<!-- \/TX:SIDEBAR -->/);
  if (!m) return null;
  const itens = [...m[1].matchAll(/data-tx-item="([^"]+)"[^>]*>([^<]+)</g)].map(x => x[1] + ':' + x[2]);
  const badges = [...m[1].matchAll(/data-tx-badge="([^"]+)"/g)].map(x => x[1]);
  const subs = [...m[1].matchAll(/data-tx-sub="([^"]+)"/g)].map(x => x[1]);
  return itens.join('|') + ' #' + badges.join(',') + ' #' + subs.join(',');
}

function principal() {
  const conferir = process.argv.includes('--conferir');
  const assin = {};
  for (const [arq, cfg] of Object.entries(TELAS)) {
    const p = path.join(pasta, arq);
    if (!fs.existsSync(p)) continue;
    let src = fs.readFileSync(p, 'utf8');
    if (!conferir) {
      src = trocar(src, 'SIDEBAR', sidebar(cfg.ativo, cfg.detalhe));
      src = trocar(src, 'PERFIL', PERFIL);
      src = trocar(src, 'MODAIS', MODAIS);
      fs.writeFileSync(p, src);
    }
    assin[arq] = assinatura(src);
  }
  const unicas = new Set(Object.values(assin));
  for (const [arq, a] of Object.entries(assin)) console.log((a ? 'ok  ' : 'SEM ') + arq);
  console.log(unicas.size === 1 ? '\nAssinatura única de sidebar em ' + Object.keys(assin).length + ' telas:\n' + [...unicas][0] : '\nASSINATURAS DIFERENTES: ' + unicas.size);
  if (unicas.size !== 1 || [...unicas].includes(null)) process.exit(1);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) principal();
