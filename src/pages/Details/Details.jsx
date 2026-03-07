import React, { useContext, useState, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment/moment";
import axios from "axios";
import { toast } from "react-toastify";

const Details = () => {
    const {user, myRequest}=useContext(AuthContext)
    const [hasRequested, setHasRequested] = useState(false);
    const [donorDetails, setDonorDetails] = useState(null);
    const [sentimentSummary, setSentimentSummary] = useState(null);
    const navigate = useNavigate()
  const food = useLoaderData();
  const {
    status,
    quantity,
    email,
    donnerimage,
    expiredDate,
    location,
    donnerName,
  } = food;

  useEffect(() => {
    if (user?.email && myRequest) {
      myRequest(user.email).then(data => {
         const alreadyRequested = data.find(req => req.foodId === food._id && req.status !== 'canceled' && req.status !== 'rejected');
         if (alreadyRequested) {
             setHasRequested(true);
         } else {
             setHasRequested(false);
         }
      }).catch(err => console.error("Failed to check existing requests", err));
    }
  }, [user, food._id, myRequest]);

  useEffect(() => {
     if (email) {
         axios.get(`${import.meta.env.VITE_API_URL}/users/${email}`)
           .then(res => setDonorDetails(res.data))
           .catch(err => console.error("Failed to load donor details for certification badges", err));

         // Fetch sentiment summary
         axios.get(`${import.meta.env.VITE_API_URL}/reviews/food-reviews/donor/${email}`)
           .then(res => setSentimentSummary(res.data))
           .catch(err => console.error("Failed to load sentiment summary", err));
     }
  }, [email]);

  const handleRequest=e=>{
    e.preventDefault()
    const form=e.target;

    const reqInfo={

        foodId:food._id,
        foodName:food.foodName,
        foodImage:food.foodImage,
        donnerEmail:email,
        donnerName:donnerName,
        requesterEmail:user?.email,
        requesterName:user?.name || user?.displayName || 'Unknown',
        requesterImage:user?.photoURL || user?.photoUrl || '',
        requestDate:moment().format('YYYY-MM-DD HH:mm:ss'),
        location:location,
        expiredDate:expiredDate,
        requestNotes:form.notes.value,
        status:"requested"
        

    }

    axios.post(`${import.meta.env.VITE_API_URL}/myrequest`,reqInfo)
    .then(res=>{
        if(res.data.insertedId){
            toast.success('Request successfully!')
            document.getElementById('my_modal_4').close()
            navigate('/availablefood')
        }
    })
    .catch(error=>{
        toast.error(error.message)
    })
  } 

  return (
    <div className="w-full secondary min-h-screen pt-28 pb-12">
      <title>Details</title>

      <div className="responsive">
        <div className=" bg-base-200 rounded-md py-10  ">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src={food.foodImage}
              className="w-full md:w-96 rounded-lg shadow-2xl"
            />
            <div className="text-start">
              <div className="flex gap-2">
                <h1 className="text-5xl font-bold">{food.foodName}</h1>
                <div className="badge badge-secondary">{status}</div>
              </div>
              <div className="text-start flex flex-col md:flex-row items-center justify-between mt-3">
                <p>Notes : {food.notes}</p>
                <h1 className="flex items-center gap-2">
                  <FaLocationArrow></FaLocationArrow> {location}
                </h1>
              </div>
              <div>
                <div className="card-actions mt-3">
                  <div className="badge badge-outline">
                    Quantity : {quantity}
                  </div>
                  <div className="badge badge-outline">
                    Expired Date: {expiredDate}
                  </div>

                  <div className="w-full border border-accent mt-2"></div>

                  {/* donner information */}

                  <div className="mt-4 p-4 flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={donnerimage}
                        alt=""
                        className="w-16 h-16 object-cover rounded-full border-2 border-emerald-600 shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-gray-800 text-sm mb-0.5">
                          Donor Name : <span className="text-emerald-700">{donnerName}</span>
                        </p>
                        <p className="font-bold text-sm text-gray-500 mb-2">
                          Donor Email : {email}
                        </p>
                        {/* Donor Certification Badges */}
                        <div className="flex gap-2 flex-wrap">
                            {donorDetails?.fssaiCertUrl && (
                                <span className="badge badge-success text-white text-xs font-bold px-3 py-2">FSSAI Certified</span>
                            )}
                            {donorDetails?.govRegCertUrl && (
                                <span className="badge badge-info text-white text-xs font-bold px-3 py-2">Gov. Registered</span>
                            )}
                            {donorDetails?.status === 'approved' && (
                                <span className="badge badge-warning text-yellow-950 text-xs font-bold px-2 py-2">Verified Donor</span>
                            )}
                            {donorDetails?.badges && donorDetails.badges.map((badge, idx) => (
                                <span key={idx} className="badge bg-yellow-400 border-none text-yellow-900 text-xs font-bold px-3 py-2 shadow-sm">
                                    🏆 {badge}
                                </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Donor Trust Score Panel moved below main content */}
                  </div>
                </div>

                <div className="text-center mt-3 ">
                  <button 
                    disabled={status === 'unavailable' || hasRequested} 
                    onClick={() => document.getElementById("my_modal_4").showModal()} 
                    className="btn primary text-white border-none disabled:bg-gray-400"
                  >
                    {status === 'unavailable' ? 'Unavailable' : hasRequested ? 'Already Requested' : 'Food Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Donor Trust Score Panel - Moved Below Main Content */}
          {food.donorTrustScore && food.donorTrustScore.totalReviews > 0 && (
            <div className="mt-6 px-4 md:px-10 pb-6 w-full">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 w-full mx-auto max-w-3xl">
                <div className="text-sm text-center font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center justify-center gap-3">
                   <div className="h-px bg-gray-200 flex-1 max-w-[50px] md:max-w-[100px]"></div>
                   Donor Trust Scores • {food.donorTrustScore.totalReviews} Reviews
                   <div className="h-px bg-gray-200 flex-1 max-w-[50px] md:max-w-[100px]"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                    <span className="text-3xl font-black text-green-600 mb-1">{food.donorTrustScore.freshness.toFixed(1)} <span className="text-xl">★</span></span>
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Freshness</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:shadow-md transition-shadow">
                    <span className="text-3xl font-black text-yellow-500 mb-1">{food.donorTrustScore.packaging.toFixed(1)} <span className="text-xl">★</span></span>
                    <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Packaging</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                    <span className="text-3xl font-black text-blue-600 mb-1">{food.donorTrustScore.amount.toFixed(1)} <span className="text-xl">★</span></span>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Amount</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                    <span className="text-3xl font-black text-purple-600 mb-1">{food.donorTrustScore.overall.toFixed(1)} <span className="text-xl">★</span></span>
                    <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">Overall</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What people say - Sentiment Analysis */}
          {sentimentSummary && sentimentSummary.totalReviews > 0 && (
            <div className="mt-6 px-4 md:px-10 pb-6 w-full">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 w-full mx-auto max-w-3xl">
                <div className="text-sm text-center font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center justify-center gap-3">
                   <div className="h-px bg-gray-200 flex-1 max-w-[50px] md:max-w-[100px]"></div>
                   What People Say
                   <div className="h-px bg-gray-200 flex-1 max-w-[50px] md:max-w-[100px]"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Sentiment Label */}
                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 w-full md:w-1/3">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Overall Sentiment</span>
                        <span className={`text-2xl font-black ${
                            sentimentSummary.sentimentLabel.includes('Positive') ? 'text-green-600' :
                            sentimentSummary.sentimentLabel.includes('Negative') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                            {sentimentSummary.sentimentLabel}
                        </span>
                    </div>

                    {/* Top Keywords */}
                    {sentimentSummary.topKeywords && sentimentSummary.topKeywords.length > 0 && (
                        <div className="w-full md:w-2/3">
                            <h4 className="text-sm font-bold text-gray-600 mb-3 text-center md:text-left">Frequently mentioned keywords:</h4>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                {sentimentSummary.topKeywords.map((keyword, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-full border border-emerald-200 shadow-sm capitalize">
                                        "{keyword}"
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">


            <form onSubmit={handleRequest} className="flex flex-col items-center justify-center gap-2" >

                <label className="text-sm font-bold" htmlFor="">Food Name</label>

                <input type="text"  value={food.foodName} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Food Image (Url)</label>

                <input type="url" value={food.foodImage} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Food Id</label>

                <input type="text" value={food._id} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Donor Email</label>

                <input type="text" value={email} readOnly className="input text-center" />

                 <label className="text-sm font-bold" htmlFor="">Donor Name</label>
                
                
                <input type="text" value={donnerName} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Seeker Email</label>

                <input type="text" value={user?.email} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Request time</label>

                <input type="text" value={moment().format('YYYY-MM-DD HH:mm:ss')} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Pickup Location</label>

                <input type="text" value={location} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Expired Date</label>

                <input type="text" value={expiredDate} readOnly className="input text-center" />

                <label className="text-sm font-bold" htmlFor="">Aditional Notes</label>

                <textarea type="text" defaultValue={food.notes}  name="notes" className="input text-center py-2" />

                <button className="btn primary text-white" type="submit">Request</button>

                





            </form>


            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>


      </div>
    </div>
  );
};

export default Details;
