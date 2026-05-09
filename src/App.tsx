/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Compass, 
  CreditCard, 
  Mail, 
  MousePointer2, 
  Rocket, 
  ShieldCheck, 
} from 'lucide-react';
import { db, handleFirestoreError, OperationType, serverTimestamp, testConnection } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import founderImg from './assets/images/regenerated_image_1778348172002.jpg';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 bg-[#050505]/80 backdrop-blur-md">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-black rotate-45"></div>
      </div>
      <span className="text-xl font-bold tracking-tighter text-[#F5F5F5]">LANCERFLOW</span>
    </div>
    <div className="px-4 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-widest text-white/60">
      Available Fall 2024
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-10 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-8">
      <Icon className="w-5 h-5 text-white/60" />
    </div>
    <h3 className="text-lg font-bold text-white mb-4 tracking-tight uppercase text-[12px] letter tracking-[0.1em]">{title}</h3>
    <p className="text-white/40 leading-relaxed font-light">{description}</p>
  </motion.div>
);

const WaitlistForm = ({ horizontal = false }: { horizontal?: boolean }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const waitlistRef = collection(db, 'waitlist');
      await addDoc(waitlistRef, {
        email,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      try {
        handleFirestoreError(error, OperationType.WRITE, 'waitlist');
      } catch (e) {
        // Suppress re-throw to show local error
      }
    }
  };

  return (
    <div className={`w-full ${horizontal ? 'max-w-2xl' : 'max-w-md'} mx-auto`}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-4 text-center rounded-lg border border-white/20 bg-white/5"
          >
            <div className="flex items-center justify-center gap-3 text-white">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-medium tracking-tight">You're on the list. We'll contact you soon.</span>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className={`flex ${horizontal ? 'flex-row' : 'flex-col'} gap-2`}
          >
            <div className="relative flex-1">
              <input 
                type="email" 
                required
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-lg focus:outline-none focus:border-white/40 text-[#F5F5F5] text-sm transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
            </div>
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-black font-bold px-8 py-4 rounded-lg hover:bg-gray-200 text-[11px] uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Get Early Access</>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <p className="mt-4 text-[10px] text-white/30 uppercase tracking-[0.1em] text-center md:text-left">
        Join 1,200+ creators on the priority waitlist
      </p>
    </div>
  );
};

const DashboardPreview = () => (
  <div className="relative w-full max-w-4xl mx-auto mt-12 md:mt-0" style={{ perspective: '2000px' }}>
    <motion.div 
      initial={{ rotateX: 5, rotateY: -10, y: 50, opacity: 0 }}
      animate={{ rotateX: 2, rotateY: 2, y: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] aspect-[4/3] p-8 md:translate-x-12"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
        <div className="ml-4 h-3 w-32 bg-white/5 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-semibold">Total Revenue</div>
          <div className="text-3xl font-mono text-[#F5F5F5] font-light tracking-tighter">$12,450.00</div>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-semibold">Pending Invoices</div>
          <div className="text-3xl font-mono text-[#F5F5F5] font-light tracking-tighter">04</div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Acme Studio Design', amount: '+$4,200.00', status: 'PAID', color: 'text-green-400', opacity: 'opacity-100' },
          { name: 'Globex Corp Branding', amount: 'PENDING', status: 'INVOICED', color: 'text-yellow-400', opacity: 'opacity-60' },
          { name: 'Stark Industries UI', amount: '$1,850.00', status: 'DRAFT', color: 'text-white/40', opacity: 'opacity-30' },
        ].map((item, i) => (
          <div key={i} className={`h-16 bg-white/5 rounded-xl border border-white/5 flex items-center px-6 justify-between ${item.opacity}`}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center text-[10px] text-white/40 border border-white/5">
                {item.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-sm font-medium text-white/80">{item.name}</div>
            </div>
            <div className={`text-xs font-mono ${item.color} tracking-tight`}>{item.amount}</div>
          </div>
        ))}
      </div>

      {/* Decorative Glow inside dashboard */}
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen pt-40 pb-20 px-12 flex flex-col md:flex-row items-center gap-16 max-w-7xl mx-auto">
          <div className="w-full md:w-1/2 flex flex-col justify-center pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block text-[#D4AF37] text-[10px] font-semibold tracking-[0.3em] uppercase mb-8 border-b border-[#D4AF37]/30 pb-1">
                Validation Phase 01
              </div>
              <h1 className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter mb-10 font-serif">
                Stop losing track of your <span className="italic block mt-2">invoices.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed mb-12 max-w-md">
                The all-in-one dashboard built for independent creators to manage clients, track projects, and get paid faster.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <WaitlistForm horizontal={true} />
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <DashboardPreview />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-40 px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="md:border-r border-white/5">
                <FeatureCard 
                  icon={BarChart3}
                  title="Profit Insights"
                  description="Real-time visibility into your earnings, projections, and expenses. Know exactly where your business stands."
                  delay={0.1}
                />
              </div>
              <div className="md:border-r border-white/5">
                <FeatureCard 
                  icon={ShieldCheck}
                  title="Secure Invoicing"
                  description="Professional invoices sent in seconds. Automated follow-ups ensure you never have to chase a payment again."
                  delay={0.2}
                />
              </div>
              <div>
                <FeatureCard 
                  icon={CreditCard}
                  title="Global Payments"
                  description="Accept payments from anywhere in the world. Seamless integration with the most popular payment gateways."
                  delay={0.3}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="about" className="py-40 px-12 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold">The Manifesto</div>
              <h2 className="text-4xl md:text-6xl font-light font-serif leading-tight">Built for the <span className="italic">Modern Independent.</span></h2>
              <p className="text-xl md:text-2xl text-white/40 leading-relaxed font-light italic">
                "We started LancerFlow because we were tired of juggling spreadsheets and banking apps just to run a simple freelance gig. We're building the tool we wish we had five years ago."
              </p>
              <div className="pt-8">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 mx-auto overflow-hidden">
                   <img src={founderImg} alt="Founder" />
                </div>
                <div className="text-sm font-bold tracking-tighter uppercase">SAMANYA IMMANUEL</div>
                <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Founder, LancerFlow</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-12 border-t border-white/5 text-center bg-white/[0.01]">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-serif font-light mb-12">Join the <span className="italic">Frontier.</span></h2>
              <p className="text-lg text-white/40 mb-16 uppercase tracking-[0.2em] text-[12px] font-bold">Priority access entering closed beta soon.</p>
              <WaitlistForm />
           </div>
        </section>
      </main>

      <footer className="px-12 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-white/30">
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Invoicing</a>
          <a href="#" className="hover:text-white transition-colors">Contracts</a>
          <a href="#" className="hover:text-white transition-colors">Client Portal</a>
        </div>
        <div className="font-medium text-white/20">Built for the Modern Independent &copy; 2026</div>
      </footer>
    </div>
  );
}
