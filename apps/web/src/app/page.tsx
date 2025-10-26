"use client";

import { Button } from "@/packages/ui/components/button";

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <Button variant={"destructive"}>Click Me</Button>
    </div>
  );
}
