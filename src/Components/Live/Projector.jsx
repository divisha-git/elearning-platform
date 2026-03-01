import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

async function ensureSocketClient() {
  if (window.io) return window.io;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const base = axios.defaults.baseURL || '';
    s.src = `${base}/socket.io/socket.io.js`;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
  return window.io;
}

export default function Projector() {
  const { roomId } = useParams();
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      try {
        const io = await ensureSocketClient();
        const base = axios.defaults.baseURL || '';
        const socket = io(base, { transports: ['websocket'] });
        socketRef.current = socket;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
        });
        pcRef.current = pc;

        pc.ontrack = (e) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        };
        pc.onicecandidate = (e) => {
          if (e.candidate) socket.emit('webrtc:ice', { roomId, to: null, candidate: e.candidate });
        };

        socket.on('connect', () => {
          setStatus('Connected');
          socket.emit('webrtc:join', { roomId, role: 'viewer' });
        });

        socket.on('webrtc:offer', async ({ from, offer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc:answer', { roomId, to: from, answer });
        });
        socket.on('webrtc:answer', async ({ answer }) => {
          // Typically viewer won't receive answers
          try { await pc.setRemoteDescription(new RTCSessionDescription(answer)); } catch {}
        });
        socket.on('webrtc:ice', async ({ candidate }) => {
          try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
        });

        cleanup = () => {
          try { socket.disconnect(); } catch {}
          try { pc.close(); } catch {}
        };
      } catch (e) {
        setStatus('Error connecting');
      }
    })();

    return () => cleanup();
  }, [roomId]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Projector • Room {roomId}</h3>
        <div className="text-muted">{status}</div>
      </div>
      <div className="card">
        <div className="card-body">
          <video ref={remoteVideoRef} autoPlay playsInline controls={false} style={{width:'100%', borderRadius:8, background:'#000'}}></video>
        </div>
      </div>
      <p className="text-muted mt-3">Ask the instructor to start the live class and share screen. This view is read-only.</p>
    </div>
  );
}
