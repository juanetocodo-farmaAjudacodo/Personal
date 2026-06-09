/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FormState } from "../types";
import { calculateIMC, evaluateRisk, getPrescriptionGuidelines, IMC_TABLE, calculateAdvancedBiometrics } from "../data";
import { 
  Printer, ArrowLeft, Heart, Scale, Stethoscope, ShieldAlert, CheckCircle, 
  AlertTriangle, Calendar, FileText, Sparkles, User, MapPin, Smile, Info, Download, Loader2,
  ShieldCheck, Activity, Flame, Palette
} from "lucide-react";

interface ReportViewProps {
  state: FormState;
  onReset: () => void;
}

export default function ReportView({ state, onReset }: ReportViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [layoutTheme, setLayoutTheme] = useState<'slate' | 'navy' | 'amber'>('slate');
  
  const p = parseFloat(state.peso) || 0;
  const h = parseFloat(state.estatura) || 0;
  const imcInfo = calculateIMC(p, h);
  const biometrics = calculateAdvancedBiometrics(state);

  const evaluation = evaluateRisk(state);
  const guidelines = getPrescriptionGuidelines(evaluation);

  const todayStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("print-area");
    if (!element) return;

    setIsGenerating(true);

    try {
      // Small delay to ensure any layout transition has finished
      await new Promise((resolve) => setTimeout(resolve, 300));

      const options = {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      };

      const canvas = await html2canvas(element, options);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Fit page with 10mm margins on sides
      const margin = 10;
      const displayWidth = pdfWidth - margin * 2;
      const ratio = canvasWidth / displayWidth;
      const displayHeight = canvasHeight / ratio;

      let remainingHeight = displayHeight;
      let positionY = margin;

      // Add first page
      pdf.addImage(imgData, "PNG", margin, positionY, displayWidth, displayHeight);
      remainingHeight -= (pdfHeight - margin * 2);

      // Add extra pages if needed
      while (remainingHeight > 0) {
        positionY = remainingHeight - displayHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, positionY, displayWidth, displayHeight);
        remainingHeight -= (pdfHeight - margin * 2);
      }

      const rawName = state.nome || "aluno";
      const sanitizedName = rawName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]+/g, "_") // replace spaces and symbols with underscores
        .replace(/(^_+|_+$)/g, ""); // trim underscores

      pdf.save(`laudo_anamnese_${sanitizedName}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("⚠️ Ocorreu um problema ao gerar o PDF. você pode tentar pelo botão 'Imprimir Laudo Técnico' escolhendo 'Salvar como PDF'.");
    } finally {
      setIsGenerating(false);
    }
  };

  const themeClasses = {
    slate: {
      text: "text-slate-800",
      subText: "text-sky-700",
      border: "border-slate-100 hover:border-slate-200",
      badge: "bg-slate-50 text-slate-700 border-slate-200",
      accentText: "text-sky-600",
      accentBg: "bg-sky-50/50",
      badgeRisk: "text-sky-600"
    },
    navy: {
      text: "text-indigo-900",
      subText: "text-indigo-700",
      border: "border-indigo-100 hover:border-indigo-200",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-250",
      accentText: "text-indigo-600",
      accentBg: "bg-indigo-50/40",
      badgeRisk: "text-indigo-600"
    },
    amber: {
      text: "text-slate-900",
      subText: "text-amber-700",
      border: "border-amber-200 hover:border-amber-300",
      badge: "bg-amber-50/70 text-amber-950 border-amber-300",
      accentText: "text-amber-600",
      accentBg: "bg-amber-50/30",
      badgeRisk: "text-amber-600"
    }
  }[layoutTheme];

  return (
    <div className="space-y-8 animate-fadeInScale">
      {/* Action Buttons Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-md no-print">
        <button
          onClick={onReset}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-full transition-all border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar e Editar Dados
        </button>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 disabled:from-sky-400 disabled:to-sky-300 text-white font-extrabold rounded-full transition-all shadow-lg hover:shadow-sky-100 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Salvar em PDF
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-full transition-all shadow-lg cursor-pointer"
          >
            <Printer className="w-5 h-5" />
            Imprimir Laudo Técnico
          </button>
        </div>
      </div>

      {/* Visual Identity Customize Palette (no-print) */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 no-print shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">Visual do Parecer de Anamnese</h4>
            <p className="text-xs text-slate-500 font-medium">Escolha uma identidade estética para estilizar o PDF e a folha impressa final</p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {[
            { id: 'slate', name: 'Executivo Slate', color: 'bg-slate-500' },
            { id: 'navy', name: 'Clinical Navy', color: 'bg-indigo-600' },
            { id: 'amber', name: 'Elite Gym', color: 'bg-amber-500' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setLayoutTheme(t.id as any)}
              className={`flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 border rounded-full text-xs font-bold transition-all cursor-pointer ${
                layoutTheme === t.id
                  ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${t.color}`} />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Report Document Sheet Container */}
      <div id="print-area" className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/60 shadow-xl space-y-8 print-card">
        {/* Clinical Document Header */}
        <div className={`text-center pb-6 border-b-2 ${layoutTheme === 'navy' ? 'border-indigo-150' : layoutTheme === 'amber' ? 'border-amber-200' : 'border-slate-100'}`}>
          <span className={`text-xs font-black uppercase tracking-widest ${themeClasses.subText}`}>JS Personal Pro • Avaliação Fisiológica</span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display mt-1">
            PARECER TÉCNICO E DIAGNÓSTICO DE RISCO DE ANAMNESE
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Orientado e Desenvolvido por • Prof. Jailson da Silva e Silva {state.cref_personal ? `(CREF ${state.cref_personal})` : "(CREF Correspondente)"}
          </p>
        </div>

        {/* Section 1: Personal Data */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b pb-2 ${themeClasses.subText}`}>
            <User className="w-4 h-4" />
            1. Dados de Identificação e Contato
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-400">Aluno(a)</span>
              <strong className="text-slate-800 font-semibold">{state.nome || "Não informado"}</strong>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Idade / Sexo</span>
              <strong className="text-slate-800 font-semibold">
                {state.idade ? `${state.idade} anos` : "--"} / {state.sexo}
              </strong>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Nascimento</span>
              <strong className="text-slate-800 font-semibold">
                {state.nascimento ? new Date(state.nascimento).toLocaleDateString("pt-BR") : "--"}
              </strong>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Emergência</span>
              <strong className="text-slate-800 font-semibold">{state.telefone_recado || "--"}</strong>
            </div>
            
            {state.plano_saude && (
              <div>
                <span className="block text-xs font-semibold text-slate-400">Convênio</span>
                <strong className="text-slate-800 font-semibold">{state.plano_saude}</strong>
              </div>
            )}
            {state.turma && (
              <div>
                <span className="block text-xs font-semibold text-slate-400">Horário Pretendido</span>
                <strong className="text-slate-800 font-semibold">{state.turma}</strong>
              </div>
            )}
            {state.tempo_disponivel && (
              <div>
                <span className="block text-xs font-semibold text-slate-400">Tempo de Sessão</span>
                <strong className="text-slate-800 font-semibold">{state.tempo_disponivel}</strong>
              </div>
            )}
            {state.endereco && (
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-slate-400">Endereço</span>
                <strong className="text-slate-800 font-semibold text-xs leading-relaxed">
                  {state.endereco}, {state.num_end} {state.comp_end ? `- ${state.comp_end}` : ""} - {state.bairro} (CEP: {state.cep || "--"})
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Clinical Risk Status & Flagged Criteria */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b pb-2 ${themeClasses.subText}`}>
            <Heart className="w-4 h-4 text-slate-400" />
            2. Classificação de Risco Clínico & Critérios Identificados
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`p-6 rounded-2xl text-center flex flex-col justify-center items-center shadow-xs border ${
              evaluation.level === 'critico'
                ? 'bg-red-500 text-white border-red-400'
                : evaluation.level === 'moderado'
                  ? 'bg-amber-500 text-amber-950 border-amber-400'
                  : 'bg-emerald-500 text-white border-emerald-400'
            }`}>
              <span className="text-xs font-black uppercase tracking-widest opacity-80">Risco Geral Avaliado</span>
              <span className="text-xl font-black tracking-tight mt-15 mb-1.5 uppercase">{evaluation.level}</span>
              <span className="text-sm font-bold leading-tight">{evaluation.text}</span>
            </div>
            
            <div className="lg:col-span-2 bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5">
              <div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Diretriz Geral do Parecer</span>
                <p className="text-sm font-bold text-slate-700 leading-relaxed mt-1">
                  {evaluation.description}
                </p>
              </div>

              {/* Analyzed Criteria Grid */}
              <div className="pt-2.5 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Critérios de Avaliação Fisio-Patológica</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
                    <span className={`w-2 h-2 rounded-full ${state.sintomas_cardio.length > 0 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                    <span className="text-slate-600 font-medium">Sintomas Cardio: <strong className="text-slate-800">{state.sintomas_cardio.length > 0 ? "Sim" : "Não"}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
                    <span className={`w-2 h-2 rounded-full ${state.patologias.length > 0 ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <span className="text-slate-600 font-medium font-inter">Patologias: <strong className="text-slate-800">{state.patologias.length > 0 ? "Sim" : "Não"}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
                    <span className={`w-2 h-2 rounded-full ${parseFloat(state.peso) / (((parseFloat(state.estatura) || 1) * (parseFloat(state.estatura) || 1))) >= 30 ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <span className="text-slate-600 font-medium">Obesidade (IMC): <strong className="text-slate-800">{imcInfo && imcInfo.imc >= 30 ? "Sim" : "Não"}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
                    <span className={`w-2 h-2 rounded-full ${state.dores_art.length > 0 ? "bg-amber-400" : "bg-emerald-500"}`} />
                    <span className="text-slate-600 font-medium">Dores/Lesões: <strong className="text-slate-800">{state.dores_art.length > 0 ? "Sim" : "Não"}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Weight, Advanced Biometrics & Lifestyle Dashboard */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b pb-2 ${themeClasses.subText}`}>
            <Scale className="w-4 h-4 text-slate-400" />
            3. Metas de Composição Corporal & Painel de Biometria Avançada
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3.5">
              <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">Antropometria de Entrada</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Peso Informado</span>
                  <strong className="text-lg font-black text-slate-800">{state.peso ? `${state.peso} kg` : "--"}</strong>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Estatura</span>
                  <strong className="text-lg font-black text-slate-800">{state.estatura ? `${state.estatura} m` : "--"}</strong>
                </div>
              </div>

              {/* Advanced Biometrics derived Panel */}
              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest block">Metabolismo Estimado (Mifflin)</span>
                {biometrics ? (
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between items-center bg-white/70 px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-semibold text-slate-500">Taxa Basal (BMR)</span>
                      <strong className="text-slate-800 font-black">{biometrics.bmr} kcal</strong>
                    </div>
                    <div className="flex justify-between items-center bg-white/70 px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-semibold text-slate-500">Gasto Diário (TDEE)</span>
                      <strong className="text-slate-800 font-black">{biometrics.tdee} kcal</strong>
                    </div>
                    <div className="flex justify-between items-center bg-white/70 px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-semibold text-slate-500">Faixa de Peso Ideal</span>
                      <strong className="text-sky-800 font-black">{biometrics.idealMin} ~ {biometrics.idealMax} kg</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Insira idade, sexo, peso e estatura para projetar o metabolismo.</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">Mapeamento de Hábitos e Estilo de Vida</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Tabagismo</span>
                  <strong className={`block text-xs font-semibold mt-1 ${state.tabagismo !== "Não" ? "text-red-600 font-extrabold" : "text-slate-700"}`}>
                    {state.tabagismo}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Bebida Alcoólica</span>
                  <strong className={`block text-xs font-semibold mt-1 ${state.bebida_alcoolica === "Consumo frequente" ? "text-amber-600 font-extrabold" : "text-slate-700"}`}>
                    {state.bebida_alcoolica}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Qualidade do Sono</span>
                  <strong className="block text-xs font-semibold text-slate-700 mt-1">
                    {state.sono_horas}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Estresse</span>
                  <strong className={`block text-xs font-semibold mt-1 ${state.estresse_nivel === "Muito Alto" ? "text-red-500 font-extrabold" : "text-slate-700"}`}>
                    {state.estresse_nivel}
                  </strong>
                </div>
              </div>

              {/* IMC table */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs text-xs">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="p-2.5">Classificação Oficial de Class. de Peso (OMS)</th>
                      <th className="p-2.5">Intervalo de IMC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IMC_TABLE.map((row, idx) => {
                      const isMatched = imcInfo?.index === idx;
                      return (
                        <tr 
                          key={row.classification} 
                          className={`border-b border-slate-150 transition-colors ${
                            isMatched ? "bg-sky-50 font-bold text-sky-900" : "text-slate-600"
                          }`}
                        >
                          <td className="p-2.5 flex items-center gap-2">
                            {isMatched && <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />}
                            {row.classification}
                          </td>
                          <td className="p-2.5">{row.range}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Physical prescription Guidelines */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b pb-2 ${themeClasses.subText}`}>
            <CheckCircle className="w-4 h-4 text-slate-400" />
            4. Diretrizes e Alocação Esportiva Prescrita pelo Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/55 border border-emerald-100 p-5 rounded-2xl block-avoid-break">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block mb-3">
                ✅ ATIVIDADES RECOMENDADAS & METAS
              </span>
              <ul className="text-xs space-y-2 text-emerald-950 font-bold">
                {guidelines.recommended.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-black">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/55 border border-rose-100 p-5 rounded-2xl block-avoid-break">
              <span className="text-xs font-black text-rose-800 uppercase tracking-wider block mb-3">
                ❌ ATIVIDADES CONTRAINDICADAS / EVITAR
              </span>
              <ul className="text-xs space-y-2 text-rose-950 font-bold">
                {guidelines.avoid.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-450 font-black">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5: Specific warnings, joint mapping and observations */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b pb-2 ${themeClasses.subText}`}>
            <Info className="w-4 h-4 text-slate-400" />
            5. Encaminhamentos Secundários, Quadro Álgico & Observações
          </h3>
          <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100 text-xs text-slate-700 space-y-3">
            {evaluation.level === "critico" && (
              <p className="flex items-start gap-2.5 font-bold text-red-800 bg-red-100/50 p-3 rounded-xl border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Risco Cardiopulmonar Alto: Exigida avaliação prévia detalhada com cardiologista clínica autorizando carga antes de qualquer treino de força ou esteira.</span>
              </p>
            )}

            {/* Premium Joint pain details with mapped intensity details */}
            {state.dores_art.length > 0 && (
              <div className="p-3.5 bg-amber-50/40 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>MAPEAMENTO DE DORES ARTICULARES ATIVAS (CUIDADOS POSTURAIS):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {state.dores_art.map((dor) => {
                    const intensity = state.dores_intensidade?.[dor] || "leve";
                    return (
                      <div key={dor} className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100 text-[11px] font-semibold text-slate-700">
                        <span>Região: <strong className="text-slate-950 font-bold">{dor}</strong></span>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold text-white ${
                          intensity === "leve" 
                            ? "bg-emerald-500" 
                            : intensity === "moderada" 
                              ? "bg-amber-500" 
                              : "bg-red-500 animate-pulse"
                        }`}>
                          {intensity}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 font-medium pt-1.5 border-t border-dashed border-amber-200">
                  * Evitar amplitude articular que desencadeie dor ativa e limitar exercícios com carga de impacto ou compressão direta nesses segmentos.
                </p>
              </div>
            )}

            {state.patologias.includes("Hipertensão") && (
              <p className="flex items-start gap-2.5 font-semibold text-amber-900 bg-amber-50/30 p-2.5 rounded-lg border border-amber-200">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Hipertensão Arterial: Monitorar a pressão arterial (manguito) antes do início do treino e na transição pós-aeróbio. Suspender sessão se PA sistólica &gt; 160 mmHg ou PA diastólica &gt; 105 mmHg.</span>
              </p>
            )}

            {state.patologias.includes("Diabetes") && (
              <p className="flex items-start gap-2.5 font-semibold text-amber-900 bg-amber-50/30 p-2.5 rounded-lg border border-amber-200">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Diabetes: Verificar com o aluno se houve alimentação correta há menos de 2h e se houver sintomas de tontura, tremores ou suor frio, disponibilizar carboidrato de rápida absorção imediatamente.</span>
              </p>
            )}

            {state.estresse_nivel === "Muito Alto" && (
              <p className="flex items-start gap-2.5 text-slate-700 bg-slate-100/50 p-2.5 rounded-lg border border-slate-200">
                <Smile className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Gerenciamento de Estresse: Implementar de 5 a 10 minutos pós-treino sob técnica de respiração controlada diafragmática para modular turgor de cortisol.</span>
              </p>
            )}

            {state.objetivos.length > 0 && (
              <p className="flex items-start gap-2 text-slate-600">
                <strong className="text-slate-800">Metas Esportivas Declaradas:</strong> {state.objetivos.join(", ")}. O parcelamento de treino e microciclos deve ser sincronizado com esta pauta prioritária.
              </p>
            )}

            <p className="flex items-start gap-2 text-slate-600">
              <strong className="text-slate-800">Reavaliação Periódica Recomendada:</strong> Reavaliação a cada 60 dias para monitoramento de respostas de condicionamento e readequação de riscometria.
            </p>
          </div>
        </div>

        {/* Legal disclaimer term of compliance */}
        <div className="bg-slate-50 text-[10px] text-slate-400 p-5 rounded-2xl text-justify border border-slate-150 leading-relaxed block-avoid-break">
          <strong>📜 TERMO LEGAL DE COMPATIBILIDADE E RESPONSABILIDADE</strong>
          <p className="mt-1">
            Declaro sob as penas da lei que todas as informações registradas nesta triagem eletrônica clínica são verdadeiras, completas e representam fielmente minhas condições de saúde atuais. Estou consciente de que a prescrição esportiva e o acompanhamento dos treinos pelo profissional de Educação Física baseiam-se única e exclusivamente nos dados descritos nesta plataforma, isentando o instrutor/supervisor e os desenvolvedores de dolo civil decorrente de problemas omitidos, informações ocultadas ou falsas prestadas pelo respondente.
          </p>
        </div>

        {/* Signatures section */}
        <div className="grid grid-cols-2 gap-8 text-center pt-8 border-t border-slate-150 block-avoid-break">
          <div className="space-y-1">
            <div className="border-b border-slate-300 w-3/4 mx-auto pb-1 text-slate-800 font-semibold font-mono text-xs">
              Prof. Jailson da Silva e Silva
            </div>
            <p className="text-xs font-bold text-slate-700">CREF Atuante Prescritor</p>
            <p className="text-[10px] text-slate-400">Educação Física Supervisionada {state.cref_personal && `[CREF ${state.cref_personal}]`}</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-300 w-3/4 mx-auto pb-1 text-slate-800 font-semibold font-mono text-xs text-ellipsis overflow-hidden whitespace-nowrap">
              {state.nome || "Assinatura do Aluno"}
            </div>
            <p className="text-xs font-bold text-slate-700">Assinatura do Aluno(a)</p>
            <p className="text-[10px] text-slate-400 font-semibold">Data de Emissão: {todayStr}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
