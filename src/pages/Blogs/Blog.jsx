import React from "react";
import { Link } from "react-router";

const Blog = ({ blog }) => {
  const { date,  heading, title, image, _id } = blog;
  const displayTitle = title || heading;

  return (
    <div className="relative h-96 w-full">

        <div className="w-full h-full bg-cover bg-center bg-no-repeat rounded-md" 
        style={{backgroundImage:`url(${image})`}}></div>
        <div className="absolute inset-0 bg-black opacity-70  rounded-md"></div>
        <div className="absolute inset-0 flex flex-col items-start z-50 justify-end gap-2 p-4">

            <h1 className="text-white text-sm font-bold ">{displayTitle}</h1>
            <p className="text-gray-200 text-xs font-semibold">{date}</p>
            <Link className="btn btn-sm primary text-white border-none " to={`/blogs/${_id}`}>Read more</Link>

        </div>
      
    </div>
  );
};

export default Blog;
