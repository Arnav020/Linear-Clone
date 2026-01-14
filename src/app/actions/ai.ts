'use server';

import { getGeminiModel } from '@/lib/gemini';

export async function analyzeIssueAction(title: string, description: string | null) {
    try {
        const model = getGeminiModel();
        const prompt = `Analyze this software issue and provide structured metadata.
        Title: "${title}"
        Description: "${description || 'No description'}"
        
        Return a JSON object with:
        - priority: "None" | "Low" | "Medium" | "High" | "Urgent" (inference based on severity)
        - status: "Backlog" | "Todo" | "In Progress" | "Done" (inference based on phrasing, default to Backlog or Todo)
        - complexity: number (1-5, where 1 is trivial and 5 is extremely complex)
        - blockers: string[] (potential risks or missing info)
        - reasoning: string (brief explanation of why this priority/status was chosen)
        
        Ensure valid JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean up potential markdown code blocks
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error: any) {
        console.error('AI Analysis failed:', error?.message || error);
        if (error?.cause) console.error('Caused by:', error.cause);
        return null;
    }
}

export async function generateIssueDetailsAction(title: string) {
    try {
        const model = getGeminiModel();
        const prompt = `You are an expert product manager. I will give you a short issue title, and you need to generate a professional, detailed description, and suggest initial metadata.
        Issue Title: "${title}"
        
        Return a JSON object with:
        - description: string (A rich, multi-line markdown description. Include "User Story", "Acceptance Criteria", and "Technical Notes" sections if relevant.)
        - priority: "None" | "Low" | "Medium" | "High" | "Urgent"
        - status: "Backlog" | "Todo" | "In Progress" 
        
        Ensure valid JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error: any) {
        console.error('AI Generation failed:', error?.message || error);
        if (error?.cause) console.error('Caused by:', error.cause);
        return null;
    }
}

export async function prioritizeBatchAction(issues: any[]) {
    try {
        const model = getGeminiModel();
        const backlogIssues = issues.map(i => ({ id: i.id, title: i.title, priority: i.priority }));

        if (backlogIssues.length === 0) return { recommendations: [] };

        const prompt = `You are a project manager. Review these backlog issues and identify up to 3 that should be promoted to "Todo" based on implied urgency in their titles or high priority.
        
        Issues provided: ${JSON.stringify(backlogIssues)}
        
        Return a JSON object with:
        - recommendations: Array of objects { 
            id: string, 
            suggestedStatus: "Todo", 
            reason: string 
          }
        
        Only include issues you actually recommend moving. If none are urgent, return empty array.
        Ensure valid JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Batch Prioritization failed:', error);
        return { recommendations: [] };
    }
}
