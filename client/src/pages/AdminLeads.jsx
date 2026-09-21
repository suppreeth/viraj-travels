import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  RefreshCw,
  Lock,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Compass,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { getLeads, updateLeadStatus } from '../services/api';

const SESSION_ADMIN_KEY = 'vt_admin_session_key';

const AdminLeads = () => {
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem(SESSION_ADMIN_KEY) || ''
  );
  const [inputKey, setInputKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(sessionStorage.getItem(SESSION_ADMIN_KEY))
  );
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLeads = async (keyToUse) => {
    const key = keyToUse || adminKey;
    if (!key) return;

    setLoading(true);
    setError('');

    try {
      const res = await getLeads(key);
      setLeads(res.data.data || []);
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_ADMIN_KEY, key);
      setAdminKey(key);
    } catch (err) {
      console.error('Admin fetch error:', err);
      if (err.response?.status === 401) {
        setError('Invalid admin passkey. Access denied.');
        setIsAuthenticated(false);
        sessionStorage.removeItem(SESSION_ADMIN_KEY);
      } else {
        setError('Failed to load leads from the server. Check if backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchLeads(adminKey);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError('Please enter the admin passkey.');
      return;
    }
    fetchLeads(inputKey.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_ADMIN_KEY);
    setAdminKey('');
    setInputKey('');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    try {
      await updateLeadStatus(leadId, newStatus, adminKey);
      setLeads((prev) =>
        prev.map((item) =>
          item.id === leadId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchTerm)) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.requirement && lead.requirement.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'NEW').length,
    contacted: leads.filter((l) => l.status === 'CONTACTED').length,
    converted: leads.filter((l) => l.status === 'CONVERTED').length
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  };

  const cleanPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    let digits = phone.replace(/\D/g, '');
    // If it's a 10 digit Indian number, prefix 91
    if (digits.length === 10) {
      digits = '91' + digits;
    }
    return digits;
  };

  // If not authenticated, show passcode login screen
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--off-white)', paddingTop: '120px', paddingBottom: '60px' }}>
        <style>{`
          .admin-auth-card {
            max-width: 440px;
            margin: 40px auto;
            background: white;
            padding: 2.5rem;
            border-radius: var(--r-xl);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--gray-200);
            text-align: center;
          }
          .admin-auth-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(14, 110, 184, 0.1);
            color: var(--blue);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.25rem;
          }
        `}</style>

        <div className="container">
          <motion.div
            className="admin-auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="admin-auth-icon">
              <Lock size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>
              Owner Portal
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Enter your admin passkey to view and manage visitor consultation enquiries.
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--r-md)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label className="form-label" htmlFor="admin-key">
                  Admin Passkey
                </label>
                <input
                  id="admin-key"
                  type="password"
                  className="form-input"
                  placeholder="Enter passkey..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  autoFocus
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '4px', display: 'block' }}>
                  Default local passkey: <code>virajadmin2025</code>
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Unlock Enquiries'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', paddingTop: '100px', paddingBottom: '80px' }}>
      <style>{`
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .admin-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .admin-stat-card {
          background: white;
          border-radius: var(--r-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-stat-num {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1;
        }
        .admin-stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gray-500);
          margin-top: 4px;
        }
        .admin-table-card {
          background: white;
          border-radius: var(--r-xl);
          box-shadow: var(--shadow-card);
          border: 1px solid var(--gray-200);
          overflow: hidden;
        }
        .admin-toolbar {
          padding: 1.25rem;
          border-bottom: 1px solid var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .admin-search-wrap {
          position: relative;
          min-width: 280px;
          flex: 1;
          max-width: 400px;
        }
        .admin-search-input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--r-full);
          font-size: 0.9rem;
        }
        .admin-search-input:focus {
          outline: none;
          border-color: var(--blue);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          background: var(--gray-50);
          padding: 0.85rem 1.25rem;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--gray-600);
          border-bottom: 1px solid var(--gray-200);
        }
        .admin-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--gray-100);
          font-size: 0.9rem;
          color: var(--gray-800);
          vertical-align: top;
        }
        .admin-table tr:hover td {
          background: #f8fafc;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0.25rem 0.65rem;
          border-radius: var(--r-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-badge.NEW {
          background: rgba(14, 110, 184, 0.12);
          color: var(--blue);
        }
        .status-badge.CONTACTED {
          background: rgba(245, 158, 11, 0.12);
          color: var(--gold);
        }
        .status-badge.CONVERTED {
          background: rgba(13, 148, 136, 0.12);
          color: var(--teal);
        }
        .status-badge.CLOSED {
          background: var(--gray-100);
          color: var(--gray-600);
        }
        .status-select {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: var(--r-md);
          border: 1px solid var(--gray-300);
          background: white;
          cursor: pointer;
        }
        .quick-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--r-md);
          border: 1px solid var(--gray-200);
          background: white;
          color: var(--gray-600);
          transition: all 0.2s;
        }
        .quick-action-btn:hover {
          color: var(--blue);
          border-color: var(--blue);
          background: rgba(14, 110, 184, 0.05);
        }
        .quick-action-btn.whatsapp:hover {
          color: #25d366;
          border-color: #25d366;
          background: rgba(37, 211, 102, 0.08);
        }
        @media (max-width: 768px) {
          .admin-table-card {
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 4 }}>
              <ShieldCheck size={14} /> Owner Portal
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy)' }}>
              Consultation Leads & Inquiries
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => fetchLeads()}
              className="btn btn-outline-dark btn-sm"
              disabled={loading}
              title="Refresh lead list"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline-dark btn-sm"
              title="Lock portal"
            >
              <LogOut size={15} />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-num">{stats.total}</div>
              <div className="admin-stat-label">Total Leads</div>
            </div>
            <Users size={28} color="var(--blue)" style={{ opacity: 0.6 }} />
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-num" style={{ color: 'var(--blue)' }}>{stats.new}</div>
              <div className="admin-stat-label">New / Uncontacted</div>
            </div>
            <Clock size={28} color="var(--blue)" style={{ opacity: 0.6 }} />
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-num" style={{ color: 'var(--gold)' }}>{stats.contacted}</div>
              <div className="admin-stat-label">In Contact</div>
            </div>
            <MessageCircle size={28} color="var(--gold)" style={{ opacity: 0.6 }} />
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-num" style={{ color: 'var(--teal)' }}>{stats.converted}</div>
              <div className="admin-stat-label">Converted Bookings</div>
            </div>
            <CheckCircle size={28} color="var(--teal)" style={{ opacity: 0.6 }} />
          </div>
        </div>

        {/* Table Card */}
        <div className="admin-table-card">
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <Search
                size={16}
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}
              />
              <input
                type="text"
                placeholder="Search by name, phone, requirement..."
                className="admin-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)' }}>
                Filter Status:
              </label>
              <select
                className="status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses ({leads.length})</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredLeads.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--gray-500)' }}>
              <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                No enquiries found
              </h3>
              <p style={{ fontSize: '0.9rem' }}>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search query or filters.'
                  : 'Submitted visitor consultation enquiries will appear here in real time.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Visitor Name</th>
                    <th>Phone / Contact</th>
                    <th>Email</th>
                    <th>Destination / Requirement</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--gray-600)', fontSize: '0.825rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="var(--gray-400)" />
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                      </td>

                      <td style={{ fontWeight: 700, color: 'var(--navy)' }}>
                        {lead.name}
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={`tel:${lead.phone}`}
                            style={{ color: 'var(--blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Call customer"
                          >
                            <Phone size={14} />
                            <span>{lead.phone}</span>
                          </a>
                        </div>
                      </td>

                      <td>
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            style={{ color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Send email"
                          >
                            <Mail size={14} />
                            <span>{lead.email}</span>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--gray-400)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                            Not provided
                          </span>
                        )}
                      </td>

                      <td style={{ maxWidth: '280px' }}>
                        {lead.requirement ? (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.88rem' }}>
                            <Compass size={15} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ lineHeight: 1.4 }}>{lead.requirement}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--gray-400)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                            General enquiry
                          </span>
                        )}
                      </td>

                      <td>
                        <select
                          className="status-select"
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* Direct WhatsApp Chat Action */}
                          <a
                            href={`https://wa.me/${cleanPhoneForWhatsApp(lead.phone)}?text=${encodeURIComponent(
                              `Hello ${lead.name}, thank you for reaching out to Viraj Travels! We received your enquiry for: "${lead.requirement || 'travel consultation'}". How can we assist you today?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="quick-action-btn whatsapp"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </a>

                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="quick-action-btn"
                            title="Call Phone"
                          >
                            <Phone size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
