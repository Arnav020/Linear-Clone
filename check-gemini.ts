
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error('Error reading .env.local:', e);
}

if (!apiKey) {
    console.error('API KEY NOT FOUND in .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function check() {
    console.log('--- Listing Models via REST API ---');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.error('Failed to list models:', response.status, response.statusText);
            const errText = await response.text();
            console.error(errText);
        } else {
            const data = await response.json();
            console.log('Available Models:');
            // @ts-ignore
            if (data.models) {
                // @ts-ignore
                data.models.forEach((m: any) => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name} (${m.displayName})`);
                    }
                });
            } else {
                console.log(JSON.stringify(data, null, 2));
            }
        }
    } catch (e: any) {
        console.error('Error listing models:', e.message);
    }

    console.log('\n--- Testing gemini-1.5-flash ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        console.log('SUCCESS: gemini-1.5-flash worked:', result.response.text());
    } catch (e: any) {
        console.error('FAIL: gemini-1.5-flash failed:', e.message);
    }

    console.log('\n--- Testing gemini-2.0-flash-exp (just in case) ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent('Hello');
        console.log('SUCCESS: gemini-2.0-flash-exp worked:', result.response.text());
    } catch (e: any) {
        console.error('FAIL: gemini-2.0-flash-exp failed:', e.message);
    }
}

check();
