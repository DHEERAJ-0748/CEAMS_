import supabase from '../config/supabaseClient.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const chatWithJarvis = async (req, res) => {
  try {
    const { message, history } = req.body;
    const { id: userId, role, name } = req.user;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       return res.status(200).json({ response: "I'm sorry, my AI core (GEMINI_API_KEY) is not yet configured. Please ask the administrator to add it to backend/.env." });
    }

    console.log('Jarvis: API Key loaded, building context for role:', role);

    // 1. Fetch relevant context data based on role
    let contextData = {};
    if (role === 'club') {
      const { data: events } = await supabase.from('events').select('*').eq('club_id', userId);
      contextData.myEvents = events;
    } else if (role === 'faculty') {
      const { data: pendingEvents } = await supabase.from('events').select('*').eq('status', 'faculty_pending');
      contextData.pendingReviews = pendingEvents;
    } else if (role === 'admin') {
      const { data: allEvents } = await supabase.from('events').select('*');
      const { data: venues } = await supabase.from('venues').select('*');
      contextData.allEvents = allEvents;
      contextData.venues = venues;
    } else if (role === 'principal') {
      const { data: allEvents } = await supabase.from('events').select('*');
      contextData.allEvents = allEvents;
      contextData.approvalStats = {
        approved: allEvents?.filter(e => e.status === 'approved').length,
        pending: allEvents?.filter(e => e.status?.includes('pending')).length
      };
    }

    const { data: calendar } = await supabase.from('academic_calendar').select('*');
    contextData.calendar = calendar;

    // 2. Build the prompt
    const systemPrompt = `You are JARVIS, an intelligent AI assistant for the CEAMS (Club Event Approval and Management System). Your personality: Professional, intelligent, efficient, and helpful. Similar to Iron Man's JARVIS.

Current User: ${name} (Role: ${role})

Rules:
- Club users can only see their own events. Help with proposals, event ideas, status tracking.
- Faculty can see pending reviews assigned to them.
- Admin can see all events, venues, calendar management.
- Principal gets high-level analytics and budget oversight.
- NEVER share cross-role data.

System Data (JSON): ${JSON.stringify(contextData)}

Respond concisely. Use markdown for formatting.`;

    // Build conversation contents array for the API
    const contents = [];

    // Add history if present
    if (history && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.parts?.[0]?.text || '' }]
        });
      }
    }

    // Add current user message with system context baked in
    const userPrompt = contents.length === 0
      ? `${systemPrompt}\n\nUser message: ${message}`
      : message;

    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    // 3. Call Gemini API directly via fetch (bypasses SDK bugs)
    console.log('Jarvis: Calling gemini-2.0-flash...');
    const apiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      const errMsg = data?.error?.message || 'Unknown Gemini API error';
      console.error('Jarvis Gemini Error:', apiResponse.status, errMsg);

      // Handle rate limiting gracefully
      if (apiResponse.status === 429) {
        return res.status(200).json({ 
          response: "I'm currently rate-limited by Google's API quota. My free-tier daily limit has been reached. Please wait a minute and try again, or ask the administrator to upgrade the API plan." 
        });
      }

      return res.status(200).json({ response: `I encountered an issue: ${errMsg}` });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Jarvis: No text in response:', JSON.stringify(data));
      return res.status(200).json({ response: "I received an empty response from my AI core. Please try rephrasing your question." });
    }

    console.log('Jarvis: Response received successfully');
    res.status(200).json({ response: text });

  } catch (error) {
    console.error('Jarvis Backend Error:', error.message);
    res.status(500).json({ message: `Jarvis Error: ${error.message}` });
  }
};
