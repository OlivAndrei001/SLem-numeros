
import { GoogleGenAI } from "@google/genai";

// Initialization follows the mandatory named parameter pattern
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Assistant service for city-related questions using Gemini 3 Flash.
 * Implements recommended configuration and response handling.
 */
export async function askCityAssistant(question: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "Você é o assistente virtual do SãoLeo em Números, um portal informativo independente sobre São Leopoldo, RS. Sua missão é ajudar cidadãos a entenderem dados da cidade, notícias e história. Seja formal mas acessível. Não se identifique como funcionário da prefeitura, mas sim como uma IA que analisa e reporta dados públicos de forma transparente.",
        temperature: 0.7,
      },
    });
    
    // Accessing .text as a property as per @google/genai guidelines (not as a method).
    return response.text ?? "Desculpe, não consegui processar uma resposta no momento. Por favor, tente reformular sua pergunta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, tive um problema técnico ao processar sua pergunta. Por favor, tente novamente mais tarde.";
  }
}
