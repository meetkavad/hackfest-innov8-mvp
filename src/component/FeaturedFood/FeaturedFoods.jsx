import { useQuery } from '@tanstack/react-query';
import React from 'react';
import FeaturedFood from './FeaturedFood';
import { Link } from 'react-router';

const FeaturedFoods = () => {

    const { isPending,isError,error,data}= useQuery ({
        queryKey:['featuredFood'],
        queryFn:async ()=>{
            const res= await fetch(`${import.meta.env.VITE_API_URL}/featuredFoods`);
            return res.json()
        }
    })

    

    if(isError){
        return <p>{error.message}</p>
    }

    if(isPending){
        return <span className="loading loading-spinner text-error"></span>
    }

    return (
        <div className='w-full bg-gray-200 py-16'>

            <div className='text-color text-center'>

                <h1 className='font-bold text-3xl'>Featured Foods</h1>
                <p className='text-sm mt-3'>Discover the most abundant food items shared by our generous community. 
                Enoy fresh, high-quantity meals available for pickup -first come , first served
                </p>

            </div>

            <div className='responsive grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch justify-center mt-10'>

                {
                    data.map(food=><FeaturedFood key={food._id} food={food}></FeaturedFood>)
                }

            </div>

            <div className='text-center mt-10'>
                <Link to={'/availablefood'} className='btn primary text-white shadow border-none '>Show All</Link>

            </div>
            
        </div>
    );
};

export default FeaturedFoods;