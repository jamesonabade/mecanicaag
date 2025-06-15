import { Wrench } from 'lucide-react';
import type { SVGProps } from 'react';

// Example of a flat, geometric icon as requested for general iconography.
// Using lucide-react Wrench as a placeholder for a more custom geometric logo if needed.
const GeometricIcon = (props: SVGProps<SVGSVGElement>) => (
  <Wrench className="h-8 w-8 text-primary" {...props} />
);

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GeometricIcon />
      <span className="text-xl font-bold text-primary font-headline">Mecânica Ágil</span>
    </div>
  );
}
