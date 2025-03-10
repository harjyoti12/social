import  { useEffect } from "react";
import { Button } from "../ui/button";
import { useSignOutAccountMutation } from "@/lib/react_query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { INavLink } from "@/lib/types";
import { sidebarLinks } from "@/constants";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/public/assets/images/logo.svg" width={170} height={36} />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/public/assets/images/profile.png"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">{user.email}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}
                key={link.label}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
       <Button variant='ghost' className='shad-button_ghost' onClick={()=>signOut()}>
                  <img src="/public/assets/icons/logout.svg" alt="logout" />
                  <p className="small-medium lg:base-medium">Logout</p>
              </Button>
    </nav>
  );
};

export default LeftSidebar;
