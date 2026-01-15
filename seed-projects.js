
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually since dotenv is not installed
try {
    const envPath = path.resolve(__dirname, '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
            process.env[key] = value;
        }
    });
} catch (error) {
    console.log('Error reading .env.local, checking process.env:', error.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    console.error('Available keys:', Object.keys(process.env).filter(k => k.startsWith('NEXT_')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding projects...');

    // Get a team (assuming one exists, or create one)
    let { data: teams } = await supabase.from('teams').select('id').limit(1);
    if (!teams || teams.length === 0) {
        console.log('No teams found, skipping seeding (or create a team first).');
        return;
    }
    const teamId = teams[0].id;

    const projectsToCreate = [
        { name: 'Linear Clone', description: 'Building a Linear clone', team_id: teamId },
        { name: 'Mobile App', description: 'iOS and Android app development', team_id: teamId },
        { name: 'Website Redesign', description: 'Marketing website refresh', team_id: teamId }
    ];

    // Insert Projects
    for (const p of projectsToCreate) {
        const { data: existing } = await supabase.from('projects').select('id').eq('name', p.name).single();
        if (!existing) {
            const { error } = await supabase.from('projects').insert(p);
            if (error) console.error('Error creating project:', p.name, error);
            else console.log('Created project:', p.name);
        } else {
            console.log('Project already exists:', p.name);
        }
    }

    // Get Project IDs
    const { data: projects } = await supabase.from('projects').select('id, name');
    if (!projects) return;

    const linearClone = projects.find(p => p.name === 'Linear Clone');
    const mobileApp = projects.find(p => p.name === 'Mobile App');

    // Update Issues
    const { data: issues } = await supabase.from('issues').select('id').order('created_at', { ascending: false });
    if (issues && issues.length > 0) {
        // Assign first 3 to Linear Clone
        if (linearClone) {
            const ids1 = issues.slice(0, 3).map(i => i.id);
            await supabase.from('issues').update({ project_id: linearClone.id }).in('id', ids1);
            console.log('Assigned 3 issues to Linear Clone');
        }

        // Assign next 2 to Mobile App
        if (mobileApp && issues.length > 3) {
            const ids2 = issues.slice(3, 5).map(i => i.id);
            await supabase.from('issues').update({ project_id: mobileApp.id }).in('id', ids2);
            console.log('Assigned 2 issues to Mobile App');
        }
    }
}

seed();
