import React from "react";
import { FaHandHoldingHeart, FaPlusCircle, FaSearch, FaUtensils } from "react-icons/fa";
import { motion } from "motion/react";

const HowItWork = () => {
  return (
    <section className="py-16 secondary">
      <div className="responsive text-center">
        <motion.div
        initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:1, ease:'easeOut'}}
        
        >
            <h2 className="text-4xl font-bold mb-4">How It Work</h2>
        <p className="mb-12">
          sharing food has never been easier. Here's how to you can contribute
          or receive in just a few steps.
        </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          

          {/* step-1 */}

          <motion.div
           initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:2, ease:'easeOut'}}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition">
            <FaPlusCircle className="text-4xl text-green-500 md-4 mx-auto"></FaPlusCircle>
            <h3 className="text-xl font-semibold mb-2">Add Food</h3>
            <p className="text-gray-600">
                Donors easily share extra food through a simple form.
            </p>
          </motion.div>
          {/* step-2 */}

          <motion.div
           initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:2, ease:'easeOut'}}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition">
            <FaSearch className="text-4xl text-blue-500 md-4 mx-auto"></FaSearch>
            <h3 className="text-xl font-semibold mb-2">Browse Foods</h3>
            <p className="text-gray-600">
                Recipients explore fresh available foods listed by others.
            </p>
          </motion.div>
          {/* step-3 */}

          <motion.div
           initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:2, ease:'easeOut'}}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition">
            <FaHandHoldingHeart className="text-4xl text-purple-500 md-4 mx-auto"></FaHandHoldingHeart>
            <h3 className="text-xl font-semibold mb-2">Request Food</h3>
            <p className="text-gray-600">
                Just one click to request your food item.
            </p>
          </motion.div>
          {/* step-4 */}

          <motion.div
           initial={{opacity:0,y:50}}
            animate={{opacity:1,y:0}}
            transition={{duration:2, ease:'easeOut'}}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition">
            <FaUtensils className="text-4xl text-red-500 md-4 mx-auto"></FaUtensils>
            <h3 className="text-xl font-semibold mb-2">Pickup Food </h3>
            <p className="text-gray-600">
                Connect, Collect, and help reduce food waste together.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
