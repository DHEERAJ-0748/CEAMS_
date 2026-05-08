import supabase from '../config/supabaseClient.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    // We will aggregate real data from Supabase here.
    // In Supabase js client without custom RPCs, we fetch data and aggregate it in memory,
    // or fetch lightly aggregated data. For large datasets, RPC is preferred.
    
    // 1. Total events and statuses
    const { data: events, error: eventError } = await supabase.from('events').select('status, budget, created_at');
    if (eventError) throw eventError;

    const stats = {
      totalEvents: events.length,
      pendingApprovals: events.filter(e => e.status.includes('pending')).length,
      approvedEvents: events.filter(e => e.status === 'approved').length,
      rejectedEvents: events.filter(e => e.status.includes('rejected')).length,
      totalBudgetRequested: events.reduce((sum, e) => sum + Number(e.budget || 0), 0)
    };

    // 2. Active Clubs
    const { data: clubs, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'club');
    if (userError) throw userError;
    stats.activeClubs = clubs.length;

    // 3. Venues
    const { data: venues, error: venueError } = await supabase.from('venues').select('id, status');
    if (!venueError && venues) {
      stats.totalVenues = venues.length;
      stats.bookedVenuesToday = venues.filter(v => v.status === 'unavailable').length;
    }

    // 4. Events per month (For charts)
    const monthlyEvents = Array(12).fill(0);
    events.forEach(e => {
       const month = new Date(e.created_at).getMonth();
       monthlyEvents[month]++;
    });

    res.status(200).json({ stats, monthlyEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
