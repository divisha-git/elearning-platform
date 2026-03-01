import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'
import Coursecart from './Coursecart'

export default function Reactjs() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get('/api/courses/react/videos');
                setVideos(res.data.videos || []);
            } catch (e) {
                setError(e.response?.data?.message || '');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="text-center wow fadeInUp mt-5" data-wow-delay="0.1s">
                    <h6 className="section-title bg-white text-center text-primary px-3">Course</h6>
                    <h1 className="mb-5">Full React Js Course</h1>
                </div>
                <div className="row g-2 justify-content-center">
                    {/* Dynamic videos (if any) */}
                    {videos && videos.length > 0 && videos.map(v => (
                        <Coursecart key={v.id} link={v.link} title={v.title} desc={v.desc || ''} />
                    ))}

                    {/* Fallback to static content if no dynamic videos */}
                    {(!videos || videos.length === 0) && !loading && (
                        <>

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="01. What is React JS" desc="Introduction of React js." />

                    <Coursecart link="https://www.youtube.com/watch?v=x4rFhThSX04" title="02. What is JSX" desc="Introduction of React js and JSX" />

                    <Coursecart link="https://www.youtube.com/watch?v=w7ejDZ8SWv8" title="03. Set up Local Environment" desc="Set up Local Environment for React js" />

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="04. Understanding our App" desc="Understanding our App and their components" />

                    <Coursecart link="https://www.youtube.com/watch?v=x4rFhThSX04" title="05. Our 1st Component" desc="Writing Our 1st Component in Jsx" />

                    <Coursecart link="https://www.youtube.com/watch?v=XXPLFPkGkc4" title="06. Import-Export" desc="Import-Export in React" />

                    <Coursecart link="https://www.youtube.com/watch?v=gQuKp_OeH4A" title="07. Writing Markup in JSX" desc="details about Writing Markup in JSX" />

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="09. Structuring Components" desc="Structuring Components in react js" />

                    <Coursecart link="https://www.youtube.com/watch?v=x4rFhThSX04" title="10. Style Components" desc="Style Components in React jsx " />

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="11. React Props" desc=" Props in React" />

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="12. Passing Arrays to Props" desc="Passing Arrays to Props in react components" />

                    <Coursecart link="https://www.youtube.com/watch?v=x4rFhThSX04" title="13. Conditionals" desc="Conditionals in react" />

                    <Coursecart link="https://www.youtube.com/watch?v=w7ejDZ8SWv8" title="14. Dynamic Component Styling" desc="Dynamic Component Styling in jsx" />

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="15. Install React Developer Tools" desc="Install React Developer Tools" />

                    <Coursecart link="https://www.youtube.com/watch?v=x4rFhThSX04" title="16. Handling Click Events" desc="Learn About Handling Click Events" />

                    <Coursecart link="https://www.youtube.com/watch?v=O6P86uwfdR0" title="17. State in React" desc="learn about State in React and their uses." />

                    <Coursecart link="https://www.youtube.com/watch?v=O6P86uwfdR0" title="18. Hooks" desc="Learn About Hooks in react" />

                    <Coursecart link="https://www.youtube.com/watch?v=O6P86uwfdR0" title="19. useState()" desc="Learn About useState() and its use" />

                    <Coursecart link="https://www.youtube.com/watch?v=SqcY0GlETPk" title="20. Closure in JS" desc="Learn Closure in JS" />

                    <Coursecart link="https://www.youtube.com/watch?v=O6P86uwfdR0" title="21. Callback in Set State Function" desc="Callback in Set State Function in react" />

                    <Coursecart link="https://www.youtube.com/watch?v=O6P86uwfdR0" title="22. More about State" desc="Know More about State and their uses." />
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
            <Footer />
        </>
    )
}
