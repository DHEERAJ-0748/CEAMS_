import supabase from '../config/supabaseClient.js';

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent notifications
// @route   GET /api/notifications/sent
// @access  Private (Admin)
export const getSentNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, users!notifications_user_id_fkey(name, club_name)') // join with users to get recipient name
      .eq('sender_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notification (Internal/Admin utility)
// @route   POST /api/notifications
// @access  Private (Admin)
export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    
    if (!user_id || !title || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{ user_id, sender_id: req.user.id, title, message, type: type || 'info' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
