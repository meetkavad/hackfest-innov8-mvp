import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import Banner from '../../component/Banner/Banner';
import HowItWork from '../../component/HowItWork/HowItWork';
import Benifit from '../../component/Benefit/Benifit';
import ImpactMetrics from '../../component/ImpactMetrics/ImpactMetrics';
import Participants from '../../component/Participants/Participants';
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
        <ImpactMetrics />
        <Participants />
        <HowItWork></HowItWork>
        <Benifit></Benifit>
        </>
    );
};

export default Home;