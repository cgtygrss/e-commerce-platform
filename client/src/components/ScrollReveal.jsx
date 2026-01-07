import React from 'react';
import { motion } from 'framer-motion';

const animationVariants = {
    fadeUp: {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
        hidden: { opacity: 0, y: -60 },
        visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 },
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    },
    rotate: {
        hidden: { opacity: 0, rotate: -10, scale: 0.9 },
        visible: { opacity: 1, rotate: 0, scale: 1 },
    },
};

const ScrollReveal = ({ 
    children, 
    width = "fit-content", 
    delay = 0, 
    duration = 0.6,
    animation = "fadeUp",
    className = ""
}) => {
    const variants = animationVariants[animation] || animationVariants.fadeUp;
    
    return (
        <div style={{ position: "relative", width, overflow: "hidden" }} className={className}>
            <motion.div
                variants={variants}
                initial="hidden"
                whileInView="visible"
                transition={{ 
                    duration: duration, 
                    delay: delay,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ScrollReveal;
