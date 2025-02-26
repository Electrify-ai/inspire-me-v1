// Array to store the last 50 quotes
let previousQuotes = [];

async function fetchQuote() {
    const quoteContainer = document.getElementById('quote-container');
    quoteContainer.innerText = "Loading new quote...";

    try {
        // Fetch the OpenAI API key from Netlify function
        const response = await fetch("/.functions/get-api-key");
        if (!response.ok) {
            throw new Error(`Failed to fetch API key: ${response.status}`);
        }

        const apiData = await response.json();
        if (!apiData.apiKey) {
            throw new Error("Failed to retrieve API key");
        }

        const apiKey = apiData.apiKey;

        // Add variety to the prompt
        const categories = [
            "environment",
            "adventure",
            "exploration",
            "journey",
            "outdoors",
        ];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const prompt = `Provide a unique and famous ${randomCategory} inspirational quote.`;

        // Fetch a quote from OpenAI using the retrieved API key
        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 50,
                temperature: 1.0, // Higher temperature for more randomness
                top_p: 0.8,
            }),
        });

        if (!openAiResponse.ok) {
            throw new Error(`OpenAI API request failed with status ${openAiResponse.status}`);
        }

        const dataResponse = await openAiResponse.json();
        if (dataResponse.choices && dataResponse.choices.length > 0) {
            const newQuote = dataResponse.choices[0].message.content.trim();

            // Check if the quote is already in the previousQuotes array
            if (previousQuotes.includes(newQuote)) {
                console.log("Duplicate quote detected. Fetching a new one...");
                fetchQuote(); // Fetch a new quote recursively
                return;
            }

            // Add the new quote to the previousQuotes array
            previousQuotes.push(newQuote);

            // Keep only the last 50 quotes
            if (previousQuotes.length > 50) {
                previousQuotes.shift(); // Remove the oldest quote
            }

            // Display the new quote
            quoteContainer.innerText = newQuote;
        } else {
            throw new Error("No quote received from API");
        }
    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteContainer.innerText = "Failed to load quote. Try again!";
    }
}

// Make fetchQuote globally available
window.fetchQuote = fetchQuote;