"use client";

import DesktopNavbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

export default function NavbarWrapper() {
  return (
    <>
      {/* Desktop Version */}
      <DesktopNavbar />

      {/* Mobile Version */}
      <MobileNavbar />
    </>
  );
}
