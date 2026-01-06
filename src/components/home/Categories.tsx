import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Shirts',
    description: 'Sophisticated designs for every occasion',
    href: '/shop/shirts',
    image: 'https://kirex01.github.io/mumu-fashion/images/shirt%20(5).png',
  },
  {
    name: 'Trousers',
    description: 'Impeccably tailored for the perfect fit',
    href: '/shop/trousers',
    image: 'https://kirex01.github.io/mumu-fashion/images/trouser%20(2).png',
  },
  {
    name: 'Shoes',
    description: 'Premium footwear for distinction',
    href: '/shop/shoes',
    image: 'https://kirex01.github.io/mumu-fashion/images/shoe%20(1).png',
  },
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
