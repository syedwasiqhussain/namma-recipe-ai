import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DoorAnimationProps {
  children: React.ReactNode;
}

const DoorAnimation: React.FC<DoorAnimationProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const leftDoorVariants = {
    closed: { x: 0 },
    open: { x: "-100%", transition: { duration: 1, ease: "easeInOut" } }
  };

  const rightDoorVariants = {
    closed: { x: 0 },
    open: { x: "100%", transition: { duration: 1, ease: "easeInOut" } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main content */}
      <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
      
      {/* Door animation overlay */}
      <motion.div 
        className="fixed inset-0 z-[100] flex pointer-events-none"
        animate={isOpen ? "open" : "closed"}
        initial="closed"
      >
        {/* Left door */}
        <motion.div 
          className="w-1/2 h-full bg-accent"
          variants={leftDoorVariants}
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-white text-4xl font-bold">Namma</div>
          </div>
        </motion.div>
        
        {/* Right door */}
        <motion.div 
          className="w-1/2 h-full bg-primary"
          variants={rightDoorVariants}
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-white text-4xl font-bold">Recipe</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoorAnimation;