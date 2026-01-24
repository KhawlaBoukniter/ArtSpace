import React from "react";
import FadeIn from "../ui/FadeIn";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Art Curator",
        quote:
            "The 3D viewing experience is revolutionary. It's changing how we interact with art in the digital age.",
        image: "/assets/testimonials/avatar.png",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Digital Artist",
        quote:
            "As an artist, this platform gives me new ways to showcase my work to a global audience.",
        image: "/assets/testimonials/avatar.png",
    },
    {
        id: 3,
        name: "Emma Davis",
        role: "Art Collector",
        quote:
            "The detail and quality of the 3D scans are incredible. It's like being in the museum.",
        image: "/assets/testimonials/avatar.png",
    },
];

// const cardVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: (i) => ({
//         opacity: 1,
//         y: 0,
//         transition: {
//             delay: i * 0.2,
//             duration: 0.6,
//             ease: "easeOut",
//         },
//     }),
// };

const Testimonials = () => {
    return (
        <section className="w-full py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-12">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="font-garamond font-normal text-4xl mb-6 text-black leading-9">
                            What Art Lovers Say
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="font-garamond font-normal text-xl text-gray-600 leading-5">
                            Hear from our passionate community of art enthusiasts
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                    {testimonials.map((t, i) => (
                        <FadeIn key={t.id} delay={0.4 * i}>
                            <div className="rounded-xl shadow-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-[0px_15px_20px_#00000030]">
                                <div className="flex items-center space-x-4 mb-4 ">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-playfair text-base text-black font-medium leading-4 mb-2">
                                            {t.name}
                                        </h4>
                                        <p className="font-garamond text-sm text-gray-600">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-garamond italic text-gray-700 text-base leading-relaxed">
                                    "{t.quote}"
                                </p>
                            </div>
                        </FadeIn>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default Testimonials;