"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Menu,
  Plus,
  Scale,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, InteractiveModal } from "@/components/ui";
import { useSession } from "@/components/auth/SessionProvider";
import { logoutAction } from "@/app/actions/auth";
import { useApi } from "@/lib/api";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; [key: string]: any }>;
  badge?: string;
};

const navigationBase: NavItem[] = [
  { label: "Visão geral", href: "/", icon: LayoutDashboard },
  { label: "Gratuidade", href: "/gratuidade", icon: Scale },
  { label: "Bolsistas", href: "/bolsistas", icon: Users },
  { label: "Documentos", href: "/documentos", icon: FileText },
  { label: "Prazos e alertas", href: "/prazos", icon: Bell },
  { label: "Auditoria", href: "/auditoria", icon: ClipboardCheck },
  { label: "Base normativa", href: "/normas", icon: BookOpen },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [modal, setModal] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { user } = useSession();
  const [localUser, setLocalUser] = useState<{ name: string } | null>(null);

  const { data: alertasData } = useApi<any>("/alertas");
  const alertsCount = Array.isArray(alertasData)
    ? alertasData.length
    : alertasData?.data?.length || 0;

  useEffect(() => {
    const userStr = localStorage.getItem("@cebas:user");
    if (userStr) {
      try {
        setLocalUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (pathname === "/login") return <>{children}</>;

  const displayUser = user?.name || localUser?.name || "Advogado(a)";

  const navigation = navigationBase.map((item) => {
    if (item.href === "/prazos" && alertsCount > 0) {
      return { ...item, badge: alertsCount.toString() };
    }
    return item;
  });

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#303631]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#ddd5c5] bg-[#fffdf9] px-4 py-3 lg:hidden">
        <button
          aria-label="Abrir menu"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <Menu />
        </button>
        <b className="tracking-[.18em] text-[#172536]">COVAC</b>
        <Button onClick={() => setModal("Nova evidência")}>
          <Plus size={14} /> Nova evidência
        </Button>
      </header>
      {isMobileMenuOpen && (
        <button
          aria-label="Fechar menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-[#17253699] lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#172536] p-5 text-white transition-transform duration-200 lg:fixed lg:w-64 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-[#33475a] pb-7">
          <div className="grid h-9 w-9 place-items-center border border-[#c29121] font-serif text-xl text-[#d5a03a]">
            C
          </div>
          <div>
            <b className="tracking-[.18em]">COVAC</b>
            <span className="block text-[9px] text-[#8192a2]">
              CEBAS Educação
            </span>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 rounded-lg border border-[#30455a] bg-[#203247] p-4">
          <span className="text-[10px] uppercase tracking-[.13em] text-[#8192a2]">
            Entidade
          </span>
          <b className="mt-2 block text-sm">Instituto Educacional Horizonte</b>
          <span className="mt-1 block text-[10px] text-[#98a7b5]">
            Ciclo 2026 · Educação
          </span>
        </div>
        <nav className="mt-7 flex flex-col gap-1">
          <span className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#718193]">
            Módulos
          </span>
          {navigation.map(({ label, href, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#aebbc7] hover:bg-[#203247] hover:text-white",
                pathname === href && "bg-[#293c50] font-bold text-[#dba548]",
              )}
            >
              <Icon size={16} />
              {label}
              {badge && (
                <em className="ml-auto rounded-full bg-[#bd5555] px-1.5 py-0.5 text-[10px] not-italic text-white">
                  {badge}
                </em>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-[#33475a] pt-4 text-xs text-[#98a7b5]">
          Ambiente demonstrativo
          <br />
          <span className="text-[#61b9ad]">●</span> Monitoramento ativo
        </div>
      </aside>
      <main className="min-h-screen lg:ml-64">
        <header className="hidden h-16 items-center justify-between border-b border-[#ddd5c5] bg-[#fffdf9] px-8 lg:flex">
          <div className="text-xs text-[#7d837e]">
            Entidade{" "}
            <b className="ml-2 text-[#34332f]">
              Instituto Educacional Horizonte
            </b>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#7d837e]">{displayUser}</span>
            <form action={logoutAction}>
              <button className="text-xs font-semibold text-[#9d4439]">
                Sair
              </button>
            </form>
            <Button onClick={() => setModal("Nova evidência")}>
              <Plus size={15} /> Nova evidência
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-[1240px] p-5 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>
      {modal && (
        <InteractiveModal
          title={modal}
          close={() => setModal(null)}
          onSaved={setToast}
        />
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] rounded-lg bg-[#292e43] px-5 py-3 text-sm text-white shadow-xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
