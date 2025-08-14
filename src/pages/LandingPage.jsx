// src/pages/LandingPage.jsx

// 1. Impor 'motion' dari framer-motion
import { motion } from 'framer-motion';
import React from 'react';

// ... (impor komponen lainnya seperti biasa)
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import ContactSection from '../components/ContactSection';

// 2. Buat konfigurasi animasi yang bisa dipakai ulang
const sectionVariants = {
  hidden: { opacity: 0, y: 50 }, // Kondisi awal: tidak terlihat & sedikit di bawah
  visible: { 
    opacity: 1, 
    y: 0, // Kondisi akhir: terlihat & di posisi normal
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
};

function LandingPage() {
  return (
    <>
      {/* HeroSection tidak perlu animasi scroll karena sudah terlihat di awal */}
      <HeroSection />

      {/* 3. Bungkus setiap section dengan motion.div */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Animasi berjalan sekali saat 20% section terlihat
      >
        <AboutSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <FeaturesSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <TestimonialsSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <CTASection />
      </motion.div>
      
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <ContactSection />
      </motion.div>
    </>
  );
}

export default LandingPage;