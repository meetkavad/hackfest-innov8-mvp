import React from 'react';
import { motion } from 'motion/react';
import { FaStore, FaBuilding, FaCity, FaHome, FaHandsHelping, FaHeartbeat, FaSchool, FaUsers } from 'react-icons/fa';

const Participants = () => {
    // Shared animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const donors = [
        { 
            title: "Restaurants & Cafes", 
            icon: <FaStore className="text-emerald-500" />,
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
            desc: "Share daily surplus meals"
        },
        { 
            title: "Cloud Kitchens", 
            icon: <FaCity className="text-emerald-500" />,
            image: "https://www.bbft.in/wp-content/uploads/2024/09/Cloud-kitchen-1024x602.jpg",
            desc: "Donate bulk preparations"
        },
        { 
            title: "Event Caterers", 
            icon: <FaBuilding className="text-emerald-500" />,
            image: "https://www.shutterstock.com/image-photo/catering-staff-serves-food-buffet-600nw-2630302985.jpg",
            desc: "Route event leftovers"
        },
        { 
            title: "Individuals & Families", 
            icon: <FaHome className="text-emerald-500" />,
            image: "https://media.istockphoto.com/id/1045038848/photo/rows-of-tiffin-meal-box-containers-filled-with-herbed-couscous-and-vegetable-stew.jpg?s=612x612&w=0&k=20&c=FSljOm_rGK-RYlxz6LaJ6Im-C-EeFnwY5v7k8HT9hnA=",
            desc: "Share excess groceries"
        }
    ];

    const recipients = [
        { 
            title: "NGOs & Non-Profits", 
            icon: <FaHandsHelping className="text-blue-500" />,
            image: "https://youngscholarz.com/wp-content/uploads/2021/10/education.jpeg",
            desc: "Distribute to communities"
        },
        { 
            title: "Shelters & Orphanages", 
            icon: <FaHome className="text-blue-500" />,
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400",
            desc: "Provide daily nourishment"
        },
        { 
            title: "Community Centers", 
            icon: <FaHeartbeat className="text-blue-500" />,
            image: "https://oakgroveky.org/wp-content/uploads/2023/08/Community-Center.png",
            desc: "Support local neighborhoods"
        },
        { 
            title: "Schools", 
            icon: <FaSchool className="text-blue-500" />,
            image: "https://media.istockphoto.com/id/1409722748/photo/students-raising-hands-while-teacher-asking-them-questions-in-classroom.jpg?s=612x612&w=0&k=20&c=NbVChOV9wIbQOhUD6BqpouZHHBbyQ2rkSjaVfIhpMv8=",
            desc: "Fuel student learning"
        }
    ];

    return (
        <div className="w-full py-24 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] rounded-full bg-emerald-200/20 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                 <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] rounded-full bg-blue-200/20 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Who Can Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">ShareBite?</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        We bridge the gap between surplus food and those in need. Everyone has a role to play in building a hunger-free community.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
                    
                    {/* Donors Section */}
                    <div className="flex flex-col">
                        <div className="mb-10 text-center lg:text-left">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Become a <span className="text-emerald-600 dark:text-emerald-400">Donor</span></h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Turn your surplus into smiles</p>
                        </div>
                        
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {donors.map((donor, idx) => (
                                <motion.div 
                                    key={idx} 
                                    variants={itemVariants}
                                    className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden flex flex-col h-full"
                                >
                                    <div className="h-40 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 transition-opacity duration-300"></div>
                                        <img 
                                            src={donor.image} 
                                            alt={donor.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 text-white shadow-lg">
                                            <span className="text-2xl drop-shadow-md">{donor.icon}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{donor.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mt-auto">{donor.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Recipients Section */}
                    <div className="flex flex-col">
                        <div className="mb-10 text-center lg:text-left">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Become a <span className="text-blue-600 dark:text-blue-400">Recipient</span></h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Receive reliable food support</p>
                        </div>
                        
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {recipients.map((recipient, idx) => (
                                <motion.div 
                                    key={idx} 
                                    variants={itemVariants}
                                    className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden flex flex-col h-full"
                                >
                                    <div className="h-40 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 transition-opacity duration-300"></div>
                                        <img 
                                            src={recipient.image} 
                                            alt={recipient.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 text-white shadow-lg">
                                            <span className="text-2xl drop-shadow-md">{recipient.icon}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{recipient.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mt-auto">{recipient.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Participants;
