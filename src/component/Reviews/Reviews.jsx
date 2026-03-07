import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

import Loading from '../../pages/Loading/Loading';
import Review from './Review';

const Reviews = () => {
    const {data:reviews=[],isLoading,isError}=useQuery({
        queryKey:['reviews'],
        queryFn:async ()=>{
            const res=await axios.get(`${import.meta.env.VITE_API_URL}/reviews`);
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
        <div className='w-full secondary py-16'>

            <div className='text-color text-center'>

                <h1 className='font-bold text-3xl'>What People Say About ShareBite</h1>
                <p className='text-sm mt-3'>
                    Real stories from donors and recipients who have experienced the joy of giving and receving.
                </p>

            </div>

            <div className='responsive grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-10 gap-6 items-stretch justify-between'>
                {
                    reviews.map(rev=><Review key={rev._id} rev={rev}></Review>)
                }

            </div>
            
        </div>
    );
};

export default Reviews;