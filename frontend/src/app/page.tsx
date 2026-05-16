import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import TrendingStays from "@/components/TrendingStays";
import FlightDeals from "@/components/FlightDeals";
import TrainRoutes from "@/components/TrainRoutes";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedDestinations />
      <TrendingStays />
      <FlightDeals />
      <TrainRoutes />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}
