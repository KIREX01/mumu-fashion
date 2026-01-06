import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // Placeholder: front-end only. Integrate with API or Supabase as needed.
      await new Promise(resolve => setTimeout(resolve, 700));
      toast({ title: 'Message sent', description: 'We will get back to you shortly.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 min-h-[60vh]">
        <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 shadow-elegant">
          <div className="text-center mb-6">
            <span className="font-serif text-4xl font-bold text-primary">MF</span>
            <h1 className="font-serif text-2xl mt-4">Contact Us</h1>
            <p className="text-muted-foreground mt-2">Questions? We're here to help.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="How can we help?"
                rows={6}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" size="lg" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>

              <a
                href="https://wa.me/25769966695"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Contact via WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
