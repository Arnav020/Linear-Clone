'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0D10] text-[#E3E4E6] font-sans selection:bg-[#5E6AD2]/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0D10]/80 backdrop-blur-md border-b border-white/5 mx-auto flex items-center justify-between px-6 h-16 max-w-[1400px] left-0 right-0">
        <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
                 {/* Linear Logo Icon */}
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#E3E4E6]">
                    <path fillRule="evenodd" clipRule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM19.0069 5.88371C19.3496 5.541 19.3496 4.98539 19.0069 4.64268C18.6642 4.30006 18.1087 4.30006 17.7659 4.64268L5.35732 17.0513C5.0147 17.394 5.0147 17.9497 5.35732 18.2923C5.70003 18.635 6.25555 18.635 6.59827 18.2923L19.0069 5.88371Z" fill="currentColor"/>
                 </svg>
                 <span className="font-medium tracking-tight">Linear</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#878A94]">
                <Link href="#" className="hover:text-[#E3E4E6] transition-colors">Product</Link>
                <Link href="#" className="hover:text-[#E3E4E6] transition-colors">Resources</Link>
                <Link href="#" className="hover:text-[#E3E4E6] transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-[#E3E4E6] transition-colors">Customers</Link>
                <Link href="#" className="hover:text-[#E3E4E6] transition-colors">Now</Link>
                <Link href="#" className="hover:text-[#E3E4E6] transition-colors">Contact</Link>
            </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-[#E3E4E6] hover:text-white transition-colors">Log in</Link>
            <Link href="/login" className="bg-[#E3E4E6] text-black px-4 py-1.5 rounded-full hover:bg-white transition-colors font-semibold">Sign up</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-32 px-4 text-center overflow-x-hidden">
         
         {/* Hero Section */}
         <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight leading-[1] md:leading-[1.1] mb-8 bg-gradient-to-b from-[#E3E4E6] to-[#7C7F88] bg-clip-text text-transparent pb-2">
                Linear is a purpose-built tool for planning and building products
            </h1>
            
            <p className="text-lg md:text-xl text-[#878A94] max-w-2xl mb-10 leading-relaxed">
                Meet the system for modern software development.<br className="hidden md:block"/> Streamline issues, projects, and product roadmaps.
            </p>

            <div className="flex items-center gap-4 mb-20">
                <Link href="/login" className="bg-[#E3E4E6] text-black px-8 py-3.5 rounded-full hover:bg-white transition-all transform hover:scale-105 font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Start building
                </Link>
                <div className="flex items-center gap-1 text-[#878A94] text-sm group cursor-pointer hover:text-[#E3E4E6] transition-colors">
                    <span className="font-semibold text-[#E3E4E6]">New:</span> Linear agent for Slack <span className="group-hover:translate-x-0.5 transition-transform">›</span>
                </div>
            </div>

            {/* Hero Image Mockup */}
            <div className="relative w-full max-w-[1200px] aspect-[16/10] bg-[#16181D] rounded-xl border border-[#2A2D35] shadow-[0_-20px_80px_-20px_rgba(94,106,210,0.2)] overflow-hidden group">
                {/* Fake Browser Chrome */}
                <div className="h-8 bg-[#1A1C23] border-b border-[#2A2D35] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-50"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-50"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-50"></div>
                </div>
                
                {/* Content Placeholder (mimicking the app interface) */}
                <div className="grid grid-cols-[240px_1fr] h-full">
                    {/* Fake Sidebar */}
                    <div className="border-r border-[#2A2D35] p-4 flex flex-col gap-4">
                       <div className="h-6 w-32 bg-[#2A2D35] rounded animate-pulse"></div>
                       <div className="space-y-2">
                          <div className="h-4 w-full bg-[#2A2D35]/50 rounded animate-pulse"></div>
                          <div className="h-4 w-3/4 bg-[#2A2D35]/50 rounded animate-pulse"></div>
                          <div className="h-4 w-5/6 bg-[#2A2D35]/50 rounded animate-pulse"></div>
                       </div>
                    </div>
                    {/* Fake Main Area */}
                    <div className="p-8">
                       <div className="h-8 w-64 bg-[#2A2D35] rounded mb-8 animate-pulse"></div>
                       <div className="space-y-4">
                           {[1,2,3,4,5].map((i) => (
                               <div key={i} className="h-12 w-full border border-[#2A2D35] rounded-lg flex items-center px-4 gap-4">
                                   <div className="w-4 h-4 rounded border border-[#2A2D35]"></div>
                                   <div className="h-2 w-16 bg-[#2A2D35] rounded"></div>
                                   <div className="h-2 w-full bg-[#2A2D35]/30 rounded"></div>
                               </div>
                           ))}
                       </div>
                    </div>
                </div>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5E6AD2]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
         </div>

         {/* Logos Section */}
         <div className="mt-32 w-full max-w-6xl text-center pb-20 border-b border-white/5">
            <p className="text-xl font-medium mb-2">Powering the world’s best product teams.</p>
            <p className="text-[#878A94] mb-12">From next-gen startups to established enterprises.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for logos (Text for now to avoid external images breaking if not available) */}
               <span className="text-2xl font-bold font-sans tracking-tighter">OpenAI</span>
               <span className="text-2xl font-bold font-serif italic">Cash App</span>
               <span className="text-2xl font-bold font-mono">scale</span>
               <span className="text-2xl font-bold font-sans">ramp</span>
               <span className="text-2xl font-bold tracking-widest uppercase">Vercel</span>
               <span className="text-2xl font-bold font-sans text-blue-500">coinbase</span>
               <span className="text-2xl font-bold font-mono">BOOM</span>
               <span className="text-2xl font-bold font-sans tracking-tight">CURSOR</span>
            </div>
         </div>
         
         {/* Feature Grid (Optional, simple version) */}
         <div className="py-32 w-full max-w-6xl grid md:grid-cols-3 gap-8">
             <div className="p-8 rounded-2xl bg-[#16181D] border border-[#2A2D35]">
                 <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                 </div>
                 <h3 className="text-xl font-medium mb-2">Built for speed</h3>
                 <p className="text-[#878A94]">Synchronize in real-time across all your devices and teams.</p>
             </div>
             <div className="p-8 rounded-2xl bg-[#16181D] border border-[#2A2D35]">
                 <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                 </div>
                 <h3 className="text-xl font-medium mb-2">Keyboard first</h3>
                 <p className="text-[#878A94]">Fly through your tasks with rapid-fire keyboard shortcuts.</p>
             </div>
             <div className="p-8 rounded-2xl bg-[#16181D] border border-[#2A2D35]">
                 <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                 </div>
                 <h3 className="text-xl font-medium mb-2">Linear Method</h3>
                 <p className="text-[#878A94]">Opinionated software that helps your team build better products.</p>
             </div>
         </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#2A2D35] py-16 px-6 bg-[#0B0D10]">
           <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 text-sm">
               <div className="col-span-2">
                   <div className="flex items-center gap-2 mb-4 text-[#E3E4E6]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#E3E4E6]">
                            <path fillRule="evenodd" clipRule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM19.0069 5.88371C19.3496 5.541 19.3496 4.98539 19.0069 4.64268C18.6642 4.30006 18.1087 4.30006 17.7659 4.64268L5.35732 17.0513C5.0147 17.394 5.0147 17.9497 5.35732 18.2923C5.70003 18.635 6.25555 18.635 6.59827 18.2923L19.0069 5.88371Z" fill="currentColor"/>
                        </svg>
                        <span className="font-semibold">Linear</span>
                   </div>
               </div>
               
               <div className="flex flex-col gap-3">
                   <h4 className="font-semibold text-[#E3E4E6]">Product</h4>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Features</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Integrations</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Pricing</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Changelog</Link>
               </div>
               
               <div className="flex flex-col gap-3">
                   <h4 className="font-semibold text-[#E3E4E6]">Company</h4>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">About</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Blog</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Careers</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Customers</Link>
               </div>
               
               <div className="flex flex-col gap-3">
                   <h4 className="font-semibold text-[#E3E4E6]">Resources</h4>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Community</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Contact</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">DPA</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Privacy</Link>
               </div>
               
               <div className="flex flex-col gap-3">
                   <h4 className="font-semibold text-[#E3E4E6]">Developers</h4>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">API</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">Status</Link>
                   <Link href="#" className="text-[#878A94] hover:text-[#E3E4E6]">GitHub</Link>
               </div>
           </div>
      </footer>
    </div>
  );
}
