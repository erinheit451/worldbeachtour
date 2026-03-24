import {
  Plane,
  Waves,
  Leaf,
  Users,
  Camera,
  Anchor,
  Scroll,
  Mountain,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  plane: Plane,
  waves: Waves,
  leaf: Leaf,
  users: Users,
  camera: Camera,
  anchor: Anchor,
  scroll: Scroll,
  mountain: Mountain,
};

export default function LensIcon({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
