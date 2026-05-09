import supabase from '../config/supabaseClient.js';

// @desc    Get all pending events for faculty
// @route   GET /api/faculty/pending-events
// @access  Private (Faculty only)
export const getPendingEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, users(club_name)')
      .eq('status', 'faculty_pending')
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

// @desc    Get all events (for faculty view)
// @route   GET /api/faculty/all-events
// @access  Private (Faculty only)
export const getAllEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, users(club_name)')
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

// @desc    Approve event by faculty
// @route   PUT /api/faculty/:id/approve
// @access  Private (Faculty only)
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const { data: event, error } = await supabase
      .from('events')
      .update({
        status: 'faculty_approved',
        faculty_remarks: remarks || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Reject event by faculty
// @route   PUT /api/faculty/:id/reject
// @access  Private (Faculty only)
export const rejectEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400);
      throw new Error('Rejection reason is required');
    }

    const { data: event, error } = await supabase
      .from('events')
      .update({
        status: 'faculty_rejected',
        rejection_reason: reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};
