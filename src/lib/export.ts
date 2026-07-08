// Exportações reais client-side (sem backend). Chamar sempre em event handlers.

function triggerDownload(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/** Baixa um CSV (com BOM p/ Excel PT-BR). */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers.map(esc).join(";"), ...rows.map((r) => r.map(esc).join(";"))].join("\r\n");
  triggerDownload(filename.endsWith(".csv") ? filename : `${filename}.csv`, "text/csv;charset=utf-8", "﻿" + csv);
}

/** Baixa um JSON formatado (pacote de dados). */
export function downloadJSON(filename: string, data: unknown) {
  triggerDownload(filename.endsWith(".json") ? filename : `${filename}.json`, "application/json", JSON.stringify(data, null, 2));
}

/** Aciona a impressão do navegador (Salvar como PDF). */
export function printPDF() {
  window.print();
}
