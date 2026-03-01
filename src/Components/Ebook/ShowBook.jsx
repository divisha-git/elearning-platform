import React, { useState, useEffect } from 'react'
import Navbar from '../Pages/Navbar'
import Onebook from './Onebook';
import Footer from '../Pages/Footer';
import data1 from "./data1";

export default function ShowBook() {

  const apikey = "AIzaSyDju8-o99z7DuJcpwB0IL9jzrlyZHFr418";
  const [search, setSearch] = useState("");
  const [books, setbooks] = useState([]);
  const [url, setUrl] = useState(`https://www.googleapis.com/books/v1/volumes?q=java&orderBy=relevance&maxResults=40&key=${apikey}`);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let result = await fetch(url);
        let resultjson = await result.json();
        if (resultjson && resultjson.items) {
          // Keep only purchasable books that have ratings, then sort by rating desc and ratingsCount desc
          const ratedPurchasable = resultjson.items
            .filter((item) => (
              item && item.saleInfo && item.saleInfo.saleability !== "NOT_FOR_SALE" &&
              item.volumeInfo && typeof item.volumeInfo.averageRating === 'number'
            ))
            .sort((a, b) => {
              const arDiff = (b.volumeInfo.averageRating ?? 0) - (a.volumeInfo.averageRating ?? 0);
              if (arDiff !== 0) return arDiff;
              return (b.volumeInfo.ratingsCount ?? 0) - (a.volumeInfo.ratingsCount ?? 0);
            });
          setbooks(ratedPurchasable.slice(0, 24));
        } else {
          setbooks([]);
        }
      } catch (err) {
        console.error(err);
        setbooks([]);
      }
    }
    fetchBooks();
  }, [url]);

  let handleChange = (event) => {
    let searchValue = event.target.value;
    setSearch(searchValue);
    setUrl(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchValue)}&orderBy=relevance&maxResults=40&key=${apikey}`);
  }

  let handleSubmit = (event) => {
    try {
      event.preventDefault();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Navbar />

      <div className="container showBook m-5 ">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3">Library</h6>
          <h1 className="mb-5">e-Library - Search Your Books</h1>
        </div>

        <div className="d-flex justify-content-center">
          <form className="d-flex  m-2" role="search" onSubmit={handleSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search (e.g., Java)" onChange={handleChange} aria-label="Search" />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>
        </div>

        <div>
          <div className="allbooks m-5 text-center wow fadeInUp">
            <h5 className="section-title bg-white text-center text-primary px-3">Your Books</h5>
            <div className="dataBooks row g-4 justify-content-center m-5 " >
              {books.map((item) => (
                <Onebook key={item.id} book={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="allbooks m-5 text-center wow fadeInUp">
          <h5 className="section-title bg-white text-center text-primary px-3">Suggested Books</h5>
          <div className="dataBooks row g-4 justify-content-center m-5 " >
            {data1.map((item) => (
              <Onebook key={item.id || item?.volumeInfo?.title} book={item} />
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
