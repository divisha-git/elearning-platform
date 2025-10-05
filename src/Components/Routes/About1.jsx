import React from 'react'
import About from '../Pages/About'
import Navbar from '../Pages/Navbar'
import Footer from '../Pages/Footer'
import Service from '../Pages/Service'
import Team from '../Pages/Team'
import Testimonial from '../Pages/Testimonial'
import Spinner from '../Pages/Spinner'

export default function About1() {
  return (
    <>
    <Spinner/>
    <Navbar/>
    <About/>
    <Service/>
    <Team/>
    <Testimonial/>
    <Footer/>
    </>
  )
}
