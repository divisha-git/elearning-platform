import React from 'react'

export default function Coursecart({ link, title, desc}) {
    // Convert YouTube URL to embed format
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        
        // Handle different YouTube URL formats
        let videoId = '';
        
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            return url; // Already in embed format
        }
        
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    const embedUrl = getYouTubeEmbedUrl(link);

    return (
        <>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
                <div className="course-item bg-light text-center">
                    <div className="position-relative overflow-hidden">
                        {embedUrl.includes('youtube.com/embed/') ? (
                            <iframe 
                                width="360" 
                                height="240" 
                                src={embedUrl}
                                title={title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                style={{ border: 'none' }}
                            ></iframe>
                        ) : (
                            <video width="360" height="240" controls>
                                <source src={link} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                    <div className="text-center p-4 pb-0">
                        <h3 className="mb-0">{title}</h3>
                        <p className="mb-4">{desc}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
