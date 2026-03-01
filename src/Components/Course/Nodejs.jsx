import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Coursecart from './Coursecart'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'

export default function Nodejs() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVideos = async () => {
        try {
            const res = await axios.get('/api/courses/nodejs/videos', { params: { t: Date.now() } });
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
    
        const id = setInterval(fetchVideos, 15000);
        return () => clearInterval(id);
    }, []);

    return (
        <>
            <Navbar />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
                        <h1 className="mb-5">Node Js Tutorial videos</h1>
                    </div>
                    <div className="row g-2 justify-content-center">
                        {/* Controls */}
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-sm btn-outline-primary" onClick={fetchVideos} disabled={loading}>
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        { }
                        {videos && videos.length > 0 && videos.map(v => (
                            <Coursecart key={v.id} link={v.link} title={v.title} desc={v.desc || ''} />
                        ))}

                        {/* Fallback */}
                        {(!videos || videos.length === 0) && !loading && (
                            <>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="01. What is Node js" desc="Introduction of Node js."/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="02. Node Installation" desc="Node Installation setup into system"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="03. Node REPL" desc="learn about Node REPL"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="04. Process in Node" desc="learn about what is Process in Node"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="05. Export in Files" desc="learn Export in Files in node js"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="06. Export in Directories" desc="Files Export in Directories"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="07. What is npm_" desc="Introdution : npm and its uses"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="08. Installing Packages" desc="How to install a packages into a directoris or file."/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="09. package.json" desc="Learn about package.json file"/>
                                <Coursecart link="https://www.youtube.com/watch?v=Oe421EPjeBE" title="10. import modules" desc="how to import modules from one file to another."/>
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

            <Footer />
        </>
    )
}
