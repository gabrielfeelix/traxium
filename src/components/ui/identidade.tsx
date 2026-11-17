import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './util';

/*
 * Âncora visual de cada linha de coleção (12-revisao-ux, Top 3):
 *  pessoa (TAC, motorista, usuário)  Avatar: iniciais em círculo, tom neutro escolhido pelo nome.
 *  empresa (ETC, fornecedor)         IconeTipo: ícone cinza de 16 px antes do nome. Sem logo, sem avatar.
 *  veículo                           Placa: chip escuro em mono. Nada de avatar do motorista.
 * Nenhum dos três usa cor de situação.
 */

// ---------------------------------------------------------------- Avatar
export function iniciais(nome: string): string {
  const p = String(nome || '').trim().split(/\s+/).filter((x) => !/^(d[aeo]s?|e)$/i.test(x));
  if (!p.length) return '?';
  return ((p[0][0] || '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}
/** 1 a 4, estável para o mesmo nome. */
export function tomAvatar(nome: string): 1 | 2 | 3 | 4 {
  let h = 0;
  for (const c of String(nome || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return ((h % 4) + 1) as 1 | 2 | 3 | 4;
}

export function Avatar({ nome, tamanho = 'm', className, ...p }: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & { nome: string; tamanho?: 'p' | 'm' | 'g' }) {
  return (
    <span className={cx('tx-avatar', 'tx-avatar--' + tomAvatar(nome), tamanho !== 'm' && 'tx-avatar--' + tamanho, className)} aria-hidden {...p}>
      {iniciais(nome)}
    </span>
  );
}

// ---------------------------------------------------------------- IconeTipo
export type TipoEmpresa = 'lavagem' | 'lonas' | 'manutencao' | 'transportadora' | 'armazem' | 'certificadora' | 'empresa';
const ROTULO_TIPO: Record<TipoEmpresa, string> = {
  lavagem: 'Lavagem',
  lonas: 'Lonas e amarração',
  manutencao: 'Manutenção',
  transportadora: 'Transportadora',
  armazem: 'Armazém',
  certificadora: 'Certificadora',
  empresa: 'Empresa',
};
const DESENHO: Record<TipoEmpresa, ReactNode> = {
  lavagem: <path d="M8 2.2C6.2 4.6 4.3 6.9 4.3 9.4a3.7 3.7 0 0 0 7.4 0C11.7 6.9 9.8 4.6 8 2.2Z" />,
  lonas: (
    <>
      <path d="M2.2 5.2 8 3l5.8 2.2v6.2L8 13.6l-5.8-2.2Z" />
      <path d="M2.2 5.2 8 7.4l5.8-2.2M8 7.4v6.2" />
    </>
  ),
  manutencao: <path d="M10.4 2.4a3 3 0 0 0-3.6 3.9L2.6 10.5a1.4 1.4 0 0 0 2 2l4.2-4.2a3 3 0 0 0 3.9-3.6l-1.8 1.8-1.8-.3-.3-1.8Z" />,
  transportadora: (
    <>
      <path d="M1.8 4.5h7.4v6H1.8zM9.2 6.6h2.7l2.3 2.2v1.7H9.2" />
      <circle cx="4.4" cy="11.6" r="1.2" />
      <circle cx="11.6" cy="11.6" r="1.2" />
    </>
  ),
  armazem: (
    <>
      <path d="M2.2 6.6 8 3l5.8 3.6V13H2.2Z" />
      <path d="M5.4 13V9h5.2v4" />
    </>
  ),
  certificadora: (
    <>
      <circle cx="8" cy="6.4" r="3.6" />
      <path d="m5.8 9.4-1 4.4L8 12.4l3.2 1.4-1-4.4" />
    </>
  ),
  empresa: (
    <>
      <path d="M3 13.6V3h6.4v10.6M9.4 6.4H13v7.2" />
      <path d="M5.2 5.4h2M5.2 7.8h2M5.2 10.2h2M2 13.6h12" />
    </>
  ),
};

/** Mapeia o campo `servico` dos fornecedores de tx-dados ('lavagem', 'lonas e amarração'...). */
export function tipoDoServico(servico?: string | null): TipoEmpresa {
  const s = String(servico || '').toLowerCase();
  if (s.includes('lava')) return 'lavagem';
  if (s.includes('lona')) return 'lonas';
  if (s.includes('manut') || s.includes('oficina')) return 'manutencao';
  if (s.includes('transp')) return 'transportadora';
  if (s.includes('armaz')) return 'armazem';
  return 'empresa';
}

/** Ícone de tipo de empresa, 16 px, cinza. Com `rotulo`, o leitor de tela ouve o tipo; sem, é decorativo. */
export function IconeTipo({ tipo, rotulo, className }: { tipo: TipoEmpresa; rotulo?: boolean | string; className?: string }) {
  const nome = typeof rotulo === 'string' ? rotulo : ROTULO_TIPO[tipo];
  return (
    <svg
      className={cx('tx-icone-tipo', className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo ? nome : undefined}
      aria-hidden={rotulo ? undefined : true}
    >
      {rotulo ? <title>{nome}</title> : null}
      {DESENHO[tipo]}
    </svg>
  );
}

// ---------------------------------------------------------------- Placa
/** "qbd3e90", "QBD-3E90" e "QBD 3E90" viram "QBD 3E90". */
export function formatarPlaca(p: string): string {
  const s = String(p || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return s.length === 7 ? s.slice(0, 3) + ' ' + s.slice(3) : s;
}

/**
 * Placa como identidade do veículo: chip escuro, mono. `compartimento` acrescenta a posição
 * ("C1") em tom mais claro. `clara` é a versão de borda, para dentro de cabeçalho escuro ou
 * para a carreta ao lado do cavalo.
 */
export function Placa({ placa, compartimento, clara, tamanho = 'm', className, ...p }: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  placa: string;
  compartimento?: string;
  clara?: boolean;
  tamanho?: 'p' | 'm' | 'g';
}) {
  const f = formatarPlaca(placa);
  return (
    <span className={cx('tx-placa', clara && 'tx-placa--clara', tamanho !== 'm' && 'tx-placa--' + tamanho, className)} {...p}>
      {f}
      {compartimento ? <span className="tx-placa__comp">{compartimento}</span> : null}
    </span>
  );
}
