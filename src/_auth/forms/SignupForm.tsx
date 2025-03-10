// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { SignupValidation } from "@/lib/validation";
// import img from "../../../public/assets/images/logo.svg";
// import Loader from "@/components/shared/Loader";
// import { Link, useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import {
//   useCreateUserAccountMutation,
//   useSignInAccountMutation,
// } from "@/lib/react_query/queriesAndMutation";
// import { useUserContext } from "@/context/AuthContext";

// const SignupForm = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const {checkAuthUser,isLoading,isUserLoading} = useUserContext()
//   const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
//     useCreateUserAccountMutation();
//   const { mutateAsync: signInAccount, isPending: isSignIn } =
//     useSignInAccountMutation();

//   const form = useForm<z.infer<typeof SignupValidation>>({
//     resolver: zodResolver(SignupValidation),
//     defaultValues: {
//       name: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//   });

//   // 2. Define a submit handler.
//   async function onSubmit(values: z.infer<typeof SignupValidation>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values);
//     const newUser = await createUserAccount(values);
//     console.log(newUser);
//     if (!newUser) {
//       return toast({
//         variant: "destructive",
//         title: "Sign up failed, Please try again",
//       });
//     }
//     const session = await signInAccount({
//       email: values.email,
//       password: values.password,
//     });
//     if (!session) {
//       return toast({
//         title: "Sign in failed, Please try again",
//         variant: "destructive",
//       });
//     }
//     const isLoggedIn = await checkAuthUser()

//     if(isLoggedIn){
//       form.reset();
//       navigate('/')
//     }else{
//       toast({
//         title: "Sign in failed, Please try again",
//         variant: "destructive",
//       });
//     }
//   }

//   return (
//     <Form {...form}>
//       <div className="sm:w-420 flex-center flex-col flex">
//         <img src={img} alt="logo" />
//         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
//           Create a new account
//         </h2>
//         <p className="text-light-3 small-medium md:base-regular">
//           To use snapgram please enter your account details
//         </p>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col gap-5 w-full mt-4"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>UserName</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             disabled={isCreatingUser}
//             className="shad-button_primary"
//             type="submit"
//           >
//             {isCreatingUser ? (
//               <div className="flex-center gap-2">
//                 {" "}
//                 <Loader />
//                 Loading...
//               </div>
//             ) : (
//               "Sign up"
//             )}
//           </Button>
//           <p className="text-small-regular text-light-2 text-center mt-2">
//             Already have an account?
//             <Link
//               to="/sign-in"
//               className="text-primary-500 text-small-semibold ml-1 cursor-pointer"
//             >
//               Sign in
//             </Link>
//           </p>
//         </form>
//       </div>
//     </Form>
//   );
// };

// export default SignupForm;


import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import img from "../../../public/assets/images/logo.svg";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateUserAccountMutation,
  useSignInAccountMutation,
} from "@/lib/react_query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccountMutation();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Submit Handler
  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(values);
      if (!newUser) {
        throw new Error("Sign up failed, Please try again");
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      if (!session) {
        throw new Error("Sign in failed, Please try again");
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate("/");
        toast({ title: "Account created successfully!", variant: "destructive" });
      } else {
        throw new Error("Sign in failed, Please try again");
      }
    } catch (error: any) {
      toast({
        title: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Reusable Field Component
  const renderField = (name: string, label: string, type = "text") => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} className="shad-input" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center  flex-col flex">
        <img src={img} alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          To use Snapgram, please enter your account details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {renderField("name", "Name")}
          {renderField("username", "Username")}
          {renderField("email", "Email")}
          {renderField("password", "Password", "password")}

          <Button
            disabled={isCreatingUser || isSigningIn || isUserLoading}
            className="shad-button_primary"
            type="submit"
          >
            {isCreatingUser || isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1 cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
