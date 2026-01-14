
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
    console.error('No API Key');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const candidates = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-001',
    'gemini-2.0-flash-lite-preview-02-05',
    'gemini-2.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
];

async function run() {
    for (const modelName of candidates) {
        console.log(`Checking ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            console.log(`FOUND WORKING MODEL: ${modelName}`);
            console.log(`Response: ${result.response.text()}`);
            process.exit(0); // Stop after finding one
        } catch (e: any) {
            console.log(`Failed ${modelName}: ${e.message.slice(0, 100)}...`);
        }
    }
    console.log('No working model found.');
    process.exit(1);
}

run();
