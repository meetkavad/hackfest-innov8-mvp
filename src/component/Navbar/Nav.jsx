import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { FaRegBell } from "react-icons/fa";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const Nav = () => {
  const { user,handlesignOut } = useContext(AuthContext);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const navigate = useNavigate();

  const logoutUser=()=>{
    handlesignOut().then(()=>{
      toast.success('successfully LogOut!')
      navigate('/');
    }).then(error=>{
      if(error) toast.error(error.message)
    })
  }

  React.useEffect(() => {
    if (user?.email && user?.role === 'recipient') {
      fetchNotifications();
      // Polling for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/notifications/${user.email}`);
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    setShowDropdown(false);
    if (!notif.isRead) {
      try {
        await axios.patch(`http://localhost:5000/notifications/${notif._id}/read`);
        // Update local state
        setNotifications(prev => 
          prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    // Navigate to food details
    if (notif.foodId && notif.foodId._id) {
       navigate(`/details/${notif.foodId._id}`);
    }
  };

  return (
    <div className="w-full primary fixed top-0 z-[9999] text-white">
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

              {user?.role === 'admin' && (
                <>
                  <li className="text-sm font-bold">
                    <NavLink
                      className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                      to={"/admin/impacts"}
                    >
                      Admin Dashboard
                    </NavLink>
                  </li>
                </>
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

            {user?.role === 'admin' && (
                <>
                  <li className="text-sm font-bold">
                    <NavLink
                      className={({ isActive }) => (isActive ? "border-b rounded-none border-b-orange-300" : "")}
                      to={"/admin/impacts"}
                    >
                      Admin Dashboard
                    </NavLink>
                  </li>
                </>
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
              {/* Notification Bell for Recipients */}
              {user?.role === 'recipient' && (
                  <div className="relative ml-2">
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="btn btn-ghost btn-circle relative"
                    >
                      <FaRegBell className="h-6 w-6 text-white" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 badge badge-sm badge-error border-none text-white indicator-item">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-box shadow-xl z-50 overflow-hidden text-gray-800">
                        <div className="p-3 bg-gray-100 font-bold border-b text-sm flex justify-between items-center">
                          <span>Notifications</span>
                          {unreadCount > 0 && <span className="badge badge-error badge-sm text-white">{unreadCount} New</span>}
                        </div>
                        <ul className="max-h-[60vh] overflow-y-auto w-full menu p-0">
                          {notifications.length === 0 ? (
                            <li className="p-4 text-center text-gray-500 text-sm">No notifications yet</li>
                          ) : (
                            notifications.map(notif => (
                              <li key={notif._id} className={`border-b border-gray-100 ${!notif.isRead ? 'bg-orange-50' : 'bg-white'}`}>
                                <a 
                                  onClick={() => handleNotificationClick(notif)}
                                  className="flex flex-col items-start gap-1 p-3 hover:bg-gray-50 active:bg-gray-100"
                                >
                                  <div className="flex gap-3 w-full items-start">
                                    <div className="avatar w-10 h-10 flex-shrink-0 mt-1">
                                      {notif.foodId?.foodImage ? (
                                        <img src={notif.foodId.foodImage} alt="Food" className="rounded-md object-cover" />
                                      ) : (
                                        <div className="bg-orange-200 w-full h-full rounded-md flex items-center justify-center text-orange-600 font-bold">F</div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                        {notif.message}
                                      </p>
                                      <span className="text-xs text-gray-400 mt-1 block">
                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                      </span>
                                    </div>
                                    {!notif.isRead && (
                                       <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                                    )}
                                  </div>
                                </a>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
              )}
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
