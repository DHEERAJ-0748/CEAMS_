import supabase from '../config/supabaseClient.js';

// @desc    Get all events for admin (especially admin_pending ones)
// @route   GET /api/admin/events
// @access  Private (Admin only)
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

// @desc    Approve event by admin
// @route   PUT /api/admin/:id/approve
// @access  Private (Admin only)
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const { data: event, error } = await supabase
      .from('events')
      .update({
        status: 'approved',
        admin_remarks: remarks || null,
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

// @desc    Reject event by admin
// @route   PUT /api/admin/:id/reject
// @access  Private (Admin only)
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
        status: 'rejected_by_admin',
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
