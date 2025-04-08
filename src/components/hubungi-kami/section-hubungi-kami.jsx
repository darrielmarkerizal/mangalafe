import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const SectionHubungiKami = () => {
  const layananOptions = [
    "Konsultasi AMDAL",
    "Analisis Dampak Lingkungan",
    "Pengelolaan Limbah",
    "Audit Lingkungan",
    "Pemantauan Lingkungan",
  ];

  return (
    <section className="py-16 mt-[72px]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center flex  flex-col items-center">
          <h1 className="text-primary font-bold font-montserrat text-[32px] md:text-[48px] leading-[120%] text-center mb-6 md:max-w-[50%]">
            Hubungi Kami untuk Solusi Lingkungan Anda
          </h1>
          <h3 className="text-primary  text-[16px] md:text-[18px] font-plus-jakarta-sans leading-[150%] text-center md:max-w-[30%]">
            Kami siap mendampingi proyek Anda dengan layanan konsultasi
            lingkungan yang profesional dan terpercaya.
          </h3>
        </div>
        <div className="max-w-3xl mx-auto">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                  Nama Depan <span className="text-red-500">*</span>
                </h3>
                <Input
                  type="text"
                  placeholder="Nama Depan"
                  required
                  className="bg-white py-2 font-plus-jakarta-sans"
                />
              </div>
              <div>
                <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                  Nama Belakang <span className="text-red-500">*</span>
                </h3>
                <Input
                  type="text"
                  placeholder="Nama Belakang"
                  required
                  className="bg-white py-2 font-plus-jakarta-sans"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                  Email <span className="text-red-500">*</span>
                </h3>
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-white py-2 font-plus-jakarta-sans"
                />
              </div>
              <div>
                <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </h3>
                <Input
                  type="tel"
                  placeholder="Nomor WhatsApp"
                  required
                  className="bg-white py-2 font-plus-jakarta-sans"
                />
              </div>
            </div>
            <div className="grid grid-cols-1">
              <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                Pilih Layanan <span className="text-red-500">*</span>
              </h3>
              <select
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-white px-3 py-1 text-base shadow-xs outline-none md:text-sm text-gray-500"
                required
              >
                <option value="">Pilih Layanan</option>
                {layananOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1">
              <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                Pesan Anda <span className="text-red-500">*</span>
              </h3>
              <Textarea
                placeholder="Pesan Anda"
                required
                className="min-h-[150px] bg-white font-plus-jakarta-sans"
              />
            </div>
            <div className="grid grid-cols-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  required
                  id="agreement"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="agreement"
                  className="text-[14px] font-plus-jakarta-sans"
                >
                  Saya menyetujui persyaratan dan ketentuan{" "}
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1">
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors w-fit"
                >
                  Kirim
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SectionHubungiKami;
