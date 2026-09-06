import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { Craft } from "@/components/home/Craft";
import { Menu } from "@/components/home/Menu";
import { Spotlight } from "@/components/home/Spotlight";
import { Room } from "@/components/home/Room";
import { Visit } from "@/components/home/Visit";

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Craft />
      <Menu />
      <Spotlight />
      <Room />
      <Visit />
    </>
  );
}
