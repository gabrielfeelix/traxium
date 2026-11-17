'use client';
/* Moldura de cada seção e de cada componente do /design-system (usada por vitrine.tsx e vitrine-ds2.tsx). */
import { useState, type ReactNode } from 'react';
import { Abas } from '@/components/ui';

// ---------------------------------------------------------------- moldura da página
export function Cod({ children }: { children: ReactNode }) {
  return <code className="ds-cod">{children}</code>;
}
export function Secao({ id, n, titulo, intro, children }: { id: string; n: string; titulo: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="ds-sec" id={id}>
      <div className="ds-sec-cab">
        <span className="ds-sec-num">{n}</span>
        <h2 className="ds-h2">{titulo}</h2>
      </div>
      {intro ? <p className="ds-intro">{intro}</p> : null}
      {children}
    </section>
  );
}
export type Prop = [string, string, string, string];
export function Componente({ id, nome, arquivo, resumo, props, classes, sim, nao, fundo, children }: {
  id: string; nome: string; arquivo: string; resumo: ReactNode; props: Prop[]; classes: ReactNode; sim: string[]; nao: string[]; fundo?: 'liso' | 'fundo'; children: ReactNode;
}) {
  const [aba, setAba] = useState<'props' | 'classes' | 'regras'>('props');
  return (
    <article className="ds-comp" id={id}>
      <div className="ds-comp-cab">
        <h3 className="ds-comp-nome">{nome}</h3>
        <span className="ds-comp-arquivo">{arquivo}</span>
      </div>
      <p className="ds-quando" style={{ marginTop: 'var(--esp-1)' }}>{resumo}</p>
      <div className="ds-palco">
        <div className={'ds-palco-corpo' + (fundo ? ' ds-palco-corpo--' + fundo : '')}>{children}</div>
        <div className="ds-abas-doc">
          <Abas
            rotulo={'Documentação de ' + nome}
            className="ds-abas-doc-lista"
            itens={[
              { k: 'props', n: 'Props', ativa: aba === 'props', onClick: () => setAba('props') },
              { k: 'classes', n: 'Classes', ativa: aba === 'classes', onClick: () => setAba('classes') },
              { k: 'regras', n: 'Fazer e não fazer', ativa: aba === 'regras', onClick: () => setAba('regras') },
            ]}
          />
        </div>
        <div className="ds-detalhe">
          {aba === 'props' ? (
            <table className="ds-tab">
              <thead><tr><th>Prop</th><th>Tipo</th><th>Padrão</th><th>Para quê</th></tr></thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p[0]}><td><Cod>{p[0]}</Cod></td><td className="tx-mono" style={{ fontSize: 'var(--fs-legenda)' }}>{p[1]}</td><td className="tx-mono" style={{ fontSize: 'var(--fs-legenda)' }}>{p[2]}</td><td>{p[3]}</td></tr>
                ))}
              </tbody>
            </table>
          ) : aba === 'classes' ? (
            <div className="ds-quando" style={{ margin: 0, maxWidth: 'none' }}>{classes}</div>
          ) : (
            <div className="ds-regras" style={{ marginTop: 0 }}>
              <div className="ds-regra ds-regra--sim"><h4>Fazer</h4><ul>{sim.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div className="ds-regra ds-regra--nao"><h4>Não fazer</h4><ul>{nao.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
export function Estado({ rot, children }: { rot: string; children: ReactNode }) {
  return (
    <div className="ds-estado">
      <span className="ds-rot">{rot}</span>
      {children}
    </div>
  );
}

