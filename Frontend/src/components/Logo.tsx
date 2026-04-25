import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', hideText = false }) => {
  const sizes = {
    sm: { box: 'w-6 h-6', text: 'text-lg', dot: 'w-1 h-1', particle: 'w-0.5 h-0.5' },
    md: { box: 'w-8 h-8', text: 'text-xl', dot: 'w-1.5 h-1.5', particle: 'w-1 h-1' },
    lg: { box: 'w-12 h-12', text: 'text-3xl', dot: 'w-2 h-2', particle: 'w-1.5 h-1.5' }
  };

  const current = sizes[size];

  return (
    <motion.div 
      whileHover="hover"
      className={`flex items-center gap-3 cursor-default group ${className}`}
    >
      <div className={`${current.box} relative flex items-center justify-center`}>
        {/* Outer Orbiting Ring */}
        <motion.div 
          variants={{
            hover: { rotate: 180, scale: 1.1 }
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-[var(--color-primary)]/40 rounded-[10px]"
        />
        
        {/* Squared Orbit */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15%] border border-[var(--color-secondary)]/30 rounded-sm"
        />

        {/* Inner Circle / Zero */}
        <motion.div 
          variants={{
            hover: { scale: 1.2, borderColor: 'var(--color-primary)' }
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-1.5 border-2 border-[var(--color-secondary)] rounded-full flex items-center justify-center"
        >
           {/* Central Core */}
           <motion.div 
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className={`${current.dot} bg-[var(--color-primary)] rounded-full shadow-[0_0_12px_var(--color-primary)]`} 
           />
        </motion.div>

        {/* Orbiting Particle */}
        <motion.div
          animate={{ 
            rotate: 360,
            x: [0, 10, 0, -10, 0],
            y: [10, 0, -10, 0, 10]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`absolute ${current.particle} bg-[var(--color-secondary)] rounded-full blur-[1px]`}
        />
      </div>
      
      {!hideText && (
        <motion.span 
          variants={{
            hover: { x: 2 }
          }}
          className={`${current.text} font-display font-bold tracking-tight text-[var(--text-primary)]`}
        >
          Lab<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Zero</span>
        </motion.span>
      )}
    </motion.div>
  );
};
