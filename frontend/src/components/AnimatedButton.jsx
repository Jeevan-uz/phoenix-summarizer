// src/components/AnimatedButton.jsx

import React, { useRef, useState, useEffect } from "react";
import { FiZap } from "react-icons/fi"; // A more fitting icon for "summarize"
import { motion } from "framer-motion";

const IDLE_TEXT = "Summarize";
const LOADING_TEXT = "Analyzing...";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "Σ@#$%^*()[]{};:,.?/~";

const AnimatedButton = ({ isLoading, isDisabled }) => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(IDLE_TEXT);

  // This useEffect hook will run whenever the `isLoading` prop changes.
  useEffect(() => {
    if (isLoading) {
      scramble(LOADING_TEXT);
    } else {
      stopScramble();
    }
    // Cleanup function to clear interval on component unmount
    return () => stopScramble();
  }, [isLoading]);

  const scramble = (targetText) => {
    stopScramble(); // Clear any existing interval
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = targetText
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= targetText.length * CYCLES_PER_LETTER) {
        // Once the initial scramble is done, keep it animating
        // by continuously scrambling the full text.
        // You can comment this section out if you want it to stop after one cycle.
        pos = 0; 
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(IDLE_TEXT);
  };

  return (
    <motion.button
      type="submit" // Ensure it works within a form
      disabled={isDisabled}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      className="animated-button"
    >
      <div className="relative z-10 flex items-center gap-2">
        {/* Show a different icon when loading */}
        {isLoading ? <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ display: 'flex' }}
          >
            <FiZap />
          </motion.div> 
          : <FiZap />
        }
        <span>{text}</span>
      </div>
      
      {/* The sweeping gradient effect */}
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="gradient-span"
      />
    </motion.button>
  );
};

export default AnimatedButton;