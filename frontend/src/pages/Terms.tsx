import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

export default function Terms() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose dark:prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-[--muted] leading-relaxed">
                By accessing and using EchoInk, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-[--muted]">
                <li>You must be at least 13 years old to use EchoInk</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You agree not to share harmful or inappropriate content</li>
                <li>You retain ownership of your content while granting us license to display it</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
              <p className="text-[--muted] leading-relaxed">
                All content must comply with our community guidelines. We reserve the right to remove 
                content that violates these guidelines or terms of service.
              </p>
            </section>

            {/* Add more sections as needed */}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
} 