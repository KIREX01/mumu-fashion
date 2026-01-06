import { Layout } from "@/components/layout/Layout";

const TermsOfService = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 md:py-16">
                <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto dark:prose-invert">
                    <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
                    <p className="mb-4 text-muted-foreground italic">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using Mumu Style Shop, you agree to be bound by these Terms of Service.
                            If you disagree with any part of the terms, then you may not access the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are and will remain the exclusive
                            property of Mumu Style Shop and its licensors. The Service is protected by copyright, trademark,
                            and other laws of both the country and foreign countries.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                        <p>
                            When you create an account with us, you must provide information that is accurate, complete, and current
                            at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                            termination of your account on our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Links To Other Web Sites</h2>
                        <p>
                            Our Service may contain links to third-party web sites or services that are not owned or controlled
                            by Mumu Style Shop. We have no control over, and assume no responsibility for, the content,
                            privacy policies, or practices of any third party web sites or services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability,
                            for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                            What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at: terms@mumustyleshop.com
                        </p>
                    </section>
                </article>
            </div>
        </Layout>
    );
};

export default TermsOfService;
