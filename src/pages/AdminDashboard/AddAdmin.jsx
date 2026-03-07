import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const AddAdmin = () => {
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name.value;
    const photoUrl = form.photoUrl.value;
       
    setError("");
    // Password validation
    const passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passregex.test(password)) {
      const msg = 'Password must be at least 6 characters, and include a capital letter, a number, and a special character.';
      setError(msg);
      return toast.error(msg);
    }

    const adminData = {
        name,
        email,
        password,
        photoUrl
    };

    setIsLoading(true);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/add-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adminData)
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Admin created successfully!");
            form.reset();
        } else {
            setError(data.message || "Failed to create Admin");
            toast.error(data.message || "Failed to create Admin");
        }
    } catch (err) {
        setError(err.message);
        toast.error(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Administrator</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">
        <p className="text-gray-500 mb-6">Fill in the details below to create a new admin account. This account will have full administrative privileges.</p>
        
        <form onSubmit={handleAddAdmin} className="flex flex-col gap-5">
            <div>
                <label className="text-sm font-bold block mb-1 text-gray-700">Full Name *</label>
                <input type="text" name="name" required className="input input-bordered w-full bg-gray-50 text-gray-800" placeholder="Admin Name" />
            </div>
            
            <div>
                <label className="text-sm font-bold block mb-1 text-gray-700">Email Address *</label>
                <input type="email" name="email" required className="input input-bordered w-full bg-gray-50 text-gray-800" placeholder="admin@example.com" />
            </div>
            
            <div>
                <label className="text-sm font-bold block mb-1 text-gray-700">Photo URL</label>
                <input type="text" name="photoUrl" className="input input-bordered w-full bg-gray-50 text-gray-800" placeholder="https://..." />
            </div>
            
            <div className="relative">
                <label className="text-sm font-bold block mb-1 text-gray-700">Password *</label>
                <input required name="password" type={showPass ? "text" : "password"} className="input input-bordered w-full bg-gray-50 text-gray-800 pr-10" placeholder="Secure Password" />
                <div onClick={() => setShowPass(!showPass)} className="absolute right-3 top-10 text-gray-500 cursor-pointer hover:text-gray-800">
                    {showPass ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                </div>
                <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters, including a capital letter, a number, and a special character.</p>
            </div>

            <button disabled={isLoading} className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full !mt-4 text-lg">
              {isLoading ? "Creating..." : "Create Admin User"}
            </button>
            
            {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
