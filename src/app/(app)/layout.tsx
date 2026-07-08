import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { Providers } from "@/components/shell/providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-[hsl(180_14%_97%)]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 px-6 py-6 max-w-screen-2xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
