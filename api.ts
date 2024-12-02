const API_KEYS = [
  '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',
  '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',
  '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'
];

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

let currentKeyIndex = 0;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

const handleApiResponse = async (response: Response) => {
  if (response.status === 503) {
    throw new Error('MODEL_LOADING');
  }
  
  if (response.status === 401 || response.status === 403) {
    throw new Error('INVALID_KEY');
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
};

const makeApiRequest = async (url: string, body: any) => {
  let lastError;
  
  for (const key of API_KEYS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      lastError = error;
      if (error instanceof Error) {
        if (error.message === 'MODEL_LOADING') {
          await sleep(RETRY_DELAY);
          continue;
        }
        if (error.message === 'INVALID_KEY') {
          continue;
        }
      }
      throw error;
    }
  }
  
  throw lastError || new Error('All API keys failed');
};

export interface WorksheetContent {
  title: string;
  instructions: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const generateWorksheet = async (subject: string, grade: string, topic: string): Promise<WorksheetContent> => {
  const prompt = `
    Create an educational worksheet with the following structure:
    Title: ${grade} Grade ${subject} - ${topic}
    Instructions: Brief instructions for completing the worksheet
    Questions: Generate 5 age-appropriate questions with answers about ${topic}
    
    Format each question as:
    Question: [The question]
    Answer: [The answer]
    
    Make questions engaging and educational.
  `;

  const result = await makeApiRequest(
    'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
    {
      inputs: prompt,
      parameters: {
        max_length: 800,
        temperature: 0.7,
      },
    }
  );

  const text = result[0].generated_text;
  const parsed = parseWorksheetResponse(text);

  return {
    title: parsed.title || `${grade} Grade ${subject} - ${topic}`,
    instructions: parsed.instructions || `Complete these ${topic} questions. Show your work where applicable.`,
    questions: parsed.questions || [],
  };
};

const parseWorksheetResponse = (text: string): Partial<WorksheetContent> => {
  const titleMatch = text.match(/Title:\s*([^\n]+)/i);
  const instructionsMatch = text.match(/Instructions:\s*([^\n]+)/i);
  const questionsMatches = text.matchAll(/Question:\s*([^\n]+)\s*Answer:\s*([^\n]+)/gi);
  
  const questions = Array.from(questionsMatches).map(match => ({
    question: match[1].trim(),
    answer: match[2].trim(),
  }));

  return {
    title: titleMatch?.[1]?.trim(),
    instructions: instructionsMatch?.[1]?.trim(),
    questions: questions.length > 0 ? questions : undefined,
  };
};

export interface VideoResult {
  title: string;
  videoId: string;
  description: string;
}

export const searchEducationalVideos = async (query: string): Promise<VideoResult[]> => {
  const prompt = `
    Generate 3 educational video suggestions about "${query}" for students.
    For each video, provide:
    1. An educational title
    2. A unique video ID (11 random characters)
    3. A brief description of the content
    
    Format as a list of videos with Title, ID, and Description.
  `;

  const result = await makeApiRequest(
    'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
    {
      inputs: prompt,
      parameters: {
        max_length: 500,
        temperature: 0.7,
      },
    }
  );

  const text = result[0].generated_text;
  const videos = parseVideoResults(text);

  return videos.length > 0 ? videos : [
    {
      title: `Introduction to ${query}`,
      videoId: 'dQw4w9WgXcQ',
      description: `A comprehensive introduction to ${query} for students.`,
    }
  ];
};

const parseVideoResults = (text: string): VideoResult[] => {
  const videos: VideoResult[] = [];
  const videoMatches = text.matchAll(/Title:([^\n]+)(?:\n|.)*?ID:([^\n]+)(?:\n|.)*?Description:([^\n]+)/gi);

  for (const match of videoMatches) {
    videos.push({
      title: match[1].trim(),
      videoId: match[2].trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 11),
      description: match[3].trim(),
    });
  }

  return videos;
};

export const chatWithAI = async (message: string): Promise<string> => {
  const prompt = `
    You are a helpful educational assistant. Provide a clear, informative, and engaging response to the following question or topic:
    
    ${message}
    
    Keep the response focused, educational, and appropriate for students.
  `;

  const result = await makeApiRequest(
    'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
    {
      inputs: prompt,
      parameters: {
        max_length: 500,
        temperature: 0.7,
        return_full_text: false,
      },
    }
  );

  return result[0].generated_text.trim() || 'I apologize, but I could not generate a response. Please try again.';
};