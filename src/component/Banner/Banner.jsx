import React, { useContext } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { AuthContext } from "../../Context/AuthContext";

const Banner = () => {
  const { user } = useContext(AuthContext);
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://i.ibb.co/hFx06VC2/pexels-julia-m-cameron-6994806.jpg)",
      }}
    >
      <div className="hero-overlay bg-black bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center z-10 px-4">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }}
            className="mb-8 text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Join the Fight Against{" "}
            <motion.span
              animate={{
                color: ["#10b981", "#34d399", "#059669"],
                transition: { duration: 4, repeat: Infinity },
              }}
            >
              Food Waste
            </motion.span>{" "}
          </motion.h1>
          <motion.p
            className="mb-10 text-lg md:text-xl font-light text-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            Share your surplus food with those who need it most. Together, we
            can build a community where no one sleeps hungry.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              className="btn bg-emerald-500 hover:bg-emerald-600 border-none text-white rounded-full px-8 py-3 text-lg font-semibold shadow-elegant hover-lift w-full sm:w-auto"
              to={user?.role === 'recipient' ? "/availablefood" : "/addfood"}
            >
              {user?.role === 'recipient' ? "Check Available Food" : "Donate Food"}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;