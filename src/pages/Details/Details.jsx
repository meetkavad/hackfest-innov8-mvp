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
         const alreadyRequested = data.find(req => req.foodId === food._id);
         if (alreadyRequested) {
             setHasRequested(true);
         }
      }).catch(err => console.error("Failed to check existing requests", err));
    }
  }, [user, food._id, myRequest]);

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

    axios.post('http://localhost:5000/myrequest',reqInfo)
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
    <div className="w-full secondary min-h-screen flex items-center justify-center">
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

                  <div className="mt-3 flex items-center justify-center gap-4">
                    <img
                      src={donnerimage}
                      alt=""
                      className="w-15 h-15 rounded-full  border-2 border-green-800"
                    />
                    <div>
                      <p className="font-bold text-sm">
                        Donor Name : {donnerName}
                      </p>
                      <p className="font-bold text-sm">
                        Donor Email : {email}
                      </p>
                    </div>
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
