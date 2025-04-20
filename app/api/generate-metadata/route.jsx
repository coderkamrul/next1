import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { image, apiKey, apiType, filename } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 400 })
    }

    let result

    try {
      if (apiType === "gemini") {
        result = await generateWithGemini(image, apiKey, filename)
      } else if (apiType === "openai") {
        result = await generateWithOpenAI(image, apiKey, filename)
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
async function generateWithGemini(imageBase64, apiKey, filename) {
  // Update the URL to use gemini-1.5-flash instead of the deprecated gemini-pro-vision
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

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
              text: "Analyze this image and generate SEO metadata for a stock photo website. Provide a concise title (max 10 words), a detailed description (2-3 sentences), and 10 relevant tags separated by commas. Format the response as JSON with keys 'title', 'description', and 'tags' (as an array).",
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
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()

  try {
    // Extract JSON from the response text
    const text = data.candidates[0].content.parts[0].text
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
    console.error("Error parsing Gemini response:", error)
    return {
      title: `Image ${filename}`,
      description: "Failed to generate description",
      tags: ["error", "processing", "image"],
    }
  }
}

async function generateWithOpenAI(imageBase64, apiKey, filename) {
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
              text: "Analyze this image and generate SEO metadata for a stock photo website. Provide a concise title (max 10 words), a detailed description (2-3 sentences), and 10 relevant tags separated by commas. Format the response as JSON with keys 'title', 'description', and 'tags' (as an array).",
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
