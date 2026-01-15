'use server';

import { getGeminiModel } from '@/lib/gemini';

function parseJSON(text: string) {
    try {
        // 1. Try simple parse
        return JSON.parse(text);
    } catch (e) {
        // 2. Try removing markdown code blocks
        const cleaned = text.replace(/```json\n?|```/g, '').trim();
        try {
            return JSON.parse(cleaned);
        } catch (e2) {
            // 3. Try finding the first '{' and last '}'
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                try {
                    return JSON.parse(text.substring(start, end + 1));
                } catch (e3) {
                    // 4. Try simplified cleanup for common trailing commas or newlines if needed
                    // For now, let's just throw the original text for debugging if this fails
                    throw new Error(`Failed to parse JSON: ${text.substring(0, 100)}...`);
                }
            }
            throw e;
        }
    }
}

export async function analyzeIssueAction(title: string, description: string | null) {
    try {
        const model = getGeminiModel();
        const prompt = `Analyze this software issue and provide structured metadata.
        Title: "${title}"
        Description: "${description || 'No description'}"
        
        Return a VALID JSON object (no markdown) with:
        - priority: "None", "Low", "Medium", "High", or "Urgent"
        - status: "Backlog", "Todo", "In Progress", or "Done"
        - complexity: number (1-5)
        - blockers: string[]
        - reasoning: string (brief explanation)
        
        Ensure strictly valid JSON. Do not add comments.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('AI Response (Analyze):', text); // Debug log

        return parseJSON(text);
    } catch (error: any) {
        console.error('AI Analysis failed:', error?.message || error);
        return null; // Fail gracefully
    }
}

export async function generateIssueDetailsAction(title: string) {
    try {
        const model = getGeminiModel();
        const prompt = `You are an expert product manager. I will give you a short issue title.
        Issue Title: "${title}"
        
        Return a VALID JSON object (no markdown) with:
        - description: "A rich, multi-line markdown description."
        - priority: "None", "Low", "Medium", "High", or "Urgent"
        - status: "Backlog", "Todo", "In Progress"
        
        Ensure strictly valid JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('AI Response (Generate):', text);

        return parseJSON(text);
    } catch (error: any) {
        console.error('AI Generation failed:', error?.message || error);
        return null;
    }
}

export async function prioritizeBatchAction(issues: any[]) {
    try {
        const model = getGeminiModel();
        const backlogIssues = issues.map(i => ({ id: i.id, title: i.title, priority: i.priority }));

        if (backlogIssues.length === 0) return { recommendations: [] };

        const prompt = `Review these backlog issues and identify up to 3 that should be promoted to "Todo".
        
        Issues: ${JSON.stringify(backlogIssues)}
        
        Return a VALID JSON object with:
        - recommendations: Array of { id: string, suggestedStatus: "Todo", reason: string }
        
        Ensure strictly valid JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log('AI Response (Batch):', text);

        return parseJSON(text);
    } catch (error) {
        console.error('Batch Prioritization failed:', error);
        return { recommendations: [] };
    }
}
