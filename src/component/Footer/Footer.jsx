import React from "react";
import {
  FaFacebook,
  FaInstagramSquare,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="bg-slate-900 w-full text-slate-300">
      <footer className="responsive py-16 flex flex-col md:flex-row md:items-start gap-10 justify-between">
        {/* logo */}
        <div className="space-y-2">
          <Link to={"/"} className="flex items-center justify-start mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Share<span className="text-emerald-500">Bite</span></h1>
          </Link>

          <small>
            © {new Date().getFullYear()} ShareBite. All rights reserved.
          </small>
        </div>

        {/* contract information */}

        <div className="md:space-y-4 space-y-3">
          <div className="flex items-center gap-3 font-medium text-lg hover:text-white transition-colors cursor-pointer">
            <div className="bg-slate-800 p-2 rounded-full text-emerald-500"><FaPhone size={16} /></div>
            <p>+880 1711111111</p>
          </div>

          <div className="flex items-center gap-3 font-medium text-lg hover:text-white transition-colors cursor-pointer">
            <div className="bg-slate-800 p-2 rounded-full text-emerald-500"><IoMdMail size={16} /></div>
            <p>info@sharebite.com</p>
          </div>

          <div className="flex items-center gap-3 font-medium text-lg hover:text-white transition-colors cursor-pointer">
            <div className="bg-slate-800 p-2 rounded-full text-emerald-500"><FaLocationDot size={16} /></div>
            <p>Share Bite Square, Vesu, Surat</p>
          </div>
        </div>

        {/* social icon */}

        <div>
          <h1 className="text-xl font-bold text-white mb-6">Connect With Us</h1>
          <div className="flex items-center gap-4">
            <a
              target="_blank"
              href="https://www.facebook.com/"
              className="text-slate-400 hover:text-emerald-500 transform hover:scale-110 transition-all duration-300"
            >
              <FaFacebook size={28} />
            </a>
            <a target="_blank" href="https://www.instagram.com/" className="text-slate-400 hover:text-emerald-500 transform hover:scale-110 transition-all duration-300">
              <FaInstagramSquare size={28} />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/"
              className="text-slate-400 hover:text-emerald-500 transform hover:scale-110 transition-all duration-300"
            >
              <FaLinkedin size={28} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
