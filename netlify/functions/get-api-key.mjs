import { createClient } from '@supabase/supabase-js';

// Log environment variables for debugging
console.log("Supabase URL:", process.env.SUPABASE_DATABASE_URL);
console.log("Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Netlify function handler
export async function handler(event, context) {
    try {
        console.log("Fetching API key from Supabase...");

        // Fetch the API key from Supabase
        const { data, error } = await supabase
            .from('secrets')
            .select('value')
            .eq('name', 'openai_api_key')
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to fetch API key" }),
            };
        }

        if (!data) {
            console.error("No data found in Supabase");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "No API key found" }),
            };
        }

        console.log("API key fetched successfully:", data.value);

        // Return the API key
        return {
            statusCode: 200,
            body: JSON.stringify({ apiKey: data.value }),
        };
    } catch (error) {
        console.error("Unexpected error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}