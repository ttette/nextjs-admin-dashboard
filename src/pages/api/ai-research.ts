import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

// Get your API key from your environment variables or directly here
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY";

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { query } = req.body;

  if (!query) {
    res.status(400).json({ message: "Query is required" });
    return;
  }

  try {
    // For this example, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // First, let's try to find similar items in the database.
    // This is a placeholder for your actual database search logic.
    const databaseSearchResults = []; // Replace with your database search

    if (databaseSearchResults.length > 0) {
      res.status(200).json({ results: databaseSearchResults });
    } else {
      // If no matches are found, use Gemini to suggest quality standards.
      const prompt = `Product idea: ${query}. Suggest mandatory quality standards for this product category.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();

      res.status(200).json({ 
        message: `No matches found for "${query}".`,
        suggestions 
      });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
