import { Poppins } from "next/font/google";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
}
