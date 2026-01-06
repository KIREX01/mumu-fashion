import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="max-w-4xl mx-auto glass-card p-6 border-primary/20 bg-background/80 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary/10 p-3 rounded-full hidden md:block">
                    <Cookie className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h3 className="font-semibold text-lg mb-1 flex items-center justify-center md:justify-start gap-2">
                        <Cookie className="h-5 w-5 md:hidden text-primary" />
                        We value your privacy
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                        By clicking "Accept All", you consent to our use of cookies.
                        Read our <Link to="/cookie-policy" className="text-primary hover:underline underline-offset-4">Cookie Policy</Link> for more details.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDecline}
                        className="flex-1 md:flex-none border-primary/20 hover:bg-primary/5"
                    >
                        Decline
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleAccept}
                        className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Accept All
                    </Button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
