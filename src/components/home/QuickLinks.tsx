import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Truck, Smartphone, CreditCard } from 'lucide-react';

const quickLinks = [
    {
        icon: ShoppingBag,
        title: 'New Arrivals',
        desc: 'Check out the latest drops',
        link: '/shop',
        color: 'bg-blue-500/10 text-blue-600'
    },
    {
        icon: Star,
        title: 'Featured',
        desc: 'Our curated selection',
        link: '/shop',
        color: 'bg-yellow-500/10 text-yellow-600'
    },
    {
        icon: Smartphone,
        title: 'Install App',
        desc: 'Shop faster on mobile',
        link: '/install',
        color: 'bg-purple-500/10 text-purple-600'
    },
    {
        icon: ShieldCheck,
        title: 'Auth',
        desc: 'Manage your profile',
        link: '/auth',
        color: 'bg-green-500/10 text-green-600'
    }
];

export const QuickLinks = () => {
    return (
        <section className="py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access</h2>
                    <p className="text-muted-foreground">Everything you need at your fingertips</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {quickLinks.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.link}
                            className="group glass-card p-6 rounded-3xl hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-tight">{item.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-6 glass-card rounded-3xl border-accent/20 bg-accent/5">
                        <Truck className="w-10 h-10 text-accent shrink-0" />
                        <div>
                            <h4 className="font-bold">Fast Delivery</h4>
                            <p className="text-sm text-muted-foreground">Doorstep delivery across Bujumbura and beyond.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 glass-card rounded-3xl border-primary/20 bg-primary/5">
                        <CreditCard className="w-10 h-10 text-primary shrink-0" />
                        <div>
                            <h4 className="font-bold">Easy Payment</h4>
                            <p className="text-sm text-muted-foreground">Secure payments via Lumicash or cash on delivery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
