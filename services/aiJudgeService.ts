/**
 * AI Judge Service for OpenQuest
 * Uses Gemini AI to evaluate user-submitted content (articles, threads, etc.)
 */

import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize Gemini AI lazily
let aiInstance: GoogleGenAI | null = null;
function getAi() {
    if (!aiInstance) {
        if (!process.env.GEMINI_API_KEY) {
            dotenv.config();
        }
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    }
    return aiInstance;
}

interface EvaluationResult {
    score: number;
    feedback: string;
    isApproved: boolean;
}

/**
 * Extract text content from a URL
 */
async function extractUrlContent(url: string): Promise<string> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        // Remove script, style, and nav elements
        $('script, style, nav, footer, header').remove();

        // Extract text from body
        return $('body').text().replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error(`❌ Error extracting content from ${url}:`, error);
        throw new Error('Failed to extract content from the provided link.');
    }
}

/**
 * Evaluate content against quest requirements
 */
export async function evaluateContent(
    submission: string,
    questTitle: string,
    questRequirement: string
): Promise<EvaluationResult> {
    try {
        let contentToEvaluate = submission;

        // If it's a URL, try to extract content
        if (submission.startsWith('http')) {
            console.log(`🔍 Extracting content from: ${submission}`);
            contentToEvaluate = await extractUrlContent(submission);
        }

        console.log(`🧠 AI Judge evaluating submission for quest: "${questTitle}"`);

        const prompt = `
            You are an expert content judge for OpenQuest, an autonomous onchain quest platform on the Base blockchain.
            
            Quest Title: "${questTitle}"
            Quest Requirement: "${questRequirement}"
            
            User Submission Content:
            """
            ${contentToEvaluate.substring(0, 10000)} // Limit to 10k characters
            """
            
            Evaluate the submission based on:
            1. Relevance: Is it actually about the quest topic?
            2. Quality: Is it reasonably high quality (not spam, not low effort)?
            3. Originality: Does it look like original work or just a copied snippet?
            
            Return a JSON response with:
            - score: (0-100)
            - feedback: (Short 1-sentence explanation)
            - isApproved: (boolean, true if score >= 70)
        `;

        const response = await getAi().models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `${prompt}`
        });

        const responseText = response.text || "";

        // Clean up JSON response if AI includes markdown formatting
        const cleanedJson = responseText.replace(/```json|```/g, '').trim();
        const evaluation = JSON.parse(cleanedJson) as EvaluationResult;

        return evaluation;
    } catch (error) {
        console.error('❌ AI Judge error:', error);
        return {
            score: 0,
            feedback: "I encountered an error while reviewing your submission. Please try again later.",
            isApproved: false
        };
    }
}

export default {
    evaluateContent
};
