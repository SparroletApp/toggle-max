"use client";

import { useState } from "react";
import Link from "next/link";
import "./header.css";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" className="header-logo" onClick={closeMenu}>
                <img src="/logo.webp"></img>
                </Link>

                <nav className={`header-nav ${menuOpen ? "active" : ""}`}>
                    <Link href="/" className="nav-link active" onClick={closeMenu}>
                        Home
                    </Link>

                    <Link href="/about-us" className="nav-link" onClick={closeMenu}>
                        About Us
                    </Link>

                    <Link href="/services" className="nav-link" onClick={closeMenu}>
                        Services
                    </Link>

                    <Link href="/blog" className="nav-link" onClick={closeMenu}>
                        Blog
                    </Link>

                    <Link href="/placements" className="nav-link" onClick={closeMenu}>
                        Placements
                    </Link>

                    <Link
                        href="/contact"
                        className="header-contact-btn mobile-contact-btn"
                        onClick={closeMenu}
                    >
                        Contact Us <i className="bi bi-arrow-up-right"></i>
                    </Link>
                </nav>
                <button
                    className="header-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
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