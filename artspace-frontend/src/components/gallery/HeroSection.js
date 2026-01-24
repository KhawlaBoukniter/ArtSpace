import React from "react";
import FadeIn from "../ui/FadeIn";

const HeroSection = () => {

    return (
        <div className="mx-auto text-center mt-14">
            <FadeIn>
                <h1 className="font-playfair font-normal text-black text-7xl leading-loose mb-8">
                    Art Gallery
                </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
                <p className="mx-auto w-10/12 font-playfair font-normal text-gray-600 text-lg leading-7">
                    Discover our extensive collection of masterpieces spanning centuries
                    of artistic excellence.
                </p>
            </FadeIn>
        </div>
    );
};

export default HeroSection;