"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X, Users, Database, Building2 } from "lucide-react"
import Image from "next/image"

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold m-4">About Kin Air Quality</DialogTitle>
        </DialogHeader>
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {/* Mission */}
          <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">Our mission</h3>
            <p className="text-[#58595b] leading-relaxed">
              Dedicated to providing accurate and real-time air quality monitoring to help communities make informed
              decisions about their environmental health.
            </p>
          </div>

          {/* Impact */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Our impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Users className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">1M+</div>
                <div className="text-[#58595b] text-sm">Users Helped</div>
              </div>
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Database className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">500k</div>
                <div className="text-[#58595b] text-sm">Data Points Collected</div>
              </div>
              <div className="bg-[#f3f4f6] p-6 rounded-lg text-center">
                <Building2 className="w-8 h-8 text-[#05b15d] mx-auto mb-2" />
                <div className="font-bold text-xl mb-1">100+</div>
                <div className="text-[#58595b] text-sm">Cities Monitored</div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">Our Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#f3f4f6] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-[#58595b]">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:contact@wasaru.org" className="hover:text-black">
                  contact@wasaru.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+243555555555" className="hover:text-black">
                  +243555555555
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Cite Verte</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <a href="https://wasaru.org" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                  https://wasaru.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
