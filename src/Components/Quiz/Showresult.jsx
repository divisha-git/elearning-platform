import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Showresult(props) {
    const [visible, setVisible] = useState(false);
    const percentage = Math.round((props.result * 100) / props.total);
    
    const getScoreMessage = () => {
        if (percentage >= 90) return { message: "Outstanding!", color: "text-success", icon: "fas fa-trophy" };
        if (percentage >= 80) return { message: "Excellent!", color: "text-success", icon: "fas fa-medal" };
        if (percentage >= 70) return { message: "Good Job!", color: "text-primary", icon: "fas fa-thumbs-up" };
        if (percentage >= 60) return { message: "Not Bad!", color: "text-warning", icon: "fas fa-hand-peace" };
        return { message: "Keep Practicing!", color: "text-danger", icon: "fas fa-redo" };
    };

    const scoreInfo = getScoreMessage();

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, 2000);
    }, []);

    return (
        <>
            <div className='showresult'>
                <div className="text-center">
                    <div className="mb-4">
                        <i className={`${scoreInfo.icon} fa-4x ${scoreInfo.color} mb-3`}></i>
                        <h2 className={`${scoreInfo.color} mb-3`}>{scoreInfo.message}</h2>
                    </div>
                    
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h4 className="card-title text-primary mb-4">Quiz Results</h4>
                                    
                                    <div className="row text-center">
                                        <div className="col-4">
                                            <div className="border-end">
                                                <h3 className="text-primary mb-1">{props.result}</h3>
                                                <p className="text-muted mb-0">Correct</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="border-end">
                                                <h3 className="text-info mb-1">{props.total - props.result}</h3>
                                                <p className="text-muted mb-0">Incorrect</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <h3 className="text-success mb-1">{percentage}%</h3>
                                            <p className="text-muted mb-0">Score</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <div className="progress" style={{height: '10px', borderRadius: '5px'}}>
                                            <div 
                                                className="progress-bar bg-gradient" 
                                                role="progressbar" 
                                                style={{
                                                    width: `${percentage}%`,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">Overall Performance</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-center gap-3">
                        <button className='btn btn-primary btn-lg' onClick={props.tryAgain}>
                            <i className="fas fa-redo me-2"></i>
                            Try Again
                        </button>
                        <Link to={props.path} className="btn btn-success btn-lg">
                            <i className="fas fa-play me-2"></i>
                            Watch Course
                        </Link>
                    </div>
                </div>
            </div>
            
            {visible && (
                <div className="main-alert">
                    <div className="alert alert-success border-0 shadow-lg" role="alert" style={{borderRadius: '15px'}}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h4 className="alert-heading mb-3">
                                    <i className="fas fa-star me-2"></i>
                                    Congratulations!
                                </h4>
                                <p className="mb-3">
                                    You've successfully completed the quiz! 
                                    {percentage >= 70 ? 
                                        " Great job on your performance!" : 
                                        " Consider reviewing the course materials to improve your understanding."
                                    }
                                </p>
                                <p className="mb-3">
                                    {percentage >= 70 ? 
                                        "You're ready to move on to the next level!" :
                                        "Watch the course videos to strengthen your knowledge."
                                    }
                                </p>
                                <Link to={props.path}>
                                    <button type="button" className="btn btn-primary">
                                        <i className="fas fa-video me-2"></i>
                                        {percentage >= 70 ? 'Continue Learning' : 'Review Course'}
                                    </button>
                                </Link>
                            </div>
                            <button 
                                type="button" 
                                className="btn-close" 
                                aria-label="Close" 
                                onClick={() => setVisible(false)}
                                style={{fontSize: '0.8rem'}}
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
