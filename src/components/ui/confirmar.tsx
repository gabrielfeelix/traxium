'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Botao } from './botao';
import { AreaTexto, Campo } from './campo';
import { textoFalta } from './falta';
import { IconeFechar } from './sobreposicao';
import { devolverFocoAoGatilho } from './util';

/*
 * Confirmar: diálogo para ação irreversível ou com efeito em terceiros (cancelar viagem, revogar
 * acesso, voltar à semente). O corpo diz o efeito; o botão diz o verbo ("Revogar acesso"), nunca "OK".
 * Ação reversível e barata não confirma: executa e mostra avisar({ acao: Desfazer }).
 *
 * Com `motivo`, pede um texto obrigatório; o botão fica inativo e o rodapé diz "Falta: motivo".
 * Radix Dialog: foco preso, Esc fecha, foco volta a quem abriu. A tela guarda só `aberto`.
 */
export type ConfirmarProps = {
  aberto: boolean;
  aoFechar: () => void;
  /** Recebe o motivo digitado (string vazia quando não há campo de motivo). */
  aoConfirmar: (motivo: string) => void;
  titulo: ReactNode;
  /** O efeito, escrito: "O link do motorista para de funcionar. As viagens feitas continuam no histórico." */
  children?: ReactNode;
  /** Verbo do botão: "Revogar acesso", "Tirar do escopo". */
  rotuloConfirmar: string;
  rotuloCancelar?: string;
  /** Vermelho (padrão). false para confirmação não destrutiva (botão primário). */
  perigo?: boolean;
  /** Campo de motivo. minimo em caracteres (padrão 1 quando obrigatorio). */
  motivo?: { rotulo: string; dica?: string; obrigatorio?: boolean; minimo?: number; placeholder?: string };
  carregando?: boolean;
  /** Desenha no fluxo da página (documentação). */
  estatico?: boolean;
};

export function Confirmar(props: ConfirmarProps) {
  const { aberto, aoFechar, estatico } = props;
  if (estatico) {
    return (
      <div className="tx-veu tx-veu--estatico">
        <div role="dialog" aria-labelledby="tx-confirmar-ex-titulo" className="tx-modal tx-modal--p tx-confirmar">
          <Miolo {...props} idTitulo="tx-confirmar-ex-titulo" />
        </div>
      </div>
    );
  }
  return (
    <Dialog.Root open={aberto} onOpenChange={(v) => { if (!v) aoFechar(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="tx-veu tx-veu--leve">
          <Dialog.Content
            className="tx-modal tx-modal--p tx-confirmar"
            data-foco-proprio
            aria-describedby={undefined}
            onOpenAutoFocus={(e) => {
              // Foco no motivo, se houver; senão em Cancelar (nunca no botão destrutivo).
              e.preventDefault();
              const el = e.currentTarget as HTMLElement;
              (el.querySelector<HTMLElement>('textarea') || el.querySelector<HTMLElement>('[data-tx-cancelar]'))?.focus();
            }}
            onCloseAutoFocus={(e) => {
              if (!document.activeElement || document.activeElement === document.body) {
                if (devolverFocoAoGatilho()) e.preventDefault();
              }
            }}
          >
            <Miolo {...props} />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Miolo({ aberto, aoFechar, aoConfirmar, titulo, children, rotuloConfirmar, rotuloCancelar = 'Cancelar', perigo = true, motivo, carregando, estatico, idTitulo }: ConfirmarProps & { idTitulo?: string }) {
  const [texto, setTexto] = useState('');
  const campo = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (aberto) setTexto('');
  }, [aberto]);
  const minimo = motivo ? (motivo.minimo ?? (motivo.obrigatorio ? 1 : 0)) : 0;
  const faltam = minimo - texto.trim().length;
  const falta = motivo && faltam > 0 ? textoFalta([minimo > 1 && texto.trim() ? 'motivo (faltam ' + faltam + ' caracteres)' : 'motivo']) : '';
  const Titulo = estatico ? 'h2' : Dialog.Title;
  const confirmar = () => {
    if (falta) {
      campo.current?.focus();
      return;
    }
    aoConfirmar(texto.trim());
  };
  return (
    <>
      <div className="tx-modal__cab">
        <div className="tx-modal__titulos">
          <Titulo {...(idTitulo ? { id: idTitulo } : {})} className="tx-modal__titulo">{titulo}</Titulo>
        </div>
        <Botao variante="icone" aria-label="Fechar" onClick={aoFechar} icone={IconeFechar} />
      </div>
      {children || motivo ? (
        <div className="tx-modal__corpo">
          {children ? <div className="tx-confirmar__efeito">{children}</div> : null}
          {motivo ? (
            <Campo id={(idTitulo || 'tx-confirmar') + '-motivo'} rotulo={motivo.rotulo} dica={motivo.dica} opcional={!motivo.obrigatorio && !motivo.minimo}>
              <AreaTexto ref={campo} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={motivo.placeholder} rows={3} />
            </Campo>
          ) : null}
        </div>
      ) : null}
      <div className="tx-modal__rodape">
        {falta ? <span className="tx-falta" aria-live="polite">{falta}</span> : null}
        <Botao onClick={aoFechar} data-tx-cancelar>{rotuloCancelar}</Botao>
        <Botao variante={perigo ? 'perigo' : 'primario'} inativo={!!falta} carregando={carregando} onClick={confirmar}>
          {rotuloConfirmar}
        </Botao>
      </div>
    </>
  );
}
