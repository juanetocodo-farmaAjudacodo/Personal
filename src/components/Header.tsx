/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Activity } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 mb-8 text-center shadow-xl border border-white/20 transition-all duration-300 hover:-translate-y-1 no-print">
      <div className="inline-flex items-center justify-center bg-sky-50 p-3 rounded-2xl mb-4">
        <Activity className="w-8 h-8 text-sky-500 animate-pulse" />
      </div>
      <h1 className="bg-gradient-to-r from-slate-900 via-sky-800 to-sky-600 bg-clip-text text-transparent text-xl md:text-3.5xl font-black tracking-tight mb-2 font-display">
        ✨ JS Personal Pro v2026
      </h1>
      <p className="text-slate-500 font-semibold text-sm md:text-base">
        Ambiente Inteligente de Anamnese, Triagem Clínica e Prescrição • Prof. Jailson da Silva
      </p>
      <div className="inline-flex items-center gap-2 mt-4 text-xs font-bold bg-slate-50 border border-slate-200 text-sky-700 py-1.5 px-4 rounded-full uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5" />
        Protocolo de Retaguarda Jurídica e Mitigação de Riscos
      </div>
    </div>
  );
}
