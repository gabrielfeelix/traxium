'use client';
/*
 * Peças pedidas pela revisão de UX (docs/revisao-telas/12-revisao-ux.md, U115 a U118): menu de linha,
 * confirmação, toast com desfazer, glossário, ordenação e seleção de tabela, filtros, cabeçalho em
 * três formas, drawer de detalhe de linha, avatar, ícone de tipo e placa. Tudo é o componente real.
 */
import { useMemo, useState } from 'react';
import {
  Avatar, BarraFiltros, BarraSelecao, Botao, CabecalhoPagina, CampoBusca, Cartao, Celula, CelulaSelecao, Confirmar, Dica, Drawer, Filtros,
  GLOSSARIO, IconeTipo, Linha, MenuLinha, PeriodoAtalhos, Placa, Segmentado, SeloRegime, SetaLinha, Situacao, Tabela, TabelaCabecalho,
  TabelaColuna, TabelaLinha, Termo, Trilha, avisar, proximaOrdem, type ChaveGlossario, type ItemMenu, type Ordem, type Regime, type TipoEmpresa,
} from '@/components/ui';
import { Cod, Componente, Estado, Secao } from './vitrine-base';

export const NAV_NOVAS: [string, [string, string][]][] = [
  ['Ações em registro', [['menu-linha', 'MenuLinha'], ['confirmar', 'Confirmar e desfazer']]],
  ['Lista', [['tabela-ordem', 'Tabela: ordem e seleção'], ['filtros', 'BarraFiltros'], ['navegacao', 'Trilha, Segmentado, Período']]],
  ['Página', [['cabecalho', 'CabecalhoPagina']]],
  ['Linguagem', [['termo', 'Termo e glossário']]],
  ['Identidade', [['identidade', 'Avatar, IconeTipo, Placa']]],
];
export const TOTAL_COMPONENTES = 35;

const IC = {
  historico: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.6 8a5.4 5.4 0 1 0 1.6-3.8" /><path d="M2.4 2.6v2.6H5" /><path d="M8 5.2V8l2 1.4" />
    </svg>
  ),
  exportar: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 2.5v8" /><path d="M4.8 7.5 8 10.7l3.2-3.2" /><path d="M3 13.2h10" />
    </svg>
  ),
  tirar: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <circle cx="8" cy="8" r="5.6" /><path d="M5.2 8h5.6" />
    </svg>
  ),
  editar: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.6 2.8 13.2 5.4 6 12.6l-3.2.6.6-3.2z" />
    </svg>
  ),
};

type Conjunto = { cavalo: string; carreta: string; tipo: string; base: string; motorista: string; carga: string; regime: Regime; escopo: boolean; desde: string };
const CONJUNTOS: Conjunto[] = [
  { cavalo: 'QBD3E90', carreta: 'SQT6B77', tipo: 'Graneleira', base: 'Rondonópolis', motorista: 'Paulo Lima', carga: 'Farelo de soja', regime: 'A', escopo: true, desde: '10/01/2026' },
  { cavalo: 'QCP8A55', carreta: 'SQT5F31', tipo: 'Graneleira', base: 'Rio Verde', motorista: 'Valdir Nunes', carga: 'Milho', regime: 'A', escopo: true, desde: '03/02/2026' },
  { cavalo: 'QJD9F03', carreta: 'SQT4A66', tipo: 'Basculante', base: 'Paranaguá', motorista: 'Sérgio Ramos', carga: 'Fertilizante', regime: 'C', escopo: false, desde: '' },
  { cavalo: 'RBK2F41', carreta: 'QWM4H57', tipo: 'Graneleira', base: 'Sorriso', motorista: 'Edson Prado', carga: 'Fosfato', regime: 'B', escopo: true, desde: '22/03/2026' },
  { cavalo: 'QHG7L33', carreta: 'QHG7L34', tipo: 'Graneleira', base: 'Sorriso', motorista: 'Renato Alves', carga: 'Cama de frango', regime: 'X', escopo: false, desde: '' },
  { cavalo: 'PHC2B17', carreta: 'PHC2B18', tipo: 'Graneleira', base: 'Rondonópolis', motorista: 'Milton Souza', carga: 'Casca de soja', regime: 'A', escopo: true, desde: '15/04/2026' },
];
type ChaveOrdem = 'cavalo' | 'base' | 'motorista';
const COLS = '40px minmax(150px,1.1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.1fr) 32px 16px';

function itensDoConjunto(c: Conjunto, pedirConfirmacao: (c: Conjunto) => void): (ItemMenu | 'separador')[] {
  return [
    { k: 'hist', rotulo: 'Ver histórico de cargas', icone: IC.historico, aoSelecionar: () => avisar({ texto: 'Abriria o histórico de ' + c.carreta + ' C1.', tom: 'info' }) },
    { k: 'exp', rotulo: 'Exportar histórico', icone: IC.exportar, aoSelecionar: () => avisar('Histórico de ' + c.cavalo + ' exportado.') },
    { k: 'edit', rotulo: 'Editar conjunto', icone: IC.editar, inativo: true, motivo: 'Só o gestor de frota edita conjuntos.' },
    'separador',
    c.escopo
      ? { k: 'tirar', rotulo: 'Tirar do escopo...', icone: IC.tirar, perigo: true, aoSelecionar: () => pedirConfirmacao(c) }
      : { k: 'incluir', rotulo: 'Incluir no escopo', icone: IC.tirar, aoSelecionar: () => avisar({ texto: c.cavalo + ' entrou no escopo GMP+.', acao: { rotulo: 'Desfazer', aoClicar: () => avisar('Inclusão desfeita.') } }) },
  ];
}

// ---------------------------------------------------------------- Drawer do conjunto (usado na seção Drawer)
export function DrawerConjunto() {
  const [i, setI] = useState(0);
  const [aba, setAba] = useState('comp');
  const c = CONJUNTOS[i];
  return (
    <Drawer
      id="ds-d2" estatico semVeu tamanho="p" titulo={c.cavalo.slice(0, 3) + ' ' + c.cavalo.slice(3)} extra={<Placa placa={c.carreta} clara />}
      sub={c.tipo + ', base ' + c.base} aoFechar={() => undefined}
      aoAnterior={i > 0 ? () => setI(i - 1) : undefined} aoProximo={i < CONJUNTOS.length - 1 ? () => setI(i + 1) : undefined}
      acoes={<><Botao tamanho="p" variante="contorno" icone={IC.historico}>Ver histórico do C1</Botao><Botao tamanho="p" variante="contorno" icone={IC.exportar}>Exportar</Botao><MenuLinha rotulo={'Mais ações de ' + c.cavalo} itens={itensDoConjunto(c, () => avisar('Abriria a confirmação.'))} /></>}
      abas={[{ k: 'comp', n: 'Compartimentos', ativa: aba === 'comp', onClick: () => setAba('comp') }, { k: 'mot', n: 'Motorista', ativa: aba === 'mot', onClick: () => setAba('mot') }, { k: 'via', n: 'Últimas viagens', q: 2, qTom: 'neutro', ativa: aba === 'via', onClick: () => setAba('via') }]}
    >
      {aba === 'comp' ? (
        <>
          <Linha rotulo={<Placa placa={c.carreta} compartimento="C1" tamanho="p" />}><span className="tx-tipo-denso">T-1 {c.carga} <SeloRegime regime={c.regime} /></span></Linha>
          <Linha rotulo="Escopo GMP+">{c.escopo ? <Situacao tom="ok" forma="selo">desde {c.desde}</Situacao> : <Situacao tom="na" forma="selo">fora do escopo</Situacao>}</Linha>
        </>
      ) : aba === 'mot' ? (
        <Linha rotulo={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--esp-2)' }}><Avatar nome={c.motorista} tamanho="p" />{c.motorista}</span>}><span className="tx-sec">CNH vale até 04/04/2028</span></Linha>
      ) : (
        <Linha rotulo="08/10 OC 48118">{c.carga}</Linha>
      )}
    </Drawer>
  );
}

// ---------------------------------------------------------------- seção
export function NovasPecas() {
  // Confirmar e desfazer
  const [confirmar, setConfirmar] = useState<Conjunto | null>(null);
  const [revogar, setRevogar] = useState(false);
  const [escopo, setEscopo] = useState<Record<string, boolean>>(() => Object.fromEntries(CONJUNTOS.map((c) => [c.cavalo, c.escopo])));
  // Tabela
  const [ordem, setOrdem] = useState<{ k: ChaveOrdem; o: Ordem }>({ k: 'cavalo', o: 'asc' });
  const [sel, setSel] = useState<string[]>(['QCP8A55', 'RBK2F41']);
  const [ativa, setAtiva] = useState('QBD3E90');
  // Filtros
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [tipoT, setTipoT] = useState('todos');
  const [periodo, setPeriodo] = useState('30d');
  const [de, setDe] = useState('01/09/2026');
  const [ate, setAte] = useState('08/10/2026');
  const [regra, setRegra] = useState('bloqueia');

  const linhas = useMemo(() => {
    const q = busca.trim().toLowerCase().replace(/\s/g, '');
    const l = CONJUNTOS.map((c) => ({ ...c, escopo: escopo[c.cavalo] })).filter((c) =>
      (filtro === 'todos' || (filtro === 'no' ? c.escopo : !c.escopo)) && (!q || (c.cavalo + c.carreta + c.motorista).toLowerCase().replace(/\s/g, '').includes(q)),
    );
    const f = ordem.o === 'desc' ? -1 : 1;
    return l.sort((a, b) => a[ordem.k].localeCompare(b[ordem.k], 'pt-BR') * f);
  }, [busca, filtro, ordem, escopo]);
  const ordenar = (k: ChaveOrdem) => setOrdem((o) => ({ k, o: o.k === k ? proximaOrdem(o.o) : 'asc' }));
  const col = (k: ChaveOrdem) => ({ ordenavel: true, ordem: ordem.k === k ? ordem.o : null, aoOrdenar: () => ordenar(k) });
  const todas = linhas.length > 0 && linhas.every((c) => sel.includes(c.cavalo));
  const algumas = !todas && linhas.some((c) => sel.includes(c.cavalo));
  const nNo = CONJUNTOS.filter((c) => escopo[c.cavalo]).length;

  const tirar = (c: Conjunto, motivo: string) => {
    setEscopo((e) => ({ ...e, [c.cavalo]: false }));
    setConfirmar(null);
    avisar({
      texto: c.cavalo.slice(0, 3) + ' ' + c.cavalo.slice(3) + ' saiu do escopo GMP+' + (motivo ? ': ' + motivo.toLowerCase().replace(/\.$/, '') : '') + '.',
      acao: { rotulo: 'Desfazer', aoClicar: () => { setEscopo((e) => ({ ...e, [c.cavalo]: true })); avisar('Voltou ao escopo.'); } },
    });
  };

  return (
    <Secao id="pecas-ux" n="06" titulo="Peças da revisão de UX" intro={<>Pedidas em <Cod>docs/revisao-telas/12-revisao-ux.md</Cod> (Top 1, 3, 5, 9 e 10; U115 a U118). Uso e antes e depois em <Cod>docs/ds/guia-migracao.md</Cod>, seção 11.</>}>
      {/* ------------------------------------------------ MenuLinha */}
      <Componente
        id="menu-linha" nome="MenuLinha" arquivo="src/components/ui/menu-linha.tsx"
        resumo="O botão [...] de uma linha ou do drawer, com as ações do registro. Destrutivas por último, depois de um separador, em vermelho e com reticências quando abrem confirmação. Item inativo fica no menu, apagado, focável, com a dica do motivo. Teclado: Enter, espaço ou seta abrem; setas percorrem; Esc fecha e devolve o foco."
        props={[
          ['itens', "(ItemMenu | 'separador')[]", '', 'As ações, na ordem.'],
          ['ItemMenu', '{ k?, rotulo, icone?, aoSelecionar?, perigo?, inativo?, motivo?, atalho? }', '', 'perigo: vermelho. inativo + motivo: apagado, não executa, dica com o motivo.'],
          ['rotulo', 'string', '', 'aria-label do botão: "Ações de QBD 3E90". Obrigatório.'],
          ['gatilho', 'ReactNode', 'botão [...] 32 px', 'Gatilho próprio (ex.: Botao "Ações ▾" no cabeçalho da Viagem).'],
          ['alinhar', "'start' | 'end'", "'end'", 'Borda do menu alinhada ao gatilho.'],
        ]}
        classes={<><Cod>.tx-menu</Cod>, <Cod>__item</Cod> (<Cod>[data-highlighted]</Cod>, <Cod>[aria-disabled]</Cod>), <Cod>__item--perigo</Cod>, <Cod>__icone</Cod>, <Cod>__rotulo</Cod>, <Cod>__atalho</Cod>, <Cod>__separador</Cod>, <Cod>__gatilho</Cod> (<Cod>[data-state=&quot;open&quot;]</Cod>). Camada <Cod>--z-flutuante</Cod>: abre por cima de drawer e modal.</>}
        sim={['"Tirar do escopo..." por último, depois do separador.', 'rotulo com o objeto: "Ações de QBD 3E90".', 'Linha com onClick (abre drawer) e MenuLinha na última coluna: o clique no menu não abre a linha.', 'Inativo com motivo que diz quem pode: "Só o gestor de frota edita conjuntos."']}
        nao={['Ação destrutiva solta na linha, em texto vermelho.', 'MenuLinha dentro de TabelaLinha com href (botão dentro de link).', 'Esconder a ação que a pessoa não pode fazer sem dizer por quê.', 'Menu com uma ação só (vira Botao).']}
      >
        <div className="ds-linha" style={{ gap: 'var(--esp-8)', alignItems: 'flex-start' }}>
          <Estado rot="Repouso"><MenuLinha rotulo="Ações de QBD 3E90" itens={itensDoConjunto(CONJUNTOS[0], (c) => setConfirmar(c))} /></Estado>
          <Estado rot="Gatilho próprio"><MenuLinha rotulo="Ações da viagem" gatilho={<Botao variante="contorno">Ações ▾</Botao>} itens={[{ rotulo: 'Exportar registro', icone: IC.exportar }, { rotulo: 'Registrar ocorrência', icone: IC.editar }, 'separador', { rotulo: 'Cancelar viagem...', perigo: true, aoSelecionar: () => setRevogar(true) }]} /></Estado>
          <Estado rot="Aberto (desenho)">
            <div className="tx-menu" style={{ position: 'static', animation: 'none' }} role="menu" aria-label="Exemplo parado">
              <div className="tx-menu__item" role="menuitem"><span className="tx-menu__icone">{IC.historico}</span><span className="tx-menu__rotulo">Ver histórico de cargas</span></div>
              <div className="tx-menu__item" role="menuitem" data-highlighted=""><span className="tx-menu__icone">{IC.exportar}</span><span className="tx-menu__rotulo">Exportar histórico</span><kbd className="tx-menu__atalho">E</kbd></div>
              <div className="tx-menu__item" role="menuitem" aria-disabled="true"><span className="tx-menu__icone">{IC.editar}</span><span className="tx-menu__rotulo">Editar conjunto</span></div>
              <div className="tx-menu__separador" role="separator" />
              <div className="tx-menu__item tx-menu__item--perigo" role="menuitem"><span className="tx-menu__icone">{IC.tirar}</span><span className="tx-menu__rotulo">Tirar do escopo...</span></div>
            </div>
          </Estado>
        </div>
      </Componente>

      {/* ------------------------------------------------ Confirmar e desfazer */}
      <Componente
        id="confirmar" nome="Confirmar e desfazer" arquivo="src/components/ui/confirmar.tsx" fundo="liso"
        resumo="Duas intensidades. Reversível e barata (tirar do escopo, revogar convite): executa na hora e mostra avisar({ acao: Desfazer }) por 8 s. Irreversível ou com efeito em terceiros (cancelar viagem, revogar acesso, voltar à semente): Confirmar, com o efeito escrito no corpo e o verbo no botão vermelho. Motivo obrigatório quando a auditoria precisa saber por quê."
        props={[
          ['aberto / aoFechar', 'boolean / () => void', '', 'A tela guarda só se está aberto. Esc e clique fora fecham.'],
          ['aoConfirmar', '(motivo: string) => void', '', 'Recebe o motivo digitado ("" sem campo).'],
          ['titulo', 'ReactNode', '', 'Pergunta com o objeto: "Revogar o acesso de Cerrado Cargas?"'],
          ['children', 'ReactNode', '', 'O efeito, escrito. Obrigatório na prática.'],
          ['rotuloConfirmar', 'string', '', 'O verbo: "Revogar acesso". Nunca "OK" ou "Sim".'],
          ['rotuloCancelar', 'string', "'Cancelar'", ''],
          ['perigo', 'boolean', 'true', 'false: botão primário (confirmação não destrutiva).'],
          ['motivo', '{ rotulo, dica?, obrigatorio?, minimo?, placeholder? }', '', 'Campo de motivo; com obrigatorio ou minimo, o botão fica inativo e o rodapé diz "Falta: motivo."'],
          ['carregando', 'boolean', 'false', 'Giro no botão enquanto salva.'],
          ['estatico', 'boolean', 'false', 'Desenha no fluxo (documentação).'],
        ]}
        classes={<>Reusa <Cod>.tx-modal.tx-modal--p</Cod> com <Cod>.tx-confirmar</Cod> e <Cod>.tx-confirmar__efeito</Cod>; véu <Cod>.tx-veu--leve</Cod> (sem desfoque). Radix Dialog: foco preso, Esc, foco volta ao gatilho; marcado <Cod>data-foco-proprio</Cod> para o teclado.tsx não brigar.</>}
        sim={['Corpo com o efeito: "O link do motorista para de funcionar. As viagens já feitas continuam no histórico."', 'Botão vermelho com o verbo do título.', 'Desfazer no toast para o que volta sem custo.']}
        nao={['"Tem certeza?" sem dizer o efeito.', 'Confirmar ação reversível e barata (dá Desfazer).', 'Desfazer para o que avisa terceiros (o SMS já foi).', 'Botão "OK".']}
      >
        <div className="ds-linha" style={{ marginBottom: 'var(--esp-4)' }}>
          <Botao variante="perigo" onClick={() => setRevogar(true)}>Revogar acesso...</Botao>
          <Botao onClick={() => setConfirmar(CONJUNTOS[0])}>Tirar QBD 3E90 do escopo...</Botao>
          <Botao onClick={() => avisar({ texto: 'Convite de Lucas Transportes revogado.', acao: { rotulo: 'Desfazer', aoClicar: () => avisar('Convite restaurado.') } })}>Revogar convite (com Desfazer)</Botao>
        </div>
        <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--esp-4)' }}>
          <Confirmar estatico aberto aoFechar={() => undefined} aoConfirmar={() => undefined} titulo="Revogar o acesso de Cerrado Cargas Ltda?" rotuloConfirmar="Revogar acesso">
            <p>O link do motorista para de funcionar e a transportadora some da escolha de nova viagem.</p>
            <p>As viagens já feitas continuam no histórico.</p>
          </Confirmar>
          <Confirmar estatico aberto aoFechar={() => undefined} aoConfirmar={() => undefined} titulo="Tirar QBD 3E90 do escopo GMP+?" rotuloConfirmar="Tirar do escopo" motivo={{ rotulo: 'Motivo', obrigatorio: true, dica: 'Vai para o registro de auditoria.', placeholder: 'Ex.: dedicado a calcário até março' }}>
            Fora do escopo, o conjunto não faz viagem assegurada. Dá para incluir de novo depois.
          </Confirmar>
        </div>
        <Confirmar
          aberto={!!confirmar} aoFechar={() => setConfirmar(null)} aoConfirmar={(m) => confirmar && tirar(confirmar, m)}
          titulo={'Tirar ' + (confirmar ? confirmar.cavalo.slice(0, 3) + ' ' + confirmar.cavalo.slice(3) : '') + ' do escopo GMP+?'} rotuloConfirmar="Tirar do escopo"
          motivo={{ rotulo: 'Motivo', obrigatorio: true, dica: 'Vai para o registro de auditoria.' }}
        >
          Fora do escopo, o conjunto não faz viagem assegurada. Dá para incluir de novo depois.
        </Confirmar>
        <Confirmar aberto={revogar} aoFechar={() => setRevogar(false)} aoConfirmar={() => { setRevogar(false); avisar('Acesso de Cerrado Cargas Ltda revogado. O histórico continua.'); }} titulo="Revogar o acesso de Cerrado Cargas Ltda?" rotuloConfirmar="Revogar acesso">
          O link do motorista para de funcionar. As viagens já feitas continuam no histórico.
        </Confirmar>
      </Componente>

      {/* ------------------------------------------------ Tabela: ordem e seleção */}
      <Componente
        id="tabela-ordem" nome="Tabela: ordem, seleção e cabeçalho fixo" arquivo="src/components/ui/tabela.tsx" fundo="fundo"
        resumo="Coluna ordenável vira botão com aria-sort e seta. Cabeçalho fixo gruda no topo da área que rola. Seleção por CelulaSelecao (nativa, com estado misto no cabeçalho) e BarraSelecao que gruda embaixo. Linha clicável mostra › no hover; o MenuLinha na ponta não abre a linha."
        props={[
          ['TabelaCabecalho.fixo', 'boolean', 'false', 'position: sticky no topo da área que rola.'],
          ['TabelaCabecalho.colunas', 'ColunaTabela[]', '', 'Alternativa aos filhos: { k, rotulo, ordenavel?, ordem?, aoOrdenar?, alinhar?, rotuloLeitor? }.'],
          ['TabelaColuna.ordenavel / ordem / aoOrdenar', "boolean / 'asc' | 'desc' | null / () => void", '', 'Rótulo vira botão; aria-sort ascending, descending ou none.'],
          ['TabelaColuna.alinhar', "'inicio' | 'fim'", "'inicio'", 'fim para número.'],
          ['TabelaColuna.rotuloLeitor', 'string', '', 'Nome só para leitor (coluna de checkbox, de menu).'],
          ['proximaOrdem(o)', "(Ordem) => 'asc' | 'desc'", '', 'Ciclo padrão: asc, desc, asc.'],
          ['CelulaSelecao', '{ marcada, misto?, aoMudar, rotulo, desabilitada? }', '', 'Checkbox nativo; rotulo: "Selecionar QBD 3E90". Não deixa o clique chegar à linha.'],
          ['SetaLinha', '', '', '› no fim da linha clicável; aparece no hover, no foco e na selecionada.'],
          ['BarraSelecao', '{ quantidade, texto?, acoes?, aoLimpar?, rotuloLimpar?, fixo? }', '', '"3 selecionados [Exportar] Limpar seleção". Some com 0. fixo: gruda embaixo.'],
        ]}
        classes={<><Cod>.tx-tabela__cab--fixo</Cod>, <Cod>.tx-tabela__col</Cod> (<Cod>--fim</Cod>), <Cod>.tx-tabela__ordenar</Cod> (<Cod>[data-ordem]</Cod>), <Cod>.tx-tabela__seta-ordem</Cod>, <Cod>.tx-tabela__selecao</Cod>, <Cod>.tx-check--so</Cod>, <Cod>.tx-tabela__seta</Cod>, <Cod>.tx-selecao</Cod> (<Cod>--fixa</Cod>, <Cod>__texto</Cod>, <Cod>__acoes</Cod>, <Cod>__limpar</Cod>). Linha com caixa marcada ganha <Cod>--primario-fraco</Cod>. <Cod>Cartao lista</Cod> passou a <Cod>overflow: clip</Cod> para o cabeçalho fixo funcionar dentro dele.</>}
        sim={['Ordem padrão que serve à tarefa (Fornecedores: próximo vencimento).', 'Cabeçalho fixo em lista que passa da dobra.', 'BarraSelecao com o verbo: "Exportar selecionadas".', 'Ordenar, buscar e filtrar guardados na URL.']}
        nao={['Ordenar por clique na célula.', 'Seta de ordem em coluna que não ordena.', 'Ações em massa no cabeçalho da página (vão na barra).', 'Checkbox desenhado com span.']}
      >
        <Cartao lista>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            <Tabela colunas={COLS} rotulo="Conjuntos da frota própria">
              <TabelaCabecalho fixo>
                <TabelaColuna><CelulaSelecao marcada={todas} misto={algumas} rotulo="Selecionar todos os conjuntos" aoMudar={(v) => setSel(v ? linhas.map((c) => c.cavalo) : [])} /></TabelaColuna>
                <TabelaColuna {...col('cavalo')}>Conjunto</TabelaColuna>
                <TabelaColuna {...col('base')}>Tipo e base</TabelaColuna>
                <TabelaColuna {...col('motorista')}>Motorista</TabelaColuna>
                <TabelaColuna>Última carga (C1)</TabelaColuna>
                <TabelaColuna>Escopo</TabelaColuna>
                <TabelaColuna rotuloLeitor="Ações" />
                <TabelaColuna rotuloLeitor="Abrir" />
              </TabelaCabecalho>
              {linhas.map((c) => (
                <TabelaLinha key={c.cavalo} onClick={() => setAtiva(c.cavalo)} selecionada={ativa === c.cavalo}>
                  <CelulaSelecao marcada={sel.includes(c.cavalo)} rotulo={'Selecionar ' + c.cavalo} aoMudar={(v) => setSel((s) => (v ? [...s, c.cavalo] : s.filter((x) => x !== c.cavalo)))} />
                  <span style={{ display: 'flex', gap: 'var(--esp-1-5)', flexWrap: 'wrap' }}><Placa placa={c.cavalo} /><Placa placa={c.carreta} clara /></span>
                  <Celula forte={c.tipo} sub={c.base} />
                  <span>{c.motorista}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2)' }}>{c.carga} <SeloRegime regime={c.regime} /></span>
                  {c.escopo ? <Situacao tom="ok">No escopo</Situacao> : <Situacao tom="na">Fora do escopo</Situacao>}
                  <MenuLinha rotulo={'Ações de ' + c.cavalo} itens={itensDoConjunto(c, (x) => setConfirmar(x))} />
                  <SetaLinha />
                </TabelaLinha>
              ))}
            </Tabela>
            <div style={{ padding: '0 var(--esp-4)' }}>
              <BarraSelecao quantidade={sel.length} acoes={<><Botao tamanho="p" variante="contorno" icone={IC.exportar}>Exportar selecionados</Botao><Botao tamanho="p" variante="contorno">Incluir no escopo</Botao></>} aoLimpar={() => setSel([])} />
            </div>
          </div>
        </Cartao>
        <p className="ds-nota">Ordene por Conjunto, Tipo e base ou Motorista; role a caixa para ver o cabeçalho grudar; marque linhas para a barra aparecer. A busca e os chips de BarraFiltros abaixo filtram esta mesma tabela.</p>
      </Componente>

      {/* ------------------------------------------------ BarraFiltros */}
      <Componente
        id="filtros" nome="BarraFiltros, Filtros e CampoBusca" arquivo="src/components/ui/filtros.tsx"
        resumo="A faixa de uma lista: busca, filtros rápidos em chip com contagem e, à direita, os controles extras. Sem estado: a tela guarda busca, filtro e contagens (e a URL). Esc dentro da busca limpa."
        props={[
          ['busca', '{ valor, aoMudar, placeholder?, rotulo?, id? }', '', 'Campo com lupa e botão de limpar. Debounce é da tela.'],
          ['filtros', 'FiltroChip[]', '', '{ k, rotulo, contagem?, ativo?, aoClicar?, alerta?, inativo? }. aria-pressed; contagem em mono, âmbar com alerta.'],
          ['rotuloFiltros', 'string', "'Filtros rápidos'", 'aria-label do grupo de chips.'],
          ['depois', 'ReactNode', '', 'À direita: Segmentado, PeriodoAtalhos, Selecao de filial.'],
          ['resultado', 'ReactNode', '', 'Linha de baixo: "26 viagens no período" (aria-live).'],
          ['aoLimpar', '() => void', '', 'Mostra "Limpar filtros".'],
          ['Filtros / CampoBusca', 'avulsos', '', 'As mesmas peças, para usar fora da barra (CabecalhoPagina lista).'],
        ]}
        classes={<><Cod>.tx-barra-filtros</Cod> (<Cod>__linha</Cod>, <Cod>__busca</Cod>, <Cod>__depois</Cod>, <Cod>__resultado</Cod>), <Cod>.tx-filtros</Cod>, chip <Cod>.tx-chip.tx-chip--filtro.tx-filtro</Cod> com <Cod>.tx-filtro__n</Cod> (<Cod>--alerta</Cod>), <Cod>.tx-busca</Cod> sobre <Cod>.tx-entrada-caixa</Cod>, <Cod>.tx-busca__limpar</Cod>.</>}
        sim={['Contagem em cada chip: "Documento a vencer 2".', 'Um chip "Todos" quando os filtros são exclusivos.', 'Sem resultado: EstadoVazio que cita a busca e oferece Limpar.']}
        nao={['Três mecanismos de filtro para a mesma lista (abas, chips e popover).', 'Filtro que não filtra nada sem avisar.', 'Placeholder longo que corta: o exemplo vai na dica.']}
      >
        <BarraFiltros
          busca={{ valor: busca, aoMudar: setBusca, placeholder: 'Buscar placa ou motorista', id: 'ds-busca-frota' }}
          filtros={[
            { k: 'todos', rotulo: 'Todos', contagem: CONJUNTOS.length, ativo: filtro === 'todos', aoClicar: () => setFiltro('todos') },
            { k: 'no', rotulo: 'No escopo', contagem: nNo, ativo: filtro === 'no', aoClicar: () => setFiltro('no') },
            { k: 'fora', rotulo: 'Fora', contagem: CONJUNTOS.length - nNo, ativo: filtro === 'fora', aoClicar: () => setFiltro('fora') },
            { k: 'venc', rotulo: 'Documento a vencer', contagem: 2, alerta: true, inativo: true },
          ]}
          depois={<Segmentado rotulo="Tipo de transportador" valor={tipoT} aoMudar={setTipoT} opcoes={[{ k: 'todos', rotulo: 'Todos' }, { k: 'tac', rotulo: 'TAC' }, { k: 'etc', rotulo: 'ETC' }]} tamanho="p" />}
          resultado={linhas.length + (linhas.length === 1 ? ' conjunto' : ' conjuntos') + (busca ? ' com "' + busca + '"' : '')}
          aoLimpar={busca || filtro !== 'todos' ? () => { setBusca(''); setFiltro('todos'); } : undefined}
        />
        <div className="ds-linha" style={{ marginTop: 'var(--esp-5)' }}>
          <Estado rot="CampoBusca avulso"><div style={{ width: 280 }}><CampoBusca valor="QBD" aoMudar={() => undefined} placeholder="Placa, CT-e, NF ou ordem" /></div></Estado>
          <Estado rot="Filtros avulsos"><Filtros rotulo="Situação" itens={[{ k: 'a', rotulo: 'Falta algo', contagem: 3, alerta: true, ativo: true }, { k: 'b', rotulo: 'Bloqueadas', contagem: 0 }]} /></Estado>
        </div>
      </Componente>

      {/* ------------------------------------------------ Trilha, Segmentado, Periodo */}
      <Componente
        id="navegacao" nome="Trilha, Segmentado e PeriodoAtalhos" arquivo="src/components/ui/navegacao.tsx"
        resumo="Trilha mostra onde a pessoa está numa tela de detalhe; o último passo é a página atual. Segmentado escolhe uma de 2 a 4 opções que valem na hora (Bloqueia | Só alerta, TAC | ETC), com setas no teclado. PeriodoAtalhos troca a digitação de datas por atalhos, com Personalizado."
        props={[
          ['Trilha.passos', '{ rotulo, href? }[]', '', 'Último passo sem link, com aria-current="page".'],
          ['Segmentado.opcoes', '{ k, rotulo, inativo? }[]', '', '2 a 4.'],
          ['Segmentado.valor / aoMudar / rotulo', "string / (k) => void / string", '', 'rotulo é o aria-label do grupo ("Quando falhar").'],
          ['Segmentado.tamanho', "'p' | 'm'", "'m'", 'p em barra de filtro.'],
          ['PeriodoAtalhos.valor / aoMudar', "string / (k) => void", '', 'Atalho escolhido.'],
          ['PeriodoAtalhos.atalhos', '{ k, rotulo }[]', 'ATALHOS_PERIODO', '30 dias, 90 dias, Personalizado. Acrescente "Desde a última auditoria".'],
          ['PeriodoAtalhos.de / ate / aoMudarDe / aoMudarAte', 'string DD/MM/AAAA', '', 'Datas do Personalizado (CampoData).'],
        ]}
        classes={<><Cod>.tx-trilha</Cod> (<Cod>__sep</Cod>), <Cod>.tx-segmentado</Cod> (<Cod>--p</Cod>, <Cod>__opcao</Cod> com <Cod>[aria-checked]</Cod>), <Cod>.tx-periodo</Cod> (<Cod>__rotulo</Cod>, <Cod>__datas</Cod>, <Cod>__data</Cod>).</>}
        sim={['Segmentado para regra que vale na hora, com rótulo de grupo.', 'Atalho "Desde a última auditoria (14/07/2026)" na Auditoria.']}
        nao={['Segmentado com mais de 4 opções (é Selecao).', 'Trilha em tela de lista (o título já diz).', 'Período só por digitação.']}
      >
        <div className="ds-pilha">
          <Trilha passos={[{ rotulo: 'Frota própria', href: '#navegacao' }, { rotulo: 'QBD 3E90', href: '#navegacao' }, { rotulo: 'SQT 6B77 C1' }]} />
          <div className="ds-linha" style={{ gap: 'var(--esp-6)' }}>
            <Estado rot="Segmentado"><Segmentado rotulo="Quando falhar" valor={regra} aoMudar={setRegra} opcoes={[{ k: 'bloqueia', rotulo: 'Bloqueia' }, { k: 'alerta', rotulo: 'Só alerta' }]} /></Estado>
            <Estado rot="Com opção inativa"><Segmentado rotulo="Quando falhar (norma)" valor="bloqueia" aoMudar={() => undefined} opcoes={[{ k: 'bloqueia', rotulo: 'Bloqueia' }, { k: 'alerta', rotulo: 'Só alerta', inativo: true }]} /></Estado>
          </div>
          <PeriodoAtalhos valor={periodo} aoMudar={setPeriodo} de={de} ate={ate} aoMudarDe={setDe} aoMudarAte={setAte} atalhos={[{ k: '30d', rotulo: 'Últimos 30 dias' }, { k: '90d', rotulo: 'Últimos 90 dias' }, { k: 'aud', rotulo: 'Desde a última auditoria (14/07/2026)' }, { k: 'personalizado', rotulo: 'Personalizado' }]} />
        </div>
      </Componente>

      {/* ------------------------------------------------ CabecalhoPagina */}
      <Componente
        id="cabecalho" nome="CabecalhoPagina: mesa, lista e detalhe" arquivo="src/components/ui/cabecalho.tsx" fundo="fundo"
        resumo="Uma forma por arquétipo de tela (Top 2). Mesa (Hoje): saudação + data, filtro de filial e a ação primária. Lista: título + contagem, busca e ação numa faixa só, filtros embaixo, sem subtítulo. Detalhe (Viagem, Compartimento): trilha, objeto em mono, estado, ação; com fixo, gruda e encolhe para 56 px depois de 120 px de rolagem. Sem variante: o cabeçalho antigo, inalterado."
        props={[
          ['variante', "undefined | 'mesa' | 'lista' | 'detalhe'", 'undefined', 'Sem variante: titulo, sub, acoes (como antes).'],
          ['titulo / acoes', 'ReactNode', '', 'Em todas.'],
          ['mesa: data / filtro / sub', 'ReactNode', '', 'data ao lado da saudação; filtro antes das ações.'],
          ['lista: contagem / busca / filtros', 'ReactNode', '', 'contagem ao lado do título; busca (CampoBusca) no meio; filtros (Filtros) embaixo.'],
          ['detalhe: trilha', '{ rotulo, href? }[]', '', 'Trilha em cima.'],
          ['detalhe: estado / meta / passos', 'ReactNode', '', 'estado ao lado do objeto; meta embaixo; passos (passo a passo, placas) por último.'],
          ['detalhe: mono', 'boolean', 'true', 'Objeto em mono (OC, placa).'],
          ['detalhe: fixo', 'boolean', 'false', 'Gruda no topo; encolhido esconde trilha, meta e passos. Use direto dentro de .tx-pagina.'],
        ]}
        classes={<><Cod>.tx-pagina-cab</Cod> + <Cod>--mesa</Cod> | <Cod>--lista</Cod> | <Cod>--detalhe</Cod>; <Cod>__data</Cod>, <Cod>__faixa</Cod>, <Cod>__contagem</Cod>, <Cod>__busca</Cod>, <Cod>__filtros</Cod>, <Cod>__trilha</Cod>, <Cod>__titulo--mono</Cod>, <Cod>__estado</Cod>, <Cod>__meta</Cod>, <Cod>__passos</Cod>; <Cod>--fixo</Cod>, <Cod>--encolhido</Cod> (<Cod>[data-encolhido]</Cod>), <Cod>__sentinela</Cod>.</>}
        sim={['Herói escuro só em Hoje do gestor; as outras telas usam estas três formas.', 'Contagem em texto secundário, não em frase.', 'Detalhe fixo quando a página passa de uma dobra.']}
        nao={['Frase de subtítulo que explica o conceito (vai para Termo).', 'Dois primários no cabeçalho.', 'Cabeçalho fixo em lista (o fixo da lista é o da Tabela).']}
      >
        <div className="ds-pilha" style={{ gap: 'var(--esp-6)' }}>
          <Estado rot="mesa">
            <div style={{ width: '100%' }}><CabecalhoPagina variante="mesa" titulo="Bom dia, Rafael" data="quinta, 08/10/2026" filtro={<Botao variante="contorno">Todas as filiais ▾</Botao>} acoes={<Botao variante="primario">Nova viagem</Botao>} /></div>
          </Estado>
          <Estado rot="lista">
            <div style={{ width: '100%' }}>
              <CabecalhoPagina variante="lista" titulo="Fornecedores" contagem={4} busca={<CampoBusca valor="" aoMudar={() => undefined} placeholder="Buscar nome, CNPJ ou cidade" />} acoes={<Botao variante="primario">Cadastrar fornecedor</Botao>}
                filtros={<Filtros rotulo="Filtros de fornecedor" itens={[{ k: 't', rotulo: 'Todos', contagem: 4, ativo: true }, { k: 'v', rotulo: 'Documento a vencer', contagem: 2, alerta: true }, { k: 'x', rotulo: 'Vencido', contagem: 0 }, { k: 'l', rotulo: 'Lavagem', contagem: 3 }]} />} />
            </div>
          </Estado>
          <Estado rot="detalhe, fixo (role a caixa)">
            <div style={{ width: '100%', height: 260, overflow: 'auto', border: '1px solid var(--borda)', borderRadius: 'var(--raio-g)', background: 'var(--fundo)' }}>
              <div className="tx-pagina">
                <CabecalhoPagina variante="detalhe" fixo trilha={[{ rotulo: 'Viagens', href: '#cabecalho' }, { rotulo: 'OC 48130' }]} titulo="OC 48130" estado={<Situacao tom="falta" forma="selo" />}
                  meta="Farelo de soja, 37 t. Hoje 17:00. Agro Sorriso Armazéns, Sorriso MT a NutriMax, Uberlândia MG"
                  passos={<span style={{ display: 'flex', gap: 'var(--esp-2)', alignItems: 'center' }}><span className="tx-tipo-rotulo">Placas</span><Placa placa="RCB9M15" /><Placa placa="RCB9M16" clara /></span>}
                  acoes={<><MenuLinha rotulo="Ações da viagem" gatilho={<Botao variante="contorno">Ações ▾</Botao>} itens={[{ rotulo: 'Exportar registro' }, 'separador', { rotulo: 'Cancelar viagem...', perigo: true }]} /><Botao variante="primario">Enviar link ao motorista</Botao></>} />
                {Array.from({ length: 6 }, (_, i) => <Cartao key={i} titulo={'Bloco ' + (i + 1)}><span className="tx-sec">Conteúdo para rolar.</span></Cartao>)}
              </div>
            </div>
          </Estado>
          <Estado rot="sem variante (como antes)">
            <div style={{ width: '100%' }}><CabecalhoPagina titulo="Viagens" sub="Toda viagem com a situação e o histórico" acoes={<Botao variante="contorno">Exportar planilha</Botao>} /></div>
          </Estado>
        </div>
      </Componente>

      {/* ------------------------------------------------ Termo */}
      <Componente
        id="termo" nome="Termo, SeloRegime e Dica" arquivo="src/components/ui/termo.tsx, glossario.ts"
        resumo="Jargão com explicação no lugar. Termo sublinha em pontilhado a primeira ocorrência de cada termo na tela; a dica abre ao passar o ponteiro e ao focar com Tab. O texto vem só do GLOSSARIO. SeloRegime é o selo A, B, C, D ou X com a mesma explicação. Dica é o balão genérico (ícone (i), número de painel)."
        props={[
          ['Termo.termo', 'ChaveGlossario', '', "'T-3', 'IDTF', 'regime-A'...'regime-X', 'GMP+ FSA', 'TAC', 'ETC', 'CT-e', 'OC', 'certificadora', 'alcada', 'conjunto', 'compartimento', 'gatekeeper'..."],
          ['Termo.children', 'ReactNode', 'GLOSSARIO[termo].termo', 'Texto visível, quando difere do verbete ("três últimas cargas").'],
          ['SeloRegime.regime', "'A' | 'B' | 'C' | 'D' | 'X' | '?'", '', 'Letra em mono; X em vermelho; ? (não classificada na IDTF) tracejado.'],
          ['SeloRegime.palavra', 'boolean', 'false', 'Escreve "A seco" quando há espaço.'],
          ['Dica.conteudo / children', 'ReactNode / elemento focável', '', 'O filho precisa receber foco (button, a, tabIndex).'],
          ['Dica.lado', "'top' | 'right' | 'bottom' | 'left'", "'top'", ''],
          ['GLOSSARIO', 'Record<ChaveGlossario, { termo, texto }>', '', 'src/components/ui/glossario.ts. Acrescente aqui; nunca na tela.'],
        ]}
        classes={<><Cod>.tx-termo</Cod> (sublinhado pontilhado 1 px <Cod>--texto-apagado</Cod>, <Cod>cursor: help</Cod>), <Cod>.tx-dica-balao</Cod> (280 px, fundo <Cod>--texto</Cod>, camada <Cod>--z-flutuante</Cod>), <Cod>__seta</Cod>, <Cod>.tx-regime</Cod> (<Cod>__letra</Cod>, <Cod>__palavra</Cod>, <Cod>--proibida</Cod>).</>}
        sim={['Só a primeira ocorrência do termo em cada tela.', 'Cortar o subtítulo que explicava o conceito e pôr Termo no lugar.', '"Comunicado à certificadora": OC é só ordem de carregamento.']}
        nao={['Explicação escrita na tela, fora do glossário.', 'Termo em toda ocorrência (vira ruído).', 'Dica com ação dentro (dica não é clicável).']}
      >
        <p className="tx-tipo-corpo" style={{ margin: 0, maxWidth: 720, lineHeight: 'var(--lh-paragrafo)' }}>
          A viagem só sai assegurada pela <Termo termo="GMP+ FSA" /> quando o <Termo termo="compartimento" /> tem as <Termo termo="T-3">três últimas cargas</Termo> conhecidas na <Termo termo="IDTF" /> e a limpeza do <Termo termo="regime" /> foi feita.
          Um <Termo termo="TAC" /> entra pelo <Termo termo="gatekeeper" />, comunicado à <Termo termo="certificadora" />. Quem libera um bloqueio depende da <Termo termo="alcada">alçada</Termo>; um <Termo termo="bloqueio-tecnico">bloqueio técnico</Termo> ninguém libera.
        </p>
        <div className="ds-linha" style={{ marginTop: 'var(--esp-5)', gap: 'var(--esp-6)' }}>
          <Estado rot="SeloRegime"><div className="ds-linha">{(['A', 'B', 'C', 'D', 'X', '?'] as Regime[]).map((r) => <SeloRegime key={r} regime={r} />)}</div></Estado>
          <Estado rot="Com palavra"><div className="ds-linha">{(['A', 'C', 'X'] as Regime[]).map((r) => <SeloRegime key={r} regime={r} palavra />)}</div></Estado>
          <Estado rot="Dica num ícone"><Dica conteudo="Viagem completa: T-3, verificação aprovada, termo (quando gatekeeper) e CT-e conciliado. Últimos 45 dias."><button type="button" className="tx-botao tx-botao--icone" aria-label="Como a prontidão é calculada">i</button></Dica></Estado>
        </div>
        <h4 className="ds-h3" style={{ marginTop: 'var(--esp-6)' }}>GLOSSARIO ({Object.keys(GLOSSARIO).length} verbetes)</h4>
        <table className="ds-tab">
          <thead><tr><th>Chave</th><th>Termo</th><th>Texto</th></tr></thead>
          <tbody>
            {(Object.keys(GLOSSARIO) as ChaveGlossario[]).map((k) => (
              <tr key={k}><td><Cod>{k}</Cod></td><td style={{ fontWeight: 700 }}>{GLOSSARIO[k].termo}</td><td style={{ color: 'var(--texto-2)' }}>{GLOSSARIO[k].texto}</td></tr>
            ))}
          </tbody>
        </table>
      </Componente>

      {/* ------------------------------------------------ Identidade */}
      <Componente
        id="identidade" nome="Avatar, IconeTipo e Placa" arquivo="src/components/ui/identidade.tsx"
        resumo="A âncora de cada linha é aquilo pelo que a pessoa procura. Pessoa (TAC, motorista, usuário): Avatar com iniciais em tom neutro, escolhido pelo nome entre quatro, nunca cor de situação. Empresa (ETC, fornecedor): IconeTipo cinza de 16 px antes do nome; sem avatar e sem logo. Veículo: Placa, chip escuro em mono, que é a cara do conjunto."
        props={[
          ['Avatar.nome', 'string', '', 'Iniciais do primeiro e do último nome (ignora "da", "de", "dos").'],
          ['Avatar.tamanho', "'p' | 'm' | 'g'", "'m'", '22, 28 ou 40 px. É decorativo (aria-hidden): o nome vem escrito ao lado.'],
          ['IconeTipo.tipo', "'lavagem' | 'lonas' | 'manutencao' | 'transportadora' | 'armazem' | 'certificadora' | 'empresa'", '', 'tipoDoServico(f.servico) traduz o campo de tx-dados.'],
          ['IconeTipo.rotulo', 'boolean | string', '', 'Sem: decorativo. true: o leitor ouve o tipo.'],
          ['Placa.placa', 'string', '', 'Qualquer formato; sai "QBD 3E90" (formatarPlaca).'],
          ['Placa.compartimento', 'string', '', '"C1" em tom mais claro ao lado.'],
          ['Placa.clara', 'boolean', 'false', 'Com borda: carreta ao lado do cavalo, ou sobre cabeçalho escuro.'],
          ['Placa.tamanho', "'p' | 'm' | 'g'", "'m'", ''],
        ]}
        classes={<><Cod>.tx-avatar</Cod> + <Cod>--1</Cod> a <Cod>--4</Cod> (tokens <Cod>--avatar-N-fundo</Cod> e <Cod>--avatar-N-texto</Cod>), <Cod>--p</Cod>, <Cod>--g</Cod>; <Cod>.tx-icone-tipo</Cod>; <Cod>.tx-placa</Cod>, <Cod>--clara</Cod>, <Cod>--p</Cod>, <Cod>--g</Cod>, <Cod>__comp</Cod>.</>}
        sim={['Iniciais neutras para TAC e usuário.', 'Ícone de tipo antes do nome do fornecedor.', 'Placa do cavalo escura e da carreta clara, lado a lado.']}
        nao={['Cor de avatar por pessoa em vermelho, laranja, roxo (parece situação).', 'Logo de terceiro na lista.', 'Avatar do motorista na linha do veículo.', 'Placa em texto corrido sem chip.']}
      >
        <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--esp-6)' }}>
          <Estado rot="Pessoa">
            <div className="ds-pilha" style={{ gap: 'var(--esp-2)' }}>
              {['Genivaldo Souza', 'Rosana Teles', 'Luiz Fernando Bastos', 'Ana Prates', 'Paulo Lima'].map((n) => (
                <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2-5)' }}><Avatar nome={n} /> <span className="tx-tipo-denso" style={{ fontWeight: 700 }}>{n}</span> <span className="tx-apagado tx-tipo-legenda">TAC</span></span>
              ))}
              <span className="ds-linha"><Avatar nome="Diego Saldanha" tamanho="p" /><Avatar nome="Diego Saldanha" /><Avatar nome="Diego Saldanha" tamanho="g" /></span>
            </div>
          </Estado>
          <Estado rot="Empresa">
            <div className="ds-pilha" style={{ gap: 'var(--esp-2)' }}>
              {([['lavagem', 'Estação de Lavagem BR-163'], ['lonas', 'Lonas Ribeiro'], ['manutencao', 'Oficina Trevo'], ['transportadora', 'Cerrado Cargas Ltda'], ['armazem', 'Agro Sorriso Armazéns'], ['certificadora', 'Control Union'], ['empresa', 'NutriMax Rações']] as [TipoEmpresa, string][]).map(([t, n]) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2)' }}><IconeTipo tipo={t} rotulo /><span className="tx-tipo-denso" style={{ fontWeight: 700 }}>{n}</span><span className="tx-apagado tx-tipo-legenda">{t}</span></span>
              ))}
            </div>
          </Estado>
          <Estado rot="Veículo">
            <div className="ds-pilha" style={{ gap: 'var(--esp-2)' }}>
              <span className="ds-linha"><Placa placa="qbd3e90" /><Placa placa="SQT-6B77" clara /></span>
              <span className="ds-linha"><Placa placa="SQT6B77" compartimento="C1" /><Placa placa="SQT6B77" compartimento="C2" clara /></span>
              <span className="ds-linha"><Placa placa="RCB9M15" tamanho="p" /><Placa placa="RCB9M15" /><Placa placa="RCB9M15" tamanho="g" /></span>
            </div>
          </Estado>
        </div>
      </Componente>
    </Secao>
  );
}

// ---------------------------------------------------------------- regras (U116), entra na seção Regras gerais
export const REGRAS_NOVAS = (
  <>
    <h3 className="ds-h3">Afordância: o que clica parece clicável, o que não clica não parece</h3>
    <div className="ds-regras">
      <div className="ds-regra ds-regra--sim">
        <h4>Fazer</h4>
        <ul>
          <li>Ação em texto: teal <Cod>--primario-2</Cod>, peso 700, sublinhado no hover e no foco, alvo de 32 px (<Cod>Botao variante=&quot;texto&quot;</Cod>).</li>
          <li>Cartão inteiro clicável só quando tem uma ação só; então mostra › e eleva no hover (<Cod>Cartao href</Cod>).</li>
          <li>Linha de lista clicável inteira, com fundo de hover e <Cod>SetaLinha</Cod>; Enter abre.</li>
          <li><Cod>cursor: pointer</Cod> só em quem tem ação; <Cod>cursor: help</Cod> só em <Cod>Termo</Cod> e <Cod>SeloRegime</Cod>.</li>
          <li>Chip de placa que leva ao histórico ganha um botão rotulado ao lado: &quot;Histórico de cargas ›&quot;.</li>
        </ul>
      </div>
      <div className="ds-regra ds-regra--nao">
        <h4>Não fazer</h4>
        <ul>
          <li>Pílula com borda para informação (&quot;Carrega hoje&quot;, &quot;CT-e a conciliar&quot;): pílula com borda é de chip de filtro e opção. Informação é texto ou <Cod>Situacao</Cod>.</li>
          <li>Cartão com hover de sombra que não abre nada.</li>
          <li>Instrução do tipo &quot;Clique na carreta para ver...&quot;: se precisa explicar, o elemento não parece clicável.</li>
          <li>Botão apagado que mesmo assim executa (&quot;Só alerta&quot;): ou é inativo com motivo, ou é cadeado com texto.</li>
        </ul>
      </div>
    </div>
    <h3 className="ds-h3">Ações destrutivas</h3>
    <div className="ds-regras">
      <div className="ds-regra ds-regra--sim">
        <h4>Fazer</h4>
        <ul>
          <li>Destrutiva no <Cod>MenuLinha</Cod> da linha ou do drawer, depois de um separador, em vermelho, com reticências quando confirma: &quot;Revogar acesso...&quot;, &quot;Tirar do escopo...&quot;, &quot;Cancelar viagem...&quot;, &quot;Descredenciar...&quot;.</li>
          <li>Reversível e barata (revogar convite, tirar do escopo): executa e dá <Cod>avisar(&#123; acao: Desfazer &#125;)</Cod> por 8 s.</li>
          <li>Irreversível ou com efeito em terceiros (cancelar viagem, liberar por autoridade, voltar à semente): <Cod>Confirmar</Cod> com o efeito no corpo e o verbo no botão vermelho.</li>
        </ul>
      </div>
      <div className="ds-regra ds-regra--nao">
        <h4>Não fazer</h4>
        <ul>
          <li>&quot;Revogar&quot; em texto solto na linha, ao lado de um chip, que executa no primeiro clique.</li>
          <li>Botão vermelho a poucos pixels de um link de navegação.</li>
          <li>Confirmação &quot;Tem certeza?&quot; com botão &quot;OK&quot;.</li>
        </ul>
      </div>
    </div>
    <h3 className="ds-h3">Avatar e identidade (U118)</h3>
    <p className="ds-quando">Pessoa: <Cod>Avatar</Cod> com iniciais em tom neutro. Empresa: <Cod>IconeTipo</Cod>, sem avatar e sem logo. Veículo: <Cod>Placa</Cod>, sem avatar do motorista. Cor forte é só de situação.</p>
  </>
);
