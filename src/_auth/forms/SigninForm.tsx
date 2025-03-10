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
import { SigninValidation } from "@/lib/validation";
import img from "../../../public/assets/images/logo.svg";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useSignInAccountMutation,
} from "@/lib/react_query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {checkAuthUser,isUserLoading} = useUserContext()

  const { mutateAsync: signInAccount } =
    useSignInAccountMutation();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // const newUser = await createUserAccount(values);
    // console.log(newUser);
    // if (!newUser) {
    //   return toast({
    //     title: "Sign up failed, Please try again",
    //     variant: "destructive",
    //   });
    // }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        title: "Sign in failed, Please try again",
        variant: "destructive",
      });
    }
    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn){
      form.reset();
      navigate('/')
    }else{
      toast({
        title: "Sign in failed, Please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col flex bg-[#09090A] rounded-md p-6">
        <img src={img} alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to youe account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          Welcomeback please enter your account details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isUserLoading}
            className="shad-button_primary"
            type="submit"
          >
            {isUserLoading ? (
              <div className="flex-center gap-2">
                {" "}
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1 cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
