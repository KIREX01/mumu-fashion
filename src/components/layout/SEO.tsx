import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO = ({
    title = "Mumu Style Shop | Elegance Redefined",
    description = "Shop sophisticated shirts, tailored trousers, and premium footwear at Mumu Style Shop. Bujumbura's premier fashion destination.",
    image = "/logos/og-image.jpg",
    url = window.location.href,
    type = "website"
}: SEOProps) => {
    useEffect(() => {
        // Update basic meta tags
        document.title = title;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute('content', description);

        // Update OpenGraph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', image);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        const ogType = document.querySelector('meta[property="og:type"]');
        if (ogType) ogType.setAttribute('content', type);

        // Update Twitter tags
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', title);

        const twDescription = document.querySelector('meta[name="twitter:description"]');
        if (twDescription) twDescription.setAttribute('content', description);

        const twImage = document.querySelector('meta[name="twitter:image"]');
        if (twImage) twImage.setAttribute('content', image);
    }, [title, description, image, url, type]);

    return null; // This component doesn't render anything
};
