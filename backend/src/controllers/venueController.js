import supabase from '../config/supabaseClient.js';

// @desc    Get all venues
// @route   GET /api/venues
// @access  Private
export const getVenues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a venue
// @route   POST /api/venues
// @access  Private (Admin)
export const createVenue = async (req, res) => {
  try {
    const { name, type, capacity, status } = req.body;
    
    if (!name || !type || !capacity) {
      return res.status(400).json({ message: 'Name, type, and capacity are required' });
    }

    const { data, error } = await supabase
      .from('venues')
      .insert([{ name, type, capacity, status: status || 'available' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a venue
// @route   PUT /api/venues/:id
// @access  Private (Admin)
export const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, status } = req.body;

    const { data, error } = await supabase
      .from('venues')
      .update({ name, type, capacity, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a venue
// @route   DELETE /api/venues/:id
// @access  Private (Admin)
export const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('venues').delete().eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
