import Cursor from './components/Cursor';
import MetricsBar from './components/MetricsBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Product from './components/Product';
import Infrastructure from './components/Infrastructure';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Cursor />
      <MetricsBar />
      <Navbar />
      <Hero />
      <Services />
      <div className="section-divider" />
      <Product />
      <Infrastructure />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
