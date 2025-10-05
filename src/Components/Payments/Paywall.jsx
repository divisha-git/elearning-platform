import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function Paywall({ courseId, title = 'Course', price = 499, onSuccess }) {
  const { user } = useAuth();
  const clientToken = useMemo(() => (user?._id || user?.id || user?.email || 'guest'), [user]);

  // Configuration: Update with your actual UPI ID and optional QR image path
  const UPI_ID = (import.meta.env?.VITE_UPI_ID || 'mdivisha2005@oksbi');
  // Use the provided Google Pay QR image at project root (served from /)
  const QR_IMAGE = '/GooglePay_QR.png';

  // Build a Google Pay UPI deep link so users can tap to open the app
  const upiParams = new URLSearchParams({
    pa: UPI_ID,               // payee address
    pn: 'eLearning',          // payee name
    am: String(price),        // amount
    cu: 'INR',                // currency
    tn: `${title} (${courseId})` // transaction note
  });
  const gpayDeepLink = `upi://pay?${upiParams.toString()}`;

  const [name, setName] = useState(user?.name || '');
  const [upiId, setUpiId] = useState(UPI_ID);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | pending | approved | error | awaiting_proof
  const pollRef = useRef(null);

  // --- Screenshot + OCR (Tesseract) ---
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [ocrOk, setOcrOk] = useState(false);
  const [ocrUpiOk, setOcrUpiOk] = useState(false);
  const [ocrAmtOk, setOcrAmtOk] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Load Tesseract.js from CDN once
  useEffect(() => {
    if (window.Tesseract) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  const handleProofChange = (e) => {
    const f = e.target.files?.[0];
    setProofFile(f || null);
    setOcrText('');
    setOcrOk(false);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setProofPreview(String(reader.result || ''));
      reader.readAsDataURL(f);
    } else {
      setProofPreview('');
    }
  };

  const runOcr = async () => {
    if (!proofFile && !proofPreview) {
      alert('Please upload a payment screenshot first');
      return;
    }
    if (!window.Tesseract) {
      alert('OCR engine not loaded yet. Please wait a moment and try again.');
      return;
    }
    setOcrRunning(true);
    setOcrOk(false);
    try {
      const imgSrc = proofPreview || URL.createObjectURL(proofFile);

      // Preprocess: upscale image to improve OCR on small screenshots
      const upscale = async (src) => new Promise((resolve, reject) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => {
          const scale = 2; // 2x upscale
          const canvas = document.createElement('canvas');
          canvas.width = im.width * scale;
          canvas.height = im.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        };
        im.onerror = reject;
        im.src = src;
      });

      const preprocessed = await upscale(imgSrc);
      const { data } = await window.Tesseract.recognize(preprocessed, 'eng');
      const rawText = (data?.text || '');
      const lower = rawText.toLowerCase();
      // Base normalization: spaces and punctuation, but do NOT change characters for UPI check
      const baseNorm = lower
        .replace(/\u00A0/g, ' ')
        .replace(/[\,]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      // Amount-targeted normalization (more aggressive)
      const amtText = baseNorm
        .replace(/[|iℓl]/g, '1')
        .replace(/o/g, '0')
        .replace(/r5/g, 'rs')
        .replace(/in\s*r/g, 'inr');
      setOcrText(baseNorm);
      try { console.debug('[OCR TEXT]', baseNorm); } catch {}
      const required = (UPI_ID || '').trim().toLowerCase();
      // Fuzzy UPI regex: allow common OCR substitutions and optional tiny gaps
      const toCharClass = (ch) => {
        if (/[a-z0-9]/.test(ch)) {
          switch (ch) {
            case 'o': return '[o0]';
            case '0': return '[o0]';
            case 'i': return '[iIl1]';
            case 'l': return '[iIl1]';
            case '1': return '[iIl1]';
            case 's': return '[s5]';
            case '5': return '[s5]';
            case 'b': return '[b6]';
            case '6': return '[b6]';
            case 'e': return '[e3]';
            case '3': return '[e3]';
            case 'a': return '[a@]';
            case '@': return '[@a]';
            default: return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          }
        }
        // Escape regex specials
        return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };
      const fuzzy = required.split('').map(c => toCharClass(c)).join('\\s{0,2}');
      const upiRegex = new RegExp(fuzzy);
      const upiMatch = !!required && upiRegex.test(baseNorm);
      // Amount checking disabled: only verify UPI presence
      setOcrUpiOk(upiMatch);
      setOcrAmtOk(true);
      const ok = upiMatch;
      setOcrOk(ok);
      if (!upiMatch) {
        alert(`UPI ID mismatch. The screenshot must contain: ${required}`);
      }
    } catch (e) {
      console.error('OCR error:', e);
      alert('Could not scan the screenshot. Please ensure the image is clear and try again.');
    } finally {
      setOcrRunning(false);
    }
  };

  const submitReference = useCallback(async () => {
    if (!reference.trim()) return alert('Enter UPI payment reference/UTR');
    if (!ocrOk) {
      return alert('Please upload your payment screenshot and click Scan. The UPI ID on the screenshot must match to continue.');
    }
    setSubmitting(true);
    try {
      const res = await axios.post('/api/payments/submit', {
        courseId,
        upiId,
        reference: reference.trim(),
        clientToken,
        name: name || ''
      });
      const id = res.data?.id;
      setPaymentId(id);
      // If backend auto-approved (UPI match), unlock immediately
      if (res.data?.status === 'approved') {
        if (ocrOk) {
          setStatus('approved');
          onSuccess?.();
        } else {
          setStatus('awaiting_proof');
        }
      } else {
        setStatus('pending');
      }
    } catch (e) {
      console.error(e);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }, [clientToken, courseId, name, reference, upiId, ocrOk]);

  // Poll for approval
  useEffect(() => {
    if (!paymentId || status !== 'pending') return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/payments/status/${paymentId}`);
        const st = res.data?.status;
        if (st === 'approved') {
          clearInterval(pollRef.current);
          if (ocrOk) {
            setStatus('approved');
            onSuccess?.();
          } else {
            setStatus('awaiting_proof');
          }
        }
      } catch (e) {
        // ignore transient errors
      }
    }, 3000);
    return () => pollRef.current && clearInterval(pollRef.current);
  }, [paymentId, status, onSuccess, ocrOk]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">
              <h3 className="mb-2">Unlock {title}</h3>
              <p className="text-muted">Pay via UPI and submit your reference ID for admin approval.</p>
              <h2 className="my-2">₹{price}</h2>

              <div className="my-3">
                <div className="d-flex flex-column align-items-center">
                  <img src={QR_IMAGE} onError={(e)=>{e.currentTarget.style.display='none'}} alt="Google Pay QR" style={{maxWidth: 240}} />
                  <div className="mt-2"><strong>UPI ID:</strong> <code>{UPI_ID}</code></div>
                </div>
              </div>

              {/* Payment screenshot + OCR verification */}
              <div className="text-start mx-auto" style={{maxWidth: 480}}>
                <div className="mb-2">
                  <label className="form-label">Upload Payment Screenshot (required)</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handleProofChange} />
                </div>
                {proofPreview && (
                  <div className="mb-2 text-center">
                    <img src={proofPreview} alt="Payment proof preview" style={{maxWidth: '100%', maxHeight: 280, objectFit: 'contain'}} />
                  </div>
                )}
                <div className="mb-3 d-flex gap-2 flex-wrap">
                  <button className="btn btn-outline-primary" type="button" onClick={runOcr} disabled={ocrRunning || !proofFile}>
                    {ocrRunning ? 'Scanning…' : 'Scan Screenshot'}
                  </button>
                  {ocrUpiOk ? (
                    <span className="badge bg-success align-self-center">UPI Verified</span>
                  ) : (
                    ocrText && <span className="badge bg-danger align-self-center">UPI Not Found</span>
                  )}
                </div>
                {ocrText && (
                  <div className="mb-2">
                    <button type="button" className="btn btn-sm btn-link p-0" onClick={()=>setShowDebug(!showDebug)}>
                      {showDebug ? 'Hide OCR details' : 'Show OCR details'}
                    </button>
                    {showDebug && (
                      <pre className="mt-2 p-2 border rounded" style={{maxHeight: 160, overflow: 'auto', background:'#f8f9fa', fontSize: 12}}>
                        {ocrText}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              <div className="text-start mx-auto" style={{maxWidth: 480}}>
                <div className="mb-2">
                  <label className="form-label">Your Name</label>
                  <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="mb-2">
                  <label className="form-label">UPI ID used (optional)</label>
                  <input className="form-control" value={upiId} onChange={(e)=>setUpiId(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">UPI Payment Reference / UTR</label>
                  <input className="form-control" placeholder="Enter reference/UTR from your UPI app" value={reference} onChange={(e)=>setReference(e.target.value)} />
                </div>
                <button className="btn btn-primary w-100" onClick={submitReference} disabled={submitting || status==='pending' || !ocrOk}>
                  {status==='pending' ? 'Submitted. Waiting for admin approval...' : (submitting ? 'Submitting...' : 'Submit Reference for Approval')}
                </button>
                {paymentId && (
                  <p className="small text-muted mt-2">Submission ID: {paymentId}. We auto-check every 3s.</p>
                )}
                {status==='awaiting_proof' && (
                  <div className="alert alert-warning mt-3">Proof not verified yet. Please upload and scan your payment screenshot showing UPI ID {UPI_ID}.</div>
                )}
                {status==='approved' && (
                  <div className="alert alert-success mt-3">Approved! Unlocking your course...</div>
                )}
                {status==='error' && (
                  <div className="alert alert-danger mt-3">Could not submit. Try again.</div>
                )}
              </div>

              <p className="mt-3 small text-muted">Admin will verify your payment and approve access. Keep your UPI reference safe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
