import { Layout } from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 min-h-[60vh]">
        <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 shadow-elegant">
          <div className="text-center mb-6">
            <span className="font-serif text-4xl font-bold text-primary">MF</span>
            <h1 className="font-serif text-2xl mt-4">About Mumu Fashion</h1>
            <p className="text-muted-foreground mt-2">Quality, style and local flair — handpicked for you.</p>
          </div>

          <div className="prose max-w-none text-foreground">
            <p>
              Mumu Fashion is a small, curated shop dedicated to bringing you stylish,
              comfortable, and timeless pieces. We focus on craftsmanship, responsible
              sourcing, and great customer service. Whether you're shopping for everyday
              essentials or something special, our collection is chosen with care.
            </p>

            <h3>Our Promise</h3>
            <p>
              We strive to provide clear product information, fast shipping, and a
              friendly returns policy. If you have questions about sizing or
              availability, our team is happy to help.
            </p>

            <h3>Get In Touch</h3>
            <p>
              For wholesale enquiries, collaborations, or general questions, reach out
              via the Contact page or WhatsApp. We look forward to hearing from you!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
