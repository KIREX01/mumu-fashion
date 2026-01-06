import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download, Monitor, Smartphone, CheckCircle, Info } from "lucide-react";
import { usePWA } from "@/contexts/PWAContext";
import { toast } from "sonner";

const InstallPage = () => {
    const { isInstallable, installApp } = usePWA();

    const handleInstallClick = async () => {
        try {
            await installApp();
            toast.success("Installation process started!");
        } catch (error) {
            toast.error("Failed to trigger installation. Please use your browser's menu.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Install Mumu Style Shop</h1>
                    <p className="text-xl text-muted-foreground">
                        Get the best shopping experience by installing our app on your device.
                        Fast, reliable, and available offline.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Smartphone className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold">Mobile App</h2>
                        <ul className="text-left space-y-3 text-muted-foreground w-full">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span>Fast access from your home screen</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span>Push notifications for deals & updates</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span>Works smoothly even on slow networks</span>
                            </li>
                        </ul>
                        {isInstallable ? (
                            <Button size="lg" onClick={handleInstallClick} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                                <Download className="mr-2 h-5 w-5" /> Install Mobile App
                            </Button>
                        ) : (
                            <div className="p-4 bg-muted/30 rounded-xl text-sm text-center w-full border border-border/50">
                                <Info className="inline-block mr-2 h-4 w-4" />
                                Already installed or not supported. Use browser menu if needed.
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Monitor className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold">Desktop App</h2>
                        <ul className="text-left space-y-3 text-muted-foreground w-full">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span>Standalone window experience</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span>Quick launch from taskbar or dock</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span>No need to remember URLs</span>
                            </li>
                        </ul>
                        {isInstallable ? (
                            <Button size="lg" variant="outline" onClick={handleInstallClick} className="w-full border-primary/20 hover:bg-primary/5 shadow-md">
                                <Download className="mr-2 h-5 w-5" /> Install Desktop App
                            </Button>
                        ) : (
                            <div className="p-4 bg-muted/30 rounded-xl text-sm text-center w-full border border-border/50">
                                <Info className="inline-block mr-2 h-4 w-4" />
                                Already installed or not supported. Use browser menu if needed.
                            </div>
                        )}
                    </div>
                </div>

                <section className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gold">How to install manually</h2>
                        <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
                        <p className="mt-4 text-muted-foreground">If the buttons above aren't available, follow these simple steps:</p>
                    </div>

                    <div className="grid gap-6">
                        <div className="flex gap-6 glass-card p-6 rounded-2xl border-border/40">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">1</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Android / Chrome</h3>
                                <p className="text-muted-foreground">Tap the three dots (⋮) in the top right corner and select <span className="text-primary font-medium">"Install app"</span> or "Add to Home screen".</p>
                            </div>
                        </div>

                        <div className="flex gap-6 glass-card p-6 rounded-2xl border-border/40">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">2</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">iOS / Safari</h3>
                                <p className="text-muted-foreground">Tap the share button (square with arrow) at the bottom and select <span className="text-primary font-medium">"Add to Home Screen"</span>.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 glass-card p-6 rounded-2xl border-border/40">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">3</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Desktop / Edge & Chrome</h3>
                                <p className="text-muted-foreground">Look for the <span className="text-primary font-medium">install icon</span> (⊕) in the right side of your address bar or go to Settings {'>'} Apps {'>'} Install this site as an app.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default InstallPage;
