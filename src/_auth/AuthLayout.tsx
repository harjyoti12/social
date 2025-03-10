// import { Outlet, Navigate } from "react-router-dom";
// import img from '../../public/assets/images/side-img.svg'
// const AuthLayout = () => {
//   const isAuthenticated = false;
//   return (
//     <>
//       {isAuthenticated ? (
//         <Navigate to="/" />
//       ) : (
//         <>
//           <section className="flex flex-1 justify-center items-center flex-col">
//             <Outlet />
//           </section>
//           <img src={img} alt="logo"  className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"/>
//         </>
//       )}
//     </>
//   );
// };

// export default AuthLayout;


import { Outlet, Navigate } from "react-router-dom";
import img from "../../public/assets/images/side-img.svg";
import { useUserContext } from "@/context/AuthContext";
import SkeletonLoader from "@/components/shared/SkeletonLoader";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  // Show a loading indicator if authentication status is being checked
  if (isLoading) {
    return (
       <SkeletonLoader/>
    );
  }

  // Redirect authenticated users to the home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render layout for unauthenticated users
  return (
    <div className="flex flex-1 flex-col xl:flex-row">
      <section className="flex flex-1 justify-center items-center flex-col">
        <Outlet />
      </section>
      <img
        src={img}
        alt="side-img"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </div>
  );
};

export default AuthLayout;
