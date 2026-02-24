"use client";

import { motion } from "framer-motion";
import { Plane, Globe, MountainSnow } from "lucide-react";

export default function AnimatedLogo({ theme = "light" }: { theme?: "light" | "dark" }) {
    const isDark = theme === "dark";
    return (
        <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div
                className="relative flex items-center justify-center w-11 h-11 rounded-[14px] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg overflow-hidden shrink-0 border border-emerald-300/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay"
                >
                    <Globe className="w-14 h-14 text-white" />
                </motion.div>

                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 6 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                    className="absolute"
                >
                    <MountainSnow className="w-8 h-8 text-emerald-50 stroke-[1.5]" />
                </motion.div>

                <motion.div
                    initial={{ x: -25, y: 25 }}
                    animate={{ x: 4, y: -4 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 12 }}
                    className="absolute drop-shadow-md"
                >
                    <Plane className="w-5 h-5 text-white" fill="white" strokeWidth={1} />
                </motion.div>
            </motion.div>

            <div className="flex flex-col justify-center">
                <span className={`text-[19px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    Outbound <span className="font-light">Travelers</span>
                </span>
                <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`text-[9px] font-bold tracking-widest mt-1 uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                >
                    Make your trips easier.
                </motion.span>
            </div>
        </div>
    );
}
