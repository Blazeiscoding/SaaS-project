"use client";
import React from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function Home() {
  const { openSignIn, openSignUp } = useClerk(); // Clerk functions to open sign-in/sign-up modals
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const words = [
    { text: "Get Your" },
    { text: "Next Content Thumbnail" },
    { text: "Perfectly" },
    { text: "with" },
    { text: "iloveImg.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Typewriter and Buttons Section */}
      <div className="flex flex-col items-center space-y-4 py-10">
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
          The road to perfect thumbnail starts here
        </p>
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <button
            onClick={() => openSignIn()}
            className="w-40 h-10 rounded-xl bg-black text-white text-sm"
          >
            Sign up
          </button>
          <button
            onClick={() => openSignUp()}
            className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm"
          >
            Join now
          </button>
        </div>
      </div>

      
      <div className="relative w-full flex justify-center items-center overflow-hidden bg-white dark:bg-black">
        <div className="max-w-7xl w-full relative h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="text-xl md:text-4xl font-bold text-black dark:text-white">
              We want the best thumbnail worldwide
            </h2>
            <p className="text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
              This globe is interactive and customizable. Have fun with it, and
              don&apos;t forget to share it. :)
            </p>
          </motion.div>

         
          <div className="absolute inset-0 w-full h-full z-10">
            <World data={[]} globeConfig={globeConfig} />
          </div>

         
          <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        </div>
      </div>
    </div>
  );
}
