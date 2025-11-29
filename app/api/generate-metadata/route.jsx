import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { image, apiKey, apiType, filename, settings } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 400 })
    }

    let result

    try {
      if (apiType === "gemini") {
        result = await generateWithGemini(image, apiKey, filename, settings)
      } else if (apiType === "openai") {
        result = await generateWithOpenAI(image, apiKey, filename, settings)
      } else {
        return NextResponse.json({ error: "Invalid API type" }, { status: 400 })
      }
    } catch (apiError) {
      console.error("API processing error:", apiError)
      return NextResponse.json({ error: apiError.message || "Error processing with AI service" }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

// Format tags with underscores for multi-word tags
function formatTags(tags) {
  return tags.map(tag => {
    // Replace spaces with underscores
    return tag.trim().replace(/\s+/g, '_');
  });
}

// Update the generateWithGemini function to use the newer gemini-1.5-flash model
async function generateWithGemini(imageBase64, apiKey, filename, settings = {}) {
  // Update the URL to use gemini-1.5-flash instead of the deprecated gemini-pro-vision
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
  
  // Construct dynamic prompt based on settings
  const mode = settings.mode || "metadata"
  const platform = settings.platform || "general"
  const titleLength = settings.titleLength || 20
  const descLength = settings.descriptionLength || 40
  const tagCount = settings.tagCount || 30
  const negativeKeywords = settings.negativeKeywords || ""

  let prompt = ""
  let generationConfig = {
    temperature: 0.4,
    topK: 32,
    topP: 1,
    maxOutputTokens: 8192, // Increased to prevent truncation
  }

  if (mode === "prompt") {
    prompt = `Analyze this image and generate a highly detailed text-to-image prompt that could be used to recreate this image in Midjourney or Stable Diffusion. 
    Focus on:
    1. Subject details (appearance, clothing, pose)
    2. Environment/Background (setting, lighting, atmosphere)
    3. Art style (medium, camera settings, artistic influences)
    4. Color palette and mood
    
    Provide ONLY the prompt text, no other conversational text.`
    // Default text generation for prompt mode
  } else {
    // Metadata Mode - Use JSON mode
    generationConfig.responseMimeType = "application/json"
    
    prompt = `Analyze this image and generate content for ${platform === 'general' ? 'a stock photo website' : platform}.`
    
    // Platform specific instructions
    if (platform === "adobe-stock") {
      prompt += ` Optimize for Adobe Stock: focus on commercial appeal, conceptual clarity, and technical quality.`
    } else if (platform === "shutterstock") {
      prompt += ` Optimize for Shutterstock: use literal and descriptive keywords, focus on subject matter.`
    } else if (platform === "freepik") {
      prompt += ` Optimize for Freepik: focus on versatility and design utility.`
    } else if (platform === "getty-images") {
      prompt += ` Optimize for Getty Images: focus on editorial quality, authentic moments, and conceptual depth.`
    } else if (platform === "instagram") {
      prompt += ` Optimize for Instagram: write an engaging, emoji-rich caption and a mix of popular and niche hashtags.`
    } else if (platform === "pinterest") {
      prompt += ` Optimize for Pinterest: write a keyword-rich, inspiring description focusing on aesthetics and utility.`
    } else if (platform === "etsy") {
      prompt += ` Optimize for Etsy: write a product-focused title and description highlighting materials, usage, and handmade quality.`
    } else if (platform === "shopify") {
      prompt += ` Optimize for Shopify: write a persuasive product description focusing on benefits and features.`
    }

    prompt += ` Provide a concise title (max ${titleLength} words), a detailed description (${descLength} words approx), and ${tagCount} relevant tags/hashtags separated by commas.`
    
    if (negativeKeywords) {
      prompt += ` Do NOT include any of the following words or concepts: ${negativeKeywords}.`
    }

    prompt += ` Return the result as a JSON object with keys 'title', 'description', and 'tags' (array of strings).`
  }

  const response = await fetch(`${url}?key=${apiKey}`, {
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
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: generationConfig,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    
    // If model not found, try to list available models to help debug
    if (response.status === 404) {
      try {
        const listModelsUrl = "https://generativelanguage.googleapis.com/v1beta/models"
        const listResponse = await fetch(`${listModelsUrl}?key=${apiKey}`)
        if (listResponse.ok) {
          const listData = await listResponse.json()
          const availableModels = listData.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name)
            .join(", ")
          
          throw new Error(`Gemini API error: Model not found. Available models: ${availableModels}`)
        }
      } catch (listError) {
        console.error("Failed to list models:", listError)
      }
    }
    
    throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()

  try {
    // Check if we have a valid response
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Gemini API returned no candidates:", JSON.stringify(data, null, 2))
      
      if (data.promptFeedback) {
        throw new Error(`Gemini refused to generate: ${JSON.stringify(data.promptFeedback)}`)
      }
      
      throw new Error("Gemini API returned an empty response. Please try again.")
    }

    const candidate = data.candidates[0]
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
       console.error("Invalid candidate structure:", JSON.stringify(candidate, null, 2))
       throw new Error("Gemini API returned an invalid structure.")
    }

    // Extract text from the response
    const text = candidate.content.parts[0].text

    // Handle Prompt Mode (Plain Text)
    if (mode === "prompt") {
      return {
        title: "Image to Prompt Result",
        description: text.trim(),
        tags: ["prompt", "midjourney", "stable-diffusion", "ai-art"],
      }
    }

    // Handle Metadata Mode (JSON)
    let parsedData;
    try {
      // Clean up potential markdown formatting even in JSON mode, just in case
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parse error:", e, "Text:", text)
      // Fallback: Try to find JSON object if strict parse failed
      const firstOpen = text.indexOf("{");
      const lastClose = text.lastIndexOf("}");
      if (firstOpen !== -1 && lastClose !== -1) {
         const looseJson = text.substring(firstOpen, lastClose + 1);
         parsedData = JSON.parse(looseJson);
      } else {
        throw new Error("Failed to parse JSON response");
      }
    }
        
    // Get tags and format them with underscores
    let tags = Array.isArray(parsedData.tags)
      ? parsedData.tags
      : typeof parsedData.tags === "string"
        ? parsedData.tags.split(",").map((tag) => tag.trim())
        : ["no", "tags", "available"];
    
    // Format tags with underscores
    tags = formatTags(tags);
    
    return {
      title: parsedData.title || `Image ${filename}`,
      description: parsedData.description || "No description available",
      tags: tags,
    }

  } catch (error) {
    console.error("Error parsing Gemini response:", error)
    return {
      title: `Image ${filename}`,
      description: "Failed to generate description. Please try again.",
      tags: ["error", "processing", "image"],
    }
  }
}

async function generateWithOpenAI(imageBase64, apiKey, filename, settings = {}) {
  const url = "https://api.openai.com/v1/chat/completions"

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and generate SEO metadata for a stock photo website. Provide a concise title (max 32 words), a detailed description (2-3 sentences), and 10 relevant tags separated by commas. Format the response as JSON with keys 'title', 'description', and 'tags' (as an array).",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()

  try {
    // Extract JSON from the response text
    const text = data.choices[0].message.content
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/)

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0]
      const parsedData = JSON.parse(jsonStr.trim())
      
      // Get tags and format them with underscores
      let tags = Array.isArray(parsedData.tags)
        ? parsedData.tags
        : typeof parsedData.tags === "string"
          ? parsedData.tags.split(",").map((tag) => tag.trim())
          : ["no", "tags", "available"];
      
      // Format tags with underscores
      tags = formatTags(tags);
      
      return {
        title: parsedData.title || `Image ${filename}`,
        description: parsedData.description || "No description available",
        tags: tags,
      }
    } else {
      // Fallback parsing if JSON format is not detected
      const lines = text.split("\n").filter((line) => line.trim())
      
      // Get tags and format them with underscores
      let tags = lines
        .slice(-1)[0]
        .split(",")
        .map((tag) => tag.trim()) || ["no", "tags", "available"];
      
      // Format tags with underscores
      tags = formatTags(tags);
      
      return {
        title: lines[0] || `Image ${filename}`,
        description: lines.slice(1, 3).join(" ") || "No description available",
        tags: tags,
      }
    }
  } catch (error) {
    console.error("Error parsing OpenAI response:", error)
    return {
      title: `Image ${filename}`,
      description: "Failed to generate description",
      tags: ["error", "processing", "image"],
    }
  }
}
