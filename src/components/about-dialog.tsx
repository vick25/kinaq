"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Database, Globe, Mail, Users } from "lucide-react";
import Link from "next/link";

interface IAboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutDialog({ open, onOpenChange }: IAboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold m-4">Kinshasa Air Quality</DialogTitle>
        </DialogHeader>
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {/* About */}
          <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">About KINAQ</h3>
            <p className="text-[#58595b] leading-relaxed mb-3">
              The Kinshasa Air Quality Project (KINAQ) is implemented by WASARU (Led by Paulson KASEREKA), in partnership with Professor Daniel Westervelt of Columbia University (USA), with financial support of the Energy Policy Institute at the University of Chicago (EPIC).
            </p>
            <p className="text-[#58595b] leading-relaxed">
              <span className="font-extrabold">KINAQ</span> provides innovative solutions that include the deployment of low-cost sensors, providing real-time open data, and sharing actionable information for air quality monitoring to reduce air pollution, improve air quality, and prevent air pollution related effects in Kinshasa and the DR Congo. We also raise awareness about air pollution and advocate for clean air policies with national and local government.
            </p>
          </div>
          {/* Mission */}
          <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">Mission</h3>
            <p className="text-[#58595b] leading-relaxed">
              Dedicated to providing accurate and real-time air quality open data and actionable information to protect communities from the effects of air pollution and help them make informed decisions about their environmental health.
            </p>
          </div>

          {/* Impact */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Users className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">2000+</div>
                <div className="text-[#58595b] text-sm">Children informed</div>
              </div>
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Users className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">150+</div>
                <div className="text-[#58595b] text-sm">Users helped</div>
              </div>
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Database className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">1M+</div>
                <div className="text-[#58595b] text-sm">Data points collected</div>
              </div>
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Building2 className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">15+</div>
                <div className="text-[#58595b] text-sm">Awareness campaign</div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">Our Team</h3>
            <Link href="https://wasaruwash.org" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-black">Visit our website</Link>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kin_Air_Quality-PEGCgBJRHeANCqprcF6Q9llzEO3Pwj.png"
                  alt="Team member avatar"
                  width={120}
                  height={120}
                  className="mx-auto mb-4"
                />
                <h4 className="font-semibold mb-1">Paulson Kasereka</h4>
                <p className="text-[#58595b] text-sm">CEO & Founder</p>
              </div>
              <div className="text-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kin_Air_Quality-PEGCgBJRHeANCqprcF6Q9llzEO3Pwj.png"
                  alt="Team member avatar"
                  width={120}
                  height={120}
                  className="mx-auto mb-4"
                />
                <h4 className="font-semibold mb-1">Isevulamire</h4>
                <p className="text-[#58595b] text-sm">CTO</p>
              </div>
              <div className="text-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kin_Air_Quality-PEGCgBJRHeANCqprcF6Q9llzEO3Pwj.png"
                  alt="Team member avatar"
                  width={120}
                  height={120}
                  className="mx-auto mb-4"
                />
                <h4 className="font-semibold mb-1">Jonas Tshombe</h4>
                <p className="text-[#58595b] text-sm">Lead Scientist</p>
              </div>
            </div> */}
          </div>

          {/* Contact */}
          <div className="bg-[#f3f4f6] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4 text-[#58595b]">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:kinshasaairquality.wasaru@gmail.com" className="hover:text-black">
                  kinshasaairquality.wasaru@gmail.com
                </a>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Follow us on Social Media</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.facebook.com/profile.php?id=100090179774395&locale=fr_FR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook-icon lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    {/* <Facebook size={18} /> */}
                    Facebook
                  </a>
                  <a
                    href="https://www.linkedin.com/in/wasaru-asbl-water-and-sanitation-in-rural-and-urban-areas-334aab269/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                    {/* <Linkedin size={18} /> */}
                    LinkedIn
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
      </DialogContent>
    </Dialog>
  )
}