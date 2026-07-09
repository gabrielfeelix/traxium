"use client";

import {
  Building2,
  Users,
  Bell,
  Shield,
  CreditCard,
  Webhook,
  KeyRound,
  Mail,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { ConvidarUsuarioModal, type Convidado } from "@/components/modals/convidar-usuario-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAPEIS_EQUIPE = ["Admin", "Compliance", "Operação", "Auditor (acesso limitado)"] as const;
import { navigation } from "@/components/shell/sidebar";
import { PAPEL_LABEL, type Papel } from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";

// Papéis de escritório (campo tem superfície própria e não usa esta matriz).
const PAPEIS_MATRIZ: Papel[] = ["gestor", "despachante", "diretoria_rt", "admin_subcontratados", "auditor_interno"];

/** Matriz papel×permissão — derivada da MESMA fonte que filtra a sidebar (§3). */
function MatrizPermissoes() {
  const { papel } = useSession();
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[620px]">
        <thead>
          <tr>
            <th className="text-left text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft pb-2 pr-3">
              Módulo
            </th>
            {PAPEIS_MATRIZ.map((p) => (
              <th
                key={p}
                className={cn(
                  "text-center text-[9px] uppercase tracking-[0.1em] font-semibold pb-2 px-1.5 leading-tight",
                  p === papel ? "text-brand-700" : "text-fg-muted"
                )}
              >
                {PAPEL_LABEL[p]}
                {p === papel && <span className="block text-[8px] font-bold text-brand-500">você</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {navigation.map((grupo) => (
            <Fragment key={grupo.title}>
              <tr>
                <td colSpan={PAPEIS_MATRIZ.length + 1} className="pt-3 pb-1">
                  <span className="text-[9px] uppercase tracking-[0.14em] font-bold text-fg-soft">{grupo.title}</span>
                </td>
              </tr>
              {grupo.items.map((item) => (
                <tr key={item.href} className="border-t border-border-soft">
                  <td className="py-1.5 pr-3">
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-fg whitespace-nowrap">
                      <item.icon className="size-3.5 text-fg-muted" /> {item.label}
                    </span>
                  </td>
                  {PAPEIS_MATRIZ.map((p) => {
                    const acesso = item.access[p];
                    return (
                      <td key={p} className={cn("text-center py-1.5 px-1.5", p === papel && "bg-brand-50/40")}>
                        {acesso === "full" ? (
                          <span className="inline-block rounded-full bg-brand-600 text-white text-[9px] font-bold px-2 py-0.5">
                            edita
                          </span>
                        ) : acesso === "read" ? (
                          <span className="inline-block rounded-full border border-border text-fg-muted text-[9px] font-bold px-2 py-0.5">
                            vê
                          </span>
                        ) : (
                          <span className="text-[10px] text-fg-soft" aria-label="sem acesso">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Mapa de sistemas conectados ───────────────────────────────────────────────

type Sistema = { id: string; nome: string; desc: string; categoria: string; on: boolean };

const SISTEMAS_INICIAIS: Sistema[] = [
  { id: "traces", nome: "TRACES NT", desc: "Submissão M2M de DDS · Comissão Europeia", categoria: "Regulatório", on: true },
  { id: "car", nome: "CAR", desc: "Cadastro Ambiental Rural · validação de fazendas", categoria: "Regulatório", on: true },
  { id: "sefaz", nome: "SEFAZ", desc: "CT-e e MDF-e · emissão e consulta fiscal", categoria: "Fiscal", on: true },
  { id: "inpe", nome: "INPE", desc: "TerraBrasilis · detecção de desmatamento", categoria: "Monitoramento", on: true },
  { id: "mapbiomas", nome: "MapBiomas", desc: "Alerta · validação cruzada de polígonos", categoria: "Monitoramento", on: true },
  { id: "sascar", nome: "Sascar", desc: "Rastreador veicular · telemetria em tempo real", categoria: "Telemetria", on: true },
  { id: "buonny", nome: "Buonny", desc: "Seguradora de carga · compliance de rota", categoria: "Telemetria", on: true },
  { id: "slack", nome: "Slack", desc: "Notificações em canal", categoria: "Comunicação", on: true },
  { id: "teams", nome: "Teams", desc: "Notificações em canal · Microsoft", categoria: "Comunicação", on: false },
  { id: "powerbi", nome: "Power BI", desc: "Conector OData para BI", categoria: "BI", on: false },
];

/** Mapa hub-and-spoke: Traxium no centro, cada sistema num raio com status. */
function MapaSistemas({ sistemas }: { sistemas: Sistema[] }) {
  const cx = 380, cy = 175, rx = 290, ry = 125;
  return (
    <svg viewBox="0 0 760 350" role="img" aria-label="Mapa de sistemas conectados ao Traxium" className="w-full">
      {sistemas.map((s, i) => {
        const ang = (i / sistemas.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(ang) * rx;
        const y = cy + Math.sin(ang) * ry;
        const anchor = Math.cos(ang) > 0.35 ? "start" : Math.cos(ang) < -0.35 ? "end" : "middle";
        const dy = Math.sin(ang) > 0.4 ? 22 : Math.sin(ang) < -0.4 ? -14 : 4;
        const dx = anchor === "start" ? 12 : anchor === "end" ? -12 : 0;
        return (
          <g key={s.id}>
            <line
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={s.on ? "var(--color-brand-500)" : "var(--color-fg-soft)"}
              strokeWidth={s.on ? 1.5 : 1}
              strokeDasharray={s.on ? undefined : "4 4"}
              opacity={s.on ? 0.45 : 0.3}
            />
            <circle cx={x} cy={y} r={s.on ? 6 : 4.5} fill={s.on ? "var(--color-brand-500)" : "var(--color-fg-soft)"} opacity={s.on ? 1 : 0.5} />
            {s.on && <circle cx={x} cy={y} r={9} fill="none" stroke="var(--color-brand-500)" strokeWidth={1} opacity={0.3} />}
            <text
              x={x + dx} y={y + dy}
              textAnchor={anchor}
              fontSize={11}
              fontWeight={700}
              fill={s.on ? "var(--color-fg)" : "var(--color-fg-soft)"}
            >
              {s.nome}
            </text>
            <text
              x={x + dx} y={y + dy + 11}
              textAnchor={anchor}
              fontSize={8}
              fill="var(--color-fg-soft)"
              style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              {s.on ? s.categoria : "desligado"}
            </text>
          </g>
        );
      })}
      {/* Hub */}
      <rect x={cx - 62} y={cy - 21} width={124} height={42} rx={10} fill="var(--color-brand-700)" />
      <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="white" style={{ letterSpacing: "0.14em" }}>
        TRAXIUM
      </text>
    </svg>
  );
}

const EQUIPE_INICIAL: Convidado[] = [
  { nome: "Leonardo Felix", email: "leonardo@bomfrete.com.br", papel: "Owner" },
  { nome: "Beto Souza", email: "beto@bomfrete.com.br", papel: "Admin" },
  { nome: "Rafael · RD Insight", email: "rafael@rdinsight.com.br", papel: "Compliance" },
  { nome: "Gabriel Felix", email: "gabriel@traxium.com.br", papel: "UX · Admin" },
  { nome: "Matheus Bruno", email: "matheus@traxium.com.br", papel: "Engenharia" },
  { nome: "Helena Marques", email: "helena@auditoria-gmp.com.br", papel: "Auditor (acesso limitado)" },
];

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [convidarOpen, setConvidarOpen] = useState(false);
  const [equipe, setEquipe] = useState<Convidado[]>(EQUIPE_INICIAL);
  const [sistemas, setSistemas] = useState<Sistema[]>(SISTEMAS_INICIAIS);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Preferências da transportadora, equipe, integrações, segurança e faturamento."
      />

      <Tabs defaultValue="organizacao">
        <div className="flex gap-6">
          <TabsList className="flex-col items-stretch h-auto p-1 w-56 shrink-0">
            <TabsTrigger value="organizacao" className="justify-start">
              <Building2 className="size-4" /> Organização
            </TabsTrigger>
            <TabsTrigger value="equipe" className="justify-start">
              <Users className="size-4" /> Equipe e permissões
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="justify-start">
              <Bell className="size-4" /> Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="justify-start">
              <Shield className="size-4" /> Segurança
            </TabsTrigger>
            <TabsTrigger value="integracoes" className="justify-start">
              <Webhook className="size-4" /> Integrações
            </TabsTrigger>
            <TabsTrigger value="api" className="justify-start">
              <KeyRound className="size-4" /> API e tokens
            </TabsTrigger>
            <TabsTrigger value="faturamento" className="justify-start">
              <CreditCard className="size-4" /> Plano e faturamento
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="organizacao">
              <Card>
                <CardHeader>
                  <CardTitle>Organização</CardTitle>
                  <CardDescription>Informações cadastrais da transportadora ativa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Razão social</Label>
                      <Input className="mt-1" defaultValue="Bom Frete Transportes Ltda" />
                    </div>
                    <div>
                      <Label>CNPJ</Label>
                      <Input className="mt-1" defaultValue="12.345.678/0001-90" />
                    </div>
                    <div>
                      <Label>Inscrição estadual</Label>
                      <Input className="mt-1" defaultValue="13.456.789-0" />
                    </div>
                    <div>
                      <Label>Selo GMP+ FSA</Label>
                      <Input className="mt-1" defaultValue="GMP-BR-2024-00871" />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input className="mt-1" defaultValue="Rondonópolis" />
                    </div>
                    <div>
                      <Label>UF</Label>
                      <Input className="mt-1" defaultValue="MT" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Endereço</Label>
                      <Input className="mt-1" defaultValue="Av. dos Estudantes, 1450 · Centro · Rondonópolis/MT" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button variant="gradient" onClick={() => toast("Configurações salvas")}>Salvar alterações</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipe" className="space-y-4">
              {/* Momento-assinatura: a matriz papel×permissão — a MESMA fonte que filtra a sidebar. */}
              <Card>
                <CardHeader>
                  <CardTitle>Matriz papel × permissão</CardTitle>
                  <CardDescription>
                    O que cada papel de escritório vê e edita — derivada da mesma matriz (§3) que monta a
                    navegação. Motorista e inspetor operam no App de campo, fora desta matriz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MatrizPermissoes />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Equipe</CardTitle>
                    <CardDescription>Usuários internos e papéis no sistema</CardDescription>
                  </div>
                  <Button variant="gradient" size="sm" onClick={() => setConvidarOpen(true)}>
                    <Plus className="size-4" /> Convidar usuário
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {equipe.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border-soft hover:bg-brand-50/50"
                    >
                      <Avatar>
                        <AvatarFallback>{u.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold">{u.nome}</p>
                        <p className="text-[11px] text-fg-muted">{u.email}</p>
                      </div>
                      <Badge variant={u.papel === "Owner" ? "default" : "outline"} className="text-[10px]">
                        {u.papel}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={u.papel === "Owner"}>
                            Gerenciar
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {PAPEIS_EQUIPE.filter((p) => p !== u.papel).map((p) => (
                            <DropdownMenuItem
                              key={p}
                              onClick={() => {
                                setEquipe((cur) => cur.map((x, xi) => (xi === i ? { ...x, papel: p } : x)));
                                toast("Papel alterado", { desc: `${u.nome} → ${p}` });
                              }}
                            >
                              Tornar {p}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEquipe((cur) => cur.filter((_, xi) => xi !== i));
                              toast("Usuário removido", { type: "error", desc: u.nome });
                            }}
                          >
                            Remover da equipe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>Quando e como o Traxium te avisa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    "Carga bloqueada por motor de regras",
                    "Auditoria GMP+ agendada (D-30, D-7, D-1)",
                    "Certificação de motorista a vencer (D-30)",
                    "Certificação de carreta a vencer (D-30)",
                    "DDS aprovada pelo TRACES NT",
                    "DDS rejeitada pelo TRACES NT",
                    "Alerta de desmatamento em fazenda cadastrada",
                    "Não conformidade crítica aberta",
                    "Resumo semanal de operação por e-mail",
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-brand-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="size-4 text-fg-muted" />
                        <span className="text-sm">{n}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-fg-muted">E-mail</span>
                          <Switch defaultChecked={i % 2 === 0} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-fg-muted">Push</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-fg-muted">Slack</span>
                          <Switch defaultChecked={i < 3} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Autenticação, sessões e auditoria de acesso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SwitchRow label="Autenticação em duas etapas (2FA) obrigatória" defaultChecked />
                  <SwitchRow label="Single Sign-On com Microsoft Entra" />
                  <SwitchRow label="Bloquear sessão após 30 min de inatividade" defaultChecked />
                  <SwitchRow label="Forçar troca de senha a cada 90 dias" defaultChecked />
                  <SwitchRow label="Habilitar trilha de auditoria LGPD" defaultChecked />
                  <SwitchRow label="Restringir login a IPs corporativos" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integracoes">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa de sistemas conectados</CardTitle>
                  <CardDescription>
                    O ecossistema ao redor do Traxium — conexão ativa em linha cheia, desligada em tracejado.
                    Os interruptores abaixo refletem no mapa na hora.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Momento-assinatura: hub-and-spoke com status vivo. */}
                  <MapaSistemas sistemas={sistemas} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border-soft pt-4">
                    {sistemas.map((s) => (
                      <div key={s.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border-soft">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold flex items-center gap-1.5">
                            <span className={cn("size-1.5 rounded-full shrink-0", s.on ? "bg-success-500" : "bg-fg-soft/50")} aria-hidden />
                            {s.nome}
                            <span className="text-[9px] uppercase tracking-[0.1em] font-bold text-fg-soft">{s.categoria}</span>
                          </p>
                          <p className="text-[11px] text-fg-muted truncate">{s.desc}</p>
                        </div>
                        <Switch
                          checked={s.on}
                          aria-label={`${s.on ? "Desligar" : "Ligar"} integração ${s.nome}`}
                          onCheckedChange={(on) =>
                            setSistemas((cur) => cur.map((x) => (x.id === s.id ? { ...x, on } : x)))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>Tokens de API</CardTitle>
                  <CardDescription>Para integração com seus sistemas internos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { nome: "TMS Bom Frete · Produção", token: "trx_live_•••••••••••8a7b", criadoEm: "12/03/2026" },
                    { nome: "Power BI Connector", token: "trx_live_•••••••••••f29c", criadoEm: "02/04/2026" },
                    { nome: "Webhook ERP", token: "trx_live_•••••••••••2d11", criadoEm: "18/05/2026" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border-soft">
                      <KeyRound className="size-4 text-brand-500" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{t.nome}</p>
                        <p className="text-[11px] font-mono text-fg-muted">{t.token}</p>
                      </div>
                      <span className="text-[11px] text-fg-muted">criado em {t.criadoEm}</span>
                      <Button variant="outline" size="sm" onClick={() => toast("Token revogado", { type: "error" })}>Revogar</Button>
                    </div>
                  ))}
                  <Button variant="gradient" size="sm" className="mt-2" onClick={() => toast("Novo token gerado", { desc: "trx_sk_" + "•".repeat(24) })}>
                    <Plus className="size-4" /> Gerar novo token
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faturamento">
              <Card>
                <CardHeader>
                  <CardTitle>Plano e faturamento</CardTitle>
                  <CardDescription>Plano Enterprise · 312 caminhões · 487 motoristas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gradient-to-br from-brand-50 to-brand-50/40 border border-brand-500/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="default" className="text-[10px]">Plano Enterprise</Badge>
                        <p className="text-[28px] font-bold mt-2 tabular-nums tracking-[-0.02em]">
                          R$ 28.400<span className="text-[14px] font-normal">/mês</span>
                        </p>
                        <p className="text-xs text-fg-muted mt-1">+ R$ 0,42 por viagem acima de 6.000</p>
                      </div>
                      <Button variant="outline" size="sm">Mudar plano</Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FaturaStat label="Viagens este mês" value="4.821" />
                    <FaturaStat label="DDS enviadas" value="142" />
                    <FaturaStat label="Armazenamento" value="84 GB" />
                    <FaturaStat label="API calls" value="284k" />
                  </div>
                  <Separator />
                  <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Faturas recentes</p>
                  <div className="space-y-2">
                    {["Maio 2026", "Abril 2026", "Março 2026"].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-md border border-border-soft">
                        <p className="text-sm font-medium">{m}</p>
                        <span className="text-sm font-bold tabular-nums">R$ 28.400,00</span>
                        <Badge variant="success" className="text-[10px]">Pago</Badge>
                        <Button variant="ghost" size="sm" onClick={() => toast("Baixando fatura", { desc: "PDF gerado." })}>Baixar fatura</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <ConvidarUsuarioModal open={convidarOpen} onOpenChange={setConvidarOpen} onInvite={(u) => setEquipe((e) => [u, ...e])} />
    </div>
  );
}

function SwitchRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md hover:bg-brand-50/50">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function FaturaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-soft p-3">
      <p className="text-[10px] uppercase tracking-wider text-fg-muted font-semibold">{label}</p>
      <p className="text-lg font-bold tabular-nums mt-1">{value}</p>
    </div>
  );
}
