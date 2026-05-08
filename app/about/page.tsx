// app/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Sea Food';
  
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sea Food Team',
      role: 'Founders',
      bio: `Our team has over 15 years of experience in the seafood industry and founded ${storeName} with a vision to provide the freshest, highest-quality seafood directly from the ocean to your table.`,
      image: '/images/m1.png'
    },
    {
      id: 2,
      name: 'Sourcing Experts',
      role: 'Seafood Specialists',
      bio: `Our sourcing experts work directly with the finest fishing communities to ensure we get the highest quality catch - fresh fish, prawns, crabs, and more, delivered daily.`,
      image: '/images/m1.png'
    },
    {
      id: 3,
      name: 'Quality Team',
      role: 'Freshness Assurance',
      bio: 'Our quality team ensures every seafood item meets the highest standards of freshness, sustainability, and safety through rigorous temperature control and careful handling.',
      image: '/images/m1.png'
    }
  ];

  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Seafood Varieties' },
    { number: '25k+', label: 'Happy Customers' },
    { number: '100%', label: 'Freshness Assured' }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-[#2EC4B6]/20 overflow-x-hidden">
      
      {/* --- Hero Section --- */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#2EC4B6]/20 blur-[80px] md:blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-gradient-to-r from-[#014F56] via-[#014F56] to-[#014F56]/10 blur-[60px] md:blur-[100px]" />
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
              <span className="inline-block py-1.5 px-4 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2EC4B6] bg-white border border-[#2EC4B6]/20 rounded-full shadow-sm">
                 Est. 2010 • Fresh Since Day One
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif font-light mb-6 md:mb-8 tracking-tight leading-tight text-stone-900">
                 Fresh. Sustainable. <br className="hidden md:block"/> <span className="italic font-normal bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#014F56] bg-clip-text text-transparent">Premium Seafood.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-stone-600 leading-relaxed font-light px-4">
                  Dedicated to providing the freshest ocean catches including premium fish, prawns, crabs, lobsters, and more, delivered directly to your doorstep.
              </p>
          </div>
      </section>

      {/* --- Mission Section --- */}
      <section className="py-16 md:py-24 bg-white" aria-label="Our Mission">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
            <div className="relative group w-full lg:w-1/2 order-2 lg:order-1">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-[#2EC4B6]/5 via-[#2EC4B6]/5 to-[#014F56]/5 rounded-2xl md:rounded-3xl rotate-3 transition-transform group-hover:rotate-1 duration-500" />
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-stone-200/50">
                  <Image
                  src="/images/about.jpg"
                  alt="Fresh Premium Seafood - Fish, Prawns, Crabs, Lobsters"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  />
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg md:shadow-xl hidden md:block border border-stone-100">
                  <p className="text-[#2EC4B6] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Guaranteed</p>
                  <p className="text-stone-900 font-serif text-lg md:text-xl italic">100% Fresh</p>
              </div>
            </div>
            
            <div className="space-y-8 md:space-y-10 w-full lg:w-1/2 order-1 lg:order-2">
              <div className="space-y-3 md:space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900">Our Philosophy</h2>
                  <div className="w-12 md:w-16 h-1 md:h-1.5 bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#014F56] rounded-full" />
              </div>
              
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-stone-600 leading-relaxed">
                  <p>
                      Our mission is to make premium, sustainable seafood accessible to every home. We believe in the power of fresh, high-quality seafood to bring families together and create memorable dining experiences.
                  </p>
                  <p className="font-light">
                      We work directly with local fishing communities and sustainable fisheries, ensuring every catch meets the highest standards of freshness, quality, and environmental responsibility.
                  </p>
              </div>

              <div className="p-6 md:p-8 bg-gradient-to-r from-[#2EC4B6]/5 via-[#2EC4B6]/5 to-[#014F56]/5 rounded-xl md:rounded-2xl border-l-4 md:border-l-8 border-[#2EC4B6] italic text-lg md:text-xl text-stone-700 font-serif leading-relaxed shadow-sm">
                Fresh seafood brings ocean goodness to your table, every single day.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-16 md:py-24 bg-[#014F56] text-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-2 md:mb-3 text-white group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80 font-bold px-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </section>

      {/* --- Team Section --- */}
      <section className="py-16 md:py-32 bg-[#fafaf9]" aria-label="Our Team">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900">Meet The Team</h2>
            <div className="w-10 md:w-12 h-1 bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#014F56]/30 mx-auto" />
            <p className="text-stone-500 text-base md:text-lg font-light tracking-wide">
              The passionate seafood experts behind {storeName}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] border border-stone-200 transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-4 shadow-sm hover:shadow-xl md:hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-[#2EC4B6]/5 via-[#2EC4B6]/5 to-[#014F56]/5 rounded-full transition-transform group-hover:scale-[2] md:group-hover:scale-[3] duration-700" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-28 md:h-28 mb-6 md:mb-8 relative rounded-xl md:rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 ring-2 md:ring-4 ring-stone-50 rotate-3 group-hover:rotate-0 shadow-md md:shadow-lg">
                      <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 112px"
                      />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-serif text-stone-900 mb-1">{member.name}</h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#2EC4B6] uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6">{member.role}</p>
                  <p className="text-sm md:text-base text-stone-600 leading-relaxed font-light">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Elevated CTA Section --- */}
      <section className="py-12 md:py-24 container mx-auto px-4 md:px-6">
        <div className="relative bg-[#1c1917] rounded-2xl md:rounded-[3.5rem] overflow-hidden group">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center">
            <div className="p-8 md:p-12 lg:p-24 space-y-6 md:space-y-10 text-left w-full lg:w-1/2">
              <div className="space-y-3 md:space-y-4">
                <span className="text-[#2EC4B6] text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase">
                  Experience Freshness
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-serif text-white leading-snug md:leading-[1.1]">
                  Discover the taste of <span className="italic bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#014F56] bg-clip-text text-transparent">premium fresh seafood</span> from Sea Food
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center">
                <Link 
                  href="/products" 
                  className="bg-[#2EC4B6] text-[#014F56] px-6 py-3 md:px-10 md:py-5 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-[#E9F5F5] transition-all hover:-translate-y-1 shadow-xl md:shadow-2xl inline-block text-center"
                >
                  Shop Fresh Seafood
                </Link>

                <button className="text-white/60 hover:text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group/link">
                  Our Sourcing Process 
                  <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </div>
            
            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-full lg:min-h-[400px] w-full lg:w-1/2 overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#2EC4B6]/50 to-transparent z-10" />
              <Image
                src="/images/about1.jpg"
                alt="Fresh Premium Seafood - Fish, Prawns, Crabs, Lobsters"
                fill
                className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
              />
              <div className="">
                <p className="text-white text-[7px] md:text-[8px] font-bold uppercase tracking-tighter">
                  Fresh <br/> Ocean <br/> Catch
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#014F56]/20 blur-[60px] md:blur-[100px] rounded-full" />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;