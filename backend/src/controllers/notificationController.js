import supabase from '../config/supabaseClient.js';

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:users!notifications_sender_id_fkey(name, email, club_name, role)')
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
// @access  Private
export const getSentNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, recipient:users!notifications_user_id_fkey(name, email, club_name, role)')
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

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
  try {
    const { recipient_email, title, message, type } = req.body;
    
    if (!recipient_email || !title || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find recipient by email
    const { data: recipient, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', recipient_email)
      .single();

    if (userError || !recipient) {
      return res.status(404).json({ message: 'Recipient email not found in the system' });
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{ 
        user_id: recipient.id, 
        sender_id: req.user.id, 
        title, 
        message, 
        type: type || 'info' 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
