import { Note } from '../domain/entities/alarm';

const GROQ_MODEL = 'llama-3.1-8b-instant';

export const AIService = {
  async optimizeNotes(rawText: string): Promise<Note[]> {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Falta la API Key de Groq. Configurala en el archivo .env');
    }

    const systemPrompt = `
      Eres el asistente de Heimdall, una aplicacion de alarmas empresariales.
      El usuario te dara un texto desordenado sobre las cosas que tiene que hacer cuando suene su alarma.
      Tu trabajo es analizar ese texto y devolver un arreglo JSON estricto de notas.

      Reglas del JSON:
      1. Debe ser un arreglo valido de objetos.
      2. Cada objeto debe tener:
         - "text": La tarea resumida y clara (max 5 palabras).
         - "emoji": UN SOLO emoji real (caracter Unicode), jamas uses palabras.
         - "priority": "high", "medium" o "low" (infiere esto segun el contexto).

      Ejemplo correcto:
      [
        { "text": "Tomar cafe", "emoji": "\u2615", "priority": "medium" },
        { "text": "Ir al gym", "emoji": "\uD83C\uDFCB", "priority": "high" }
      ]

      IMPORTANTE: Devuelve UNICAMENTE el JSON. Sin texto antes ni despues, sin marcadores de markdown.
      El campo "emoji" debe ser un emoji real, no una palabra.
    `;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: rawText }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API de Groq (400): ${errorText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content.trim();

      const parsedNotes = JSON.parse(aiResponse);

      return parsedNotes.map((note: any, index: number) => ({
        id: `ai-note-${Date.now()}-${index}`,
        text: note.text,
        emoji: note.emoji,
        priority: note.priority,
        completed: false,
      }));

    } catch (error) {
      console.error('[AIService] Error al optimizar notas:', error);
      throw new Error('No se pudo optimizar las notas. Revisa tu conexion y API Key.');
    }
  }
};
