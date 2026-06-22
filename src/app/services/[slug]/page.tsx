import { notFound } from "next/navigation";
import { services } from "@/data/services";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// For static site generation
export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <div className="pt-24 pb-0 bg-white dark:bg-[#050b14] transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50/50 via-white to-white dark:from-primary-900/20 dark:via-[#050b14] dark:to-[#050b14] -z-10" />
        
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-8 shadow-sm border border-primary-100 dark:border-primary-800">
              <Icon size={40} />
            </div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Our Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {service.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-6 max-w-3xl mx-auto leading-relaxed">
              {service.description}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto">
              {service.longDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/clients" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full transition-all shadow-lg hover:shadow-primary-600/25 dark:hover:shadow-primary-500/25 hover:-translate-y-1">
                Book a Consultation
              </Link>
              <Link href="/methodology" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all hover:-translate-y-1">
                View Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
            
            {/* Features */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">What's Included</h2>
              <ul className="space-y-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4 bg-white dark:bg-[#050b14] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                    <div className="mt-1 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400 shrink-0">
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{feature}</h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why You Need This</h2>
              <div className="bg-white dark:bg-[#050b14] rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />
                <ul className="space-y-6">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-0.5 text-primary-600 dark:text-primary-400 shrink-0">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-[#050b14]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center bg-primary-600 dark:bg-primary-900/40 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden border border-primary-500 dark:border-primary-800 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to scale your {service.title}?
            </h2>
            <p className="text-primary-100 dark:text-primary-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Let's build a customized strategy that drives highly qualified traffic and predictable revenue.
            </p>
            <Link href="/clients" className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold text-white bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-secondary-600/25 relative z-10">
              Get Your Custom Strategy
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
