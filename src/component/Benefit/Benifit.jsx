import React from "react";
import { motion } from "motion/react";

const Benifit = () => {
  return (
    <div className="w-full py-16 bg-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="text-color text-center"
      >
        <h2 className="text-3xl font-bold mb-3">Benefits of Our Platform</h2>
        <p className="text-color">Discover how your small act of kindness can make a big difference in someone's life. 
        Explore the key benefits of using our community food sharing platform.
        </p>
      </motion.div>

      <div className="responsive grid grid-cols-1 md:grid cols-2 lg:grid-cols-3 gap-6 mt-8">
        

        <motion.div
        initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:3, ease:'easeOut'}}
        className="bg-white p-4 rounded-md shadow-md">
           <img src="https://i.ibb.co/Q3PZTDVR/pexels-robinstickel-70497.jpg" alt="Help qommunity" className="w-full h-40 object-cover rounded-md mb-3" />

           <h3 className="text-xl font-semibold mb-1">Reduce Food Waste</h3>
           <p className="text-color">Share your food surplus instead of throwing it away.</p>

        </motion.div>

        <motion.div
        initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:3, ease:'easeOut'}}
        className="bg-white p-4 rounded-md shadow-md">
           <img src="https://i.ibb.co/Tqr7bB3T/pexels-julia-m-cameron-6995221.jpg" alt="Help qommunity" className="w-full h-40 object-cover rounded-md mb-3" />

           <h3 className="text-xl font-semibold mb-1">Help the Community</h3>
           <p className="text-color">Support people in need by donating food in your area.</p>

        </motion.div>

        <motion.div
        initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:3, ease:'easeOut'}}
        className="bg-white p-4 rounded-md shadow-md">
           <img src="https://i.ibb.co/NnHWtZg3/pexels-rdne-6414906.jpg" alt="Help qommunity" className="w-full h-40 object-cover rounded-md mb-3" />

           <h3 className="text-xl font-semibold mb-1">
            Easy to Use
           </h3>
           <p className="text-color">Intuitive platform to share or request food in just a few clicks.</p>

        </motion.div>
      </div>
    </div>
  );
};

export default Benifit;
