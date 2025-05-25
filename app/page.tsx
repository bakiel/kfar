import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/ui/HeroSection';
import VillageEnterprises from '@/components/business/VillageEnterprises';
import StatsSection from '@/components/ui/StatsSection';
import FeaturedProducts from '@/components/ui/FeaturedProducts';
import ReviewsSection from '@/components/ui/ReviewsSection';
import CommunityServices from '@/components/ui/CommunityServices';

export default function Home() {
  return (
    <Layout>
      <main className="min-h-screen">
        <HeroSection />
        <CommunityServices />
        <VillageEnterprises />
        <StatsSection />
        <FeaturedProducts />
        <ReviewsSection />
      </main>
    </Layout>
  );
}
