interface BeachHeroProps {
  name: string;
  location: string;
  imageUrl?: string;
}

export default function BeachHero({ name, location, imageUrl }: BeachHeroProps) {
  return (
    <div className="relative h-64 sm:h-80 bg-gray-300">
      {imageUrl && (
        <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{name}</h1>
        <p className="text-lg text-white/80 mt-1">{location}</p>
      </div>
    </div>
  );
}
