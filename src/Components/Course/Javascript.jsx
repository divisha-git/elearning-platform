import React from 'react'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'
import Coursecart from './Coursecart'

export default function Javascript() {
    return (
        <>
            <Navbar />



            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
                        <h1 className="mb-5">Javascript full course Tutorial</h1>
                    </div>
                    <div className="row g-2 justify-content-center">

                        <Coursecart link="https://www.youtube.com/watch?v=Fo5FyZkmpIM" title="01. Introduction" desc="Introduction of Javascript" />

                        <Coursecart link="https://www.youtube.com/watch?v=Fo5FyZkmpIM" title="02. Variable" desc="Learn what is variable." />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="03. Data types" desc="Data Types in JS" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="04. Numbers" desc="Numbers in JS" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="05. Operations" desc="Operations in JS" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="06. Operator Precedence" desc="Operator Precedence in Javascript" />

                        <Coursecart link="https://www.youtube.com/watch?v=d56mG7DezGs" title="07. What is TypeScript_" desc="Introduction of typescript" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="08. Template Literals" desc="Introduction of Template Literals" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="09. Linking JS File" desc="Introduction of Linking JS File" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="09. Operators" desc="Introduction of Operators in JS" />

                        <Coursecart link="https://www.youtube.com/watch?v=IsG4Xd6LlsM" title="10. Nested if-else" desc="If else and Nested if-else in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=IsG4Xd6LlsM" title="11. Switch Statement" desc="Introduction of Switch Statement" />

                        <Coursecart link="https://www.youtube.com/watch?v=IsG4Xd6LlsM" title="12. Alerts & Prompts" desc="Learn about Alerts & Prompts in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=W6NZfCO5SIk" title="13. console.log()" desc="Introduction of console.log()" />

                        <Coursecart link="https://www.youtube.com/watch?v=fozwNnFunlo" title="14. String methods" desc="String and their methods in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=fozwNnFunlo" title="14. Strings are Immutable in JS" desc="Learn why Strings are Immutable in JS?" />

                        <Coursecart link="https://www.youtube.com/watch?v=fozwNnFunlo" title="15. ToUpperCase and ToLowerCase" desc="Learn methods : ToUpperCase and ToLowerCase" />

                        <Coursecart link="https://www.youtube.com/watch?v=fozwNnFunlo" title="16. Methods indexOf" desc="Methods with Arguments - indexOf" />

                        <Coursecart link="https://www.youtube.com/watch?v=fozwNnFunlo" title="17. Slice Method" desc="SLearn Slice Method" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="18. Array (Data Structure)" desc="Array (Data Structure) in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="19. Array Methods" desc="Array Methods in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="20. Slice in Arrays" desc="Slice in Arrays Methods in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="21. Splice in Arrays" desc="Splice in Arrays Methods in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="22. Arrays References" desc="Arrays References in java" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="23. Nested Arrays" desc="Nested Arrays Methods in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=7W4pQQ20nJg" title="24. Concatenation & Reverse" desc="Concatenation & Reverse in Arrays" />

                        <Coursecart link="https://www.youtube.com/watch?v=fozwNnFunlo" title="25. Trim Method" desc="Array Trim Method in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="26. for Loops" desc="For Loops in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="27. Nested for Loop" desc="Nested for Loop in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="28. while Loops" desc="While Loops in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="29. break Keyword" desc="Break Keyword in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="30. Loops with Arrays" desc="Loops with Arrays in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="31. for-of Loops" desc="For-of Loops in js" />

                        <Coursecart link="https://www.youtube.com/watch?v=s9wW2PpJsmQ" title="32. Nested for-of Loop" desc="Nested for-of Loop in js" />

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
