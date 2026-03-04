import React, { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";

const SignUp = () => {

  
  const { createUser } = useContext(AuthContext);

  const [errore, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();



  const handleSignIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userName = e.target.name.value;
    const photoUrl = e.target.photoUrl.value;
    const role = e.target.role.value;
       
    setError("")
    const passregex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if(!passregex.test(password)){
      setError('Password muse be at least 6 characters, and include a capital letter , a number and a special characters.')
      return toast.error(errore)
    }

    createUser(email, password, userName, photoUrl, role)
      .then(() => {
        toast.success("SuccessFully signUp!")
        navigate(location?.state || "/");
      })
      .catch(error => {
        setError(error.message)
        toast.error(error.message)
      });
  };

  return (
    <div className={`w-full bg-[#A5D6A7] min-h-screen flex items-center justify-center`}>

      <title>Registration</title>
      <div className="md:w-[60%]  py-15 md:mx-auto w-full flex items-center justify-center">
        <div className="lg:w-1/2 w-11/12 bg-gray-900 p-2  h-[620px] rounded-2xl lg:rounded-none lg:rounded-l-2xl">
          <div className="w-full text-center py-5">
            <h1 className="text-2xl font-extrabold text-white">SignUp Now!</h1>
          </div>
          <form
            onSubmit={handleSignIn}
            className=" flex flex-col gap-3 text-white "
          >
            <label className=" text-sm font-bold text-white">Name</label>
            <input
              type="text"
              name="name"
              required
              className="input text-red-400 text-sm font-medium w-full"
              placeholder="Name"
            />

            <label className=" text-sm font-bold text-white">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input text-red-400 text-sm font-medium w-full"
              placeholder="Email"
            />

            <label className=" text-sm font-bold text-white">Photo Url</label>
            <input
              type="text"
              name="photoUrl"
              required
              className="input text-red-400 text-sm font-medium w-full"
              placeholder="Photo Url"
            />

            <label className=" text-sm font-bold text-white">Role</label>
            <select name="role" required className="select text-red-400 text-sm font-medium w-full">
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="admin">Admin</option>
            </select>

            <div className="relative">
              <label className="text-sm font-bold text-white">Password</label>
              <input
                required
                name="password"
                type={showPass ? "text" : "password"}
                className="input text-red-600 text-sm font-medium w-full"
                placeholder="Password"
              />

              <div
                onClick={() => setShowPass(!showPass)}
                className="absolute z-50 text-lg text-black p-2 cursor-pointer bg right-2 top-7 "
              >
                {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>

           

            <button className="btn bg-red-500 text-white border-none w-full mt-4">
              SignUp
            </button>
          </form>


          <p className="text-white mt-3">
            have an aacount?{" "}
            <Link className="text-blue-400 underline" to={"/login"}>
              LogIn
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex bg-[url('https://i.ibb.co/h1x6sGV9/victoria-shes-UC0-HZd-Uit-WY-unsplash.jpg')] w-1/2 h-[620px] rounded-r-2xl bg-cover bg-center bg-norepeat"></div>
      </div>
    </div>
  );
};

export default SignUp;
