const db = require('../services/db');

// GET /api/packages
const getAllPackages = (req, res) => {
  try {
    const { category, destination, duration, sort, search, featured } = req.query;
    
    let query = 'SELECT * FROM TourPackage WHERE 1=1';
    const params = [];

    if (featured === 'true') {
      query += ' AND featured = 1';
    }
    if (search) {
      query += ' AND (title LIKE ? OR destinationName LIKE ? OR category LIKE ? OR shortDescription LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (category) {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }
    if (destination) {
      query += ' AND destinationName LIKE ?';
      params.push(`%${destination}%`);
    }
    if (duration) {
      if (duration === '1-3') query += ' AND nights <= 3';
      else if (duration === '4-7') query += ' AND nights BETWEEN 4 AND 7';
      else if (duration === '8+') query += ' AND nights >= 8';
    }

    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else if (sort === 'rating') query += ' ORDER BY rating DESC';
    else query += ' ORDER BY featured DESC, rating DESC';

    const packages = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const result = packages.map(p => ({
      ...p,
      highlights: JSON.parse(p.highlights || '[]'),
      inclusions: JSON.parse(p.inclusions || '[]'),
      exclusions: JSON.parse(p.exclusions || '[]'),
      images: JSON.parse(p.images || '[]'),
      featured: p.featured === 1,
    }));

    res.json({ success: true, data: result, count: result.length });
  } catch (err) {
    console.error('Error fetching packages:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch packages' });
  }
};

// GET /api/packages/:id
const getPackageById = (req, res) => {
  try {
    const pkg = db.prepare('SELECT * FROM TourPackage WHERE id = ?').get(req.params.id);
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const itineraries = db.prepare('SELECT * FROM Itinerary WHERE packageId = ? ORDER BY day ASC').all(req.params.id);

    const result = {
      ...pkg,
      highlights: JSON.parse(pkg.highlights || '[]'),
      inclusions: JSON.parse(pkg.inclusions || '[]'),
      exclusions: JSON.parse(pkg.exclusions || '[]'),
      images: JSON.parse(pkg.images || '[]'),
      featured: pkg.featured === 1,
      itineraries,
    };

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error fetching package:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch package' });
  }
};

module.exports = { getAllPackages, getPackageById };
