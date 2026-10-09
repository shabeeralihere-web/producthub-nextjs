# ProductHub — Next.js Frontend

A modern e-commerce web application built with **Next.js and Bootstrap**, designed to provide a smooth shopping experience for customers and dedicated product management tools for sellers and administrators.

## Overview

ProductHub is a full-stack e-commerce project that connects customers, sellers, and administrators through a role-based application. This repository contains the frontend, built with Next.js, and communicates with a separate backend API.

## Features

- **Authentication** — Login and registration.
- **Role-based access** — Separate access for customers, sellers, and administrators.
- **Product browsing** — Explore products and view product details.
- **Shopping cart** — Add and manage cart items.
- **Checkout and orders** — Shopping and order-related workflows.
- **Seller dashboard** — Manage products and access seller tools.
- **Product management** — Add, edit, and manage product listings.
- **Admin dashboard** — Administrative interface.
- **Responsive UI** — Bootstrap-based layouts for different screen sizes.
- **Protected navigation** — Redirect users based on authentication and authorization rules.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** JavaScript
- **UI:** React and Bootstrap
- **Forms:** React Hook Form
- **Validation:** Yup
- **Backend:** Node.js and Express.js (separate repository)
- **Database:** MongoDB (managed by the backend)
- **Image Storage:** Cloudinary (integrated through the backend)

## Project Architecture

The frontend and backend are maintained separately.

- **Frontend:** Next.js application responsible for pages, UI, user interactions, and frontend routing.
- **Backend:** Express API responsible for authentication, business logic, database operations, and product-related services.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/producthub-nextjs.git
   ```

2. Navigate to the project directory:

   ```bash
   cd producthub-nextjs
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the required environment variables in a local `.env.local` file, following the variable names used by the application.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

The application may require environment variables for backend API communication and other configuration.

Create a `.env.local` file in the project root and add the variables required by your current configuration.

**Important:** Never commit `.env.local` or expose private API keys, database credentials, authentication secrets, or other sensitive values.

## Project Structure

The application uses the Next.js App Router. The structure may evolve as development continues.

```text
producthub-nextjs/
├── public/             # Static assets and images
├── src/
│   └── app/            # App Router pages, layouts, and route handlers
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Development

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

## Project Goals

- Build a practical, full-stack e-commerce application.
- Implement clear authentication and role-based user experiences.
- Organize frontend and backend responsibilities separately.
- Develop maintainable application structure and reusable UI components.
- Practice real-world web development and deployment workflows.

## Future Improvements

Potential improvements include enhanced search and filtering, accessibility refinements, performance optimization, expanded testing, and additional user experience improvements.

