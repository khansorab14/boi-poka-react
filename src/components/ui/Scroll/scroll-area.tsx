// src/components/ui/scroll-area.tsx
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export const ScrollArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollAreaPrimitive.Root className="w-full h-full overflow-hidden">
      <ScrollAreaPrimitive.Viewport className="w-full h-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
      <ScrollAreaPrimitive.Scrollbar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};
