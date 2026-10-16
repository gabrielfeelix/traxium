// Ícones da sidebar (os mesmos do protótipo .dc.html).
import type { ReactElement } from 'react';

const I: Record<string, ReactElement> = {
  "hoje": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="3.2" width="11" height="10.3" rx="2.4" /><line x1="2.5" y1="6.6" x2="13.5" y2="6.6" /><line x1="5.6" y1="1.8" x2="5.6" y2="4.2" /><line x1="10.4" y1="1.8" x2="10.4" y2="4.2" /><circle cx="8" cy="10" r="1.3" fill="currentColor" stroke="none" /></svg>,
  "viagens": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8h9" /><path d="M8 4.5 11.5 8 8 11.5" /></svg>,
  "transportadores": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="5.4" cy="6.2" r="2.4" /><circle cx="10.8" cy="6.2" r="2.4" /><path d="M2.5 13c.6-2 1.7-3 3-3s2.3 1 2.9 3" strokeLinecap="round" /></svg>,
  "frota": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4.5" width="8" height="5.5" rx="1.4" /><path d="M10 6.5h2.4l1.6 2v1.5h-4z" strokeLinejoin="round" /><circle cx="5" cy="11.8" r="1.4" /><circle cx="11.6" cy="11.8" r="1.4" /></svg>,
  "auditoria": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2.6" y="2.2" width="8" height="10.5" rx="1.8" /><line x1="4.8" y1="5.4" x2="8.4" y2="5.4" /><line x1="4.8" y1="8" x2="7.2" y2="8" /><circle cx="10.6" cy="10.4" r="2.3" /><line x1="12.3" y1="12.1" x2="14" y2="13.8" /></svg>,
  "cadastros": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M8 2.2 13.5 5 8 7.8 2.5 5z" /><path d="M2.5 8 8 10.8 13.5 8" strokeLinecap="round" /><path d="M2.5 11 8 13.8 13.5 11" strokeLinecap="round" /></svg>,
  "config": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="2.3" /><path d="M8 1.8v1.9M8 12.3v1.9M14.2 8h-1.9M3.7 8H1.8M12.4 3.6l-1.3 1.3M4.9 11.1l-1.3 1.3M12.4 12.4l-1.3-1.3M4.9 4.9 3.6 3.6" strokeLinecap="round" /></svg>,
  "link": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="1.8" width="9" height="12.4" rx="2" /><line x1="6.5" y1="4" x2="9.5" y2="4" /><circle cx="8" cy="11.7" r=".65" fill="currentColor" stroke="none" /></svg>,
  "anterior": <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.6 8a5.4 5.4 0 1 0 1.6-3.8" /><path d="M2.4 2.6v2.6H5" /><path d="M8 5.2V8l1.9 1.3" /></svg>,
  logo: <svg aria-hidden style={{ flex: 'none' }} width="34" height="34" viewBox="0 0 32 32"><defs><linearGradient id="txLogo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1a9e93" /><stop offset="1" stopColor="#0E78B5" /></linearGradient></defs><polygon points="16,2.5 27.5,9 27.5,23 16,29.5 4.5,23 4.5,9" fill="url(#txLogo)" /><polyline points="9,20 13,13 18,17 23,10" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.6" fill="#fff" /><circle cx="13" cy="13" r="1.6" fill="#fff" /><circle cx="18" cy="17" r="1.6" fill="#fff" /><circle cx="23" cy="10" r="1.6" fill="#fff" /></svg>,
};

export function Icone({ k }: { k: string }) {
  return I[k] || null;
}
