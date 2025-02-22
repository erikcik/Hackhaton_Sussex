import type React from "react"
import { Bubblegum_Sans } from "next/font/google"

const bubblegumSans = Bubblegum_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bubblegum-sans",
})

export const metadata = {
  title: "TinyTalker Dashboard",
  description: "A cozy digital farm for adolescent kids",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}

