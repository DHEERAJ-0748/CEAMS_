import supabase from '../config/supabaseClient.js';

// @desc    Create new event
// @route   POST /api/events/create
// @access  Private (Club only)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      event_date,
      venue,
      budget,
      expected_participants,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !event_date ||
      !venue ||
      !budget ||
      !expected_participants
    ) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          club_id: req.user.id,
          title,
          description,
          category,
          event_date,
          venue,
          budget,
          expected_participants,
          status: 'faculty_pending',
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Get club's events
// @route   GET /api/events/my-events
// @access  Private (Club only)
export const getMyEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('club_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};
