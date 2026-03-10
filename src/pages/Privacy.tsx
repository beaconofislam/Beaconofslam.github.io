import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p>At Beacon of Islam, we respect your privacy and are committed to protecting any personal information you may share with us. This Privacy Policy explains how we collect, use, and safeguard your data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information Collection</h2>
              <p>The website may use cookies to enhance your browsing experience. These cookies help us understand how you interact with our site and allow us to provide a more personalized experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p>We may use third-party services such as Google AdSense to display advertisements. These services may collect anonymous data about your visits to this and other websites in order to provide relevant advertisements about goods and services of interest to you.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Protection</h2>
              <p>User privacy is highly respected. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, so long as those parties agree to keep this information confidential.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Consent</h2>
              <p>By using our site, you consent to our website's privacy policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to our Privacy Policy</h2>
              <p>If we decide to change our privacy policy, we will post those changes on this page.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
