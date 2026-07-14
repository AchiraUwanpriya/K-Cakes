// const AuthLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#120214] via-[#1d0126] to-[#280637] dark:from-[#050109] dark:via-[#120214] dark:to-[#2c0a3f]">
//       {/* Full-bleed background image (smart fallback) */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <img
//           src="/cake3.jpg"
//           alt=""
//           aria-hidden="true"
//           className="w-full h-full object-cover object-center filter brightness-75 blur-sm"
//         />
//       </div>

//       {/* Subtle decorative SVG above the video */}
//       <div className="absolute inset-0 z-10 opacity-50 pointer-events-none">
//         <svg
//           className="w-full h-full"
//           xmlns="http://www.w3.org/2000/svg"
//           preserveAspectRatio="none"
//           viewBox="0 0 800 600"
//           fill="none"
//         >
//           <defs>
//             <linearGradient id="g1" x1="0" x2="1">
//               <stop offset="0" stopColor="#8b1fd3" stopOpacity="0.28" />
//               <stop offset="1" stopColor="#d946ef" stopOpacity="0.2" />
//             </linearGradient>
//             <linearGradient id="g2" x1="0" x2="1">
//               <stop offset="0" stopColor="#a855f7" stopOpacity="0.2" />
//               <stop offset="1" stopColor="#f472b6" stopOpacity="0.18" />
//             </linearGradient>
//           </defs>
//           <rect width="800" height="600" fill="url(#g1)" rx="0" />
//           <g transform="translate(-100, -80)">
//             <ellipse cx="420" cy="220" rx="420" ry="160" fill="url(#g2)" />
//             <ellipse cx="100" cy="480" rx="220" ry="120" fill="#3b0a4a" />
//           </g>
//         </svg>
//       </div>

//       {/* Gradient overlay to improve contrast and reveal video subtly */}
//       <div
//         className="absolute inset-0 z-20 pointer-events-none"
//         style={{
//           background:
//             "linear-gradient(90deg, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.28) 45%, rgba(6,6,6,0.08) 100%)",
//         }}
//       />

//       <div className="container mx-auto px-6 py-12 relative z-30">
//         <div className="mx-auto max-w-4xl rounded-2xl soft-shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
//           {/* Left branding / illustration */}
//           <div className="hidden md:flex flex-col justify-center gap-6 px-10 py-12 bg-gradient-to-br from-[#8b1fd3] via-[#a021d6] to-[#d946ef] text-white">
//             <div>
//               <h1 className="text-3xl font-extrabold"> Sweet of K Cakes</h1>
//               <p className="mt-2 text-sm opacity-90">
//                 Craft irresistible lessons, schedule baking workshops, and
//                 celebrate every student milestone for Sweet of K Cakes.
//               </p>
//             </div>

//             {/* Playful cake illustration to reinforce the brand */}
//             <div className="mt-6">
//               <svg
//                 width="220"
//                 height="150"
//                 viewBox="0 0 220 150"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 aria-hidden
//               >
//                 <g filter="url(#shadow)">
//                   <path
//                     d="M40 110h140c10 0 18 8 18 18v2H22v-2c0-10 8-18 18-18z"
//                     fill="rgba(255,255,255,0.25)"
//                   />
//                 </g>
//                 <path
//                   d="M60 100h100l8 30H52l8-30z"
//                   fill="rgba(255,255,255,0.3)"
//                 />
//                 <path
//                   d="M68 88h84l6 12H62l6-12z"
//                   fill="rgba(255,255,255,0.55)"
//                 />
//                 <path
//                   d="M74 72h72c8 0 14 6 14 14v2H60v-2c0-8 6-14 14-14z"
//                   fill="rgba(255,255,255,0.8)"
//                 />
//                 <path
//                   d="M82 58c0-8 6-14 14-14 8 0 14 6 14 14 0-8 6-14 14-14 8 0 14 6 14 14"
//                   stroke="rgba(255,255,255,0.85)"
//                   strokeWidth="6"
//                   strokeLinecap="round"
//                 />
//                 <circle cx="110" cy="40" r="8" fill="rgba(255,255,255,0.85)" />
//                 <path
//                   d="M110 26c3 0 6 3 6 6s-3 6-6 6-6-3-6-6 3-6 6-6z"
//                   fill="rgba(255,255,255,0.7)"
//                 />
//                 <defs>
//                   <filter
//                     id="shadow"
//                     x="12"
//                     y="100"
//                     width="196"
//                     height="40"
//                     filterUnits="userSpaceOnUse"
//                     colorInterpolationFilters="sRGB"
//                   >
//                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                     <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
//                     <feComposite
//                       in2="SourceAlpha"
//                       operator="in"
//                       result="effect1_backgroundBlur"
//                     />
//                     <feBlend
//                       mode="normal"
//                       in="SourceGraphic"
//                       in2="effect1_backgroundBlur"
//                       result="shape"
//                     />
//                   </filter>
//                 </defs>
//               </svg>
//             </div>
//           </div>

//           {/* Right: form container (glass card) */}
//           <div className="bg-white/95 dark:bg-gray-800 p-8 md:p-12 glass-surface">
//             <div className="max-w-md mx-auto">{children}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthLayout;
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#120214] via-[#1d0126] to-[#280637] dark:from-[#050109] dark:via-[#120214] dark:to-[#2c0a3f]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                             linear-gradient(to bottom, #888 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mx-auto max-w-6xl rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left side: Background image with overlay content */}
            <div className="relative overflow-hidden">
              {/* Background video (fallback poster is cake3.jpg) */}
              <video
                poster="/cake3.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/cake1.mp4" type="video/mp4" />
                {/* Fallback image for very old browsers */}
                <img src="/cake3.jpg" alt="Delicious cakes display" className="w-full h-full object-cover" />
              </video>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-purple-900/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                <div className="absolute top-12 left-12 w-8 h-8 border-2 border-white/30 rounded-full"></div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                <div className="absolute bottom-12 right-12 w-8 h-8 border-2 border-white/30 rounded-full"></div>
              </div>
              
              {/* Floating decorative circles */}
              <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white/40 rounded-full animate-bounce"></div>
              <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-pink-400/40 rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-purple-400/50 rounded-full animate-bounce delay-500"></div>
              
              {/* Content overlay */}
              <div className="relative h-full flex flex-col justify-between p-8 md:p-12 text-white">
                {/* Logo/Branding */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <img src="/Logo.png" alt="Sweet of K Cakes logo" className="w-12 h-12 rounded-lg object-cover shadow-lg" />
                    <h1 className="text-3xl font-bold tracking-tight">Sweet of K Cakes</h1>
                  </div>
                </div>
                
                {/* Main text content */}
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Bake. Create.<br />
                    <span className="text-pink-300">Celebrate.</span>
                  </h2>
                  
                  <div className="space-y-4 text-lg opacity-90 max-w-md">
                    <p className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      Craft irresistible lessons
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Schedule baking workshops
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      Celebrate every student milestone
                    </p>
                  </div>
                  
                  {/* Decorative quote */}
                  <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <p className="italic text-lg mb-2">"Where every cake tells a story and every lesson creates memories"</p>
                    <div className="flex items-center gap-3">
                      <img src="/admin.png" alt="Kaushalya Samaraweera" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">Kaushalya Samaraweera</p>
                        <p className="text-sm opacity-80">Managing Director, Sweet of K Cakes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative cake illustration */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="relative w-48 h-48">
                      {/* Cake base */}
                      <div className=""></div>
                      {/* Cake middle */}
                      <div className=""></div>
                      {/* Cake top */}
                      <div className=""></div>
                      {/* Cherry */}
                      <div className=""></div>
                      {/* Candle */}
                      <div className="">
                        <div className=""></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Login form */}
            <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 md:p-12">
              <div className="h-full flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  {/* Form header */}
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sign in to manage courses, workshops, and sweet creations
                    </p>
                  </div>
                  
                  {/* Login form */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    {children}
                  </div>
                  
                  {/* Footer note */}
                  {/* <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      By signing in, you agree to our{" "}
                      <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                   */}
                  {/* Decorative flourishes */}
                  <div className="mt-8 flex justify-center items-center gap-6">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Sweet Moments Await
                    </div>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Sweet of K Cakes. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;