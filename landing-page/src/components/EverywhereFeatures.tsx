export function EverywhereFeatures() {
  const cards = [
    {
      num: "01",
      title: "Content creators",
      desc: "Amplify your blog posts, articles, and newsletters by letting your audience share them easily.",
      color: "bg-[#00C853]",
      textColor: "text-black",
    },
    {
      num: "02",
      title: "E-commerce sites",
      desc: "Drive more traffic and sales by making your products shareable to social media platforms.",
      color: "bg-[#FFCC00]",
      textColor: "text-black",
    },
    {
      num: "03",
      title: "Portfolio platforms",
      desc: "Let clients and recruiters easily share your work and projects with their networks.",
      color: "bg-white dark:bg-neutral-900",
      textColor: "text-black dark:text-white",
    },
    {
      num: "04",
      title: "News portals",
      desc: "Enable rapid distribution of breaking news and important stories across any network.",
      color: "bg-[#FFCC00]",
      textColor: "text-black",
    },
    {
      num: "05",
      title: "Web apps",
      desc: "Add shareable achievements, results, or dashboards to your SaaS or web application.",
      color: "bg-[#00C853]",
      textColor: "text-black",
    },
  ];

  return (
    <div className="py-24 bg-background border-t-2 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <span className="text-xs font-bold tracking-widest text-[#FFCC00] uppercase mb-4 block">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-balance">
            Wherever content<br />gets <span className="underline decoration-[#FFCC00] decoration-4 underline-offset-8">shared.</span>
          </h2>
        </div>

        <div className="flex gap-6 md:gap-8 overflow-x-auto pb-12 pt-4 snap-x hide-scrollbar">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className={`snap-center shrink-0 w-[300px] md:w-[350px] lg:w-[400px] rounded-[32px] p-8 md:p-10 relative flex flex-col transition-transform hover:-translate-y-2 border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] ${card.color} ${card.textColor} aspect-square`}
            >
              <span className={`text-6xl md:text-7xl font-serif opacity-30 absolute top-6 right-8 font-bold ${card.textColor}`}>
                {card.num}
              </span>
              
              <div className="mt-auto pt-12">
                <h3 className="text-xl md:text-2xl font-bold mb-4 pr-4">{card.title}</h3>
                <p className={`text-[14px] md:text-[15px] opacity-90 leading-relaxed font-semibold mb-8`}>
                  {card.desc}
                </p>
                
                <div>
                  <span className="text-sm font-bold px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-sm hover:opacity-80 transition cursor-pointer">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
