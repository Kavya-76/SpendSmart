import Link from "next/link";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image src="/logo.svg" alt="logo" width={40} height={25} />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>

      {/* Right Section: Background Image */}
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/register_background.jpeg"
          alt="A sleek and modern design for registration"
          layout="fill" // Ensures the image fills the parent container
          objectFit="cover" // Ensures the image covers the parent div
          className="absolute inset-0 dark:brightness-[0.2] dark:grayscale"
          loading="lazy"
        />
      </div>
    </div>
    // <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
    // </div>
    // <>
    //     {children}
    // </>
  );
};

export default AuthLayout;
