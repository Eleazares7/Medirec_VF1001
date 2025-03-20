import React from "react";
import { motion } from "framer-motion";

const BackgroundDecorations = () => {
    return (
        <>
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
            />
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,125,128,0.2)_70%)]" />
            </motion.div>
            <motion.svg
                className="absolute top-10 left-10 w-32 h-32 text-teal-600 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <path stroke="currentColor" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
            </motion.svg>
            <motion.svg
                className="absolute bottom-20 right-20 w-40 h-40 text-teal-500 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ y: [-20, 0, -20] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
        </>
    );
};

export default BackgroundDecorations;