"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.array(z.string()).min(1, "Please select at least one service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const servicesList = [
  { id: "seo", label: "SEO" },
  { id: "performance", label: "Performance Marketing" },
  { id: "social", label: "Social Media Marketing" },
  { id: "branding", label: "Branding" },
  { id: "web", label: "Website Development" },
  { id: "content", label: "Content Marketing" },
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { service: [] }
  });

  const selectedServices = watch("service") || [];

  const toggleService = (label: string) => {
    if (selectedServices.includes(label)) {
      setValue("service", selectedServices.filter(s => s !== label), { shouldValidate: true });
    } else {
      setValue("service", [...selectedServices, label], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { submitContactForm } = await import("@/app/actions/contact");
      
      const result = await submitContactForm(data);
      
      if (result.success) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(result.error || "Failed to submit form");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError: boolean) => 
    `w-full px-4 py-3 rounded-xl border ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"} bg-transparent dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`;

  return (
    <motion.div 
      initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
      className="bg-white dark:bg-gray-950 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>
      
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-900/50">
          Thank you! Your message has been sent successfully. We'll be in touch soon.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              id="fullName"
              {...register("fullName")}
              className={inputClasses(!!errors.fullName)}
              placeholder="Rahul Sharma"
            />
            {errors.fullName && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
            <input
              id="company"
              {...register("company")}
              className={inputClasses(!!errors.company)}
              placeholder="Reliance Industries"
            />
            {errors.company && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.company.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={inputClasses(!!errors.email)}
              placeholder="rahul@example.com"
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              id="phone"
              {...register("phone")}
              className={inputClasses(!!errors.phone)}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Services Required <span className="text-gray-400 font-normal ml-1">(Select multiple)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {servicesList.map((srv) => {
              const isSelected = selectedServices.includes(srv.label);
              return (
                <div 
                  key={srv.id} 
                  onClick={() => toggleService(srv.label)}
                  className={`
                    relative cursor-pointer group w-full h-full px-4 py-3 rounded-xl border flex items-center justify-between gap-2
                    transition-all duration-200 ease-in-out select-none
                    ${!!errors.service ? 'border-red-500' : isSelected ? 'border-primary-600 dark:border-primary-500' : 'border-gray-200 dark:border-gray-800'}
                    ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700'}
                  `}
                >
                  <span className="text-sm font-semibold leading-tight">{srv.label}</span>
                  <div className={`w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-colors
                    ${isSelected ? 'border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500' : 'border-gray-300 dark:border-gray-700'}
                  `}>
                    <svg className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.service && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.service.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            id="message"
            {...register("message")}
            rows={4}
            className={`${inputClasses(!!errors.message)} resize-none`}
            placeholder="Tell us about your project..."
          />
          {errors.message && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 text-white bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg hover:shadow-secondary-600/25 dark:hover:shadow-secondary-500/25"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </motion.div>
  );
}
