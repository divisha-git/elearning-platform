import React from 'react'

export default function Onebook({ book }) {

    const title = book?.volumeInfo?.title;
    const pageCount = book?.volumeInfo?.pageCount;
    const authors = book?.volumeInfo?.authors?.join(', ');
    const thumbnail = book?.volumeInfo?.imageLinks?.smallThumbnail;
    const saleability = book?.saleInfo?.saleability;
    const priceAmount = book?.saleInfo?.retailPrice?.amount;
    const priceCurrency = book?.saleInfo?.retailPrice?.currencyCode;
    const buyLink = book?.saleInfo?.buyLink;
    const downloadLink = book?.accessInfo?.pdf?.downloadLink;
    const avgRating = book?.volumeInfo?.averageRating;
    const ratingsCount = book?.volumeInfo?.ratingsCount;

    const renderStars = (rating) => {
        if (typeof rating !== 'number') return null;
        const full = Math.floor(rating);
        const half = rating - full >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return (
            <span aria-label={`Rated ${rating} out of 5`} title={`Rated ${rating} / 5`}>
                {'★'.repeat(full)}{half ? '☆' : ''}{'✩'.repeat(empty)}
            </span>
        );
    };

    return (
        <>
            <div className="card m-4 bookCart" style={{ width: "18rem" }} data-wow-delay="0.1s">
                <img src={thumbnail || '/img/placeholder.png'} className="card-img-top pt-2" alt={title || 'Book cover'} />
                <div className="card-body">
                    <div>
                        <h5 className="card-title " style={{ color: "red" }}>{title}</h5>
                        {typeof avgRating === 'number' && (
                            <p className="mb-1">
                                {renderStars(avgRating)} <span className="ms-1">{avgRating.toFixed(1)} ({ratingsCount ?? 0})</span>
                            </p>
                        )}
                        <p>Pages : {pageCount ?? 'N/A'}</p>
                        <p>Author : {authors ?? 'N/A'}</p>
                        <h6 className="card-subtitle mb-2 text-muted">{saleability}</h6>

                        {saleability === 'FREE' ? (
                            <div>
                                <a href={downloadLink ?? "#"} target="_blank" rel="noreferrer">Download Pdf</a>
                            </div>
                        ) : (
                            <div>
                                <p>Price : {priceAmount ?? '—'} {priceCurrency ?? ''}</p>
                                {buyLink && (
                                    <a href={buyLink} target="_blank" rel="noreferrer">Buy Now</a>
                                )}
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
