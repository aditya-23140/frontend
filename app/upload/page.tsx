"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Lightbulb, CheckCircle, HelpCircle } from "lucide-react";
import Image from "next/image"; // This will resolve in your Next.js project
import { Skeleton } from "@/components/ui/skeleton";

const env = {
  endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
  googleAPI: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
};

// Interface for the prediction result
interface PredictionResult {
  name: string;
  confidence: number;
}

// Interface for disease information (matches the JSON schema for Gemini)
interface DiseaseInfo {
  cause: string;
  solution: string;
}

// --- NEW: Exponential Backoff Function ---
const fetchWithBackoff = async (
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Don't retry on client errors (4xx), but do on server errors (5xx) or network issues
      if (response.status >= 400 && response.status < 500) {
        console.error(`Client error: ${response.status}. Not retrying.`);
        // Try to parse the error response from Gemini
        try {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${errorData?.error?.message || response.statusText}`
          );
        } catch (parseError) {
          throw new Error(
            `API Request Failed: ${response.status} ${response.statusText}`
          );
        }
      }
      // Throw error to trigger retry for 5xx or network issues
      throw new Error(
        `API Request Failed: ${response.status} ${response.statusText}`
      );
    }
    return response;
  } catch (error: any) {
    if (retries > 0) {
      // console.log(`Retrying API call in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      // Double the delay for the next retry
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    } else {
      console.error("API call failed after multiple retries:", error);
      // Re-throw the error after exhausting retries
      throw error;
    }
  }
};

export default function PredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoError, setInfoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPrediction(null);
      setDiseaseInfo(null);
      setError(null);
      setInfoError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // --- UPDATED Function: Fetch Disease Info using Gemini ---
  const fetchDiseaseInfo = async (diseaseName: string) => {
    if (diseaseName.toLowerCase().includes("healthy")) {
      setDiseaseInfo({
        cause: "The plant appears to be healthy.",
        solution: "Maintain good care practices.",
      });
      return;
    }

    setIsFetchingInfo(true);
    setInfoError(null);
    setDiseaseInfo(null);

    // --- Gemini API Configuration ---
    const apiKey = env.googleAPI; // Leave empty - Canvas provides it
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt =
      "You are an expert plant pathologist. For the given plant disease, provide a concise potential cause and a concise recommended solution. Respond ONLY with a valid JSON object containing 'cause' and 'solution' keys. Do not include any introductory text, markdown formatting, or explanations outside the JSON structure.";
    const userQuery = `Plant Disease: ${diseaseName}`;

    // Define the expected JSON structure
    const jsonSchema = {
      type: "OBJECT",
      properties: {
        cause: { type: "STRING" },
        solution: { type: "STRING" },
      },
      required: ["cause", "solution"],
    };

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
        // Optional: Adjust temperature for creativity vs. factuality
        // temperature: 0.5
      },
    };

    try {
      const response = await fetchWithBackoff(apiUrl, {
        // Use fetchWithBackoff
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Gemini API Response:", result); // Log the full response for debugging

      const candidate = result?.candidates?.[0];
      const contentPart = candidate?.content?.parts?.[0];

      if (contentPart?.text) {
        try {
          // Parse the JSON string returned by Gemini
          const parsedJson: DiseaseInfo = JSON.parse(contentPart.text);
          if (parsedJson.cause && parsedJson.solution) {
            setDiseaseInfo(parsedJson);
          } else {
            throw new Error("Invalid JSON structure received from API.");
          }
        } catch (parseError) {
          console.error("Error parsing Gemini JSON response:", parseError);
          console.error("Received text:", contentPart.text); // Log the text that failed parsing
          throw new Error(
            "Could not parse disease information from the API response."
          );
        }
      } else {
        // Handle cases where response might be blocked or empty
        const safetyReason = candidate?.finishReason;
        const safetyRatings = candidate?.safetyRatings;
        console.warn(
          "Gemini response missing text. Reason:",
          safetyReason,
          "Ratings:",
          safetyRatings
        );
        throw new Error(
          `Could not get valid disease information. Reason: ${
            safetyReason || "Empty response"
          }`
        );
      }
    } catch (err: any) {
      console.error("Error fetching disease info:", err);
      setInfoError(err.message || "Could not fetch disease information.");
    } finally {
      setIsFetchingInfo(false);
    }
  };

  // Handle prediction submission
  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setInfoError(null);
    setPrediction(null);
    setDiseaseInfo(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const API_URL = env.endpoint;
      if (!API_URL) {
        throw new Error(
          "Backend API URL is not configured in environment variables."
        );
      }

      const response = await fetch(API_URL, {
        // Use regular fetch for the prediction endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Prediction failed with status: ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.error || errData.detail || errorMsg;
        } catch (jsonError) {
          errorMsg = `${errorMsg} - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (data.prediction && typeof data.confidence === "number") {
        const result: PredictionResult = {
          name: data.prediction,
          confidence: data.confidence,
        };
        setPrediction(result);
        fetchDiseaseInfo(result.name); // Trigger Gemini call
      } else {
        throw new Error("Invalid response format from prediction API.");
      }
    } catch (err: any) {
      setError(
        err.message || "An unknown error occurred while contacting the server."
      );
      console.error("Prediction Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Plant Disease Detection
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Leaf Image</CardTitle>
          <CardDescription>
            Select an image file of a plant leaf to check for diseases.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="w-full"
          >
            Choose Image File
          </Button>

          {file && (
            <p className="text-sm text-muted-foreground text-center">
              Selected: {file.name}
            </p>
          )}

          {previewUrl && (
            <div className="mt-4 flex justify-center">
              <Image
                src={previewUrl}
                alt="Image preview"
                width={250}
                height={250}
                className="max-h-60 w-auto rounded-md border object-contain"
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || isFetchingInfo || !file}
            className="w-full"
          >
            {isLoading ? "Analyzing..." : "Check for Disease"}
          </Button>

          {/* Display Prediction */}
          {prediction && !isLoading && (
            <Alert
              variant="default"
              className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
            >
              <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
              <AlertTitle className="font-semibold text-green-800 dark:text-green-200">
                Prediction Result
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                The model predicts: <strong>{prediction.name}</strong>
                <span className="ml-2 text-xs">
                  (Confidence: {(prediction.confidence * 100).toFixed(1)}%)
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Section for Disease Info */}
          {prediction && !isLoading && (
            <div className="mt-4 space-y-4">
              {isFetchingInfo && (
                <Card>
                  <CardHeader>
                    {" "}
                    <Skeleton className="h-5 w-32" />{" "}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-5 w-32 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                  </CardContent>
                </Card>
              )}

              {diseaseInfo && !isFetchingInfo && (
                <Card className="border-blue-300 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      About {prediction.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Possible Cause:</h4>
                      <p className="text-sm text-muted-foreground">
                        {diseaseInfo.cause}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Recommended Solution:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {diseaseInfo.solution}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {infoError && !isFetchingInfo && (
                <Alert variant="destructive">
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>Could Not Fetch Details</AlertTitle>
                  <AlertDescription>{infoError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Display Prediction Errors */}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Prediction Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
