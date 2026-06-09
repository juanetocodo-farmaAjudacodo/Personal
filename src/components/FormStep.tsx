/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormState } from "../types";
import { calculateIMC, calculateAdvancedBiometrics } from "../data";
import { 
  User, MapPin, Scale, Briefcase, Heart, 
  Stethoscope, ShieldAlert, Brain, Info, Sparkles, Flame, ShieldCheck 
} from "lucide-react";

interface FormStepProps {
  currentStep: number;
  state: FormState;
  onChange: (field: keyof FormState, value: any) => void;
  onCheckboxChange: (field: keyof FormState, value: string) => void;
}

export default function FormStep({ currentStep, state, onChange, onCheckboxChange }: FormStepProps) {
  // Automatic Age calculation helper
  const handleDateChange = (dateStr: string) => {
    onChange("nascimento", dateStr);
    if (dateStr) {
      const today = new Date();
      const birth = new Date(dateStr);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      onChange("idade", age.toString());
    }
  };

  // Live IMC calculation
  const p = parseFloat(state.peso) || 0;
  const h = parseFloat(state.estatura) || 0;
  const imcInfo = calculateIMC(p, h);
  const biometrics = calculateAdvancedBiometrics(state);

  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <User className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">1. Identificação Geral</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={state.nome}
                onChange={(e) => onChange("nome", e.target.value)}
                placeholder="Nome completo do aluno"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sexo Biológico
                </label>
                <select
                  value={state.sexo}
                  onChange={(e) => onChange("sexo", e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={state.nascimento}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Idade (Calculada)
                </label>
                <input
                  type="number"
                  readOnly
                  placeholder="Selecione data"
                  value={state.idade}
                  className="w-full bg-slate-100 border-2 border-slate-200 cursor-not-allowed rounded-xl px-4 py-3 text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contato de Emergência
                </label>
                <input
                  type="text"
                  value={state.telefone_recado}
                  onChange={(e) => onChange("telefone_recado", e.target.value)}
                  placeholder="Ex: Maria (88) 99999-9999"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Plano de Saúde / Convênio
                </label>
                <input
                  type="text"
                  value={state.plano_saude}
                  onChange={(e) => onChange("plano_saude", e.target.value)}
                  placeholder="Nome ou número do convênio"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>Registro CREF do Personal</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={state.cref_personal}
                  onChange={(e) => onChange("cref_personal", e.target.value)}
                  placeholder="Ex: CREF 123456-G/CE"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <MapPin className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">2. Localização e Agenda</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Endereço Residencial
              </label>
              <input
                type="text"
                value={state.endereco}
                onChange={(e) => onChange("endereco", e.target.value)}
                placeholder="Rua / Avenida"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={state.num_end}
                  onChange={(e) => onChange("num_end", e.target.value)}
                  placeholder="Número"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  value={state.comp_end}
                  onChange={(e) => onChange("comp_end", e.target.value)}
                  placeholder="Apto, Bloco..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={state.bairro}
                  onChange={(e) => onChange("bairro", e.target.value)}
                  placeholder="Bairro"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={state.cep}
                  onChange={(e) => onChange("cep", e.target.value)}
                  placeholder="60000-000"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Horário Pretendido
                </label>
                <input
                  type="text"
                  value={state.turma}
                  onChange={(e) => onChange("turma", e.target.value)}
                  placeholder="Ex: Seg a Sex às 07:00h"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tempo por Sessão
                </label>
                <select
                  value={state.tempo_disponivel}
                  onChange={(e) => onChange("tempo_disponivel", e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                >
                  <option>Até 45 minutos</option>
                  <option>45 a 60 minutos</option>
                  <option>Mais de 60 minutos</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Scale className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">3. Composição Corporal & Bioestatística</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Peso Atual (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={state.peso}
                onChange={(e) => onChange("peso", e.target.value)}
                placeholder="Ex: 75.5"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Estatura (m) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={state.estatura}
                onChange={(e) => onChange("estatura", e.target.value)}
                placeholder="Ex: 1.72"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fator de Atividade Física
              </label>
              <select
                value={state.nivel_atividade}
                onChange={(e) => onChange("nivel_atividade", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold text-sm"
              >
                <option value="Sedentário">Sedentário (pouco/nenhum exercício)</option>
                <option value="Atividade Leve">Atividade Leve (1-3 dias/semana)</option>
                <option value="Atividade Moderada">Atividade Moderada (3-5 dias/semana)</option>
                <option value="Atividade Intensa">Atividade Intensa (6-7 dias/semana)</option>
              </select>
            </div>
          </div>

          {/* Real-time Bioestatística Dashboard Panel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Painel de Indicadores Estimados (Tempo Real)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* BMI widget */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">IMC Corporal</span>
                {imcInfo ? (
                  <div className="mt-1">
                    <div className="text-base font-black text-slate-800">{imcInfo.imc} <span className="text-xs font-medium text-slate-500">kg/m²</span></div>
                    <div className="text-[10px] font-bold text-sky-600 mt-0.5">{imcInfo.text}</div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic mt-2">Aguardando peso...</span>
                )}
              </div>

              {/* BMR widget */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Taxa Metabólica Basal</span>
                {biometrics ? (
                  <div className="mt-1">
                    <div className="text-base font-black text-slate-800">{biometrics.bmr} <span className="text-xs font-medium text-slate-500">kcal</span></div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-0.5">Mifflin-St Jeor</div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic mt-2">Falta idade/sexo...</span>
                )}
              </div>

              {/* TDEE widget */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Gasto Calórico Diário</span>
                {biometrics ? (
                  <div className="mt-1">
                    <div className="text-base font-black text-slate-800">{biometrics.tdee} <span className="text-xs font-medium text-slate-500">kcal</span></div>
                    <div className="text-[10px] font-bold text-amber-600 mt-0.5">Consumo estimado/dia</div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic mt-2">Aguardando dados...</span>
                )}
              </div>

              {/* Ideal weights range */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Faixa de Peso Recomendada</span>
                {biometrics ? (
                  <div className="mt-1">
                    <div className="text-sm font-black text-slate-800">{biometrics.idealMin} ~ {biometrics.idealMax} <span className="text-xs font-medium text-slate-500">kg</span></div>
                    <div className="text-[10px] font-bold text-sky-600 mt-0.5">Fórmula de IMC Saudável</div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic mt-2">Estime com estatura...</span>
                )}
              </div>
            </div>
            {!biometrics && (
              <p className="text-[11px] text-slate-500 italic">
                * Os cálculos de taxa metabólica basal e gasto energético diário necessitam de Idade, Sexo Biológico, Peso e Estatura válidos.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Objetivos Principais
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Estética", "Saúde", "Reabilitação", "Condicionamento", "Emagrecimento", "Hipertrofia"].map((obj) => (
                <label
                  key={obj}
                  className={`flex items-center gap-2.5 p-3.5 border-2 rounded-xl cursor-pointer transition-all select-none ${
                    state.objetivos.includes(obj)
                      ? "border-sky-500 bg-sky-50 text-sky-900"
                      : "border-slate-200 bg-white hover:border-sky-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={state.objetivos.includes(obj)}
                    onChange={() => onCheckboxChange("objetivos", obj)}
                    className="accent-sky-500 w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold">{obj}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Briefcase className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">4. Rotina Ocupacional</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Horas trabalhadas por semana
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Menos de 20h", "20-40h", "41-60h", "Mais de 60h"].map((h) => (
                <div
                  key={h}
                  onClick={() => onChange("horas_trabalho", h)}
                  className={`p-3 text-center border-2 rounded-2xl cursor-pointer transition-all font-semibold text-sm ${
                    state.horas_trabalho === h
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 hover:border-sky-300 bg-white"
                  }`}
                >
                  {h}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Postura predominantemente adotada no trabalho
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Sentado", "Em pé", "Movimentando cargas"].map((postura) => (
                <label
                  key={postura}
                  className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all select-none ${
                    state.postura_trabalho.includes(postura)
                      ? "border-sky-500 bg-sky-50 text-sky-900"
                      : "border-slate-200 bg-white hover:border-sky-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={state.postura_trabalho.includes(postura)}
                    onChange={() => onCheckboxChange("postura_trabalho", postura)}
                    className="accent-sky-500 w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold">{postura}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Heart className="w-6 h-6 text-sky-500 animate-pulse" />
            <h2 className="text-xl font-bold font-display text-slate-800">5. Triagem Cardiorrespiratória</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-normal">
            Selecione se apresentar algum destes sintomas durante repouso ou esforços mínimos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Dor no peito", "Falta de ar", "Tontura", "Desmaios", "Palpitação"].map((sintoma) => (
              <label
                key={sintoma}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
                  state.sintomas_cardio.includes(sintoma)
                    ? "border-red-500 bg-red-50/50 text-red-950"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={state.sintomas_cardio.includes(sintoma)}
                  onChange={() => onCheckboxChange("sintomas_cardio", sintoma)}
                  className="accent-red-500 w-4 h-4 rounded"
                />
                <span className="text-sm font-bold">{sintoma}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Stethoscope className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">6. Histórico Clínico Diagnosticado</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {["Hipertensão", "Diabetes", "Colesterol", "Problema Cardíaco"].map((pat) => (
              <label
                key={pat}
                className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all select-none ${
                  state.patologias.includes(pat)
                    ? "border-amber-500 bg-amber-50/50 text-amber-950"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={state.patologias.includes(pat)}
                  onChange={() => onCheckboxChange("patologias", pat)}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
                <span className="text-sm font-semibold">{pat}</span>
              </label>
            ))}
          </div>

          {state.patologias.includes("Problema Cardíaco") && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-fadeInScale">
              <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                Descreva o problema cardíaco diagnosticado:
              </label>
              <input
                type="text"
                value={state.cardiopatia_qual}
                onChange={(e) => onChange("cardiopatia_qual", e.target.value)}
                placeholder="Exemplo: Arritmia, Marcapasso, Valvopatia..."
                className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2.5 text-amber-950 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>
          )}
        </div>
      );

    case 7:
      return (
        <div className="space-y-6 animate-fadeInScale">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <ShieldAlert className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">7. Dores e Lesões Articulares</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Indique as regiões articulares que apresentam dor frequente, incômodo ou histórico de lesão:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Coluna", "Joelhos", "Ombros", "Quadril", "Tornozelos", "Pulsos/Cotovelos"].map((dor) => (
                <label
                  key={dor}
                  className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all select-none ${
                    state.dores_art.includes(dor)
                      ? "border-amber-500 bg-amber-50/50 text-slate-900 shadow-xs"
                      : "border-slate-200 bg-white hover:border-sky-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={state.dores_art.includes(dor)}
                    onChange={() => {
                      onCheckboxChange("dores_art", dor);
                      // Default intensity to 'leve' if checked
                      if (!state.dores_art.includes(dor)) {
                        const updated = { ...state.dores_intensidade, [dor]: "leve" as const };
                        onChange("dores_intensidade", updated);
                      } else {
                        const updated = { ...state.dores_intensidade };
                        delete updated[dor];
                        onChange("dores_intensidade", updated);
                      }
                    }}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold">{dor}</span>
                </label>
              ))}
            </div>
          </div>

          {state.dores_art.length > 0 && (
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 animate-fadeInScale">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-sky-500" />
                Mapeamento de Intensidade da Dor
              </h3>
              
              <div className="space-y-3.5">
                {state.dores_art.map((dor) => {
                  const currentIntensity = state.dores_intensidade?.[dor] || "leve";
                  return (
                    <div key={dor} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 gap-3">
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        Grau de incômodo na região: <strong className="text-sky-600">{dor}</strong>
                      </span>
                      
                      <div className="flex gap-2.5">
                        {(["leve", "moderada", "intensa"] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              const updated = { ...state.dores_intensidade, [dor]: lvl };
                              onChange("dores_intensidade", updated);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              currentIntensity === lvl
                                ? lvl === "leve"
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                  : lvl === "moderada"
                                    ? "bg-amber-500 text-amber-950 shadow-md shadow-amber-100"
                                    : "bg-red-500 text-white shadow-md shadow-red-100"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-500"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );

    case 8:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Brain className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">8. Estilo de Vida & Hábitos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Horas de sono por noite
              </label>
              <select
                value={state.sono_horas}
                onChange={(e) => onChange("sono_horas", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm font-semibold"
              >
                <option>Menos de 6h</option>
                <option>6-8h</option>
                <option>Mais de 8h</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Estresse diário percebido
              </label>
              <select
                value={state.estresse_nivel}
                onChange={(e) => onChange("estresse_nivel", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm font-semibold"
              >
                <option>Baixo</option>
                <option>Moderado</option>
                <option>Muito Alto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Uso de Tabaco / Fumo
              </label>
              <select
                value={state.tabagismo}
                onChange={(e) => onChange("tabagismo", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm font-semibold"
              >
                <option value="Não">Não fumante</option>
                <option value="Fumante">Fumante ativo</option>
                <option value="Ex-fumante">Ex-fumante</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Consumo de Bebidas Alcoólicas
              </label>
              <select
                value={state.bebida_alcoolica}
                onChange={(e) => onChange("bebida_alcoolica", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm font-semibold"
              >
                <option value="Não consome">Não consome</option>
                <option value="Consumo social">Consumo social / Ocasionalmente</option>
                <option value="Consumo frequente">Consumo frequente / Semanal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Uso de medicamentos de uso contínuo
            </label>
            <textarea
              value={state.farmacos_uso}
              onChange={(e) => onChange("farmacos_uso", e.target.value)}
              rows={2}
              placeholder="Liste medicamentos tomados diariamente (ou deixe em branco se nenhum)..."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>
      );

    case 9:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Info className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">9. Histórico Esportivo & Preferências</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Atividade física atual?
              </label>
              <select
                value={state.atividade_atual}
                onChange={(e) => onChange("atividade_atual", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              >
                <option value="Não">Não (Sedentário)</option>
                <option value="Sim">Sim</option>
              </select>
            </div>

            <div className={`md:col-span-2 ${state.atividade_atual === "Sim" ? "block" : "hidden"}`}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quais exercícios pratica e com qual frequência?
              </label>
              <input
                type="text"
                value={state.atividade_detalhes}
                onChange={(e) => onChange("atividade_detalhes", e.target.value)}
                placeholder="Ex: Musculação 3x por semana e corrida 1x"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Atividades ou modalidades que GOSTA
              </label>
              <input
                type="text"
                value={state.exercicios_gosta}
                onChange={(e) => onChange("exercicios_gosta", e.target.value)}
                placeholder="Exemplo: Musculação, Pilates, Futebol"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Atividades que EVITA ou não gosta
              </label>
              <input
                type="text"
                value={state.exercicios_evita}
                onChange={(e) => onChange("exercicios_evita", e.target.value)}
                placeholder="Exemplo: Corrida na esteira, aulas com muita dança"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      );

    case 10:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <User className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">10. Perfil Ginecológico (Feminino)</h2>
          </div>

          {state.sexo !== "Feminino" ? (
            <div className="p-5 text-center bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <p className="text-sm text-slate-500 font-medium">
                Etapa aplicável apenas a respondentes do <strong>Sexo Biológico Feminino</strong>. Avançando...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Idade da Menopausa (Deixe em branco ou escreva "Não")
                </label>
                <input
                  type="text"
                  value={state.idade_menopausa}
                  onChange={(e) => onChange("idade_menopausa", e.target.value)}
                  placeholder="Ex: 50 anos"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Faz Terapia de Reposição Hormonal?
                </label>
                <select
                  value={state.reposicao_hormonal}
                  onChange={(e) => onChange("reposicao_hormonal", e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
            </div>
          )}
        </div>
      );

    case 11:
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-sky-500 pl-4 py-1">
            <Info className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold font-display text-slate-800">11. Informações Complementares</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Histórico de fraturas?
              </label>
              <select
                value={state.historico_fraturas}
                onChange={(e) => onChange("historico_fraturas", e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            </div>

            <div className={`md:col-span-2 ${state.historico_fraturas === "Sim" ? "block" : "hidden"}`}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quais ossos/regiões foram fraturados?
              </label>
              <input
                type="text"
                value={state.fraturas_detalhes}
                onChange={(e) => onChange("fraturas_detalhes", e.target.value)}
                placeholder="Ex: Rádio no braço esquerdo"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alergias severas ou limitações funcionais diárias
            </label>
            <input
              type="text"
              value={state.alergias_limitacoes}
              onChange={(e) => onChange("alergias_limitacoes", e.target.value)}
              placeholder="Ex: Alergias severas a calor excessivo, asma, etc."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
