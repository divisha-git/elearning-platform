import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Coursecart from './Coursecart'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'

export default function Mongodb() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVideos = async () => {
        try {
            const res = await axios.get('/api/courses/mongodb/videos', { params: { t: Date.now() } });
            setVideos(res.data.videos || []);
            setError('');
        } catch (e) {
            setError(e.response?.data?.message || '');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                        <h1 className="mb-5">Programming Languages Tutorials</h1>
                    </div>
                    <div className="row g-2 justify-content-center">
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
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="01. The Mongo Shell" desc="Introduction of Mongo Shell." />
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="02. Document _ Collection" desc="How to store Document Collection in mongodb." />
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="03. INSERT in DB (InsertOne)" desc="How to insert data into DB (InsertOne)." />
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="04. INSERT in DB (InsertMany)" desc="How to insert data into DB (InsertMany)." />
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="05. FIND in DB" desc="Find elements or data in DB." />
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="06. UPDATE in DB" desc="Learn how to Update data in DB." />
                                <Coursecart link="https://www.youtube.com/watch?v=jN0ThkJQteE" title="07. DELETE in DB" desc="Learn about how to Delete data in DB." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="08. What is mongoose" desc="What is mongoose ans its installation." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="09. Schema" desc="What is Schema." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="10. Models" desc="What is mongoose Models." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="11. Insert in Mongoose" desc="Insert One or Many data in Mongoose." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="12. Find in Mongoose" desc="Learn about Find in Mongoose." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="13. Update in Mongoose" desc="How to Update data in Mongoose." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="14. Schema Validations" desc="Learn about Schema Validations in mongoose." />
                                <Coursecart link="https://www.youtube.com/watch?v=DZBGEVgL2eE" title="15. SchemaType Options" desc="Learn What are the SchemaType Options in mongodb." />
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
