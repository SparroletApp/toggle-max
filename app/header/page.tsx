"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./header.css";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Services", href: "/services" },
        { name: "Blog", href: "/blog" },
        { name: "Placements", href: "/placements" },
        { name: "Contact Us", href: "/contact-us" },
    ];

    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" className="header-logo" onClick={closeMenu}>
                    <img src="/logo.webp" alt="Togglemax Logo" />
                </Link>

                <nav className={`header-nav ${menuOpen ? "active" : ""}`}>
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" &&
                                pathname.startsWith(item.href + "/"));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${isActive ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    className="header-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={
                        menuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={menuOpen}
                    type="button"
                >
                    <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
                </button>
            </div>
        </header>
    );
}

export default Header;