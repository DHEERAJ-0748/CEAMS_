import supabase from '../config/supabaseClient.js';

// @desc    Get all events for admin (especially admin_pending ones)
// @route   GET /api/admin/events
// @access  Private (Admin only)
export const getAllEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, users(club_name)')
      .eq('status', 'faculty_approved')
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
        status: 'admin_approved',
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
        status: 'admin_rejected',
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

// @desc    Get all clubs
// @route   GET /api/admin/clubs
// @access  Private (Admin only)
export const getClubs = async (req, res) => {
  try {
    const { data: clubs, error } = await supabase
      .from('users')
      .select('id, name, email, club_name, created_at, is_active')
      .eq('role', 'club')
      .order('club_name', { ascending: true });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    // We can also fetch the number of events conducted per club, but for simplicity
    // we return the clubs first. Ideally, we fetch events grouped by club.
    res.status(200).json(clubs);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

// @desc    Toggle club active status
// @route   PUT /api/admin/clubs/:id/toggle-status
// @access  Private (Admin only)
export const toggleClubStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current status
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('is_active')
      .eq('id', id)
      .single();
      
    if (fetchError) throw new Error(fetchError.message);

    // Toggle status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ is_active: !user.is_active })
      .eq('id', id)
      .select('id, is_active')
      .single();

    if (updateError) throw new Error(updateError.message);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
