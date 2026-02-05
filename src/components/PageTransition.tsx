import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

// Settingan Animasi (Bisa diutak-atik isinya)
const animations = {
  initial: { opacity: 0, y: 20, scale: 0.98 }, // Posisi awal (transparan & agak turun)
  animate: { opacity: 1, y: 0, scale: 1 },     // Posisi akhir (muncul normal)
  exit: { opacity: 0, y: -20, scale: 0.98 },   // Saat keluar (hilang ke atas)
};

const PageTransition: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }} // Durasi 0.4 detik
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;