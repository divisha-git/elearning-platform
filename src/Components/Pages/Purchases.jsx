import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function Purchases() {
  const { user } = useAuth();
  const clientToken = useMemo(() => (user?._id || user?.id || user?.email || 'guest'), [user]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/payments/mine', { params: { clientToken } });
      setItems(res.data?.items || []);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [clientToken]);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-4">
          <h3>My Purchases</h3>
          <p className="text-muted">View your UPI payment submissions and approval status.</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        )}
        {error && !loading && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && items.length === 0 && (
          <div className="alert alert-info">No submissions found.</div>
        )}

        {!loading && items.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Course</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id}>
                    <td><code>{i.id}</code></td>
                    <td>{i.courseId}</td>
                    <td><code>{i.reference}</code></td>
                    <td>
                      {i.status === 'approved' ? (
                        <span className="badge bg-success">Approved</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </td>
                    <td>{new Date(i.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={load} disabled={loading}>Refresh</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
