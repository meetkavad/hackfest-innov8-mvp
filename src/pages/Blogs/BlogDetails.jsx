import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link, useParams } from "react-router";
import Loading from "../Loading/Loading";

const BlogDetails = () => {
  const { id } = useParams();
  const {
    data: blog = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/blogs/${id}`
      );
      return res.data;
    },
  });

  const { image, heading, title, date, body, content } = blog;
  const displayTitle = title || heading;
  const displayContent = content || body;

  if (isLoading) {
    return <Loading></Loading>;
  }
  if (isError) {
    return (
      <p className="text-center text-2xl font-bold py-10">
        Faild to load reviews !
      </p>
    );
  }

  return (
    <div className="py-32 bg-gray-50">
     <div className="max-w-4xl mx-auto space-y-2">

        <h1 className="text-3xl font-bold ">{displayTitle}</h1>
        <p className="text-sm">Author: <span>Share<span className="text-orange-300 text-xl">Bite</span></span> || <span>Date : {date}</span></p>

        <img className="w-full h-[600px] object-cover rounded" src={image} alt="" />

        <p className="whitespace-pre-wrap">{displayContent}</p>

        <Link className="btn btn-sm text-white primary" to={'/blogs'}>Back to blog</Link>

     </div>
    </div>
  );
};

export default BlogDetails;
