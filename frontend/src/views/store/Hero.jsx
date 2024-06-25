import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <img
                src="https://plus.unsplash.com/premium_photo-1681487933632-c9eda34fcaf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="slogan-container"
            >
                <h1>
                    Shop Everything <br />
                    Sell Anything <br /> Discover Your Marketplace at Nova!
                </h1>
            </motion.div>
        </section>
    );
};

export default HeroSection;