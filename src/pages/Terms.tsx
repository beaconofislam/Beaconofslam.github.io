import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Beacon of Islam, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Educational Purpose</h2>
              <p>All content provided on this website is for educational and informational purposes only. While we strive for authenticity, users are encouraged to verify information with qualified scholars.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Use of Resources</h2>
              <p>Resources provided on this website, including videos, animations, and PDFs, are for personal, non-commercial use only. Redistribution or commercial use without explicit permission is prohibited.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Islamic Values</h2>
              <p>Users must respect Islamic values when interacting with the website and its community. Any form of hate speech, disrespect, or inappropriate behavior will result in a ban from our platforms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Updates to Terms</h2>
              <p>The website owner reserves the right to update or change these terms at any time without prior notice. Your continued use of the site after any changes indicates your acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p>Beacon of Islam shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the website or its content.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
