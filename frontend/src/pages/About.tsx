import { motion } from 'framer-motion';
import { BookOpenIcon, UsersIcon, ShieldIcon, HeartIcon } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function About() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            About EchoInk
          </h1>
          <p className="text-xl text-[--muted] max-w-2xl mx-auto">
            A platform where ideas resonate and stories come alive.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: BookOpenIcon,
              title: "Share Your Story",
              description: "Express yourself through writing and connect with readers worldwide."
            },
            {
              icon: UsersIcon,
              title: "Vibrant Community",
              description: "Join a community of passionate writers and engaged readers."
            },
            {
              icon: ShieldIcon,
              title: "Safe Space",
              description: "A protected environment for sharing ideas and perspectives."
            },
            {
              icon: HeartIcon,
              title: "Built with Love",
              description: "Crafted with care to provide the best writing experience."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[--card] border border-[--border] hover:scale-105 transition-transform"
            >
              <feature.icon className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[--foreground]">{feature.title}</h3>
              <p className="text-[--muted]">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-[--foreground]">Our Mission</h2>
          <p className="text-lg text-[--muted] max-w-2xl mx-auto">
            To create a space where every voice matters and every story finds its audience. 
            We believe in the power of written words to connect, inspire, and transform.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
} 