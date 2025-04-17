import HeroSlider from "@/components/blog/HeroSlider";
import FeaturedBlogGrid from "@/components/blog/FeaturedBlogGrid";
import CategoryTabs from "@/components/blog/CategoryTabs";
import BlogGrid from "@/components/blog/BlogGrid";
import MostPopularSidebar from "@/components/blog/MostPopularSidebar";
import RecentBlogSection from "@/components/blog/RecentBlogSection";
import LooksSection from "@/components/blog/LooksSection";
import ShopSection from "@/components/blog/ShopSection";
import FavoritesSection from "@/components/blog/FavoritesSection";
import LookAroundSection from "@/components/blog/LookAroundSection";

const BlogHomePage = () => {
  return (
    <div className="bg-[#f5f5f5]">
      <HeroSlider />
      <FeaturedBlogGrid />
      <CategoryTabs />
      <div className="flex gap-8 px-6 max-w-[1440px] mx-auto">
        <div className="w-3/4">
          <BlogGrid />
        </div>
        <div className="w-1/4">
          <MostPopularSidebar />
        </div>
      </div>
      <RecentBlogSection />
      <LooksSection />
      <ShopSection />
      <FavoritesSection />
      <LookAroundSection />
    </div>
  );
};


export default BlogHomePage;