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
import { useState } from "react";
import { ConvidarUsuarioModal, type Convidado } from "@/components/modals/convidar-usuario-modal";

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

            <TabsContent value="equipe">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Equipe e permissões</CardTitle>
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
                      className="flex items-center gap-3 p-3 rounded-lg border border-border-soft hover:bg-[hsl(174_64%_98%)]"
                    >
                      <Avatar>
                        <AvatarFallback>{u.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{u.nome}</p>
                        <p className="text-[11px] text-fg-muted">{u.email}</p>
                      </div>
                      <Badge variant={u.papel === "Owner" ? "default" : "outline"} className="text-[10px]">
                        {u.papel}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Gerenciar
                      </Button>
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
                      className="flex items-center justify-between p-3 rounded-md hover:bg-[hsl(174_64%_98%)]"
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
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>Sistemas conectados ao Traxium</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { nome: "TRACES NT · Comissão Europeia", desc: "Submissão M2M de DDS", on: true },
                    { nome: "INPE TerraBrasilis", desc: "Detecção de desmatamento", on: true },
                    { nome: "MapBiomas Alerta", desc: "Validação cruzada de polígonos", on: true },
                    { nome: "CAR · Cadastro Ambiental Rural", desc: "Validação de fazendas BR", on: true },
                    { nome: "SEFAZ · CT-e e MDF-e", desc: "Emissão e consulta fiscal", on: true },
                    { nome: "Sascar · Rastreador veicular", desc: "Telemetria em tempo real", on: true },
                    { nome: "Buonny · Seguradora de carga", desc: "Compliance de rota", on: true },
                    { nome: "Slack", desc: "Notificações em canal", on: true },
                    { nome: "Microsoft Teams", desc: "Notificações em canal", on: false },
                    { nome: "Power BI", desc: "Conector OData para BI", on: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border-soft">
                      <div>
                        <p className="text-sm font-semibold">{s.nome}</p>
                        <p className="text-[11px] text-fg-muted">{s.desc}</p>
                      </div>
                      <Switch defaultChecked={s.on} />
                    </div>
                  ))}
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
                      <KeyRound className="size-4 text-[hsl(174_72%_35%)]" />
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
                  <div className="rounded-lg bg-gradient-to-br from-[hsl(174_64%_97%)] to-[hsl(200_60%_97%)] border border-[hsl(174_72%_60%)] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="default" className="text-[10px]">Plano Enterprise</Badge>
                        <p className="text-3xl font-bold mt-2 tabular-nums">
                          R$ 28.400<span className="text-base font-normal">/mês</span>
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
    <div className="flex items-center justify-between p-3 rounded-md hover:bg-[hsl(174_64%_98%)]">
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
