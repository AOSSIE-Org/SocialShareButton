export function Stats() {
  const stats = [
    { value: "<10 KB", label: "gzipped" },
    { value: "7", label: "NETWORKS" },
    { value: "0", label: "DEPENDENCIES" },
    { value: "4", label: "FRAMEWORKS" },
  ];

  return (
    <div className="border-y-2 border-black bg-[#FFCC00] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-black md:divide-x-2 divide-black">
          {stats.map((stat, i) => (
            <div key={i} className="py-8 text-center flex flex-col items-center justify-center">
              <span className="text-3xl font-serif font-bold mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
