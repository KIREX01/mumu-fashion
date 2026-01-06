import { Layout } from "@/components/layout/Layout";

const CookiePolicy = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 md:py-16">
                <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto dark:prose-invert">
                    <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
                    <p className="mb-4 text-muted-foreground italic">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
                        <p>
                            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file
                            is stored in your web browser and allows the Service or a third-party to recognize you and
                            make your next visit easier and the Service more useful to you.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. How Mumu Style Shop Uses Cookies</h2>
                        <p>
                            When you use and access the Service, we may place a number of cookies files in your web browser.
                            We use cookies for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>To enable certain functions of the Service</li>
                            <li>To provide analytics</li>
                            <li>To store your preferences</li>
                            <li>To enable advertisements delivery, including behavioral advertising</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
                        <p>
                            We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li><strong>Essential Cookies:</strong> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
                            <li><strong>Preference Cookies:</strong> We use preference cookies to remember information that changes the way the service behaves or looks, such as a user's language preference.</li>
                            <li><strong>Analytics Cookies:</strong> We use analytics cookies to track information how the Service is used so that we can make improvements.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. What Are Your Choices Regarding Cookies</h2>
                        <p>
                            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please
                            visit the help pages of your web browser. Please note, however, that if you delete cookies or
                            refuse to accept them, you might not be able to use all of the features we offer, you may not
                            be able to store your preferences, and some of our pages might not display properly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about our Cookie Policy, please contact us at: privacy@mumustyleshop.com
                        </p>
                    </section>
                </article>
            </div>
        </Layout>
    );
};

export default CookiePolicy;
