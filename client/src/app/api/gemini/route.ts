// Import necessary modules and libraries
import { NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Constants for the generative AI model
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = "AIzaSyBBD2IM5IO4sLAZcGmb5qoXCX6nYtTV0bw";

// Function to fetch and process the image
async function run(imageUrl: string, question: string) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Generation configuration and safety settings
    const generationConfig = {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    try {
        // Fetch the image using the provided URL
        const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBufferData = Buffer.from(data, "binary").toString("base64");

        // Parts for generative content
        const parts = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBufferData,
                },
            },
            { text: question },
        ];

        // Generate content using the model
        // @ts-ignore 
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });

        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error fetching or processing the image:", error.message);
        throw new Error("Error fetching or processing the image");
    }
}

// Handle a GET request to /api
export async function GET(request: any) {
    try {
        // Get the image URL and question from the query parameters
        const imageUrl = request.nextUrl.searchParams.get("image_url");
        const question = request.nextUrl.searchParams.get("question");
        console.log(imageUrl)

        // Ensure that both parameters are provided
        if (!imageUrl || !question || typeof imageUrl !== 'string' || typeof question !== 'string') {
            throw new Error("Invalid or missing image URL or question");
        }

        // Run the processing function with the provided image URL and question
        const output = await run(imageUrl, question);

        // Return the result as a JSON response
        return NextResponse.json({ message: output }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        // Return an error response if there's an issue
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}