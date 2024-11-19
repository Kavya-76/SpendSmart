import React from "react";
import Image from "next/image";
function Hero() {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="mx-auto max-w-screen-xl px-4 py-32">  {/*lg:flex lg:h-screen lg:items-center*/}
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Manage Your Expense
            <strong className="font-extrabold text-primary sm:block">
              {" "}
              Control Your Money{" "}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Start Creating your budget and save ton of money
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-primary sm:w-auto"
              href="#"
            >
              Get Started
            </a>

            <a
              className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-blue-700 focus:outline-none focus:ring active:text-primary sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      <Image
        className="-mt-10 rounded-xl border-2"
        src="/dashboard-image.jpg"
        alt="dashboard-image"
        width={1000}
        height={700}
      />
    </section>
  );
}

export default Hero;
