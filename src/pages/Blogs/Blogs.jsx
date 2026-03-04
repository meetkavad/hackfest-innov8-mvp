import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Blog from './Blog';
import Loading from '../Loading/Loading';

const Blogs = () => {
    const {data:blogs=[],isLoading,isError}=useQuery({
        queryKey:['blogs'],
        queryFn: async ()=>{
            const res= await axios.get('http://localhost:5000/blogs');
            return res.data
        }
    })
    
    if(isLoading){
        return <Loading></Loading>
    }
    if(isError){
        return <p className='text-center text-2xl font-bold py-10'>Faild to load reviews !</p>
    }
    return (
        <div className='secondary py-32 w-full'>
            <div className='text-color text-center'>

                <h1 className='font-bold text-3xl'>
                    Feeding Hope: Stories & Tips from Food Donation
                </h1>
                <p className='text-sm mt-3'>
                    
                    Discover inspiring stories, helpful tips, and the latest news to fight hunger and reduce food waste.
                </p>

            </div>

            <div className='responsive pt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
                {
                    blogs.map(blog=><Blog key={blog.id} blog={blog}></Blog>)
                }

            </div>
        </div>
    );
};

export default Blogs;