import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import Banner from '../../component/Banner/Banner';
import HowItWork from '../../component/HowItWork/HowItWork';
import Benifit from '../../component/Benefit/Benifit';
import FeaturedFoods from '../../component/FeaturedFood/FeaturedFoods';
import Reviews from '../../component/Reviews/Reviews';
import ManageFood from '../ManageFood/ManageFood';

const Home = () => {
    const { user } = useContext(AuthContext);

    if (user && user.role === 'donor') {
        return <ManageFood />;
    }

    if (user && user.role === 'admin') {
        return <Navigate to="/admin/impacts" replace />;
    }

    return (
        <>
        <title>ShareBite </title>
        <Banner></Banner>
        <FeaturedFoods></FeaturedFoods>
        <HowItWork></HowItWork>
        <Benifit></Benifit>
        <Reviews></Reviews>
        </>
    );
};

export default Home;