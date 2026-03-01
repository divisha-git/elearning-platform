import React from 'react'
import Navbar from './Navbar'
import Slide from './Slide'
import Service from './Service'
import About from './About'
import Courses from './Courses'  
import Team from './Team'  
import Testimonial from './Testimonial'  
import Footer from './Footer' 
import Spinner from './Spinner'
import Contact from './Contact'
import BotpressChatbot from '../Ebook/BotpressChatbot'

export default function Home() {
    return (
        <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh'}}>
            <Spinner/>
            <Navbar/>
            <Slide/>
            <Service/>
            <About/>
            <Courses/>
            <Team/>
            <Testimonial/>
            <Footer/>
        </div>
    )
}
