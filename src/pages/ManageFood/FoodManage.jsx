import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const FoodManage = ({ food, index,setMyFoods,myFoods, incomingRequests, setIncomingRequests }) => {
  const { status, expiredDate, foodImage,notes, location,quantity, foodName,_id} = food;

  const handleDelete=(id)=>{
    axios.delete(`http://localhost:5000/foods/${id}`).then(res=>{
        if(res.data.deletedCount){
            toast.success('foode deleted successfully!')
            const remainingFoods=myFoods.filter(myfood=>myfood._id!==id)
            setMyFoods(remainingFoods)
            document.getElementById('my_modal_3').close()
        }
    })
  }

  const handleUpdate=(e,id)=>{
    e.preventDefault()
    const form=e.target;
    const formData=new FormData(form)
    const updateData= Object.fromEntries(formData.entries())
    

    const {quantity,...newData}=updateData
    newData.quantity=parseInt(quantity)
    axios.put(`http://localhost:5000/foods/${id}`,newData)
    .then(res=>{
      if(res.data.modifiedCount){
        toast.success("food Update successfully!")
        document.getElementById(`my_modal_${id}`).close()

      }
    })
  }
  
  return (
    <>
    <tr>
      <th>{index + 1}</th>
      <td>{foodName}</td>
      <td>{foodImage}</td>
      <td>{expiredDate}</td>
      <td>{status}</td>
      <td>
        <button onClick={()=>document.getElementById(`my_modal_${_id}`).showModal()}  className="btn">update</button>
        <button onClick={()=>document.getElementById('my_modal_3').showModal()} className="btn">Delete</button>
    
      </td>
    </tr>
    
    {/* Render associated requests for this food item */}
    {incomingRequests && incomingRequests.length > 0 && (
      <tr>
        <td colSpan="6" className="p-4 bg-base-100 border-b-2">
           <h4 className="font-bold mb-2 text-sm text-gray-600">Incoming Requests ({incomingRequests.length})</h4>
           <div className="flex flex-col gap-4">
             {incomingRequests.map(req => {
                
                const getStepClass = (stepName) => {
                    const flow = ['requested', 'accepted', 'picked up', 'delivered'];
                    
                    if (req.status === 'rejected') {
                         return stepName === 'requested' ? 'step step-primary' : 'step step-error'; 
                    }

                    const currentIndex = flow.indexOf(req.status?.toLowerCase() || 'requested');
                    const stepIndex = flow.indexOf(stepName);
                    return stepIndex <= currentIndex ? 'step step-primary' : 'step';
                };

                const updateRequestStatus = (newStatus) => {
                    axios.patch(`http://localhost:5000/myrequest/${req._id}`, { status: newStatus })
                         .then(res => {
                             if(res.data) {
                               toast.success(`Request marked as ${newStatus}!`);
                               // Update local state
                               setIncomingRequests(prev => prev.map(pReq => {
                                   if(pReq._id === req._id) {
                                       return { ...pReq, status: newStatus };
                                   }
                                   // Also if accepted, maybe update others, but simplifying here
                                   return pReq;
                               }));
                             }
                         })
                         .catch(err => toast.error(err.message));
                };

                return (
                  <div key={req._id} className="w-full bg-white p-4 rounded shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-sm">Requester: {req.requesterName || req.requestEmail || 'Unknown'}</span>
                        <div className="flex gap-2 text-xs">
                           {req.status === 'requested' && (
                              <>
                                <button onClick={() => updateRequestStatus('accepted')} className="btn btn-xs btn-primary">Accept</button>
                                <button onClick={() => updateRequestStatus('rejected')} className="btn btn-xs btn-error text-white">Reject</button>
                              </>
                           )}
                           {req.status === 'accepted' && <button onClick={() => updateRequestStatus('picked up')} className="btn btn-xs btn-secondary">Mark Picked Up</button>}
                        </div>
                    </div>
                    <ul className="steps w-full text-xs mt-3">
                      <li className={getStepClass('requested')}>Requested</li>
                      {req.status === 'rejected' ? (
                          <li className={getStepClass('rejected')} data-content="✕">Rejected</li>
                      ) : (
                          <>
                            <li className={getStepClass('accepted')}>Accepted</li>
                            <li className={getStepClass('picked up')}>Picked up</li>
                            <li className={getStepClass('delivered')}>Delivered</li>
                          </>
                      )}
                    </ul>
                  </div>
                )
             })}
           </div>
        </td>
      </tr>
    )}


    
       {/* for delet  */}

       {/* You can open the modal using document.getElementById('ID').showModal() method */}

<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    
    <p className="py-4">Are you sure you want to delete this food? </p>

    <button onClick={()=>handleDelete(_id)} className="btn">Sure</button>
  </div>
</dialog>


{/* for upadate modal */}
{/* Open the modal using document.getElementById('ID').showModal() method */}

<dialog id={`my_modal_${_id}`} className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Update your food</h3>
    <form onSubmit={(e)=>handleUpdate(e,_id)} className="space-y-4">
     
        <input type="text" name='foodName' defaultValue={foodName} placeholder="Food Name"  className="input w-full"/>

        <input type="text" name='foodImage' defaultValue={foodImage} placeholder="Food image"  className="input w-full"/>

        <input type="number" name='quantity' defaultValue={quantity} placeholder="FoodName"  className="input w-full"/>

        <input type="date" name='expiredDate' defaultValue={expiredDate} placeholder="Expired Date"  className="input w-full"/>

        <input type="text" name='location' defaultValue={location} placeholder="Pickup Location"  className="input w-full"/>
        <textarea type="text" name='notes' defaultValue={notes} placeholder="Additional Notes"  className="input w-full"/>

        <button   type="submit" className="btn primary text-white">
            Update
        </button>
    </form>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

    
    </>
  );
};

export default FoodManage;
