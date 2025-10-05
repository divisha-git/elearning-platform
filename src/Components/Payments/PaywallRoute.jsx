import React, { useEffect, useMemo, useState } from 'react';
import Paywall from './Paywall';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// courseId: unique id per course (e.g., 'java', 'mern-nodejs')
// price: amount in INR (e.g., 499)
export default function PaywallRoute({ courseId, price = 499, title = 'Course', children }) {
  const [purchased, setPurchased] = useState(false);
  const { user } = useAuth();
  const clientToken = useMemo(() => (user?._id || user?.id || user?.email || 'guest'), [user]);
  const storageKey = useMemo(() => `purchased:${clientToken}:${courseId}`,[clientToken, courseId]);

  useEffect(() => {
    let mounted = true;
    const local = localStorage.getItem(storageKey) === 'true';
    if (local) {
      setPurchased(true);
      return;
    }
    // Check backend approvals
    const check = async () => {
      try {
        const res = await axios.get('/api/payments/mine', { params: { clientToken } });
        const items = res.data?.items || [];
        const ok = items.some(x => x.courseId === courseId && x.status === 'approved');
        if (mounted && ok) {
          localStorage.setItem(storageKey, 'true');
          setPurchased(true);
        }
      } catch (e) {
        // ignore errors
      }
    };
    check();
    return () => { mounted = false; };
  }, [clientToken, courseId, storageKey]);

  if (purchased) return children;

  return (
    <Paywall
      courseId={courseId}
      title={title}
      price={1}
      onSuccess={() => {
        localStorage.setItem(storageKey, 'true');
        setPurchased(true);
      }}
    />
  );
}
