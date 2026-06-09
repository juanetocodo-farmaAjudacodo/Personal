/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { initialFormState } from "./data";
import { FormState } from "./types";
import Header from "./components/Header";
import FormStep from "./components/FormStep";
import ReportView from "./components/ReportView";
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function App() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalSteps = 11;

  // Single field update helper
  const updateField = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle checklist checkbox items helper
  const toggleCheckbox = (field: keyof FormState, item: string) => {
    setFormData((prev) => {
      const currentList = prev[field] as string[];
      if (currentList.includes(item)) {
        return {
          ...prev,
          [field]: currentList.filter((x) => x !== item)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentList, item]
        };
      }
    });
  };

  // Step validation before advancing
  const isStepValid = (): { valid: boolean; errorMsg?: string } => {
    if (currentStep === 1) {
      if (!formData.nome.trim()) {
        return { valid: false, errorMsg: "O preenchimento do Nome Completo é obrigatório para continuar." };
      }
      if (!formData.idade || parseInt(formData.idade) <= 0) {
        return { valid: false, errorMsg: "Sua data de nascimento ou idade deve ser preenchida corretamente." };
      }
    }
    if (currentStep === 3) {
      const pStr = formData.peso.trim();
      const hStr = formData.estatura.trim();
      if (!pStr || isNaN(parseFloat(pStr)) || parseFloat(pStr) <= 0) {
        return { valid: false, errorMsg: "Preencha um valor válido para o Peso Atual (ex: 75.5 kg)." };
      }
      if (!hStr || isNaN(parseFloat(hStr)) || parseFloat(hStr) <= 0) {
        return { valid: false, errorMsg: "Preencha um valor válido para a Estatura (ex: 1.72 m)." };
      }
    }
    return { valid: true };
  };

  const handleNext = () => {
    const validation = isStepValid();
    if (!validation.valid) {
      alert(`⚠️ ${validation.errorMsg}`);
      return;
    }

    if (currentStep === totalSteps) {
      setIsSubmitted(true);
      return;
    }

    // Dynamic Step skipping: skip Perfil Ginecológico (Step 10) if Sexo is Masculino
    if (currentStep === 9 && formData.sexo === "Masculino") {
      setCurrentStep(11);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) return;

    // Dynamic Step skipping when returning
    if (currentStep === 11 && formData.sexo === "Masculino") {
      setCurrentStep(9);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const activePercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-clinical text-slate-100 py-8 px-4 sm:px-6 lg:px-8 select-none transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Universal Header widget */}
        <Header />

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Visual indicators for progressive wizard */}
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-inner no-print">
              <div className="flex justify-between items-center mb-2.5 text-xs font-bold text-slate-400">
                <span>Evolução do Preenchimento</span>
                <span className="text-sky-400">Etapa {currentStep} de {totalSteps}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-sky-600 h-full rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${activePercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Container wrapper for steps */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100/50 transition-all text-slate-800 animate-fadeInScale">
              <FormStep 
                currentStep={currentStep}
                state={formData}
                onChange={updateField}
                onCheckboxChange={toggleCheckbox}
              />

              {/* Navigation button panel */}
              <div className="flex gap-4 items-center justify-between mt-8 pt-6 border-t border-slate-100 no-print">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={handlePrev}
                  className={`inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full text-sm font-bold border-2 transition-all cursor-pointer ${
                    currentStep === 1
                      ? "opacity-40 border-slate-200 text-slate-400 cursor-not-allowed"
                      : "border-slate-200 text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 max-w-md inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-slate-900 to-sky-600 hover:to-sky-500 text-white font-extrabold rounded-full transition-all shadow-md hover:shadow-sky-100 cursor-pointer"
                >
                  {currentStep === totalSteps ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-sky-300" />
                      Gerar Parecer Clínico Final
                    </>
                  ) : (
                    <>
                      Continuar
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ReportView 
            state={formData} 
            onReset={() => setIsSubmitted(false)} 
          />
        )}

        {/* Decorative micro indicator under form */}
        <div className="text-center font-mono text-[10px] text-slate-500 mt-10 space-y-1 no-print">
          <p>© 2026 JS Personal Pro • Jailson da Silva. Proteção e Segurança de Dados Criptografados Localmente.</p>
          <div className="inline-flex items-center gap-1.5 justify-center opacity-85">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            <span>Assinado em conformidade com o CREF e bases protocolares da OMS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
