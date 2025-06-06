export const dynamic = 'force-static'

import { Building2, Database, Globe, Mail, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: 'KINAQ | About Us',
    description: 'Download air quality data from KINAQ and learn about our mission to improve air quality in Kinshasa and DR Congo.',
    openGraph: {
        title: 'KINAQ | About Us',
        description: 'Download air quality data from KINAQ and learn about our mission to improve air quality in Kinshasa and DR Congo.',
        url: 'https://kinaq.vercel.app/about',
        siteName: 'KINAQ',
        images: [
            {
                url: 'https://kinaq.vercel.app/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'KINAQ air quality dashboard and mission',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KINAQ | About Us',
        description: 'Learn how KINAQ is helping improve air quality in Kinshasa with data, sensors, and awareness.',
        images: ['https://kinaq.vercel.app/og-image.jpg'],
    },
};

const impactItems = [
    { icon: Users, value: "2000+", label: "Children informed" },
    { icon: Users, value: "150+", label: "Users helped" },
    { icon: Database, value: "1M+", label: "Data points collected" },
    { icon: Building2, value: "15+", label: "Awareness campaign" },
];

const socialLinks = [
    {
        href: "https://www.facebook.com/profile.php?id=100090179774395&locale=fr_FR",
        label: "Facebook",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
        ),
    },
    {
        href: "https://www.linkedin.com/in/wasaru-asbl-water-and-sanitation-in-rural-and-urban-areas-334aab269/",
        label: "LinkedIn",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
        ),
    },
];

const AboutPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="p-6 sm:p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-8">About KINAQ</h1>

                <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
                    <p className="text-[#58595b] leading-relaxed mb-3">
                        The Kinshasa Air Quality Project (KINAQ) is implemented by WASARU (led by Paulson KASEREKA), in partnership with Professor Daniel Westervelt of Columbia University (USA), with financial support of the Energy Policy Institute at the University of Chicago (EPIC).
                    </p>
                    <p className="text-[#58595b] leading-relaxed">
                        <span className="font-extrabold text-[#05b15d]">KINAQ</span> provides innovative solutions that include the deployment of low-cost sensors, providing real-time open data, and sharing actionable information for air quality monitoring to reduce air pollution, improve air quality, and prevent air pollution related effects in Kinshasa and the DR Congo. We also raise awareness about air pollution and advocate for clean air policies with national and local government.
                    </p>
                </div>

                <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-2">Mission</h3>
                    <p className="text-[#58595b] leading-relaxed">
                        Dedicated to providing accurate and real-time air quality open data and actionable information to protect communities from the effects of air pollution and help them make informed decisions about their environmental health.
                    </p>
                </div>

                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-8">Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {impactItems.map((item, i) => (
                            <div key={i} className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                                <item.icon className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                                <div className="font-bold text-xl mb-1">{item.value}</div>
                                <div className="text-[#58595b] text-sm">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-8">Our Team</h3>
                    <Link
                        href="https://wasaruwash.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-black"
                    >
                        Visit our website
                    </Link>
                </div>

                <div className="bg-[#f3f4f6] rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                    <div className="space-y-4 text-[#58595b]">
                        <div className="flex items-center gap-2">
                            <Mail size={18} />
                            <a href="mailto:kinshasaairquality.wasaru@gmail.com" className="hover:text-black">
                                kinshasaairquality.wasaru@gmail.com
                            </a>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium">Follow us on Social Media</p>
                            <div className="flex flex-col gap-2">
                                {socialLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:text-black"
                                    >
                                        {link.icon}
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Globe size={18} />
                            <Link
                                href="https://wasaruwash.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-black"
                            >
                                https://wasaruwash.org
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;