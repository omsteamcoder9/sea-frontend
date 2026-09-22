"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/settings-api";

export default function Footer() {
  const [siteName, setSiteName] = useState("Sea Food");
  const [siteDescription, setSiteDescription] = useState("");
  const [contactEmail, setContactEmail] = useState(
    "support@MeenavanFresh.com"
  );
  const [contactNumber, setContactNumber] = useState("+91 98765 43210");
  const [companyAddress, setCompanyAddress] = useState("Mumbai, India");
  const [footerText, setFooterText] = useState("");

  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(true);

  const getLogoLines = () => {
    if (!siteName || siteName.trim() === "") {
      return { first: "", second: "" };
    }

    const nameParts = siteName.trim().split(" ");

    if (nameParts.length > 1) {
      return {
        first: nameParts[0],
        second: nameParts.slice(1).join(" "),
      };
    }

    return {
      first: nameParts[0],
      second: "",
    };
  };

  const { first: logoFirstLine, second: logoSecondLine } =
    getLogoLines();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getPublicSettings();

      if (response.success && response.data) {
        const data = response.data;

        if (data.siteName) {
          setSiteName(data.siteName);
        }

        if (data.siteDescription) {
          setSiteDescription(data.siteDescription);
        }

        if (data.contactEmail) {
          setContactEmail(data.contactEmail);
        }

        if (data.contactNumber) {
          setContactNumber(data.contactNumber);
        }

        if (data.companyAddress) {
          setCompanyAddress(data.companyAddress);
        }

        if (data.footerText) {
          setFooterText(data.footerText);
        }

        if (data.socialMedia) {
          setSocialMedia({
            facebook: data.socialMedia.facebook || "",
            instagram: data.socialMedia.instagram || "",
            twitter: data.socialMedia.twitter || "",
            youtube: data.socialMedia.youtube || "",
            linkedin: data.socialMedia.linkedin || "",
          });
        }

        if (data.facebookUrl && !data.socialMedia?.facebook) {
          setSocialMedia((prev) => ({
            ...prev,
            facebook: data.facebookUrl || "",
          }));
        }

        if (data.instagramUrl && !data.socialMedia?.instagram) {
          setSocialMedia((prev) => ({
            ...prev,
            instagram: data.instagramUrl || "",
          }));
        }

        if (data.twitterUrl && !data.socialMedia?.twitter) {
          setSocialMedia((prev) => ({
            ...prev,
            twitter: data.twitterUrl || "",
          }));
        }

        if (data.youtubeUrl && !data.socialMedia?.youtube) {
          setSocialMedia((prev) => ({
            ...prev,
            youtube: data.youtubeUrl || "",
          }));
        }

        if (data.linkedinUrl && !data.socialMedia?.linkedin) {
          setSocialMedia((prev) => ({
            ...prev,
            linkedin: data.linkedinUrl || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching footer settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const socialConfigs = [
    {
      key: "facebook",
      icon: FaFacebookF,
      url: socialMedia.facebook,
      label: "Facebook",
    },
    {
      key: "twitter",
      icon: FaTwitter,
      url: socialMedia.twitter,
      label: "Twitter",
    },
    {
      key: "instagram",
      icon: FaInstagram,
      url: socialMedia.instagram,
      label: "Instagram",
    },
    {
      key: "youtube",
      icon: FaYoutube,
      url: socialMedia.youtube,
      label: "YouTube",
    },
    {
      key: "linkedin",
      icon: FaLinkedinIn,
      url: socialMedia.linkedin,
      label: "LinkedIn",
    },
  ];

  const activeSocialLinks = socialConfigs.filter(
    (social) => social.url && social.url.trim() !== ""
  );

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { title: "Terms", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
  ];

  const copyrightText =
    footerText ||
    `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  if (loading) {
    return (
      <footer
        className="pt-12 pb-8"
        style={{
          backgroundColor: "#F8FCFD",
          color: "#315A6E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008FB8]" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="pt-12 pb-8"
      style={{
        backgroundColor: "#ebf7f9",
        color: "#315A6E",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">

              <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt={siteName}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[25px] sm:text-[25px] lg:text-[28px] font-black tracking-[2px] lg:tracking-[3px] text-[#063B5C] leading-none">
                  {logoFirstLine}
                </span>

                {logoSecondLine && (
                  <span className="text-[18px] sm:text-[18px] lg:text-[16px] font-bold tracking-[1px] text-[#008FB8] leading-none ml-4 sm:ml-3 lg:ml-5">
                    {logoSecondLine}
                  </span>
                )}
              </div>
            </div>

            <p
              className="text-sm leading-relaxed font-medium"
              style={{ color: "#315A6E" }}
            >
              {siteDescription}
            </p>

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
                      transition={{
                        type: "spring",
                        stiffness: 400,
                      }}
                      className="transition-colors hover:text-[#00A9E0]"
                      style={{ color: "#008FB8" }}
                      aria-label={social.label}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4
              className="font-extrabold text-[12px] tracking-[2px] uppercase mb-4"
              style={{ color: "#063B5C" }}
            >
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <motion.li
                  key={link.title}
                  whileHover={{ x: 3 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-[12px] font-extrabold tracking-[1px] transition-colors hover:text-[#008FB8]"
                    style={{ color: "#063B5C" }}
                  >
                    {link.title.toUpperCase()}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4
              className="font-extrabold text-[12px] tracking-[2px] uppercase mb-4"
              style={{ color: "#063B5C" }}
            >
              Legal
            </h4>

            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <motion.li
                  key={link.title}
                  whileHover={{ x: 3 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-[12px] font-extrabold tracking-[1px] transition-colors hover:text-[#008FB8]"
                    style={{ color: "#063B5C" }}
                  >
                    {link.title.toUpperCase()}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4
              className="font-extrabold text-[12px] tracking-[2px] uppercase mb-4"
              style={{ color: "#063B5C" }}
            >
              Contact Us
            </h4>

            <ul className="space-y-2 text-sm">

              <li className="flex items-start space-x-2">
                <Mail
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#008FB8" }}
                />

                <span
                  className="text-[12px] font-semibold tracking-[0.5px]"
                  style={{ color: "#315A6E" }}
                >
                  {contactEmail}
                </span>
              </li>

              <li className="flex items-start space-x-2">
                <Phone
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#008FB8" }}
                />

                <span
                  className="text-[12px] font-semibold tracking-[0.5px]"
                  style={{ color: "#315A6E" }}
                >
                  {contactNumber}
                </span>
              </li>

              <li className="flex items-start space-x-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#008FB8" }}
                />

                <span
                  className="text-[12px] font-semibold tracking-[0.5px]"
                  style={{ color: "#315A6E" }}
                >
                  {companyAddress}
                </span>
              </li>

            </ul>
          </motion.div>

        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 mt-8"
          style={{
            borderTop: "1px solid #B8DCE7",
          }}
        >
          <p
            className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base text-center px-2 font-semibold tracking-[0.5px]"
            style={{ color: "#315A6E" }}
          >
            {copyrightText}
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
