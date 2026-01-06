import { motion } from 'framer-motion';
import { Truck, CreditCard, MessageCircle, Scissors } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Home Delivery',
    description: 'We deliver right to your doorstep across Bujumbura',
  },
  {
    icon: CreditCard,
    title: 'Lumicash Payment',
    description: 'Easy mobile money payments via Lumicash',
  },
  {
    icon: Scissors,
    title: 'Custom Tailoring',
    description: 'Bespoke tailoring for the perfect fit',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Support',
    description: 'Direct communication for orders and inquiries',
  },
];

export const DeliveryInfo = () => {
  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 text-gold mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
