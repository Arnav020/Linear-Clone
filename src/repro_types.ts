
import { createClient, Database } from './lib/supabase';

const supabase = createClient();

async function test() {
    const insertPayload = {
        name: 'test',
        key: 'KEY',
        created_by: 'uuid'
    };

    // Use 'as any' for insert to bypass validation error (since types are broken)
    const { data, error } = await supabase.from('projects').insert(insertPayload as any).select('id').single();

    // Cast data explicitly since it is inferred as never
    const projectData = data as { id: string } | null;

    if (projectData) {
        console.log(projectData.id); // This should pass
    }
}
