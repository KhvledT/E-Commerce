import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-20 sm:py-32 lg:py-40 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
          Welcome to TechMart
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Discover the latest technology, fashion, and lifestyle products.
          Quality guaranteed with fast shipping and excellent customer service.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 ">
            <Link href={"/products"} className="text-base sm:text-lg px-6 sm:px-8  sm:w-auto bg-black text-white py-2  rounded-lg shadow-lg hover:shadow-xl font-semibold transition-all duration-300">Shop Now</Link>

            <Link href={"/categories"} className="text-base sm:text-lg px-6 sm:px-8  sm:w-auto bg-white text-black py-2  rounded-lg border border-black-500 font-semibold transition-all duration-300">Browse Categories</Link>

        </div>
      </div>
    </div>
  );
}
