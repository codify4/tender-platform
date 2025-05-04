// API key is required for the Gemini API
const API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";
import { Submission } from "@/lib/db-schema";
import { saveEvaluation } from "./evaluations";

export async function evaluateSubmission(submission: Submission) {
  try {
    // Create the prompt for evaluation - improved for better structure and clarity
    const prompt = `
    You are an expert procurement evaluation AI. Evaluate this tender submission objectively and assign numerical scores.

    **Submission Data:**
    ${JSON.stringify(submission, null, 2)}

    **Evaluation Instructions:**
    1. ALWAYS provide numerical scores from 0-100 for each category.
    2. NEVER return null or undefined values.
    3. BE OBJECTIVE in your assessment of strengths and weaknesses.
    4. FOLLOW THE SCORING FORMULA exactly as specified.

    **Required Evaluation Format:**
    Your response MUST be valid JSON with these exact fields:
    {
      "score": <REQUIRED: overall_score as integer 0-100>,
      "technical_evaluation": {
        "experience": {
          "correct": ["specific strengths found in submission"],
          "mistakes": ["specific weaknesses found in submission"],
          "score": <REQUIRED: integer 0-70>
        },
        "team": {
          "correct": ["specific strengths found in submission"],
          "mistakes": ["specific weaknesses found in submission"],
          "score": <REQUIRED: integer 0-30>
        },
        "total_score": <REQUIRED: integer 0-100, calculated as below>
      },
      "financial_evaluation": {
        "correct": ["specific strengths found in submission"],
        "mistakes": ["specific weaknesses found in submission"],
        "score": <REQUIRED: integer 0-100>
      },
      "compliance_issues": ["any critical omissions or incomplete documents"],
      "recommendation": <REQUIRED: "award", "reject", or "conditional">
    }

    **Scoring Rules:**
    - Technical Score Calculation: total_score = (experience_score + team_score) * 0.7
    - Overall Score Formula: score = (technical_total * 0.7) + (financial_score * 0.3)
    - Recommendation: score ≥ 70 = "award", score < 50 = "reject", otherwise "conditional"
    - All scores MUST be integer values, not null or undefined

    **Quality Check:** 
    Before submitting your response, verify:
    1. All required fields have numerical values
    2. No null or undefined values exist
    3. Score calculations follow specified formulas
    4. JSON structure is valid and can be parsed
    
    Your evaluation must be data-driven and based directly on the submission's content.`;

    // Make a direct API call to Gemini 2.0 Flash Lite
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Reduced temperature for more deterministic output
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("Gemini API error response:", errorData);
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Check if the response has the expected structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error("Unexpected Gemini API response structure:", data);
      throw new Error("Invalid Gemini API response format");
    }
    
    const text = data.candidates[0].content.parts[0]?.text;
    
    if (!text) {
      console.error("No text content in Gemini response:", data);
      throw new Error("No text content in Gemini response");
    }

    // Extract and parse the JSON response, handling potential formatting issues
    try {
      // Log the full text for debugging
      console.log("Raw Gemini response:", text);
      
      // More robust JSON extraction - try multiple approaches
      let jsonText = text;
      let evaluation;
      
      try {
        // First attempt: direct parse
        evaluation = JSON.parse(jsonText);
      } catch (e) {
        try {
          // Second attempt: find JSON object with regex
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
            evaluation = JSON.parse(jsonText);
          } else {
            // Third attempt: remove markdown code block formatting if present
            const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
            evaluation = JSON.parse(cleanedText);
          }
        } catch (innerError) {
          console.error("All JSON parsing attempts failed:", innerError);
          throw new Error("Could not extract valid JSON from response");
        }
      }
      
      console.log("Parsed evaluation object:", evaluation);
      
      // Check if evaluation is empty or missing essential structure
      if (!evaluation || Object.keys(evaluation).length === 0) {
        console.error("Empty evaluation object after parsing");
        throw new Error("Gemini returned an empty evaluation");
      }
      
      // Minimal validation of required fields
      if (typeof evaluation.score !== 'number') {
        console.error("Missing or invalid score in evaluation");
        throw new Error("Evaluation missing required score field");
      }
      
      if (!evaluation.technical_evaluation || !evaluation.financial_evaluation) {
        console.error("Missing technical or financial evaluation");
        throw new Error("Evaluation missing required evaluation sections");
      }
      
      // Add application_id, vendor_name, tender_title, created_at
      const completeEvaluation = {
        ...evaluation,
        application_id: submission.id,
        vendor_name: submission.vendor_name || "",
        tender_title: submission.tender_title,
        created_at: new Date().toISOString(),
      };
      
      // Save to in-memory storage
      try {
        await saveEvaluation({
          application_id: completeEvaluation.application_id,
          vendor_name: completeEvaluation.vendor_name,
          tender_title: completeEvaluation.tender_title,
          score: completeEvaluation.score,
          technical_score: completeEvaluation.technical_evaluation.total_score,
          financial_score: completeEvaluation.financial_evaluation.score,
          recommendation: completeEvaluation.recommendation,
          created_at: completeEvaluation.created_at,
          evaluation_data: completeEvaluation
        });
      } catch (saveError) {
        console.error("Error saving evaluation:", saveError);
        // Continue anyway - the evaluation will still be returned
      }
      
      return completeEvaluation;
    } catch (parseError: any) {
      console.error("Error processing evaluation:", parseError);
      throw new Error(`Failed to process evaluation: ${parseError.message || 'Unknown parsing error'}`);
    }
  } catch (error: any) {
    console.error("Error generating evaluation:", error);
    throw new Error(`Failed to generate AI evaluation: ${error.message || 'Unknown error'}`);
  }
} 