import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <img
                  src={`${import.meta.env.BASE_URL}logos/android-chrome-192x192.png`}
                  alt="Mumu Store"
                  className="h-10 w-10 object-contain brightness-0 invert"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white leading-none">
                  Mumu
                </span>
                <span className="font-serif text-xs text-gold font-medium tracking-widest uppercase">
                  Store
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Elegance redefined for the modern lifestyle. Discover sophisticated clothing,
              accessories, and delicious treats for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">Shop</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/shop/men"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors w-fit"
              >
                Men's Collection
              </Link>
              <Link
                to="/shop/women"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors w-fit"
              >
                Women's Collection
              </Link>
              <Link
                to="/shop/kids"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors w-fit"
              >
                Kids' Collection
              </Link>
              <Link
                to="/shop/cake"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors w-fit"
              >
                Cakes & Treats
              </Link>
              <Link
                to="/shop"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors w-fit mt-2 font-medium"
              >
                View All Products
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">Contact</h4>
            <div className="space-y-4">
              <a
                href="https://wa.me/25764057443"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-gold transition-colors group"
              >
                <MessageCircle className="w-5 h-5 mt-0.5 shrink-0 group-hover:text-gold transition-colors" />
                <span>WhatsApp: +257 64 05 74 43</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span>Bujumbura, Burundi</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <Clock className="w-5 h-5 mt-0.5 shrink-0" />
                <span>Mon - Sat: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">Payment</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <p>Secure mobile payments via Lumicash:</p>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-gold/50 transition-colors">
                <p className="font-medium text-primary-foreground">
                  Mumu Store
                </p>
                <p className="text-gold font-semibold text-lg tracking-wide">64057443</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Mumu Store. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="text-xs text-primary-foreground/50 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-xs text-primary-foreground/50 hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-xs text-primary-foreground/50 hover:text-gold transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};