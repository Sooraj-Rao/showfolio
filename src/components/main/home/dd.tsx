// const [activeTab, setActiveTab] = useState(0);

// const features = [
//   {
//     title: "Smart Document Management",
//     description:
//       "Store and organize all your resumes, cover letters, and career documents in one secure location with easy access.",
//     icon: FileText,
//     benefits: [
//       "Unlimited storage for all your career documents",
//       "Organize by job type, company, or custom categories",
//       "Version control to track changes and updates",
//       "Secure cloud storage with privacy controls",
//     ],
//     image: "/placeholder.svg?height=450&width=800",
//   },
//   {
//     title: "AI-Powered Optimization",
//     description:
//       "Get intelligent suggestions to improve your resume and increase your chances of landing interviews.",
//     icon: Sparkles,
//     benefits: [
//       "Keyword optimization for ATS compatibility",
//       "Content suggestions based on job descriptions",
//       "Grammar and style improvements",
//       "Industry-specific recommendations",
//     ],
//     image: "/placeholder.svg?height=450&width=800",
//   },
//   {
//     title: "Advanced Analytics",
//     description:
//       "Track views, downloads, and engagement with detailed analytics to optimize your applications.",
//     icon: BarChart3,
//     benefits: [
//       "Real-time tracking of resume views and downloads",
//       "Engagement metrics for each section of your resume",
//       "Comparison tools for different resume versions",
//       "Insights on which skills and experiences attract attention",
//     ],
//     image: "/placeholder.svg?height=450&width=800",
//   },
//   {
//     title: "Custom Portfolio Builder",
//     description:
//       "Create a beautiful portfolio website to showcase your projects, skills, and experience.",
//     icon: Palette,
//     benefits: [
//       "Beautiful, customizable templates",
//       "Showcase projects with rich media galleries",
//       "Integrated blog for sharing your insights",
//       "Mobile-responsive design for all devices",
//     ],
//     image: "/placeholder.svg?height=450&width=800",
//   },
//   {
//     title: "Easy Sharing & Custom Domain",
//     description:
//       "Share your resume with custom links and QR codes, plus get your own personalized subdomain.",
//     icon: Link2,
//     benefits: [
//       "Custom shareable links for each document",
//       "QR codes for easy sharing on business cards",
//       "Your own custom subdomain (you.resumehub.com)",
//       "Privacy controls to manage who can view your content",
//     ],
//     image: "/placeholder.svg?height=450&width=800",
//   },
// ];






// <section id="features" className="py-20">
// <div className="container px-4">
//   <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
//     <motion.div
//       className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
//       whileHover={{ scale: 1.05 }}
//     >
//       <span>Key Features</span>
//     </motion.div>
//     <h2 className="text-3xl font-bold">
//       Everything You Need to Succeed
//     </h2>
//     <p className="text-lg text-muted-foreground">
//       Our platform provides all the tools you need to manage your career
//       documents and stand out from the crowd.
//     </p>
//   </ScrollReveal>

//   <div className="mb-10">
//     <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
//       {features.map((feature, index) => (
//         <motion.button
//           key={index}
//           className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//             activeTab === index
//               ? "bg-primary text-primary-foreground"
//               : "bg-muted hover:bg-muted/80 text-foreground"
//           }`}
//           onClick={() => setActiveTab(index)}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <div className="flex items-center gap-2">
//             <feature.icon className="h-4 w-4" />
//             <span>{feature.title}</span>
//           </div>
//         </motion.button>
//       ))}
//     </div>

//     <AnimatePresence mode="wait">
//       <motion.div
//         key={activeTab}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.3 }}
//         className="grid md:grid-cols-2 gap-12 items-center"
//       >
//         <div className="space-y-6">
//           <div className="flex items-center gap-3">
//             <motion.div
//               className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
//               whileHover={{ scale: 1.1, rotate: 5 }}
//             >
//               {React.createElement(features[activeTab].icon, {
//                 className: "h-5 w-5 text-primary",
//               })}
//             </motion.div>
//             <h3 className="text-2xl font-semibold">
//               {features[activeTab].title}
//             </h3>
//           </div>
//           <p className="text-lg text-muted-foreground">
//             {features[activeTab].description}
//           </p>
//           <div className="space-y-4">
//             {features[activeTab].benefits.map((item, i) => (
//               <motion.div
//                 key={i}
//                 className="flex items-start gap-3"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.1 * i }}
//               >
//                 <motion.div
//                   whileHover={{ scale: 1.2, rotate: 5 }}
//                   className="mt-0.5"
//                 >
//                   <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
//                 </motion.div>
//                 <span>{item}</span>
//               </motion.div>
//             ))}
//           </div>
//           <motion.div
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             <Button className="group">
//               Learn More
//               <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </Button>
//           </motion.div>
//         </div>
//         <div className="relative">
//           <motion.div
//             className="aspect-video rounded-xl overflow-hidden border shadow-xl"
//             whileHover={{ scale: 1.02 }}
//             transition={{ type: "spring", stiffness: 300 }}
//           >
//             <img
//               src={features[activeTab].image || "/placeholder.svg"}
//               alt={features[activeTab].title}
//               className="object-cover w-full h-full"
//             />
//             <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
//               <div className="p-6 text-white">
//                 <h3 className="text-xl font-bold">
//                   {features[activeTab].title}
//                 </h3>
//                 <p className="text-sm opacity-80">
//                   Click to explore this feature
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Decorative elements */}
//           <motion.div
//             className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary/10"
//             animate={{
//               scale: [1, 1.1, 1],
//               rotate: [0, 5, 0],
//             }}
//             transition={{
//               duration: 5,
//               repeat: Number.POSITIVE_INFINITY,
//               repeatType: "reverse",
//             }}
//           />
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   </div>
// </div>
// </section>