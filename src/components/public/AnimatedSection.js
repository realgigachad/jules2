/**
 * @fileoverview This file defines the AnimatedSection component, a wrapper that
 * animates its children as they scroll into view, but only if the 'playful'
 * theme is active.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppearance } from '@/components/admin/AppearanceSettings';

/**
 * A reusable component that wraps its children in a motion.div to animate them
 * as they scroll into view, but only for the 'playful' theme.
 * @param {{children: React.ReactNode}} props - The component props.
 * @returns {JSX.Element} The animated section or a simple div.
 */
export default function AnimatedSection({ children }) {
  const { publicAppearance } = useAppearance();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  if (publicAppearance !== 'playful') {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
