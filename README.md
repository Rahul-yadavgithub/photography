<!-- Replace this with a stunning cover image of your studio/platform -->
<div align="center">
  <img src="https://res.cloudinary.com/dzbliymin/image/upload/v1781342011/Screenshot_from_2026-06-13_14-36-08_cobakj.png alt="Platform Banner">

  <h1 align="center">Shubman Photo Studio Platform</h1>

  <p align="center">
    A premium, full-stack photography booking and portfolio platform designed to deliver a high-end, cinematic user experience.
    <br />
    <a href="#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

<!-- BADGES -->
<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
</div>

## 📸 About The Project

The **Shubman Photo Studio Platform** is a state-of-the-art web application built to serve as both a breathtaking visual portfolio and a fully functional business management system. It moves beyond standard static templates to offer dynamic, interactive experiences using modern web technologies. 

Whether a user is browsing cinematic film reels, scrolling through dynamic pose galleries, shopping for prints, or booking a complex photography package with add-ons—the platform ensures a frictionless, Amazon-style checkout and a premium aesthetic.

### ✨ Key Features

* **Premium Booking Engine:** Dynamic package calculation (including active offers, add-on configurations, and base price adjustments) seamlessly integrated with Razorpay.
* **Cinematic Portfolio Galleries:** Masonry layouts and infinite auto-scrolling carousels powered by Framer Motion.
* **Dynamic Pose Inspiration:** An interactive database of photography poses dynamically loaded from Cloudinary and MongoDB.
* **E-Commerce Store:** A fully integrated store with a sliding cart drawer and secure checkout flow.
* **Dedicated Admin Dashboard:** A robust management system (`frontend1`) to manage packages, active offers, publish/draft states, and track bookings.

---

## 💻 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Clerk (Authentication)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Payments:** Razorpay Integration
- **Storage/Media:** Cloudinary

---

## 🚀 Project Status: Closed Source

Please note that the **Shubman Photo Studio Platform** is a proprietary, closed-source web application. 

This repository serves strictly as a **public showcase** and documentation hub to demonstrate the architecture, features, and capabilities of the platform. The actual source code (Frontend, Backend, and Admin Dashboard) is hosted in a separate, private repository to protect the intellectual property and business logic.

Therefore, this repository cannot be cloned to run the application locally. You can explore the live demo link provided at the top or view the screenshots below to experience the platform.

---

## 📁 Project Structure

```text
Photography/
├── Backend/                # Express.js API, MongoDB schemas, Controllers
│   ├── src/
│   ├── .env                # Backend Secrets (Database URI, Razorpay Keys)
│   └── package.json
├── Frontend/               # Customer-Facing React Application (Vite)
│   ├── src/
│   │   ├── api/            # API Service functions connecting to backend
│   │   ├── components/     # UI Components (Hero, Carousels, Store)
│   │   ├── context/        # React Context (BookingContext, IntentContext)
│   │   └── pages/          # Main Views (PackagesPage, PackageDetailPage)
│   └── package.json
└── frontend1/              # Admin Panel React Application (Vite)
    ├── src/
    │   ├── components/     # Admin Layouts (Sidebar, Modals)
    │   └── pages/          # Management Views (PackagesDashboard)
    └── package.json
```

---

## 🖼️ Media & Screenshots

**

| Customer Booking Flow | Admin Package Dashboard |
| --------------------- | ----------------------- |
| <img src="https://res.cloudinary.com/dzbliymin/image/upload/v1781342011/Screenshot_from_2026-06-13_14-36-08_cobakj.png" width="100%"> | <img src="https://res.cloudinary.com/dzbliymin/image/upload/v1781342437/Screenshot_from_2026-06-13_14-50-18_h1zoby.png" width="100%"> |

| E-Commerce Store |
| ---------------- |
|  <img src="https://res.cloudinary.com/dzbliymin/image/upload/v1781342888/Screenshot_from_2026-06-13_14-57-32_uc2w6y.png" width="100%"> |

---



## 🤝 Contact

**Shubman Photo Studio** - [Website Link](https://photography-alpha-gold.vercel.app)

Project Link: [https://github.com/Rahul-yadavgithub/photography](https://github.com/Rahul-yadavgithub/photography)
