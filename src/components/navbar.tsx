"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { assets } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane, Database, ChartColumn } from "lucide-react";

type NavItemProps = {
  icon?: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
};

function MobileNavItem({ icon, label, href, active = false, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full text-left px-3 py-2 rounded-md text-xl font-medium flex items-center transition-colors ${
        active ? "bg-green-50 text-[#72BB34]" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon ? <span className="mr-3 inline-flex items-center">{icon}</span> : null}
      {label}
    </Link>
  );
}

function NavItem({ label, href, active = false, onClick }: NavItemProps) {
  return (
    <li
      className={`text-black no-underline transition-transform duration-300 hover:scale-105 ${
        active ? "font-bold" : "hover:font-bold"
      }`}
    >
      <Link
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className="hover:text-[#72BB34] inline-flex items-center gap-2"
      >
        {label}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const handleNavClick = () => setIsMenuOpen(false);

  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname?.startsWith(path));

  return (
    <nav className="w-full border-b border-[rgba(0,0,0,0)] bg-white/100 backdrop-blur-md z-50 relative shadow-[0_4px_12px_rgba(0,0,0,0.2)]">

      {/* Header bar */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 md:px-12 py-4 min-h-[141px]">
        
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={assets.logo}
            alt="Logo"
            priority
            className="absolute left-[13px] cursor-pointer object-contain h-32 md:h-32 ml-0 w-auto"
            onClick={() => window.open("https://www.injourneyairports.id/", "_blank")}
          />
        </div>

        {/* Desktop Menu - Centered */}
        <ul className="hidden xl:flex fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center gap-[50px] list-none text-[23px]">
          <NavItem label="Dashboard" href="/dashboard" active={isActive("/dashboard")} onClick={handleNavClick} />
          <NavItem label="Data" href="/data" active={isActive("/data")} onClick={handleNavClick} />
          <NavItem label="Tentang" href="/about" active={isActive("/about")} onClick={handleNavClick} />
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center ml-auto xl:hidden">
          <Button 
            size="icon" 
            onClick={toggleMenu} 
            aria-label="Toggle menu" 
            aria-expanded={isMenuOpen}
            className="bg-[#83C8EC] text-white hover:bg-[#9EC944]"
          >
            {isMenuOpen 
              ? <X className="h-37 w-37" /> 
              : <Menu className="h-9 w-9" />
            }
          </Button>
        </div>
      
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white shadow-lg border-t border-gray-200 absolute top-full left-0 right-0 z-50">
          <div className="px-4 pt-2 pb-2 space-y-4">
            <MobileNavItem
              icon={<ChartColumn className="w-6 h-6 mr-3" />}
              label="Dashboard"
              href="/dashboard"
              active={isActive("/dashboard")}
              onClick={handleNavClick}
            />
            <MobileNavItem
              icon={<Database className="w-6 h-6 mr-3" />}
              label="Data"
              href="/data"
              active={isActive("/data")}
              onClick={handleNavClick}
            />
            <MobileNavItem
              icon={<Plane className="w-6 h-6 mr-3" />}
              label="Tentang"
              href="/about"
              active={isActive("/about")}
              onClick={handleNavClick}
            />
          </div>
        </div>
      )}
    </nav>
  );
}