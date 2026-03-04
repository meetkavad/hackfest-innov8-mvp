import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

const Banner = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://i.ibb.co/hFx06VC2/pexels-julia-m-cameron-6994806.jpg)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { duration: 2 } }}
            className="mb-5 text-5xl font-bold"
          >
            Join the Fight Aganist{" "}
            <motion.span
              animate={{
                color: ["#50cc0d", "#33ff33", "#5ff60e"],
                transition: { duration: 4, repeat: Infinity },
              }}
            >
              Food Waste
            </motion.span>{" "}
          </motion.h1>
          <motion.p
            className="mb-5"
            

            initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:2, ease:'easeOut'}}
          
          >
            Share your surplus food with those who neees it most. Together, we
            can build a community where no one sleeps hungry.
          </motion.p>
          <motion.div
          initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:3, ease:'easeOut'}}
          className="flex items-center justify-center gap-2">
            <Link
              className="border px-3 py-2 hover:primary"
              to={"/availablefood"}
            >
              Explore Food
            </Link>
            <Link
              className="border primary px-3 py-2 hover:bg-none"
              to={"/addfood"}
            >
              Donate Food
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
