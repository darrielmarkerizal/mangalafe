import Hero from "@/components/home/hero";
import Keahlian from "@/components/home/keahlian";
import Layanan from "@/components/home/layanan";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <Layanan />
      <Keahlian />
    </main>
  );
}
