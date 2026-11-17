'use client';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { useId, type MouseEvent, type ReactNode } from 'react';
import { classeBotao } from './botao';
import { Dica } from './termo';
import { cx, lembrarGatilho } from './util';

/*
 * MenuLinha: o botão [...] de uma linha (ou do drawer) com as ações do registro. Radix DropdownMenu:
 * Enter, espaço e seta abrem; setas percorrem; Esc fecha e devolve o foco ao botão.
 *
 * Regra das destrutivas: ficam por último, depois de um 'separador', com `perigo` e reticências no
 * rótulo quando abrem confirmação ("Tirar do escopo...", "Revogar acesso...").
 * Item inativo continua focável (para a dica com o motivo ser lida) e não executa.
 *
 * O clique no botão e nos itens não chega à linha (stopPropagation): a linha pode ter onClick.
 * Não ponha MenuLinha dentro de TabelaLinha com href (botão dentro de link é HTML inválido): use onClick.
 */
export type ItemMenu = {
  k?: string;
  rotulo: string;
  icone?: ReactNode;
  aoSelecionar?: () => void;
  /** Ação destrutiva: vermelho. */
  perigo?: boolean;
  /** Não vale agora; continua no menu, apagado. */
  inativo?: boolean;
  /** Por que está inativo. Vira dica ao lado e descrição para o leitor de tela. */
  motivo?: string;
  /** Atalho mostrado à direita (só texto, ex.: "E"). */
  atalho?: string;
};

export type MenuLinhaProps = {
  itens: (ItemMenu | 'separador')[];
  /** aria-label do botão: "Ações de QBD 3E90". Obrigatório. */
  rotulo: string;
  /** Gatilho próprio (ex.: Botao "Ações"). Padrão: botão de ícone [...] de 32 px. */
  gatilho?: ReactNode;
  alinhar?: 'start' | 'end';
  className?: string;
};

export const IconeMais = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <circle cx="3.5" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="12.5" cy="8" r="1.4" />
  </svg>
);

const parar = (e: MouseEvent) => e.stopPropagation();

function Item({ it }: { it: ItemMenu }) {
  const idMotivo = useId();
  const el = (
    <Menu.Item
      className={cx('tx-menu__item', it.perigo && 'tx-menu__item--perigo')}
      aria-disabled={it.inativo || undefined}
      aria-describedby={it.inativo && it.motivo ? idMotivo : undefined}
      onSelect={(e) => {
        if (it.inativo) {
          e.preventDefault();
          return;
        }
        lembrarGatilho(document.querySelector<HTMLElement>('[aria-haspopup="menu"][data-state="open"]'));
        it.aoSelecionar?.();
      }}
    >
      {it.icone ? <span className="tx-menu__icone" aria-hidden>{it.icone}</span> : null}
      <span className="tx-menu__rotulo">{it.rotulo}</span>
      {it.atalho ? <kbd className="tx-menu__atalho">{it.atalho}</kbd> : null}
      {it.inativo && it.motivo ? <span id={idMotivo} className="tx-so-leitor">{it.motivo}</span> : null}
    </Menu.Item>
  );
  return it.inativo && it.motivo ? <Dica conteudo={it.motivo} lado="left" atraso={100}>{el}</Dica> : el;
}

export function MenuLinha({ itens, rotulo, gatilho, alinhar = 'end', className }: MenuLinhaProps) {
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger asChild onClick={parar} onKeyDown={(e) => e.stopPropagation()}>
        {gatilho ?? (
          <button type="button" className={cx(classeBotao({ variante: 'icone' }), 'tx-menu__gatilho', className)} aria-label={rotulo}>
            {IconeMais}
          </button>
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className="tx-menu" align={alinhar} sideOffset={4} collisionPadding={8} onClick={parar} loop>
          {itens.map((it, i) =>
            it === 'separador' ? <Menu.Separator key={'s' + i} className="tx-menu__separador" /> : <Item key={it.k || it.rotulo} it={it} />,
          )}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
