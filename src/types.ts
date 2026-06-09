/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormState {
  // 1. Identificação Geral
  nome: string;
  sexo: "Masculino" | "Feminino";
  nascimento: string;
  idade: string;
  telefone_recado: string;
  plano_saude: string;
  cref_personal: string; // Registro CREF opcional para impressão personalizada

  // 2. Localização e Agenda
  endereco: string;
  num_end: string;
  comp_end: string;
  bairro: string;
  cep: string;
  turma: string;
  tempo_disponivel: string;

  // 3. Composição Corporal & IMC
  peso: string; // kg
  estatura: string; // m
  objetivos: string[]; // checkboxes
  nivel_atividade: "Sedentário" | "Atividade Leve" | "Atividade Moderada" | "Atividade Intensa"; // Fator de atividade para TDEE/BMR

  // 4. Rotina Ocupacional
  horas_trabalho: string; // "Menos de 20h" | "20-40h" | "41-60h" | "Mais de 60h"
  postura_trabalho: string[]; // "Sentado" | "Em pé" | "Movimentando"

  // 5. Triagem Cardiorrespiratória
  sintomas_cardio: string[]; // "Dor no peito" | "Falta de ar" | "Tontura" | "Desmaios" | "Palpitação"

  // 6. Histórico Clínico
  patologias: string[]; // "Hipertensão" | "Diabetes" | "Colesterol" | "Problema Cardíaco"
  cardiopatia_qual: string;

  // 7. Dores e Lesões
  dores_art: string[]; // "Coluna" | "Joelhos" | "Ombros" | "Quadril" | "Tornozelos" | "Pulsos/Cotovelos"
  dores_intensidade: Record<string, "leve" | "moderada" | "intensa">; // Nível de dor para articulações selecionadas

  // 8. Estilo de Vida
  sono_horas: string; // "Menos de 6h" | "6-8h" | "Mais de 8h"
  estresse_nivel: string; // "Baixo" | "Moderado" | "Muito Alto"
  tabagismo: "Não" | "Fumante" | "Ex-fumante";
  bebida_alcoolica: "Não consome" | "Consumo social" | "Consumo frequente";
  farmacos_uso: string;

  // 9. Histórico Esportivo
  atividade_atual: "Sim" | "Não";
  atividade_detalhes: string;
  exercicios_gosta: string;
  exercicios_evita: string;

  // 10. Perfil Ginecológico
  idade_menopausa: string;
  reposicao_hormonal: "Sim" | "Não";

  // 11. Informações Complementares
  historico_fraturas: "Sim" | "Não";
  fraturas_detalhes: string;
  alergias_limitacoes: string;
}

export type RiskLevel = "baixo" | "moderado" | "critico";

export interface RiskEvaluation {
  level: RiskLevel;
  class: string;
  text: string;
  description: string;
}
