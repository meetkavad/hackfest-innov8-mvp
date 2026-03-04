import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const Nav = () => {
  const { user,handlesignOut } = useContext(AuthContext);

  

  const logoutUser=()=>{
    handlesignOut().then(()=>{
      toast.success('successfully LogOut!')
    }).then(error=>{
      toast.error(error.message)
    })
  }

  return (
    <div className="w-full primary  fixed z-50  text-white">
      <div className="navbar responsive shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gray-600 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {(!user || user.role === 'recipient') && (
                <>
                  <li className="text-sm font-bold">
                    <NavLink
                      className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                      to={"/"}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="text-sm font-bold">
                    <NavLink
                      className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                      to={"/availablefood"}
                    >
                      Available Foods
                    </NavLink>
                  </li>
                </>
              )}

              {user?.role === 'donor' && (
                <>
                  <li className="text-sm font-bold">
                    <NavLink
                      className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                      to={"/"}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="text-sm font-bold">
                    <NavLink
                      className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                      to={"/addfood"}
                    >
                      Add Food
                    </NavLink>
                  </li>
                </>
              )}

              {user?.role === 'recipient' && (
                <li className="text-sm font-bold">
                  <NavLink
                    className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                    to={"/foodrequest"}
                  >
                    My Food Request
                  </NavLink>
                </li>
              )}

             <li className="text-sm font-bold">
              <NavLink
                className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                to={"/blogs"}
              >
                Blog
              </NavLink>
            </li>
            </ul>
          </div>
          <Link to={"/"} className="md:text-2xl text-xl italic font-extrabold">
            Share<span className="text-orange-300 text-2xl md:text-3xl">Bite</span>{" "}
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {(!user || user.role === 'recipient') && (
              <>
                <li className="text-sm font-bold">
                  <NavLink
                    className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                    to={"/"}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="text-sm font-bold">
                  <NavLink
                    className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                    to={"/availablefood"}
                  >
                    Available Foods
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'donor' && (
              <>
                <li className="text-sm font-bold">
                  <NavLink
                    className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                    to={"/"}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="text-sm font-bold">
                  <NavLink
                    className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                    to={"/addfood"}
                  >
                    Add Food
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'recipient' && (
              <li className="text-sm font-bold">
                <NavLink
                  className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                  to={"/foodrequest"}
                >
                  My Food Request
                </NavLink>
              </li>
            )}

             <li className="text-sm font-bold">
              <NavLink
                className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                to={"/blogs"}
              >
                Blog
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-end flex gap-3 items-center">
          {user ? (
            <>
              <div className="flex flex-col items-end text-right hidden sm:flex">
                <span className="text-sm font-bold text-white">{user.name || user.displayName}</span>
                <span className="text-xs text-orange-300 uppercase tracking-wide">{user.role}</span>
              </div>
              <div className="avatar w-11 h-11 ml-2">
                <div className=" ring-offset-base-100  rounded-full ring-1 ring-offset-2">
                  <img src={user?.photoURL || user?.photoUrl} alt="User avatar" />
                </div>
              </div>
              <button onClick={logoutUser} className=" btn ml-2">Logout</button>
            </>
          ) : (
            <>
              <NavLink className={'btn'} to={"/login"}>LogIn</NavLink>
              <NavLink className={'btn'} to={"/signup"}>SignUp</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
