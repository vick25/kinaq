// export const dynamic = 'force-static'

import { Building2, Database, Globe, Mail, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata = {
    title: 'KINAQ | About Us',
    description: 'Download air quality data from KINAQ and learn about our mission to improve air quality in Kinshasa and DR Congo.',
};

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

const AboutPage = async () => {
    const t = await getTranslations('About');

    const impactItems = [
        { icon: Users, value: "2000+", label: t('impact.stats.children') },
        { icon: Users, value: "150+", label: t('impact.stats.users') },
        { icon: Database, value: "1M+", label: t('impact.stats.dataPoints') },
        { icon: Building2, value: "15+", label: t('impact.stats.campaigns') },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="p-6 sm:p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-8">{t('hero.title')}</h1>

                <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
                    <p className="text-[#58595b] leading-relaxed mb-3">
                        {t('mission.description')}
                    </p>
                    <p className="text-[#58595b] leading-relaxed">
                        <span className="font-extrabold text-[#05b15d]">KINAQ</span>&nbsp;
                        {t('mission.goals.awareness')}
                    </p>
                </div>

                <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-2">{t('mission.title')}</h3>
                    <p className="text-[#58595b] leading-relaxed">
                        {t('mission.goals.data')}
                    </p>
                </div>

                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-8">{t('impact.title')}</h3>
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
                    <h3 className="text-2xl font-bold mb-8">{t('team.title')}</h3>
                    <Link
                        href="https://wasaruwash.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-black"
                    >
                        {t('contact.visit')}
                    </Link>
                </div>

                <div className="bg-[#f3f4f6] rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">{t('contact.title')}</h3>
                    <div className="space-y-4 text-[#58595b]">
                        <div className="flex items-center gap-2">
                            <Mail size={18} />
                            <a href="mailto:kinshasaairquality.wasaru@gmail.com" className="hover:text-black">
                                kinshasaairquality.wasaru@gmail.com
                            </a>
                        </div>
                        <p className="text-sm italic">
                            {t('contact.contribution')}
                        </p>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium">{t('contact.follow')}</p>
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