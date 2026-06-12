"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const stats = [
  { id: 1, label: "Clients", value: 100, suffix: "+" },
  { id: 2, label: "Projects", value: 250, suffix: "+" },
  { id: 3, label: "Client Satisfaction", value: 95, suffix: "%" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-5xl md:text-7xl font-bold text-white mb-2">
      {count}{suffix}
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-12 md:py-16 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Why leading brands choose Trisage
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed mb-8">
              We don't guess. We test, measure, and optimize. Our data-driven approach ensures every marketing dollar you spend is an investment towards scalable growth. We pride ourselves on transparency, relentless execution, and delivering measurable ROI.
            </p>
            <ul className="space-y-4">
              {[
                "Data-driven strategies tailored to your goals",
                "Transparent reporting and real-time analytics",
                "Award-winning design and development team",
                "Proven track record across multiple industries"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-primary-50">
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm ${
                  index === 2 ? "sm:col-span-2 text-center" : ""
                }`}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-primary-200 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
