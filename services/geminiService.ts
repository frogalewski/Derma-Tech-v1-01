
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { GroundingSource, Product } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* getFormulaSuggestionsStream(diseaseName: string, products: Product[] = []): AsyncGenerator<{ text?: string, sources?: GroundingSource[] }> {
    try {
        const model = 'gemini-2.5-flash';

        let productsPromptPart = '';
        if (products && products.length > 0) {
            const productList = products.map(p => `- ${p.name}${p.description ? `: ${p.description}` : ''}`).join('\n');
            productsPromptPart = `\n\nConsidere os seguintes produtos disponíveis em meu estoque ao criar as fórmulas. Dê preferência a eles, se aplicável, e se possível, mencione-os na seção 'ingredients'.\n${productList}`;
        }

        const prompt = `
        Para a condição "${diseaseName}", sugira de 2 a 4 fórmulas manipuladas.
        Seu público-alvo são farmacêuticos e médicos, então use terminologia técnica apropriada.
        ${productsPromptPart}

        Forneça a resposta em um único objeto JSON. O objeto deve ter a seguinte estrutura:
        {
          "summary": "Um resumo conciso da condição e da abordagem geral do tratamento.",
          "formulas": [
            {
              "name": "Nome da Fórmula (ex: 'Creme Hidratante com Ureia e Alfa-Bisabolol')",
              "ingredients": [
                "Ingrediente 1 com concentração (ex: 'Ureia 10%')",
                "Ingrediente 2 com concentração (ex: 'Alfa-Bisabolol 1%')",
                "Veículo e quantidade (ex: 'Creme base q.s.p. 100g')"
              ],
              "instructions": "Instruções detalhadas de uso para o paciente (ex: 'Aplicar na área afetada 2 vezes ao dia.')"
            }
          ]
        }

        Certifique-se de que a resposta seja APENAS o objeto JSON, sem nenhum texto ou formatação extra como \`\`\`json.
        `;

        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        let sourcesExtracted = false;

        for await (const chunk of responseStream) {
            const text = chunk.text;

            if (!sourcesExtracted && chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                const groundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
                const sources: GroundingSource[] = groundingChunks
                    .filter((c: any) => c.web && c.web.uri && c.web.title)
                    .map((c: any) => ({
                        uri: c.web.uri,
                        title: c.web.title,
                        snippet: c.web.snippet,
                    }));
                
                if (sources.length > 0) {
                    yield { sources };
                    sourcesExtracted = true;
                }
            }
            
            if (text) {
                yield { text };
            }
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Não foi possível obter sugestões. Verifique o console para mais detalhes.");
    }
}


export async function generateFormulaIcon(formulaName: string): Promise<string> {
    try {
        const model = 'gemini-2.5-flash-image';
        
        const prompt = `Create a minimalist, clean, single-color vector icon representing a dermatological formula for '${formulaName}'. The icon should be simple, symbolic, and easily recognizable, suitable for a professional medical or pharmaceutical application. The icon must be a single color: indigo (#4F46E5). The background must be transparent. Output as a PNG.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }

        throw new Error("No image data found in the response.");

    } catch (error) {
        console.error(`Error generating icon for "${formulaName}":`, error);
        throw new Error(`Não foi possível gerar o ícone para "${formulaName}".`);
    }
}
