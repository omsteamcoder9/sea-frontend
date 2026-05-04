// // src/components/FloatingContactButtons.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { Phone, ArrowUp } from "lucide-react";
// import { settingsAPI } from "@/lib/settings-api";

// const FloatingContactButtons = () => {
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [callNumber, setCallNumber] = useState("");
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   useEffect(() => {
//     const fetchContactInfo = async () => {
//       try {
//         const res = await settingsAPI.getPublicSettings();
//         if (res.success && res.data) {
//           setWhatsappNumber(res.data.whatsappNumber || "");
//           setCallNumber(res.data.callNumber || "");
//         }
//       } catch {
//         setWhatsappNumber("+911234567890");
//         setCallNumber("+911234567890");
//       }
//     };
//     fetchContactInfo();
//   }, []);

//   useEffect(() => {
//     const onScroll = () => setShowScrollTop(window.scrollY > 300);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const formatWhatsappNumber = (num: string) =>
//     num.replace(/[^\d]/g, "");

//   const openWhatsApp = () => {
//     if (!whatsappNumber) return;
//     window.open(
//       `https://wa.me/${formatWhatsappNumber(whatsappNumber)}`,
//       "_blank"
//     );
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 70,
//         left: 24,
//         zIndex: 9999,
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//       }}
//     >
//       {/* ✅ WHATSAPP BUTTON - SMALLER SIZE */}
//       <button
//         onClick={openWhatsApp}
//         aria-label="WhatsApp"
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: "50%",
//           backgroundColor: "#25D366",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//           cursor: "pointer",
//           border: "none",
//           transition: "transform 0.2s ease, box-shadow 0.2s ease",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "scale(1.05)";
//           e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.25)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "scale(1)";
//           e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
//         }}
//       >
//         <svg
//           width="22"
//           height="22"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill="#FFFFFF"
//             d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"
//           />
//         </svg>
//       </button>

//       {/* CALL BUTTON - SMALLER SIZE */}
//       <button
//         onClick={() => (window.location.href = `tel:${callNumber}`)}
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: "50%",
//           backgroundColor: "#FACC15",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//           border: "none",
//           cursor: "pointer",
//           transition: "transform 0.2s ease, box-shadow 0.2s ease",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "scale(1.05)";
//           e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.25)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "scale(1)";
//           e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
//         }}
//       >
//         <Phone size={20} color="#1E3A8A" />
//       </button>

//       {/* SCROLL TOP BUTTON - SMALLER SIZE (Uncommented if needed) */}
//       {showScrollTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           style={{
//             width: 44,
//             height: 44,
//             borderRadius: "50%",
//             backgroundColor: "#10B981",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//             border: "none",
//             cursor: "pointer",
//             transition: "transform 0.2s ease, box-shadow 0.2s ease",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = "scale(1.05)";
//             e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.25)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "scale(1)";
//             e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
//           }}
//         >
//           <ArrowUp size={20} color="#FFFFFF" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default FloatingContactButtons;