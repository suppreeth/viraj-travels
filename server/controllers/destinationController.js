const db = require('../services/db');

// GET /api/destinations
const getAllDestinations = (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM Destination WHERE 1=1';
    const params = [];
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY name ASC';
    const destinations = db.prepare(query).all(...params);
    res.json({ success: true, data: destinations, count: destinations.length });
  } catch (err) {
    console.error('Error fetching destinations:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch destinations' });
  }
};

// GET /api/destinations/:id
const getDestinationById = (req, res) => {
  try {
    const destination = db.prepare('SELECT * FROM Destination WHERE id = ?').get(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    const packages = db.prepare('SELECT * FROM TourPackage WHERE destinationId = ?').all(req.params.id);
    const packagesWithParsed = packages.map(p => ({
      ...p,
      highlights: JSON.parse(p.highlights || '[]'),
      inclusions: JSON.parse(p.inclusions || '[]'),
      exclusions: JSON.parse(p.exclusions || '[]'),
      images: JSON.parse(p.images || '[]'),
      featured: p.featured === 1,
    }));
    res.json({ success: true, data: { ...destination, packages: packagesWithParsed } });
  } catch (err) {
    console.error('Error fetching destination:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch destination' });
  }
};

module.exports = { getAllDestinations, getDestinationById };
