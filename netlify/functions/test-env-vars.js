// Log environment variables for debugging
console.log("Testing Netlify environment variables...");

// Log specific environment variables
console.log("Supabase URL:", process.env.SUPABASE_DATABASE_URL);
console.log("Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

// Add more environment variables if needed
// console.log("Another Variable:", process.env.ANOTHER_VARIABLE);

// Simple response for Netlify function
exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Environment variables logged to the console.",
            supabaseUrl: process.env.SUPABASE_DATABASE_URL,
            supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            openaiApiKey: process.env.OPENAI_API_KEY,
        }),
    };
};