import { initialData } from '../data/travelData.js';

/**
 * Pure Frontend API Service for Viraj Travels / V-RAJ Holidays.
 * 
 * Replaces the Express/SQLite backend completely with client-side state management
 * and localStorage persistence. Works 100% offline, on static hosting (Vercel, Netlify,
 * GitHub Pages), with zero server maintenance.
 */

const ADMIN_KEY = 'virajadmin2025';

// Storage keys
const STORAGE_LEADS = 'vt_leads';
const STORAGE_TESTIMONIALS = 'vt_testimonials';
const STORAGE_PACKAGES = 'vt_packages';
const STORAGE_DESTINATIONS = 'vt_destinations';

const memoryStore = {};

const getStored = (key, fallback) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(item);
    }
  } catch (e) {
    // fallback to memory
  }
  if (!memoryStore[key]) {
    memoryStore[key] = JSON.parse(JSON.stringify(fallback));
  }
  return memoryStore[key];
};

const setStored = (key, value) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
  memoryStore[key] = JSON.parse(JSON.stringify(value));
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
};

const wrapResponse = (data, status = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, status });
    }, 40);
  });
};

const wrapError = (message, status = 400) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error(message);
      err.response = { status, data: { success: false, message } };
      reject(err);
    }, 40);
  });
};

// ==========================================
// Tour Packages
// ==========================================
export const getPackages = async (params = {}) => {
  const allPackages = getStored(STORAGE_PACKAGES, initialData.packages);
  let list = [...allPackages];

  const { category, destination, duration, sort, search, featured } = params;

  if (featured === 'true' || featured === true) {
    list = list.filter((p) => p.featured === true || p.featured === 1);
  }

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter((p) =>
      (p.title && p.title.toLowerCase().includes(s)) ||
      (p.destinationName && p.destinationName.toLowerCase().includes(s)) ||
      (p.category && p.category.toLowerCase().includes(s)) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(s)) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  }

  if (category && category.trim()) {
    const c = category.trim().toLowerCase();
    list = list.filter((p) => p.category && p.category.toLowerCase().includes(c));
  }

  if (destination && destination.trim()) {
    const d = destination.trim().toLowerCase();
    list = list.filter((p) => p.destinationName && p.destinationName.toLowerCase().includes(d));
  }

  if (duration) {
    if (duration === '1-3') {
      list = list.filter((p) => (p.nights ?? 0) <= 3);
    } else if (duration === '4-7') {
      list = list.filter((p) => (p.nights ?? 0) >= 4 && (p.nights ?? 0) <= 7);
    } else if (duration === '8+') {
      list = list.filter((p) => (p.nights ?? 0) >= 8);
    }
  }

  if (sort === 'price_asc') {
    list.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price_desc') {
    list.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Default: featured first, then highest rating
    list.sort((a, b) => {
      const featA = a.featured ? 1 : 0;
      const featB = b.featured ? 1 : 0;
      if (featB !== featA) return featB - featA;
      return (b.rating || 0) - (a.rating || 0);
    });
  }

  return wrapResponse({
    success: true,
    data: list,
    count: list.length
  });
};

export const getFeaturedPackages = () => getPackages({ featured: 'true' });

export const getPackageById = async (id) => {
  const allPackages = getStored(STORAGE_PACKAGES, initialData.packages);
  const pkg = allPackages.find((p) => String(p.id) === String(id));
  if (!pkg) {
    return wrapError('Package not found', 404);
  }
  return wrapResponse({
    success: true,
    data: pkg
  });
};

export const searchPackages = (searchParams) => getPackages(searchParams);

// ==========================================
// Destinations
// ==========================================
export const getDestinations = async (params = {}) => {
  const allDestinations = getStored(STORAGE_DESTINATIONS, initialData.destinations);
  let list = [...allDestinations];

  if (params.category && params.category.trim()) {
    const c = params.category.trim().toLowerCase();
    list = list.filter((d) => d.category && d.category.toLowerCase().includes(c));
  }

  list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return wrapResponse({
    success: true,
    data: list,
    count: list.length
  });
};

export const getDestinationById = async (id) => {
  const allDestinations = getStored(STORAGE_DESTINATIONS, initialData.destinations);
  const allPackages = getStored(STORAGE_PACKAGES, initialData.packages);

  const destination = allDestinations.find((d) => String(d.id) === String(id));
  if (!destination) {
    return wrapError('Destination not found', 404);
  }

  const destinationPackages = allPackages.filter((p) => String(p.destinationId) === String(id));

  return wrapResponse({
    success: true,
    data: {
      ...destination,
      packages: destinationPackages
    }
  });
};

// ==========================================
// Testimonials / Reviews
// ==========================================
export const getTestimonials = async () => {
  const testimonials = getStored(STORAGE_TESTIMONIALS, initialData.testimonials);
  const sorted = [...testimonials].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return wrapResponse({
    success: true,
    data: sorted
  });
};

export const submitTestimonial = async (data) => {
  const { name, destination, rating, review } = data || {};
  if (!name || !review) {
    return wrapError('Name and review are required', 400);
  }

  const numRating = parseFloat(rating) || 5.0;
  const clampedRating = Math.max(1, Math.min(5, numRating));
  const id = generateId();

  const newTestimonial = {
    id,
    name: name.trim(),
    destination: destination ? destination.trim() : 'Traveller',
    rating: clampedRating,
    review: review.trim(),
    image: null
  };

  const current = getStored(STORAGE_TESTIMONIALS, initialData.testimonials);
  const updated = [newTestimonial, ...current];
  setStored(STORAGE_TESTIMONIALS, updated);

  return wrapResponse({
    success: true,
    message: 'Thank you for your review!',
    data: newTestimonial
  }, 201);
};

// ==========================================
// Enquiries & Contact
// ==========================================
export const submitEnquiry = async (data) => {
  const { name, email, phone, destination, travelDate, travellers, message, packageId } = data || {};
  if (!name || !phone) {
    return wrapError('Name and phone are required.', 400);
  }

  const id = generateId();
  const cleanEmail = email && email.trim() ? email.trim() : null;
  const cleanRequirement = [
    destination ? `Destination: ${destination}` : null,
    travelDate ? `Travel Date: ${travelDate}` : null,
    travellers ? `Travellers: ${travellers}` : null,
    message ? `Note: ${message}` : null
  ].filter(Boolean).join(' | ');

  const newLead = {
    id,
    name: name.trim(),
    phone: phone.trim(),
    email: cleanEmail,
    requirement: cleanRequirement || 'Tour Enquiry',
    source: packageId ? `package-${packageId}` : 'enquiry-form',
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  const leads = getStored(STORAGE_LEADS, initialData.leads);
  setStored(STORAGE_LEADS, [newLead, ...leads]);

  return wrapResponse({
    success: true,
    message: 'Your travel enquiry has been received! Our expert will contact you shortly.',
    id
  }, 201);
};

export const submitContact = async (data) => {
  const { name, email, phone, message } = data || {};
  if (!name || !email || !message) {
    return wrapError('Name, email, and message are required.', 400);
  }

  const id = generateId();
  const newLead = {
    id,
    name: name.trim(),
    phone: (phone || '').trim(),
    email: email.trim(),
    requirement: message.trim(),
    source: 'contact-page',
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  const leads = getStored(STORAGE_LEADS, initialData.leads);
  setStored(STORAGE_LEADS, [newLead, ...leads]);

  return wrapResponse({
    success: true,
    message: 'Your message has been received! We will get back to you within 24 hours.'
  }, 201);
};

// ==========================================
// Leads (Visitor consultation popup & admin view)
// ==========================================
export const submitLead = async (data) => {
  const { name, phone, email, requirement, destination, website, source } = data || {};

  // Honeypot check
  if (website && website.trim() !== '') {
    return wrapResponse({
      success: true,
      message: "Thank you! We've received your enquiry. Our team will contact you soon."
    });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return wrapError('Full Name is required and must be at least 2 characters.', 400);
  }

  if (!phone || typeof phone !== 'string') {
    return wrapError('Phone Number is required.', 400);
  }

  const cleanPhone = phone.trim();
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 16) {
    return wrapError('Please enter a valid phone number (minimum 7 digits).', 400);
  }

  const id = generateId();
  const rawReq = requirement || destination || '';
  const cleanRequirement = typeof rawReq === 'string' ? rawReq.trim().slice(0, 1000) : null;
  const cleanEmail = email && typeof email === 'string' ? email.trim() : null;

  const newLead = {
    id,
    name: name.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    requirement: cleanRequirement,
    source: source || 'popup',
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  const leads = getStored(STORAGE_LEADS, initialData.leads);
  setStored(STORAGE_LEADS, [newLead, ...leads]);

  return wrapResponse({
    success: true,
    message: "Thank you! We've received your enquiry. Our team will contact you soon.",
    leadId: id
  }, 201);
};

export const getLeads = async (adminKey) => {
  if (!adminKey || adminKey !== ADMIN_KEY) {
    return wrapError('Unauthorized. Admin key required.', 401);
  }

  const leads = getStored(STORAGE_LEADS, initialData.leads);
  const sorted = [...leads].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return wrapResponse({
    success: true,
    count: sorted.length,
    data: sorted
  });
};

export const updateLeadStatus = async (id, status, adminKey) => {
  if (!adminKey || adminKey !== ADMIN_KEY) {
    return wrapError('Unauthorized. Admin key required.', 401);
  }

  const validStatuses = ['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return wrapError(`Invalid status. Valid values are: ${validStatuses.join(', ')}`, 400);
  }

  const leads = getStored(STORAGE_LEADS, initialData.leads);
  const leadIndex = leads.findIndex((l) => String(l.id) === String(id));

  if (leadIndex === -1) {
    return wrapError('Lead not found.', 404);
  }

  leads[leadIndex] = {
    ...leads[leadIndex],
    status: status.toUpperCase()
  };

  setStored(STORAGE_LEADS, leads);

  return wrapResponse({
    success: true,
    message: 'Lead status updated successfully.'
  });
};

// Mock Axios API object for any direct axios calls
const api = {
  get: async (url, config = {}) => {
    if (url.startsWith('/packages/')) {
      const id = url.replace('/packages/', '');
      return getPackageById(id);
    }
    if (url === '/packages') {
      return getPackages(config.params || {});
    }
    if (url.startsWith('/destinations/')) {
      const id = url.replace('/destinations/', '');
      return getDestinationById(id);
    }
    if (url === '/destinations') {
      return getDestinations(config.params || {});
    }
    if (url === '/testimonials') {
      return getTestimonials();
    }
    if (url === '/leads') {
      const key = config.headers?.['x-admin-key'];
      return getLeads(key);
    }
    return wrapResponse({ success: true, data: [] });
  },
  post: async (url, data) => {
    if (url === '/leads') return submitLead(data);
    if (url === '/testimonials') return submitTestimonial(data);
    if (url === '/enquiries') return submitEnquiry(data);
    if (url === '/contact') return submitContact(data);
    return wrapResponse({ success: true });
  },
  patch: async (url, data, config = {}) => {
    if (url.startsWith('/leads/') && url.endsWith('/status')) {
      const id = url.replace('/leads/', '').replace('/status', '');
      const key = config.headers?.['x-admin-key'];
      return updateLeadStatus(id, data?.status, key);
    }
    return wrapResponse({ success: true });
  }
};

export default api;
