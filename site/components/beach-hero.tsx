interface BeachHeroProps {
  name: string;
  location: string;
  imageUrl?: string;
}

export default function BeachHero({ name, location, imageUrl }: BeachHeroProps) {
  return (
    <div className="relative h-72 sm:h-96 overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-800 via-ocean-600 to-reef-600" />
      )}
      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">
            {location}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white">
            {name}
          </h1>
        </div>
      </div>
    </div>
  );
}
