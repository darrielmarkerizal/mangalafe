"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const SectionHubungiKami = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "",
    serviceId: "",
    message: "",
    agreement: false,
  });
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, threshold: 0.1 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/service");
        if (response.data.success) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Gagal memuat daftar layanan");
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.agreement) {
        toast.error("Anda harus menyetujui persyaratan dan ketentuan");
        setIsLoading(false);
        return;
      }

      const response = await axios.post("/api/contact", {
        ...formData,
        serviceId: parseInt(formData.serviceId),
      });

      if (response.data.success) {
        toast.success("Pesan berhasil dikirim", {
          description: "Kami akan segera menghubungi Anda",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          whatsapp: "",
          serviceId: "",
          message: "",
          agreement: false,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim pesan";
      toast.error("Gagal mengirim pesan", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-16 mt-[72px]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12 text-center flex flex-col items-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-primary font-bold font-montserrat text-[32px] md:text-[48px] leading-[120%] text-center mb-6 md:max-w-[50%]"
            variants={headerVariants}
          >
            Hubungi Kami untuk Solusi Lingkungan Anda
          </motion.h1>
          <motion.h3 
            className="text-primary text-[16px] md:text-[18px] font-plus-jakarta-sans leading-[150%] text-center md:max-w-[30%]"
            variants={headerVariants}
          >
            Kami siap mendampingi proyek Anda dengan layanan konsultasi
            lingkungan yang profesional dan terpercaya.
          </motion.h3>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                  Nama Depan <span className="text-red-500">*</span>
                </h3>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
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
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Nama Belakang"
                  required
                  className="bg-white py-2 font-plus-jakarta-sans"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                  Email <span className="text-red-500">*</span>
                </h3>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Nomor WhatsApp"
                  required
                  className="bg-white py-2 font-plus-jakarta-sans"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1">
              <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                Pilih Layanan <span className="text-red-500">*</span>
              </h3>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-white px-3 py-1 text-base shadow-xs outline-none md:text-sm text-gray-500"
                required
              >
                <option value="">Pilih Layanan</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1">
              <h3 className="text-[14px] mb-1 font-plus-jakarta-sans">
                Pesan Anda <span className="text-red-500">*</span>
              </h3>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Pesan Anda"
                required
                className="min-h-[150px] bg-white font-plus-jakarta-sans"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleInputChange}
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
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1">
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors w-fit flex items-center gap-2 disabled:opacity-70"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Mengirim..." : "Kirim"}
                </motion.button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionHubungiKami;