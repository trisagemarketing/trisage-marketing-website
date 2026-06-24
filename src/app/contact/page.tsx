import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Trisage Marketing",
  description: "Get in touch with Trisage Marketing to start scaling your business today.",
};

export default function ContactPage() {
  return (
    <>
      <div className="pt-32 pb-16 bg-gradient-to-b from-primary-50/50 dark:from-gray-900 to-white dark:to-gray-950 ">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Let's Talk Growth</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Ready to take your digital presence to the next level? Reach out to our team of experts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                    <a href="mailto:Admin@trisagemarketing.com" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Admin@trisagemarketing.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h4>
                    <a href="tel:+919217900934" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">+91 92179 00934</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Office</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Basement, Office No.4,<br/>
                      SSBK & ASSOCIATES, B-11, Block B,<br/>
                      Sector 4, Noida, Uttar Pradesh - 201301
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <FAQ />
    </>
  );
}
