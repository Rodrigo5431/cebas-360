"use client";

import { useState } from "react";
import Documents from "@/components/views/Documents";

export default function DocumentosPage() {
  const [, setToast] = useState<string | null>(null);
  return <Documents onToast={setToast} />;
}
