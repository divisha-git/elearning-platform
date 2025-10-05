import React, { useState } from 'react'
import "/src/assets/css/quiz.css"
import Showresult from './Showresult';

export default function QuizStructure({ Questions, path}) {

    const [currQues, setCurrQues] = useState(0);
    const [ans, setAns] = useState("");
    const [result, setResult] = useState(0);
    const [isLast, setIsLast] = useState(false);

    let Score = () => {
        if (ans === Questions[currQues].Answer) {
            setResult(result + 1);
        }
    }

    let nextHandle = () => {
        Score();
        setAns("");
        if (currQues < Questions.length - 1) {
            setCurrQues(currQues + 1);
        } else {
            setIsLast(true);
        }
    }

    let resetAll = () => {
        setCurrQues(0);
        setAns("");
        setResult(0);
        setIsLast(false);
    }

    return (
        <>
            <div className="Quiz">
                <h2 className='heading'>Interactive Quiz</h2>
                
                <div className="container">
                    {isLast ?
                        <Showresult result={result} total={Questions.length} tryAgain={resetAll} path={path} />
                        : (
                            <>
                                <div className="question">
                                    <span>
                                        <strong>Question {currQues + 1} of {Questions.length}:</strong><br/>
                                        {Questions[currQues].Question}
                                    </span>
                                </div>
                                <div className="option">
                                    {Questions[currQues].Options.map((el, i) =>
                                        <button 
                                            className={`btn ${ans === el ? "checked" : ""}`} 
                                            key={i} 
                                            onClick={() => (setAns(el))}
                                        >
                                            <span className="me-3">
                                                {String.fromCharCode(65 + i)}.
                                            </span>
                                            {el}
                                        </button>
                                    )}
                                </div>
                                <div className='nextbtn'>
                                    <button 
                                        className='btn' 
                                        onClick={nextHandle}
                                        disabled={!ans}
                                    >
                                        {currQues === Questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                        <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </>
                        )}
                </div>
            </div>
        </>
    )
}
