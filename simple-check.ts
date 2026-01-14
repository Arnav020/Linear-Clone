
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) { }

if (!apiKey) {
    fs.writeFileSync('models.json', JSON.stringify({ error: 'No API Key' }));
    process.exit(1);
}

async function check() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            fs.writeFileSync('models.json', JSON.stringify({ error: response.statusText, status: response.status }));
        } else {
            const data = await response.json();
            fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        }
    } catch (e: any) {
        fs.writeFileSync('models.json', JSON.stringify({ error: e.message }));
    }
}

check();
