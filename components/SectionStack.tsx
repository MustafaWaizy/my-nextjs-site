"use client";

import SectionDivider from "./SectionDivider";

interface SectionStackProps {
  children: React.ReactNode[];
  dividerVariant?: "wave" | "pulse" | "circuit" | "dots" | "random";
  autoCycle?: boolean;       // pass to dividers
  cycleInterval?: number;    // pass to dividers
}

export default function SectionStack({
  children,
  dividerVariant = "random",
  autoCycle = false,
  cycleInterval = 5000,
}: SectionStackProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div>
      {items.map((child, index) => (
        <div key={index}>
          {child}
          {index < items.length - 1 && (
            <SectionDivider
              variant={dividerVariant}
              autoCycle={autoCycle}
              cycleInterval={cycleInterval}
            />
          )}
        </div>
      ))}
    </div>
  );
}
