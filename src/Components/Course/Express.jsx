import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Coursecart from './Coursecart'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'

export default function EXpress() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVideos = async () => {
        try {
            const res = await axios.get('/api/courses/express/videos', { params: { t: Date.now() } });
            setVideos(res.data.videos || []);
            setError('');
        } catch (e) {
            setError(e.response?.data?.message || '');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // initial load
        fetchVideos();
        // poll every 15s so page updates when instructor adds videos
        const id = setInterval(fetchVideos, 15000);
        return () => clearInterval(id);
    }, []);

    return (
        <>
        <Navbar/>
             <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
                        <h1 className="mb-5">Programming Languages Tutorials</h1>
                    </div>
                    <div className="row g-2 justify-content-center">
                        {/* Controls */}
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-sm btn-outline-primary" onClick={fetchVideos} disabled={loading}>
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        {/* Dynamic */}
                        {videos && videos.length > 0 && videos.map(v => (
                            <Coursecart key={v.id} link={v.link} title={v.title} desc={v.desc || ''} />
                        ))}

                        {/* Fallback */}
                        {(!videos || videos.length === 0) && !loading && (
                            <>
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="01. What is Express js" desc="Introduction of Express js." />
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="02. Getting started with Express" desc="Getting started with Express Js" />
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="03. Handling requests" desc="Basics of Express Js and Handling requests" />
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="04. Sending a Response" desc="Sending a Response via express" />
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="05. Routing" desc="Routing with Express Js" />
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="06. Path Parameters" desc="Adding Path Parameters in express" />
                                <Coursecart link="https://www.youtube.com/watch?v=SccSCuHhOw0" title="07. Query Strings" desc="Query Strings in express and node js" />
                            </>
                        )}
                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        {error && !loading && (
                            <div className="alert alert-warning text-center">{error}</div>
                        )}

                    </div>
                </div>
            </div>
        <Footer/>
        </>
    )
}

