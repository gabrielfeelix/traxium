import { SurfaceShell } from "@/components/shell/surface-shell";

// Providers foi promovido ao root layout (login também precisa do store).
// O SurfaceShell (client) lê `surface` do store e escolhe o chrome inteiro:
// B → back-office · C → App de campo · A → Console · D → Portal · E → Auditor.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SurfaceShell>{children}</SurfaceShell>;
}
