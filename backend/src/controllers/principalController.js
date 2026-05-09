import supabase from '../config/supabaseClient.js';

// @desc    Get dashboard stats for principal
// @route   GET /api/principal/stats
// @access  Private (Principal only)
export const getStats = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('status, budget, created_at, category');

    if (error) throw error;

    const stats = {
      totalEvents: events.length,
      pendingApprovals: events.filter(e => e.status === 'principal_pending').length,
      totalBudgetApproved: events
        .filter(e => e.status === 'principal_approved' || e.status === 'approved')
        .reduce((sum, e) => sum + Number(e.budget || 0), 0),
      upcomingMajorEvents: events.filter(e => 
        (e.status === 'principal_approved' || e.status === 'approved') && 
        ['Technical Festival', 'Hackathon', 'Cultural Festival', 'Inter-College'].includes(e.category)
      ).length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events for principal review
// @route   GET /api/principal/events
// @access  Private (Principal only)
export const getEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, users(club_name)')
      .in('status', ['principal_pending', 'principal_approved', 'principal_rejected'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve event by principal
// @route   PUT /api/principal/:id/approve
// @access  Private (Principal only)
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const { data: event, error } = await supabase
      .from('events')
      .update({
        status: 'principal_approved',
        principal_remarks: remarks || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, users(name, club_name)')
      .single();

    if (error) throw error;

    // Notify club
    await supabase.from('notifications').insert([{
      user_id: event.club_id,
      sender_id: req.user.id,
      title: 'Final Approval Granted',
      message: `Principal has granted final authorization for your event: ${event.title}.`,
      type: 'success'
    }]);

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject event by principal
// @route   PUT /api/principal/:id/reject
// @access  Private (Principal only)
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
        status: 'principal_rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, users(name, club_name)')
      .single();

    if (error) throw error;

    // Notify club
    await supabase.from('notifications').insert([{
      user_id: event.club_id,
      sender_id: req.user.id,
      title: 'Proposal Declined by Principal',
      message: `Your event proposal "${event.title}" was declined by the Principal. Reason: ${reason}`,
      type: 'error'
    }]);

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request clarification by principal
// @route   PUT /api/principal/:id/clarify
// @access  Private (Principal only)
export const requestClarification = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      res.status(400);
      throw new Error('Clarification message is required');
    }

    const { data: event, error } = await supabase
      .from('events')
      .update({
        principal_remarks: `Clarification Requested: ${message}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, users(name, club_name)')
      .single();

    if (error) throw error;

    // Notify club and admin (broadly we can notify club)
    await supabase.from('notifications').insert([{
      user_id: event.club_id,
      sender_id: req.user.id,
      title: 'Clarification Requested',
      message: `Principal has requested clarification on your event "${event.title}": ${message}`,
      type: 'warning'
    }]);

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budget analytics for principal
// @route   GET /api/principal/budget-analytics
// @access  Private (Principal only)
export const getBudgetAnalytics = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('budget, status, users(club_name), created_at');

    if (error) throw error;

    const totalRequested = events.reduce((sum, e) => sum + Number(e.budget || 0), 0);
    const totalApproved = events
      .filter(e => e.status === 'principal_approved' || e.status === 'approved')
      .reduce((sum, e) => sum + Number(e.budget || 0), 0);

    // Distribution by club
    const distribution = {};
    events.forEach(e => {
      const club = e.users?.club_name || 'Unknown';
      if (!distribution[club]) distribution[club] = 0;
      if (e.status === 'principal_approved' || e.status === 'approved') {
        distribution[club] += Number(e.budget || 0);
      }
    });

    res.status(200).json({
      totalRequested,
      totalApproved,
      distribution: Object.entries(distribution).map(([name, value]) => ({ name, value }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
