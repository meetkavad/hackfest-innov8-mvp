import {
    createBrowserRouter,
    
  } from "react-router";
import Root from "../Root/Root";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Login/Login";
import SignUp from "../../pages/Registration/SignUp"
import AvialableFoods from "../../pages/AvialableFoods/AvialableFoods";
import PrivetRout from "./PrivetRout"
import AddFood from "../../pages/AddFood/AddFood"
import ManageFood from "../../pages/ManageFood/ManageFood"
import MyFoodRequest from "../../pages/MyFoodRequest/MyFoodRequest"
import Error from "../ErrorPage/Error";
import Loading from "../../pages/Loading/Loading";
import Details from "../../pages/Details/Details"
import Blogs from "../../pages/Blogs/Blogs";
import BlogDetails from "../../pages/Blogs/BlogDetails";
import AdminLayout from "../../pages/AdminDashboard/AdminLayout";
import Impacts from "../../pages/AdminDashboard/Impacts";
import UsersList from "../../pages/AdminDashboard/UsersList";
import AllRequests from "../../pages/AdminDashboard/AllRequests";
import AdminFoods from "../../pages/AdminDashboard/AdminFoods";
import UserVerification from "../../pages/AdminDashboard/UserVerification";
import AddAdmin from "../../pages/AdminDashboard/AddAdmin";
import PoorPerformers from "../../pages/AdminDashboard/PoorPerformers";
import AddBlog from "../../pages/AdminDashboard/AddBlog";

import AdminRoute from "./AdminRoute";

 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Root></Root>,
      errorElement:<Error></Error>,
      children:[
        {index:true, Component:Home},
        {
          path:"/login",
          Component:Login
        },
        {
          path:'/signup',
          Component:SignUp
        },
        {
          path:'/availablefood',
          element:<AvialableFoods></AvialableFoods>,
          loader: ()=>fetch('http://localhost:5000/foods?status=available&excludeExpired=true'),
           HydrateFallback:Loading
        },
        {
          path:'/addfood',
          element:<PrivetRout><AddFood></AddFood></PrivetRout>
        },
        {
          path:'/managefood',
          element:<PrivetRout><ManageFood></ManageFood></PrivetRout>
        },
        {
          path:'/foodrequest',
          element:<PrivetRout><MyFoodRequest></MyFoodRequest></PrivetRout>
        },
        {
          path:'/details/:id',
          element:<PrivetRout> <Details></Details> </PrivetRout>,
          loader:({params})=>fetch(`http://localhost:5000/foods/${params.id}`),
          HydrateFallback:Loading
        },
        {
          path:'/blogs',
          Component:Blogs
        },
        {
          path:'/blogs/:id',
          Component:BlogDetails
        },
        {
          path: '/admin',
          element: <AdminRoute><AdminLayout></AdminLayout></AdminRoute>,
          children: [
            { path: 'impacts', element: <Impacts></Impacts> },
            { path: 'users', element: <UsersList></UsersList> },
            { path: 'verification', element: <UserVerification></UserVerification> },
            { path: 'requests', element: <AllRequests></AllRequests> },
            { path: 'foods', element: <AdminFoods></AdminFoods> },
            { path: 'poor-performers', element: <PoorPerformers></PoorPerformers> },
            { path: 'add-admin', element: <AddAdmin></AddAdmin> },
            { path: 'add-blog', element: <AddBlog></AddBlog> }
          ]
        }
      ]
    },
  ]);