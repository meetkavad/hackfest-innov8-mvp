import React, { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";

import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";



const Login = () => {
  
  const [showPass, setShowPass] = useState(false);
  const { handleLoginWithEmailPass } = useContext(AuthContext);
  const [errore, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");
    handleLoginWithEmailPass(email, password)
      .then(() => {
        toast.success("Successfully login!");
        navigate(location?.state || "/");
      })
      .catch((error) => {
        setError(error.message);
        toast.error(error.message)
      });
  };


  return (
    <div
      className={`w-full bg-[#A5D6A7] min-h-screen flex items-center justify-center `}
    >
      <title>LogIn</title>
      <div className="md:w-[60%] py-15 md:mx-auto w-full flex items-center justify-center">
          <div className="hidden lg:flex bg-[url('https://media.istockphoto.com/id/1430371482/photo/asian-volunteers-packing-donated-goods-and-groceries-at-food-bank.jpg?s=612x612&w=0&k=20&c=astRXKyhTtg1UPma7lUPwgmKOOf1_oGYg9F74ristD0=')] w-1/2 h-[500px] rounded-l-2xl bg-cover bg-center bg-norepeat"></div>

        <div className="lg:w-1/2 w-11/12 p-6 bg-emerald-700 h-[500px] rounded-2xl lg:rounded-none lg:rounded-r-2xl flex flex-col justify-center">
          <div className="w-full text-center py-5">
            <h1 className="text-2xl font-extrabold text-white">Login Now!</h1>
          </div>
          <form
            onSubmit={handleLogin}
            className=" flex flex-col gap-3 text-white "
          >
            <label className=" text-sm font-bold text-white">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="input text-red-400 text-sm font-medium w-full"
              placeholder="Email"
            />
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


            <button className="btn bg-white hover:bg-emerald-50 text-emerald-600 font-bold border-none w-full mt-4">
              Login
            </button>
          </form>


          <p className="text-white mt-3 text-center">
            Don't have an account?{" "}
            <Link className="text-emerald-100 hover:text-white underline font-bold" to={"/signup"}>
              Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
