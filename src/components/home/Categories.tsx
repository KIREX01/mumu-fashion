import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Shirts',
    description: 'Sophisticated designs for every occasion',
    href: '/shop/shirts',
    image: 'https://img.freepik.com/free-photo/clothing-rack-with-floral-hawaiian-shirts-hangers-hat_23-2149366019.jpg?t=st=1767726272~exp=1767729872~hmac=6b08cf1a7c27b71302d3dd2337b1ef3230dbbf434cfdaab39040f76de4c828cf&w=1480',
  },
  {
    name: 'Trousers',
    description: 'Impeccably tailored for the perfect fit',
    href: '/shop/trousers',
    image: 'https://img.freepik.com/free-photo/assortment-beige-tone-colored-pants_23-2150773387.jpg?t=st=1767726453~exp=1767730053~hmac=8d82aab8f97494cf3d877262950e6bfb0d2aeee984599d1694c42ef33aabdd66&w=1480',
  },
  {
    name: 'Shoes',
    description: 'Premium footwear for distinction',
    href: '/shop/shoes',
    image: 'https://img.freepik.com/free-photo/close-up-futuristic-sneakers_23-2151005654.jpg?t=st=1767726561~exp=1767730161~hmac=0e43e395329e24e233a4d5ff9daee85e75729a3e15e87448b1fb70fc3b661e9b&w=1480',
  },
  {
    name: 'cake',
    description: 'Elevate your style with our curated selection',
    href: '/shop/cake',
    image: 'https://img.freepik.com/free-photo/wonderful-wedding-day_1157-4889.jpg?t=st=1767726760~exp=1767730360~hmac=5c94b9233209940f3481b9c128c31703fe6e12752a98c57f79c7e52b83f49d87&w=1480',
  },
  {
    name: 'Accessories',
    description: 'Complete your look with stylish accessories',
    href: '/shop/accessories',
    image: 'https://img.freepik.com/free-photo/model-career-kit-still-life_23-2150217993.jpg?t=st=1767726923~exp=1767730523~hmac=367465ea697539994f0f97374c23719f45b74c0644c3db047a6953e5fab3b294&w=1480',
  },
  {
    name: 'children ware',
    description: 'Specialized clothing for children',
    href: '/shop/children',
    image: 'https://img.freepik.com/free-photo/photorealistic-portrait-young-people-with-braids_23-2151570188.jpg?t=st=1767727131~exp=1767730731~hmac=cb0fe5db0dea8039a974fb8a6fb2fbbced9007ecddc58a2f6ca5a49d7f442041&w=1480',
  }
];

export const Categories = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-accent uppercase tracking-widest"
          >
            Our Collections
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2"
          >
            Shop by Category
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link
                to={category.href}
                className="group block relative aspect-[4/5] rounded-xl overflow-hidden bg-card"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-serif text-2xl font-semibold text-primary-foreground mb-1">
                    {category.name}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
