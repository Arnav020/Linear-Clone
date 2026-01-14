
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
    console.error('No API Key found');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName: string) {
    console.log(`\nTesting ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        console.log(`[SUCCESS] ${modelName}:`, result.response.text());
        return true;
    } catch (e: any) {
        console.log(`[FAILED] ${modelName}:`, e.message);
        return false;
    }
}

async function run() {
    await testModel('gemini-2.5-flash');
    await testModel('gemini-2.0-flash-lite');
    await testModel('gemini-1.5-flash'); // Just in case
}

run();
