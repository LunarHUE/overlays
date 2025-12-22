"use client";

import { useOverlay } from "@/generated";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { openOverlay } = useOverlay();

  const onClick = () => {
    openOverlay("profile/edit", { name: "John Doe", username: "johndoe@example.com" });
  }

  const onClick2 = () => {
    openOverlay("user/create");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Button onClick={onClick}>Open Profile Edit</Button>
        <Button onClick={onClick2}>Open User Create</Button>
      </main>
    </div>
  );
}
