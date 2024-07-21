import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import SignUpForm from "./SignUpForm";
import poster from "@/assets/signup-image.jpg";

export const metadata: Metadata = {
  title: "Sign Up",
};

const Page = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign Up &#x25cf; BugBook</h1>
            <p className="text-muted-foreground">
              &laquo; Friendships are not only for the{" "}
              <span className="italic">Cool Guys</span> &raquo;
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <p className="block text-center">
              Already registered?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
        <Image
          src={poster}
          alt=""
          priority
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default Page;
