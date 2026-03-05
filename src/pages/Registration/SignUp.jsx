import React, { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import MapPicker from "../../component/MapPicker/MapPicker";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const [errore, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("donor");
  const [step, setStep] = useState(1);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailForOtp, otp })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Email verified! Your account is pending admin approval.");
        navigate("/login");
      } else {
        toast.error(data.message || "OTP Verification failed.");
        setError(data.message || "OTP Verification failed.");
        if (data.message && data.message.includes('deleted')) {
             setStep(1); // Go back if deleted
        }
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Base Fields
    const email = form.email.value;
    const password = form.password.value;
    const userName = form.name.value;
    const photoUrl = form.photoUrl.value;
       
    setError("");
    const passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passregex.test(password)) {
      const msg = 'Password must be at least 6 characters, and include a capital letter, a number, and a special character.';
      setError(msg);
      return toast.error(msg);
    }

    let userData = {
        email,
        password,
        name: userName,
        photoUrl,
        role,
        ...(location && { lat: location.lat, lng: location.lng })
    };

    // Append role-specific fields
    if (role === 'donor') {
        userData = {
            ...userData,
            businessName: form.businessName?.value,
            ownerName: form.ownerName?.value,
            businessRegNo: form.businessRegNo?.value,
            phone: form.phone?.value,
            address: form.address?.value,
            foodType: form.foodType?.value,
            operatingHours: form.operatingHours?.value,
            govRegCertUrl: form.govRegCertUrl?.value,
            fssaiCertUrl: form.fssaiCertUrl?.value,
            gstCertUrl: form.gstCertUrl?.value,
            addressProofUrl: form.addressProofUrl?.value,
            idProofUrl: form.idProofUrl?.value,
        };
    } else if (role === 'recipient') {
        userData = {
            ...userData,
            orgName: form.orgName?.value,
            contactPerson: form.contactPerson?.value,
            phone: form.phone?.value,
            pickupAddress: form.pickupAddress?.value,
            recipientType: form.recipientType?.value,
            estimatedPeople: form.estimatedPeople?.value,
            ngoRegCertUrl: form.ngoRegCertUrl?.value,
            authLetterUrl: form.authLetterUrl?.value,
            addressProofUrl: form.addressProofUrl?.value,
            idProofUrl: form.idProofUrl?.value,
        };
    }

    setIsLoading(true);
    createUser(userData)
      .then((data) => {
        setIsLoading(false);
        // If it was an admin that signed up directly, they get logged in. Otherwise it's pending.
        if (data.token) {
            toast.success("Successfully Signed Up!");
            navigate("/");
        } else if (data.requireOtp) {
            toast.success("Please check your email for the OTP.");
            setEmailForOtp(email);
            setStep(2);
        } else {
            toast.success("Registration received! Your account is pending admin verification.", { autoClose: 5000 });
            navigate("/login");
        }
      })
      .catch(error => {
        setIsLoading(false);
        setError(error.message);
        toast.error(error.message);
      });
  };

  return (
    <div className={`w-full bg-[#A5D6A7] min-h-screen py-20 flex items-center justify-center`}>
      <title>Registration</title>
      <div className="md:w-[80%] mx-auto w-full flex bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Form Container */}
        <div className="w-full lg:w-1/2 p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="w-full text-center mb-6">
            <h1 className="text-3xl font-extrabold text-white">Join ShareBite</h1>
            <p className="text-gray-400 mt-2 text-sm">Register as a Donor or Recipient.</p>
          </div>
          
          {step === 1 && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4 text-white">
            
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <h2 className="text-orange-400 font-bold border-b border-gray-700 pb-2">Account Type</h2>
                <div>
                    <label className="text-sm font-bold block mb-1">Select Role</label>
                    <select 
                        name="role" 
                        required 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="select bg-gray-700 text-white w-full"
                    >
                        <option value="donor">Donor (Restaurant/Provider)</option>
                        <option value="recipient">Recipient (NGO/Individual)</option>
                    </select>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <h2 className="text-orange-400 font-bold border-b border-gray-700 pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold block mb-1">Full Name</label>
                        <input type="text" name="name" required className="input bg-gray-700 text-white w-full" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="text-sm font-bold block mb-1">Email</label>
                        <input type="email" name="email" required className="input bg-gray-700 text-white w-full" placeholder="email@example.com" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-bold block mb-1">Photo URL</label>
                        <input type="text" name="photoUrl" className="input bg-gray-700 text-white w-full" placeholder="https://..." />
                    </div>
                    <div className="relative md:col-span-2">
                        <label className="text-sm font-bold block mb-1">Password</label>
                        <input required name="password" type={showPass ? "text" : "password"} className="input bg-gray-700 text-white w-full pr-10" placeholder="Password" />
                        <div onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-400 cursor-pointer hover:text-white">
                            {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Donor Fields */}
            {role === 'donor' && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-4 animate-fade-in">
                    <h2 className="text-orange-400 font-bold border-b border-gray-700 pb-2">Business Details (Requires Verification)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Organization / Restaurant Name *</label>
                            <input type="text" name="businessName" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Owner / Authorized Person Name *</label>
                            <input type="text" name="ownerName" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Business Registration No. (GST/FSSAI) *</label>
                            <input type="text" name="businessRegNo" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Phone Number *</label>
                            <input type="tel" name="phone" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold block mb-1 text-gray-300">Complete Address *</label>
                            <input type="text" name="address" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Type of Food Provided</label>
                            <input type="text" name="foodType" placeholder="e.g. Veg, Non-Veg, Packaged" className="input bg-gray-700 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Operating Hours</label>
                            <input type="text" name="operatingHours" placeholder="e.g. 9 AM - 10 PM" className="input bg-gray-700 text-white w-full" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-bold block mb-2 text-gray-300">Pin your specific location on the map * (Required for notifying nearby recipients)</label>
                        <MapPicker onLocationSelect={(loc) => setLocation(loc)} />
                        {!location && <p className="text-xs text-red-400 mt-1">Please drop a pin on the map to continue.</p>}
                    </div>

                    <h2 className="text-orange-400 font-bold border-b border-gray-700 pb-2 pt-4">Document Uploads (URLs)</h2>
                    <p className="text-xs text-gray-400 mb-2">Please provide public accessible URLs (e.g., Imgur, Google Drive) for your documents for admin verification.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">FSSAI License URL *</label><input type="text" name="fssaiCertUrl" required className="input bg-gray-700 border-blue-500/30 text-white w-full input-sm" /></div>
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">Gov. ID Proof URL *</label><input type="text" name="idProofUrl" required className="input bg-gray-700 border-blue-500/30 text-white w-full input-sm" /></div>
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">GST Certificate URL</label><input type="text" name="gstCertUrl" className="input bg-gray-700 text-white w-full input-sm" /></div>
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">Address Proof URL</label><input type="text" name="addressProofUrl" className="input bg-gray-700 text-white w-full input-sm" /></div>
                    </div>
                </div>
            )}

            {/* Recipient Fields */}
            {role === 'recipient' && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-4 animate-fade-in">
                    <h2 className="text-orange-400 font-bold border-b border-gray-700 pb-2">Recipient Details (Requires Verification)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Organization Name / Full Name *</label>
                            <input type="text" name="orgName" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Contact Person Name</label>
                            <input type="text" name="contactPerson" className="input bg-gray-700 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Phone Number *</label>
                            <input type="tel" name="phone" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1 text-gray-300">Recipient Type *</label>
                            <select name="recipientType" required className="select bg-gray-700 border-orange-500/30 text-white w-full">
                                <option value="NGO">NGO</option>
                                <option value="Shelter">Shelter</option>
                                <option value="Community Group">Community Group</option>
                                <option value="Individual">Individual</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold block mb-1 text-gray-300">Pickup Address *</label>
                            <input type="text" name="pickupAddress" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold block mb-1 text-gray-300">Estimated Number of People Served *</label>
                            <input type="number" name="estimatedPeople" required className="input bg-gray-700 border-orange-500/30 text-white w-full" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-bold block mb-2 text-gray-300">Pin your specific location on the map * (Required to receive nearby food notifications)</label>
                        <MapPicker onLocationSelect={(loc) => setLocation(loc)} />
                        {!location && <p className="text-xs text-red-400 mt-1">Please drop a pin on the map to continue.</p>}
                    </div>

                    <h2 className="text-orange-400 font-bold border-b border-gray-700 pb-2 pt-4">Document Uploads (URLs)</h2>
                    <p className="text-xs text-gray-400 mb-2">Please provide public accessible URLs for verification.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">NGO Registration Cert URL</label><input type="text" name="ngoRegCertUrl" className="input bg-gray-700 text-white w-full input-sm" /></div>
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">Gov. ID Proof URL *</label><input type="text" name="idProofUrl" required className="input bg-gray-700 border-blue-500/30 text-white w-full input-sm" /></div>
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">Address Proof URL *</label><input type="text" name="addressProofUrl" required className="input bg-gray-700 border-blue-500/30 text-white w-full input-sm" /></div>
                        <div><label className="text-xs font-bold block mb-1 text-gray-300">Authorization Letter URL</label><input type="text" name="authLetterUrl" className="input bg-gray-700 text-white w-full input-sm" /></div>
                    </div>
                </div>
            )}

            <button disabled={isLoading || (role !== 'donor' && role !== 'recipient' ? false : !location)} className="btn bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white border-none w-full !mt-6 text-lg">
              {isLoading ? "Submitting..." : "Submit Registration"}
            </button>
            {errore && <p className="text-red-400 text-sm mt-2">{errore}</p>}
          </form>
          )}

          {step === 2 && (
             <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 text-white animate-fade-in">
                 <div className="bg-gray-800 p-6 rounded-lg space-y-4 text-center">
                     <h2 className="text-2xl font-bold text-orange-400">Verify Your Email</h2>
                     <p className="text-gray-300 text-sm">We've sent a 6-digit OTP to <strong>{emailForOtp}</strong>. It will expire in 10 minutes.</p>
                     
                     <div className="mt-4">
                         <label className="text-sm font-bold block mb-2 text-left">Enter OTP</label>
                         <input type="text" name="otp" required maxLength="6" className="input bg-gray-700 text-white w-full text-center text-2xl tracking-widest" placeholder="------" />
                     </div>
                     <p className="text-xs text-red-400 mt-2">Entering an incorrect OTP will cancel your registration.</p>
                 </div>
                 <button disabled={isLoading} className="btn bg-green-500 hover:bg-green-600 text-white border-none w-full !mt-4 text-lg">
                     {isLoading ? "Verifying..." : "Verify OTP"}
                 </button>
                 {errore && <p className="text-red-400 text-sm mt-2 text-center">{errore}</p>}
                 
                 <button type="button" onClick={() => setStep(1)} className="text-gray-400 text-sm hover:text-white mt-4 underline">
                     Go back to registration
                 </button>
             </form>
          )}

          <p className="text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <Link className="text-orange-400 hover:text-orange-300 underline font-bold" to={"/login"}>
              Log In
            </Link>
          </p>
        </div>

        {/* Image Container */}
        <div className="hidden lg:block w-1/2 bg-[url('https://i.ibb.co/h1x6sGV9/victoria-shes-UC0-HZd-Uit-WY-unsplash.jpg')] bg-cover bg-center">
            <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center p-10 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4 italic">Share<span className="text-orange-400">Bite</span></h2>
                <p className="text-gray-200 text-lg">Bridging the gap between food surplus and food scarcity.</p>
                <div className="mt-8 space-y-4">
                    <div className="bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h3 className="text-orange-400 font-bold">For Donors</h3>
                        <p className="text-sm text-gray-300">Verified status helps you reach more organizations safely.</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h3 className="text-orange-400 font-bold">For Recipients</h3>
                        <p className="text-sm text-gray-300">Register your NGO to start connecting with generous donors.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default SignUp;
