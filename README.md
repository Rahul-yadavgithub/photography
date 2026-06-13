<!-- Replace this with a stunning cover image of your studio/platform -->
<div align="center">
  <img src="https://via.placeholder.com/1000x300?text=Shubman+Photo+Studio+Platform" alt="Platform Banner">

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

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation & Running Locally

The project is split into three main directories: `Backend`, `Frontend` (Customer-facing), and `frontend1` (Admin Dashboard).

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/photography-platform.git
   cd photography-platform
   ```

2. **Start the Backend Server**
   Open a new terminal and navigate to the Backend directory:
   ```sh
   cd Backend
   npm install
   npm run dev
   ```
   *(The backend usually runs on `http://localhost:5000`)*

3. **Start the Customer Frontend**
   Open a second terminal:
   ```sh
   cd Frontend
   npm install
   npm run dev
   ```
   *(The frontend usually runs on `http://localhost:5173`)*

4. **Start the Admin Dashboard**
   Open a third terminal:
   ```sh
   cd frontend1
   npm install
   npm run dev
   ```

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

*(Upload your screenshots to your repository or image host and update the links below)*

| Customer Booking Flow | Admin Package Dashboard |
| --------------------- | ----------------------- |
| <img src="https://via.placeholder.com/600x400?text=Booking+Flow+Screenshot" width="100%"> | <img src="https://via.placeholder.com/600x400?text=Admin+Dashboard+Screenshot" width="100%"> |

| Cinematic Portfolio | E-Commerce Store |
| ------------------- | ---------------- |
| <img src="https://via.placeholder.com/600x400?text=Portfolio+Screenshot" width="100%"> | <img src="https://via.placeholder.com/600x400?text=Store+Screenshot" width="100%"> |

---

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files.

**Backend (`Backend/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongo_connection_string
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_URL=your_cloudinary_url
CORS_ORIGIN=http://localhost:5173
```

**Frontend (`Frontend/.env`)**
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

---

## 🤝 Contact

**Shubman Photo Studio** - [Website Link](https://your-website.com)

Project Link: [https://github.com/your-username/photography-platform](https://github.com/your-username/photography-platform)
