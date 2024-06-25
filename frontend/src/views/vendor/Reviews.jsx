import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import Sidebar from './Sidebar';

function Reviews() {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        apiInstance.get(`vendor-reviews/${UserData()?.vendor_id}/`).then((res) => {
            setReviews(res.data)
        })
    }, [])

  return (
    <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
<Sidebar />
    <div className="col-md-9 col-lg-10 main mt-4">
      <h4>
        <i className="fas fa-star" /> Reviews and Rating
      </h4>

      <section
        className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"
        style={{
          backgroundImage:
            "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)"
        }}
      >
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-10">
          {reviews?.map((r, index) => (
            <div className="card mt-3 mb-3" key={index}>
              <div className="card-body m-3">
                <div className="row">
                  <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                    <img
                      src={r.profile.image}
                      className="rounded-circle img-fluid shadow-1"
                      alt={r.profile.full_name}
                      style={{width: "160px", height: "160px", objectFit: "cover"}}
                    />
                  </div>
                  <div className="col-lg-8">
                    <p className="text-dark fw-bold mb-1">
                      Review:{" "}
                      <i>
                        {r.review}
                      </i>
                    </p>
                    <p className="text-dark fw-bold mb-4">
                    Reply:{" "}
                    <i>
                    {r.reply === null
                      ? <span>No Reply Yet</span>
                      : (r.reply)
                }
                    </i>
                  </p>
                    <p className="fw-bold text-dark mb-2">
                      <strong>Name: {r.profile.full_name}</strong>
                    </p>
                    <p className="fw-bold text-muted mb-0">
                      Product: {r.product?.title}
                    </p>
                    <p className="fw-bold text-muted mb-0">
                      Rating: {r.rating} 
                      {r.rating == 1 && 
                         <i className="fas fa-star" /> 
                    }
                    {r.rating == 2 && 
                        <>
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                        </>
                    }
                    {r.rating == 3 &&
                        <>
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                        </> 
                    }
                    {r.rating == 4 && 
                        <>
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                        </> 
                    }
                    {r.rating == 5 && 
                        <>
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                        </> 
                    }
                    {r.rating == 0 && 
                        <>
                            <i className="fas fa-star" />
                        </> 
                    }
                    </p>
                    <div className="d-flex mt-3">
                      <p className="fw-bold text-muted mb-0">
                        <Link to={`/vendor/reviews/${r.id}/`} className="btn btn-primary">
                          Reply <i className="fas fa-pen" />
                        </Link>
                      </p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </div>
    </div>

  )
}

export default Reviews