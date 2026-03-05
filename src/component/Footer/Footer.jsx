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
    <div className="bg-neutral w-full">
      <footer className=" w-full px-2 md:px-0 md:w-11/12 md:mx-auto text-neutral-content p-10 flex flex-col md:flex-row md:items-center gap-2 justify-between">
        {/* logo */}
        <div className="space-y-2">
          <Link to={"/"} className="flex items-center  justify-start ">
            
              <h1 className="text-2xl font-bold italic">Share<span className="text-orange-300 text-2xl md:text-3xl">Bite</span>{" "}</h1>
            
          </Link>

          <small>
            © {new Date().getFullYear()} ShareBite. All rights reserved.
          </small>
        </div>

        {/* contract information */}

        <div className="md:space-y-2">
          <div className="flex items-center gap-1 font-bold text-lg">
            <FaPhone></FaPhone>
            <p>+880 1711111111</p>
          </div>

          <div className="flex items-center gap-1 font-bold text-lg">
            <IoMdMail />
            <p>info@sharebite.com</p>
          </div>

          <div className="flex items-center gap-1 font-bold text-lg">
            <FaLocationDot />
            <p>Share Bite Square, Vesu, Surat</p>
          </div>
        </div>

        {/* social icon */}

        <div>
          <h1 className="text-xl font-bold italic">Follow us on.</h1>

          <div className="flex items-center gap-2 mt-2">
            <a
              target="_blank"
              href="https://www.facebook.com/"
            >
              <FaFacebook />
            </a>
            <a target="_blank" href="https://www.instagram.com/">
              <FaInstagramSquare />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
