import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Loads Socket.IO client from backend if not already loaded
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

export default function Classroom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [screenSharing, setScreenSharing] = useState(false);
  const shareUrl = `${window.location.origin}/live/projector/${roomId}`;
  const announce = () => {
    try {
      const socket = socketRef.current;
      if (!socket) return;
      socket.emit('live:announce', {
        roomId,
        link: shareUrl,
        title: 'Live Class Started',
        instructor: 'Instructor',
        ts: Date.now()
      });
      setStatus('Announcement sent');
    } catch {}
  };

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      try {
        const io = await ensureSocketClient();
        const base = axios.defaults.baseURL || '';
        const socket = io(base, { transports: ['websocket'] });
        socketRef.current = socket;

        // Create RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
        });
        pcRef.current = pc;

        pc.ontrack = (e) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit('webrtc:ice', { roomId, to: null, candidate: e.candidate });
          }
        };

        // Get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(t => pc.addTrack(t, stream));

        // Signaling events
        socket.on('connect', () => {
          setStatus('Connected');
          socket.emit('webrtc:join', { roomId, role: 'host' });
          setJoined(true);
        });
        socket.on('webrtc:peer-joined', async ({ id }) => {
          // Create and send offer to new peer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc:offer', { roomId, to: id, offer });
        });
        socket.on('webrtc:offer', async ({ from, offer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc:answer', { roomId, to: from, answer });
        });
        socket.on('webrtc:answer', async ({ answer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });
        socket.on('webrtc:ice', async ({ candidate }) => {
          try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
        });

        cleanup = () => {
          try { socket.disconnect(); } catch {}
          try { pc.close(); } catch {}
          try { stream.getTracks().forEach(t => t.stop()); } catch {}
        };
      } catch (e) {
        setStatus('Error initializing call');
      }
    })();

    return () => cleanup();
  }, [roomId]);

  const toggleScreenShare = async () => {
    if (!pcRef.current) return;
    if (!screenSharing) {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        const sender = pcRef.current.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(display.getVideoTracks()[0]);
        setScreenSharing(true);
        display.getVideoTracks()[0].addEventListener('ended', () => {
          stopScreenShare();
        });
      } catch {}
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    if (!pcRef.current || !localVideoRef.current?.srcObject) return;
    const camStream = localVideoRef.current.srcObject;
    const sender = pcRef.current.getSenders().find(s => s.track && s.track.kind === 'video');
    if (sender) sender.replaceTrack(camStream.getVideoTracks()[0]);
    setScreenSharing(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Live Classroom • Room {roomId}</h3>
        <div className="text-muted">{status}</div>
      </div>
      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap align-items-center gap-2">
          <div>
            <strong>Share this code:</strong> <code>{roomId}</code>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => navigator.clipboard?.writeText(roomId)}>Copy Code</button>
          <div className="ms-3">
            <strong>Projector link:</strong> <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => navigator.clipboard?.writeText(shareUrl)}>Copy Link</button>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shareUrl)}`} alt="Projector QR" className="ms-auto" style={{width:120,height:120}} />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">You</div>
            <div className="card-body">
              <video ref={localVideoRef} autoPlay playsInline muted style={{width:'100%', borderRadius:8, background:'#000'}}></video>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Students / Projector</div>
            <div className="card-body">
              <video ref={remoteVideoRef} autoPlay playsInline style={{width:'100%', borderRadius:8, background:'#000'}}></video>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={toggleScreenShare} disabled={!joined}>
          {screenSharing ? 'Stop Screen Share' : 'Share Screen'}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate(`/live/projector/${roomId}`)}>
          Open Projector View
        </button>
        <button className="btn btn-success" onClick={announce} disabled={!joined}>
          Notify Students
        </button>
      </div>
      <p className="text-muted mt-3">Students can click Online Classes/Home Projects and enter the code <code>{roomId}</code>, or scan the QR above.</p>
    </div>
  );
}
