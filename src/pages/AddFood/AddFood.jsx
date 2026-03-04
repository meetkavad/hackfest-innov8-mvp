import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddFood = () => {
  const { user } = useContext(AuthContext);

  const handleFormData=e=>{
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const data=Object.fromEntries(formData.entries())
    data.donnerName=user?.name || user?.displayName
    data.donnerimage=user?.photoUrl || user?.photoURL
    data.email=user?.email
    data.status="available"
    const {quantity,...newData}=data
    newData.quantity=parseInt(quantity)

    axios.post('http://localhost:5000/foods',newData).then(res=>{
        if(res.data.insertedId){
            toast.success('Foods Added Successfully!')
            form.reset()
        }
    })

    

    
  }
  return (
    <div className="w-full  secondary py-32">
      <title>ShareBite || add food</title>
      <div className="text-center text-color">
        <h1 className="text-3xl font-bold mb-3">Share Your Surplus Food</h1>
        <p>
          Help reduce food waste and feed someone in need by sharing your extra
          food. Fill out the form below to add a food item.
        </p>
      </div>

      <div className="responsive">
        <form onSubmit={handleFormData} className="mt-10">
          <fieldset className="fieldset bg-white border-none rounded-box md:w-1/2 space-y-1 md:mx-auto w-full border p-4">
            

            <label className="font-bold">Food Name</label>
            <input
              type="text"
              className="input w-full border border-cyan-400 focus:outline-none "
              placeholder="Food Name"
              required
              name='foodName'
            />

            <label className="font-bold">Food Image</label>
            <input
              type="url"
              className="input w-full border border-cyan-400 focus:outline-none "
              placeholder="Food image (url)"
              required
              name='foodImage'
            />

            <label className="font-bold">Food Quantity</label>
            <input
              type="number"
              className="input w-full border border-cyan-400 focus:outline-none"
              placeholder="Quantity"
              required
              name='quantity'
            />

            <label className="font-bold">Pickup Location</label>
            <input
              type="text"
              className="input w-full border border-cyan-400 focus:outline-none"
              placeholder="Pickup Location"
              required
              name='location'
            />

            <label className="font-bold">Expired Date</label>
            <input
              type="date"
              className="input w-full border border-cyan-400 focus:outline-none"
              
              required
              name='expiredDate'
            />
            <label className="font-bold">Aditional Notes</label>
            <textarea
              type="date"
              className="input w-full border border-cyan-400 focus:outline-none  py-2"
              placeholder="Aditional Notes"
              
              required
              name='notes'
            />


            <input type="submit"  className="primary btn mt-5 text-white font-bold hover:bg-green-300"/>

            
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
