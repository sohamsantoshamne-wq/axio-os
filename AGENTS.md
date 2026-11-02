# AXIO OS - Project Engineering & Quality Standards

This document establishes the permanent, non-negotiable standards for this codebase. Any agent or developer working on this project must strictly comply with these rules.

## 1. Zero Security Loopholes & Payment Protection
- **No Client-Side Bypasses:** Never introduce manual entry prompts, fallback text inputs, or URL query overrides that allow anyone to bypass payment or unlock the application without verified gateway confirmation.
- **Payment Verification:** Access is unlocked strictly and exclusively when Razorpay's official live gateway callback executes (`rzp_live_Tv0OjmASWlUYZg`).
- **Cryptographic VIP Keys:** Unlocked VIP licenses follow the checksum pattern `AXIO-VIP-XXXX-YYYY-LIFETIME` verified by `verifyLicenseKey()`.

## 2. Real Business Identity & No Hallucinated Data
- **Official Support Email:** `axio.os.ltd@gmail.com` is the only official support email. Never invent domains (e.g. `@axio-os.com`) or placeholder contacts.
- **Merchant Details:** Name is Soham Amne, registered in Maharashtra, India.
- **Pricing:** Lifetime license is ₹199 (INR).

## 3. Non-Destructive Responsive Design
- **No Hiding Features to Fix Overflow:** Never use `display: none` on user-facing features (such as `.live-clock-card`, `.nav-tab-label`, `.brand-badge-sub`, `.header-daily-progress-card`, or habit descriptions) to solve horizontal clipping.
- **Fluid Proportional Scaling:** Use proportional padding, flexible gaps, and container queries so all elements fit naturally across desktops, laptops (1024px–1366px), tablets, and phones (360px–420px).
- **Mobile Stacking:** On narrow mobile screens, cards must stack cleanly with full-width touch targets rather than cramping elements horizontally.

## 4. Pristine User Slate
- **Zero Pre-Filled Checkboxes:** The habit matrix and interactive demo must always initialize 100% empty (`0/8 Done Today (0%)`, `0/15 Days Done`).
- **No Mock Test Data in Production:** Never hardcode dummy checkmark loops in production defaults.

## 5. Build, Verification & Deployment Pipeline
- Always use `scripts/build-sync.js` (`npm run build`) to ensure `index.template.html` compiles cleanly through Vite and syncs with root and `dist/`.
- Validate with headless multi-viewport testing before reporting completion.
