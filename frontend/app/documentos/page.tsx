"use client";

import { useState, Suspense } from "react";
import Documents from "@/components/views/Documents";

export const dynamic = 'force-dynamic';

export default function DocumentosPage() {
  const [, setToast] = useState<string | null>(null);
  
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#879087]">Carregando documentos...</div>}>
      <Documents onToast={setToast} />
    </Suspense>
  );
}