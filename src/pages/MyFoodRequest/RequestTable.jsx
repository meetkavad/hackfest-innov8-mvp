import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RequestTable = ({request,index, requestFood, setRequestFood}) => {
    const {requestDate,foodName,expiredDate,donnerName,status, _id, foodId, donnerEmail, requesterEmail, location}=request;
    
    const [ratings, setRatings] = useState({ freshness: 5, packaging: 5, amount: 5, overall: 5 });
    const [comment, setComment] = useState("");

    const updateRequestStatus = async (newStatus, openReview = false) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/myrequest/${_id}`, { status: newStatus });
            
            // Update local state
            setRequestFood(prev => prev.map(req => req._id === _id ? { ...req, status: newStatus } : req));
            
            if (openReview) {
                toast.success('Food marked as received!');
                document.getElementById(`review_modal_${_id}`).showModal();
            } else {
                toast.success(`Marked as ${newStatus}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    }

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/reviews/food-reviews`, {
                donorEmail: donnerEmail,
                recipientEmail: requesterEmail,
                foodId: foodId,
                ratings: ratings,
                comment: comment || "Great!"
            });
            toast.success("Review submitted! Thank you.");
            document.getElementById(`review_modal_${_id}`).close();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    }

    // Helper logic for the DaisyUI steps component
    const getStepClass = (stepName) => {
        const flow = ['requested', 'accepted', 'picked up', 'delivered'];

        if (status === 'rejected') {
             return stepName === 'requested' ? 'step step-primary' : 'step step-error'; 
        }
        if (status === 'canceled') {
             return stepName === 'requested' ? 'step step-primary' : 'step step-error';
        }

        const currentIndex = flow.indexOf(status?.toLowerCase() || 'requested');
        const stepIndex = flow.indexOf(stepName);
        
        return stepIndex <= currentIndex ? 'step step-primary' : 'step';
    };

    const handleRatingChange = (field, value) => {
        setRatings(prev => ({ ...prev, [field]: value }));
    }

    const renderStars = (field) => {
        return (
            <div className="rating rating-sm">
                {[1, 2, 3, 4, 5].map(star => (
                    <input 
                        key={star}
                        type="radio" 
                        name={`${_id}_${field}`} 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={ratings[field] === star}
                        onChange={() => handleRatingChange(field, star)}
                    />
                ))}
            </div>
        );
    }

    return (
      <React.Fragment>
        <tr className="bg-white hover:bg-emerald-50 transition-colors border-b">
          <th className="font-medium text-gray-500">{index+1}</th>
          <td className="font-bold text-gray-800">{donnerName}</td>
          <td className="font-semibold text-emerald-700">{foodName}</td>
          <td className="text-sm text-gray-600 max-w-xs truncate" title={location}>{location || 'N/A'}</td>
          <td className="text-sm text-red-500 font-medium whitespace-nowrap">{expiredDate || 'Not specified'}</td>
          <td className="text-sm text-gray-500 font-medium whitespace-nowrap">{requestDate}</td>
        </tr>
        <tr>
          <td colSpan="5" className="p-4 bg-base-100 border-b-2">
            <div className="w-full flex flex-col gap-4">
               
               <div className="flex justify-between items-center">
                   <div className="text-sm font-semibold text-gray-600">Status Tracking</div>
                   <div className="flex gap-2">
                     {(status === 'requested' || status === 'accepted') && (
                         <button onClick={() => updateRequestStatus('canceled', false)} className="btn btn-sm btn-error text-white">
                             Cancel Request
                         </button>
                     )}
                     {status === 'accepted' && (
                         <button onClick={() => updateRequestStatus('picked up', false)} className="btn btn-sm btn-secondary text-white">
                             Mark Picked Up
                         </button>
                     )}
                     {status === 'picked up' && (
                         <button onClick={() => updateRequestStatus('delivered', true)} className="btn btn-sm btn-accent text-white">
                             Mark Received
                         </button>
                     )}
                   </div>
               </div>

               <ul className="steps steps-vertical lg:steps-horizontal w-full text-xs md:text-sm mt-4 font-bold tracking-wide text-gray-500">
                  <li className={getStepClass('requested')}>Requested</li>
                  {status === 'rejected' ? (
                      <li className={getStepClass('rejected')} data-content="✕">Rejected</li>
                  ) : status === 'canceled' ? (
                      <li className={getStepClass('canceled')} data-content="✕">Canceled</li>
                  ) : (
                      <>
                        <li className={getStepClass('accepted')}>Accepted</li>
                        <li className={getStepClass('picked up')}>Picked up</li>
                        <li className={getStepClass('delivered')}>Delivered</li>
                      </>
                  )}
               </ul>
            </div>
          </td>
        </tr>

        {/* Review Modal */}
        <dialog id={`review_modal_${_id}`} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Rate Your Experience</h3>
            <p className="text-sm mb-6">Please let us know how the food from this donor was to help maintain trust in the community.</p>
            
            <form onSubmit={submitReview} className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Freshness</span>
                    {renderStars('freshness')}
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Packaging</span>
                    {renderStars('packaging')}
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Amount as Specified</span>
                    {renderStars('amount')}
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">Overall Experience</span>
                    {renderStars('overall')}
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Additional Comments</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered h-24" 
                        placeholder="Was the food good?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                <div className="modal-action">
                    <button type="button" className="btn" onClick={() => document.getElementById(`review_modal_${_id}`).close()}>Skip</button>
                    <button type="submit" className="btn btn-primary text-white">Submit Review</button>
                </div>
            </form>
          </div>
        </dialog>
      </React.Fragment>
    );
};

export default RequestTable;