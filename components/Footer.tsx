"use client";

import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  // Static site settings
  const siteName = 'Sea Food';
  const copyrightText = '© 2026 Sea Food. All rights reserved.';

  // Static social links
  const socialLinks = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  };

  // Define social icons and their configurations
  const socialConfigs = [
    { key: 'facebook', icon: Facebook, url: socialLinks.facebook, label: 'Facebook' },
    { key: 'twitter', icon: Twitter, url: socialLinks.twitter, label: 'Twitter' },
    { key: 'instagram', icon: Instagram, url: socialLinks.instagram, label: 'Instagram' },
    { key: 'youtube', icon: Youtube, url: socialLinks.youtube, label: 'YouTube' },
    { key: 'linkedin', icon: Linkedin, url: socialLinks.linkedin, label: 'LinkedIn' },
  ];

  // Filter only social links that have URLs
  const activeSocialLinks = socialConfigs.filter(social => social.url && social.url.trim() !== '');

  // Navigation links
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { title: 'Terms & Conditions', href: '/terms-conditions' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
  ];

  return (
    <footer className="pt-12 pb-8" style={{ backgroundColor: '#5E0006', color: '#EED9B9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: '#D53E0F' }}>{siteName}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#EED9B9' }}>
              India's fastest growing seafood platform. Get the freshest catches delivered instantly at minimal cost.
            </p>
            
            {/* Social Links - Only show if URLs exist */}
            {activeSocialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {activeSocialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="transition-colors hover:text-[#D53E0F]"
                      style={{ color: '#EED9B9' }}
                      aria-label={social.label}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4" style={{ color: '#D53E0F' }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <motion.li 
                  key={link.title}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link 
                    href={link.href} 
                    className="transition-colors hover:text-[#D53E0F]"
                    style={{ color: '#EED9B9' }}
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4" style={{ color: '#D53E0F' }}>Legal</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <motion.li 
                  key={link.title}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link 
                    href={link.href} 
                    className="transition-colors hover:text-[#D53E0F]"
                    style={{ color: '#EED9B9' }}
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold mb-4" style={{ color: '#D53E0F' }}>Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span style={{ color: '#EED9B9' }}>support@seafood.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span style={{ color: '#EED9B9' }}>+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{ color: '#EED9B9' }}>Mumbai, India</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 mt-8"
          style={{ borderTop: '1px solid rgba(213, 62, 15, 0.2)' }}
        >
          <p className="text-sm text-center" style={{ color: '#EED9B9' }}>
            {copyrightText}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}