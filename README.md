# Movie Ticket Booking Web App

## 🚀 Project Overview

A Front-end, modern, and user-friendly movie ticket booking web application designed to provide seamless seat selection, secure payments, and real-time movie schedules for cinema lovers. Built with industry-best practices and a focus on delivering a real-world product experience.

---

## ✨ Key Features

* **Browse Movies:** Discover now showing & upcoming movies with posters, trailers, cast, and synopses.
* **Search & Filter:** Instantly find movies by genre, title, language, and location.
* **Showtimes & Theatres:** View all available theatres, show timings, and seat availability in your city.
* **Responsive UI:** Lightning-fast, mobile-first design with rich user experience.
* **Real-Time Seat Selection:** Interactive seat map; pick your seats visually, with instant availability updates.
* **Secure Booking:** Quick, secure booking with confirmation emails.
* **User Accounts:** Login/Signup, booking history, and easy ticket downloads.
* **Payment Integration:** Multiple payment gateways for a hassle-free transaction.
* **Accessibility:** Designed for inclusivity—screen reader friendly and keyboard navigable.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, TypeScript
* **Backend:** Node.js, Express.js

* **Payment Integration:** Razorpay/Stripe (Pluggable)
* **Deployment:** Vercel/Netlify (Frontend), Render/Heroku (Backend)
* **Other:** Cloudinary (for movie posters), ESLint + Prettier (for clean code), GitHub Actions (CI/CD)

---

## 💳 Payments Integration

- **Razorpay (Test Mode):**  
  Implemented end-to-end payment functionality using Razorpay’s developer sandbox.  
  Users can complete bookings and simulate payment success or failure using Razorpay test cards.

  > _Note: For security, real payments are disabled. This project uses Razorpay’s test credentials. For production, simply replace with live keys and enable payment verification._

---

## 📡 External APIs

- **TMDB API:**  
  Used to fetch the latest movie listings, posters, trailers, and detailed metadata.  
  All movie content displayed in the app is dynamically pulled from [The Movie Database (TMDB)](https://www.themoviedb.org/).

  > _Note: You must provide your own TMDB API key in the `.env` file to run the app locally._

---

## 💡 What Sets This Project Apart?

* **Real-World Problem Solving:** Designed with feedback from moviegoers & theatre staff; focuses on solving real pain points like last-minute seat conflicts, smooth refunds, and user notifications.
* **Enterprise-Ready:** Clean codebase, modular architecture, scalable for multiplex chains, easily extendable for new features (offers, wallet, QR check-ins).
* **Security First:** Strict input validation, secure JWT authentication, payment flow tested for edge cases.
* **DevOps Practices:** Automated deployments, CI/CD integration, zero-downtime updates.
* **Best UX Practices:** Dark/light mode, error handling, loading skeletons, and micro-interactions for premium feel.

---

## 📷 App Screenshots

*Homepage-Light Mode*
![home page light mode](https://github.com/user-attachments/assets/18471176-ec0f-4b7b-824b-37d31512b328)

*Homepage-Dark Mode*
![home page dark mode](https://github.com/user-attachments/assets/e44996df-6d09-4a46-959c-28292d55d03d)


*Show Times-Light Mode*
![show times light mode](https://github.com/user-attachments/assets/ef3822b1-673a-4369-94bc-acc935025eab)

*Seat Booking-Light Mode*
![seat booking light mode](https://github.com/user-attachments/assets/d377e900-3d70-410b-a0a0-bffd1ef8b153)

*Razorpay Integration*
![razorpay integration](https://github.com/user-attachments/assets/aae487df-f707-4c58-9f24-d51971e3add6)

*Payment through Razorpay*
![payment razorpay](https://github.com/user-attachments/assets/061ac095-882d-4c56-8a46-decc47d190a3)

---

## 🚦 Getting Started (Local Setup)

1. **Clone the repo**

```bash
git clone https://github.com/your-username/movie-ticket-app.git
cd movie-ticket-app
```

2. **Install dependencies**

```bash
npm install # or yarn install
```

3. **Set up environment variables**
   Create `.env` files in `/client` and `/server` (sample below):

```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PAYMENT_KEY=your-key
```

4. **Run locally**

```bash
# In separate terminals:
npm run dev    # frontend
yarn server    # backend
```

---

## 👨‍💻 Folder Structure

```
movie-ticket-app/
├── client/       # React Frontend
├── server/       # Node.js Backend
├── shared/       # Types & shared utils
├── README.md
```

---

## 📈 Roadmap / Future Improvements

* Offer/coupon engine
* QR-code check-in at theatre
* Social login & sharing

---

## 🤝 Acknowledgements

* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Node.js](https://nodejs.org/)
* Inspiration: BookMyShow, Paytm Movies, Fandango

---

## 📬 Contact

**Developed by:** \Rallabandi Lakshmi Narasimham

* Email: [narasimhamadi89@gmail.com](mailto:narasimhamadi89@gmail.com)
* LinkedIn: \[https://www.linkedin.com/in/rlnarasimham/]
* Portfolio: \[https://my-portfolio-git-17cb02-rallabandi-lakshmi-narasimhams-projects.vercel.app/]

*Thank you for reviewing my project!*
