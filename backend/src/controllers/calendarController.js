import supabase from '../config/supabaseClient.js';

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
export const getCalendarEvents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('academic_calendar')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
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
