"use client";

import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin
} from 'lucide-react';

export default function Footer() {
  // Static categories data
  const categories = [
    { id: '1', title: 'Electronics', slug: 'electronics' },
    { id: '2', title: 'Furniture', slug: 'furniture' },
    { id: '3', title: 'Vehicles', slug: 'vehicles' },
    { id: '4', title: 'Property', slug: 'property' },
    { id: '5', title: 'Jobs', slug: 'jobs' },
  ];

  // Static states/locations data
  const states = [
    { id: '1', name: 'Delhi', slug: 'delhi' },
    { id: '2', name: 'Mumbai', slug: 'mumbai' },
    { id: '3', name: 'Bangalore', slug: 'bangalore' },
    { id: '4', name: 'Chennai', slug: 'chennai' },
    { id: '5', name: 'Kolkata', slug: 'kolkata' },
  ];

  // Static site settings
  const siteName = 'Classic India';
  const copyrightText = '© 2026 Classic India. All rights reserved.';

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
    { key: 'facebook', icon: Facebook, url: socialLinks.facebook, color: 'hover:text-[#1877f2]', label: 'Facebook' },
    { key: 'twitter', icon: Twitter, url: socialLinks.twitter, color: 'hover:text-[#1da1f2]', label: 'Twitter' },
    { key: 'instagram', icon: Instagram, url: socialLinks.instagram, color: 'hover:text-[#e4405f]', label: 'Instagram' },
    { key: 'youtube', icon: Youtube, url: socialLinks.youtube, color: 'hover:text-[#ff0000]', label: 'YouTube' },
    { key: 'linkedin', icon: Linkedin, url: socialLinks.linkedin, color: 'hover:text-[#0077b5]', label: 'LinkedIn' },
  ];

  // Filter only social links that have URLs
  const activeSocialLinks = socialConfigs.filter(social => social.url && social.url.trim() !== '');

  return (
    <footer className="bg-black text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: '#ff6600' }}>{siteName}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's fastest growing classifieds platform. Post ads instantly and reach millions at minimal cost.
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
                      className={`text-gray-400 transition ${social.color}`}
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
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <motion.li 
                  key={cat.id}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a href={`/category/${cat.slug}`} className="hover:text-[#ff6600] transition">
                    {cat.title}
                  </a>
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
            <h4 className="text-white font-semibold mb-4">Top Locations</h4>
            <ul className="space-y-2 text-sm">
              {states.map((state) => (
                <motion.li 
                  key={state.id}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a href={`/${state.slug}`} className="hover:text-[#ff6600] transition">
                    {state.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <motion.li
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <a 
                  href="/privacy-policy"
                  className="hover:text-[#ff6600] transition"
                >
                  Privacy Policy
                </a>
              </motion.li>
              <motion.li
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <a 
                  href="/terms-conditions"
                  className="hover:text-[#ff6600] transition"
                >
                  Terms & Conditions
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 pt-8"
        >
          <p className="text-sm text-gray-500 text-center">
            {copyrightText}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}