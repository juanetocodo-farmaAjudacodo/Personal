/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormState, RiskEvaluation } from "./types";

export const initialFormState: FormState = {
  nome: "",
  sexo: "Masculino",
  nascimento: "",
  idade: "",
  telefone_recado: "",
  plano_saude: "",
  cref_personal: "",

  endereco: "",
  num_end: "",
  comp_end: "",
  bairro: "",
  cep: "",
  turma: "",
  tempo_disponivel: "45 a 60 minutos",

  peso: "",
  estatura: "",
  objetivos: [],
  nivel_atividade: "Atividade Moderada",

  horas_trabalho: "20-40h",
  postura_trabalho: [],

  sintomas_cardio: [],

  patologias: [],
  cardiopatia_qual: "",

  dores_art: [],
  dores_intensidade: {},

  sono_horas: "6-8h",
  estresse_nivel: "Moderado",
  tabagismo: "Não",
  bebida_alcoolica: "Não consome",
  farmacos_uso: "",

  atividade_atual: "Não",
  atividade_detalhes: "",
  exercicios_gosta: "",
  exercicios_evita: "",

  idade_menopausa: "",
  reposicao_hormonal: "Não",

  historico_fraturas: "Não",
  fraturas_detalhes: "",
  alergias_limitacoes: "",
};

export const IMC_TABLE = [
  { classification: "Abaixo do peso", range: "Menor que 18.5", min: 0, max: 18.49, color: "text-amber-500 bg-amber-50" },
  { classification: "Peso normal (ideal)", range: "18.5 a 24.9", min: 18.5, max: 24.99, color: "text-emerald-600 bg-emerald-50" },
  { classification: "Sobrepeso", range: "25.0 a 29.9", min: 25.0, max: 29.99, color: "text-amber-600 bg-amber-50" },
  { classification: "Obesidade Grau I", range: "30.0 a 34.9", min: 30.0, max: 34.99, color: "text-orange-600 bg-orange-50" },
  { classification: "Obesidade Grau II (severa)", range: "35.0 a 39.9", min: 35.0, max: 39.99, color: "text-red-500 bg-red-50" },
  { classification: "Obesidade Grau III (mórbida)", range: "Maior que 40.0", min: 40.0, max: Infinity, color: "text-red-700 bg-red-100 font-bold" },
];

export interface AdvancedBiometrics {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Daily Energy Expenditure
  idealMin: number;
  idealMax: number;
}

export function calculateAdvancedBiometrics(state: FormState): AdvancedBiometrics | null {
  const peso = parseFloat(state.peso);
  const estatura = parseFloat(state.estatura);
  const idade = parseInt(state.idade);

  if (isNaN(peso) || isNaN(estatura) || isNaN(idade) || peso <= 0 || estatura <= 0 || idade <= 0) {
    return null;
  }

  // BMR (Mifflin-St Jeor)
  // Height in cm
  const heightCm = estatura * 100;
  let bmr = 0;
  if (state.sexo === "Masculino") {
    bmr = 10 * peso + 6.25 * heightCm - 5 * idade + 5;
  } else {
    bmr = 10 * peso + 6.25 * heightCm - 5 * idade - 161;
  }

  // Activity Multiplier
  let multiplier = 1.2; // Sedentário
  if (state.nivel_atividade === "Atividade Leve") multiplier = 1.375;
  if (state.nivel_atividade === "Atividade Moderada") multiplier = 1.55;
  if (state.nivel_atividade === "Atividade Intensa") multiplier = 1.725;

  const tdee = bmr * multiplier;

  // Ideal weight range based on normal BMI limitations (18.5 to 24.9)
  const idealMin = 18.5 * (estatura * estatura);
  const idealMax = 24.9 * (estatura * estatura);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    idealMin: parseFloat(idealMin.toFixed(1)),
    idealMax: parseFloat(idealMax.toFixed(1))
  };
}

export function calculateIMC(peso: number, estatura: number): { imc: number; text: string; index: number } | null {
  if (!peso || !estatura || peso <= 0 || estatura <= 0) return null;
  const imc = parseFloat((peso / (estatura * estatura)).toFixed(1));
  let index = 0;
  for (let i = 0; i < IMC_TABLE.length; i++) {
    const item = IMC_TABLE[i];
    if (imc >= item.min && imc <= item.max) {
      index = i;
      break;
    }
  }
  return { imc, text: IMC_TABLE[index].classification, index };
}

export function evaluateRisk(state: FormState): RiskEvaluation {
  const hasCriticoSymptom = state.sintomas_cardio.length > 0;
  const hasHeartPathology = state.patologias.includes("Problema Cardíaco");

  if (hasCriticoSymptom || hasHeartPathology) {
    return {
      level: "critico",
      class: "bg-red-500 text-white shadow-red-200",
      text: "🚨 RISCO CRÍTICO / ALTO",
      description: "Liberação médica especializada obrigatória antes de realizar qualquer atividade física assistida.",
    };
  }

  const hasPathology = state.patologias.length > 0;
  const hasPain = state.dores_art.length > 0;
  const isHighStress = state.estresse_nivel === "Muito Alto";
  const isObese = (() => {
    const p = parseFloat(state.peso);
    const h = parseFloat(state.estatura);
    const imcObj = calculateIMC(p, h);
    return imcObj ? imcObj.imc >= 30 : false;
  })();

  if (hasPathology || hasPain || isHighStress || isObese) {
    return {
      level: "moderado",
      class: "bg-amber-500 text-amber-950 shadow-amber-100",
      text: "🟡 RISCO MODERADO",
      description: "Treinamento permitido com restrições e monitoramento constante de fadiga e sintomas relatados.",
    };
  }

  return {
    level: "baixo",
    class: "bg-emerald-500 text-white shadow-emerald-200",
    text: "🟢 BAIXO RISCO",
    description: "Apto a iniciar atividades físicas progressivas, seguindo as diretrizes gerais de condicionamento.",
  };
}

export function getPrescriptionGuidelines(evaluation: RiskEvaluation) {
  if (evaluation.level === "critico") {
    return {
      recommended: [
        "Exercícios de mobilidade geral e flexibilidade sem bloqueios respiratórios",
        "Atividades aeróbias de intensidade muito leve (Caminhadas descontraídas)",
        "Exercícios educativos com foco em controle motor e postura natural",
        "Monitoramento frequente da frequência cardíaca e pressão arterial antes de iniciar"
      ],
      avoid: [
        "Treinamentos exaustivos de força ou potência com altas sobrecargas",
        "Manobras de Valsalva involuntárias (prender a respiração sob esforço)",
        "Exercícios intervalados de alta intensidade (HIIT)",
        "Sessões que provoquem dispneia extrema ou tonturas recorrentes"
      ]
    };
  } else if (evaluation.level === "moderado") {
    return {
      recommended: [
        "Musculação com cargas moderadas (foco em resistência muscular e padrão motor)",
        "Cardio de intensidade leve a moderada por 30 a 45 minutos por sessão",
        "Fortalecimento do core e estabilizadores articulares prioritários",
        "Progressão controlada e gradual de volume de treino semanal"
      ],
      avoid: [
        "Grandes saltos de carga ou falha concêntrica extrema nas primeiras semanas",
        "Movimentos de grande impacto articular se relatar dor latente",
        "Exercícios complexos que sobrecarreguem diretamente as articulações afetadas"
      ]
    };
  } else {
    return {
      recommended: [
        "Treinamento de força progressivo visando adaptações hipertróficas ou de força",
        "Treino cardiovascular variado (ritmo constante e intervalado)",
        "Padrões complexos de movimentos multiarticulares (agachamentos, desenvolvimentos)",
        "Protocolos focando em aumento de densidade de treino ou performance"
      ],
      avoid: [
        "Aumento desordenado ou não planejado de cargas de trabalho",
        "Falta de aquecimento estruturado para as principais cadeias motoras",
        "Negligência nos tempos de recuperação estipulados para descanso"
      ]
    };
  }
}
