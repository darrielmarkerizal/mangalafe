import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const navigationLinks = [
    { href: "/", label: "Beranda" },
    { href: "/portofolio", label: "Portofolio" },
    { href: "/hubungi-kami", label: "Hubungi Kami" },
  ];

  return (
    <footer className="bg-background text-text">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center md:flex-row md:items-start">
          <div className="flex flex-col items-center md:items-start w-full">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Mangala Dipa Lokatara Logo"
                width={37}
                height={40}
                priority
              />
            </Link>

            <div className="flex flex-col mt-12 text-[14px] font-plus-jakarta-sans space-y-3">
              <div>
                <h3 className="font-semibold">Alamat</h3>
                <span>
                  Jalan Kaliurang KM 5 CT 3 No. 22, Caturtunggal, Depok, Sleman,
                  Daerah Istimewa Yogyakarta
                </span>
              </div>
              <div>
                <h3 className="font-semibold">Email:</h3>
                <span>mangaladipalokatara@gmail.com</span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col w-full mt-12 space-y-3 md:items-end md:mt-[0px]">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-plus-jakarta-sans hover:text-primary text-[14px] font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 border-t py-6 w-full border-black">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Mangala Dipa Lokatara. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
