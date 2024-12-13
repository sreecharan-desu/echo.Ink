import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { ShieldIcon, LockIcon, EyeIcon, ServerIcon } from 'lucide-react';

export default function Privacy() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-[--muted] text-lg max-w-2xl mx-auto">
            We value your privacy and are committed to protecting your personal information.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Key Privacy Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: ShieldIcon,
                title: "Data Protection",
                description: "Your data is encrypted and securely stored"
              },
              {
                icon: LockIcon,
                title: "Secure Access",
                description: "Industry-standard security measures"
              },
              {
                icon: EyeIcon,
                title: "Transparency",
                description: "Clear information about data usage"
              },
              {
                icon: ServerIcon,
                title: "Data Control",
                description: "You control your data sharing preferences"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-[--card] border border-[--border]"
              >
                <feature.icon className="w-6 h-6 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[--muted]">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8 prose dark:prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-[--muted] leading-relaxed">
                We collect information that you provide directly to us, including your name, 
                email address, and any content you post on EchoInk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-[--muted]">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
              <p className="text-[--muted] leading-relaxed">
                You have the right to access, update, or delete your personal information. 
                You can exercise these rights by contacting us through our support channels.
              </p>
            </section>

            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 