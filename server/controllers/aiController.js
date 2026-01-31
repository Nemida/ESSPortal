const db = require('../db');

const HF_MODEL = 'meta-llama/Meta-Llama-3-8B-Instruct';
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';

const generateText = async (messages, maxTokens = 500) => {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: messages, // Pass the array directly
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle "Model is loading" (Common 503 error)
      if (errorData.error && typeof errorData.error === 'string' && errorData.error.includes('loading')) {
        throw new Error('AI Model is warming up. Please try again in 20 seconds.');
      }
      
      throw new Error(errorData.error?.message || errorData.error || `HF API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
    
  } catch (error) {
    console.error('HF Generation Error:', error.message);
    throw error;
  }
};

const buildContext = async () => {
  try {
    const [forms, announcements, events, publications] = await Promise.all([
      db.query('SELECT title, description, category FROM forms'),
      db.query('SELECT title, description, date FROM announcements ORDER BY announcement_id DESC LIMIT 10'),
      db.query('SELECT title, description, event_date FROM events ORDER BY event_date DESC LIMIT 10'),
      db.query('SELECT title, type, meta, description FROM publications ORDER BY publication_id DESC LIMIT 5'),
    ]);

    return {
      forms: forms.rows,
      announcements: announcements.rows,
      events: events.rows,
      publications: publications.rows,
    };
  } catch (err) {
    console.error('Error building context:', err);
    return {};
  }
};

exports.chat = async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const context = await buildContext();

    const systemPrompt = `You are an intelligent HR Assistant for DRDO's Employee Self-Service (ESS) Portal. 
You help employees with questions about:
- Leave policies and form submissions
- IT support and asset management
- Company announcements and events
- Research publications
- General HR queries

CURRENT CONTEXT FROM DATABASE:
AVAILABLE FORMS:
${context.forms?.map(f => `- ${f.title} (${f.category}): ${f.description}`).join('\n') || 'No forms available'}

RECENT ANNOUNCEMENTS:
${context.announcements?.map(a => `- [${a.date}] ${a.title}: ${a.description}`).join('\n') || 'No announcements'}

UPCOMING EVENTS:
${context.events?.map(e => `- ${e.title} (${e.event_date}): ${e.description}`).join('\n') || 'No events'}

RECENT PUBLICATIONS:
${context.publications?.map(p => `- ${p.title} (${p.type}): ${p.description}`).join('\n') || 'No publications'}

INSTRUCTIONS:
1. Be helpful, professional, and concise.
2. Reference specific forms/events when relevant.
3. If you don't know, say so.
4. Always be respectful.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: 'user', content: message }
    ];

    const assistantMessage = await generateText(messages, 500);

    res.json({
      response: assistantMessage.trim(),
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: err.message || 'Failed to get AI response' });
  }
};

exports.chatStream = async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const context = await buildContext();

    const systemPrompt = `You are an intelligent HR Assistant for DRDO's Employee Self-Service (ESS) Portal.
CONTEXT:
Forms: ${context.forms?.map(f => f.title).join(', ') || 'None'}
Recent Announcements: ${context.announcements?.map(a => a.title).join(', ') || 'None'}
Upcoming Events: ${context.events?.map(e => e.title).join(', ') || 'None'}

Be helpful, concise, and professional.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: 'user', content: message }
    ];

    const response = await generateText(messages, 500);
    
    const words = response.trim().split(' ');
    for (let i = 0; i < words.length; i++) {
      const content = words[i] + (i < words.length - 1 ? ' ' : '');
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
      await new Promise(r => setTimeout(r, 30));
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('AI Stream Error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message || 'Failed to get AI response' })}\n\n`);
    res.end();
  }
};

exports.analyzeGrievance = async (req, res) => {
  const { subject, details } = req.body;

  if (!subject || !details) {
    return res.status(400).json({ error: 'Subject and details are required' });
  }

  try {
    const messages = [
        { 
            role: 'system', 
            content: `You are a grievance analysis system. Analyze the grievance and return valid JSON only (no markdown).
Schema:
{
  "sentiment": "positive" | "neutral" | "negative" | "urgent",
  "severity": number (1-10),
  "category": string,
  "keywords": string[],
  "suggestedPriority": "low" | "medium" | "high" | "critical",
  "summary": string,
  "suggestedAction": string
}` 
        },
        { 
            role: 'user', 
            content: `Subject: ${subject}\nDetails: ${details}` 
        }
    ];

    const responseText = await generateText(messages, 300);
    
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const analysis = JSON.parse(cleanedResponse);
    res.json(analysis);
  } catch (err) {
    console.error('Grievance Analysis Error:', err);
    res.status(500).json({ error: 'Failed to analyze grievance' });
  }
};

exports.suggestFormFields = async (req, res) => {
  const { formType, partialData, userContext } = req.body;

  try {
    const messages = [
        {
            role: 'system',
            content: 'You are a form assistant. Suggest values for remaining fields based on partial data. Return only valid JSON.'
        },
        {
            role: 'user',
            content: `Form Type: ${formType}\nPartial Data: ${JSON.stringify(partialData)}\nUser Context: ${JSON.stringify(userContext)}`
        }
    ];

    const responseText = await generateText(messages, 200);
    
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const suggestions = JSON.parse(cleanedResponse);
    res.json(suggestions);
  } catch (err) {
    console.error('Form Suggestion Error:', err);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};

exports.generateDashboardInsights = async (req, res) => {
  try {
    const [submissions, grievances, announcements] = await Promise.all([
      db.query(`SELECT COUNT(*) as count, status FROM form_submissions 
                WHERE submitted_at > NOW() - INTERVAL '7 days' 
                GROUP BY status`),
      db.query(`SELECT COUNT(*) as count, status FROM grievances 
                WHERE submitted_at > NOW() - INTERVAL '7 days' 
                GROUP BY status`),
      db.query(`SELECT COUNT(*) as count FROM announcements`),
    ]);

    const data = {
      recentSubmissions: submissions.rows,
      recentGrievances: grievances.rows,
      totalAnnouncements: announcements.rows[0]?.count || 0,
    };

    const messages = [
        {
            role: 'user',
            content: `Generate a brief, professional summary (2-3 sentences) of this portal activity data:\n${JSON.stringify(data)}`
        }
    ];

    const insight = await generateText(messages, 150);

    res.json({
      data,
      insight: insight.trim(),
    });
  } catch (err) {
    console.error('Dashboard Insights Error:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};