import supabase from '../config/supabaseClient.js';

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
export const getCalendarEvents = async (req, res) => {
  try {
    const { year, month } = req.query;
    let query = supabase
      .from('academic_calendar')
      .select('*')
      .order('start_date', { ascending: true });

    if (year) {
      if (month) {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        // Overlap logic: event_start <= month_end AND event_end >= month_start
        query = query.lte('start_date', endDate).gte('end_date', startDate);
      } else {
        query = query.gte('start_date', `${year}-01-01`).lte('start_date', `${year}-12-31`);
      }
    }

    const { data: calendarData, error: calendarError } = await query;

    if (calendarError) throw calendarError;

    // Fetch approved/pending events to mark them as occupied
    let eventsQuery = supabase
      .from('events')
      .select(`
        id, 
        title, 
        event_date, 
        status, 
        description, 
        category,
        users!events_club_id_fkey (name)
      `)
      .neq('status', 'rejected');

    if (year && month) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      eventsQuery = eventsQuery.gte('event_date', startDate).lte('event_date', endDate);
    }

    const { data: eventsData, error: eventsError } = await eventsQuery;

    if (eventsError) throw eventsError;

    // Map events to calendar format
    const mappedEvents = eventsData.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      start_date: event.event_date,
      end_date: event.event_date,
      type: 'occupied',
      description: event.description,
      category: event.category,
      status: event.status,
      created_by_name: event.users?.name
    }));

    res.status(200).json([...calendarData, ...mappedEvents]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a calendar event
// @route   POST /api/calendar
// @access  Private (Admin/Faculty)
export const createCalendarEvent = async (req, res) => {
  try {
    const { title, start_date, end_date, type, description } = req.body;

    if (!title || !start_date || !end_date || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('academic_calendar')
      .insert([{ title, start_date, end_date, type, description }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a calendar event
// @route   DELETE /api/calendar/:id
// @access  Private (Admin)
export const deleteCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('academic_calendar').delete().eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Calendar event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
