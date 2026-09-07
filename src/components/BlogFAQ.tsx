"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  faqs: FAQItem[];
  title?: string;
}

export default function BlogFAQ({ faqs, title = "Frequently Asked Questions" }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  // Generate JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 md:py-16">
      {/* ── SEO JSON-LD Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
        {title}
      </h2>

      <div className="border-t border-gray-200 dark:border-gray-800">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `blog-faq-panel-${index}`;
          const buttonId = `blog-faq-button-${index}`;

          return (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-gray-800 group"
            >
              <h3 className="m-0">
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(index)}
                  className="flex items-center justify-between w-full py-5 md:py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm cursor-pointer"
                >
                  <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 pr-6 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.25, delay: 0.05 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 md:pb-6 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
                      {/* Using dangerouslySetInnerHTML in case the answer contains bolding/links from the rich text editor */}
                      <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
