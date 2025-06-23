# Zephyr Aero Leathers

Zephyr Aero Leathers is a headless e-commerce application using **Next.js** and **Tailwind CSS** for the frontend, with a **WooCommerce API backend**. The WooCommerce backend is deployed on **Amazon Lightsail**, but you are free to deploy it however you want (LocalWP, managed WordPress, etc.). This project supports both local development and cloud deployment.

There are some challenges implementing a headless WooCommerce backend, which this project addresses, with minimal use of custom PHP (although you will need a custom plugin to allow users to view and change their cart).

**Stripe** is used for payments (Stripe CLI will be needed for local dev work) and **Resend** for email functionality.

### Features

- **Guest and Registered User Support** – Seamless shopping experience for both guests and signed-in users.
- **Mobile-Friendly Design** – Responsive layout ensures a smooth experience on any device.
- **Real-Time Shipping Calculation** – Instantly calculates shipping costs during checkout, based on user input.
- **Automated Tax Calculation** – Fetches accurate tax rates directly from WooCommerce for every order.
- **USPS Address Verification (OAuth API)** – Validates shipping addresses in real time using the official USPS OAuth API.
- **Comprehensive Shopping Cart** – Persistent cart for guests and users, with easy add/remove/update functionality.
- **Secure Authentication** – Includes registration, login, logout, and password reset flows.
- **Forgot Password Functionality** – Secure password reset via Resend transactional email and WooCommerce integration.
- **Contact Form with Email Delivery** – User inquiries are sent directly to your team using Resend transactional email service.
- **Order History** – Users can view their complete order history and details.
- **Product Reviews** – Customers can leave and view reviews for products.
- **Stripe Payments** – Secure, integrated payment processing with Stripe (admin can manage payments via Stripe dashboard).
- **WooCommerce CMS Integration** – Full product and inventory management through WooCommerce.
- **JWT Authentication** – Secure API authentication for WooCommerce using JWT tokens.
- **Cart & Order Synchronization** – Real-time synchronization between frontend cart and WooCommerce backend.
- **Modern UI with Tailwind CSS** – Clean, responsive, and modern user interface built with Tailwind CSS.
- **Docker Support** – Containerized deployment for consistent development and production environments.
- **Nginx Reverse Proxy** – Production-ready web server configuration with SSL termination and security headers.
- **Automated SSL Renewal** – SSL certificates are automatically renewed using Certbot and cron jobs.
- **CI/CD Ready** – Project structure and scripts are ready for integration with CI/CD pipelines.

### Deployment Architecture

- S3 Bucket for hosting larger, high-quality images
- EC2 Instance for website hosting
- Lightsail for WordPress WooCommerce backend
- Squarespace for custom DNS
- Elastic IP to keep the IP consistent if the EC2 is restarted

---

## Prerequisites

- **Node.js** (Latest LTS recommended)
- **Next.js** (Installed with dependencies)
- **LocalWP** (For local development) or **Amazon Lightsail** (For WooCommerce backend hosting)
- **WordPress with WooCommerce**
- **JWT Authentication for WP REST API** plugin

---

## Installation

Clone the repository and navigate to the project folder:

```sh
git clone https://github.com/projxon/zephyr.git
cd zephyr
```

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

---

## WooCommerce Setup

Zephyr Aero Leathers uses a headless WooCommerce backend for product and order management. We deployed WooCommerce on Amazon Lightsail for reliable, easy-to-manage hosting, but you can deploy it however you prefer.

To set up WooCommerce for this project:

1. **Install and configure WooCommerce** on your WordPress site.
2. **Install and activate** the [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) plugin.
3. **Add these lines to your `wp-config.php` file** to enable JWT authentication:

   ```php
define('JWT_AUTH_SECRET_KEY', 'YOUR_SECRET_STRING_HERE');
define('JWT_AUTH_CORS_ENABLE', true);
```

4. **Generate a WooCommerce REST API key:**
   - Go to **WooCommerce > Settings > Advanced > REST API** in your WordPress admin.
   - Click **Add Key**, enter a name/description, and set permissions to **Read/Write**.
   - Save and copy the **Consumer Key** and **Consumer Secret**.

5. **Add these keys and your WooCommerce API URL to a `.env.local` file** in your project root:

   ```env
WOOCOMMERCE_API_URL=https://your-woocommerce-domain.com/wp-json/wc/v3
WOOCOMMERCE_API_KEY=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
WOOCOMMERCE_API_SECRET=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Custom Plugin: Customer Cart Editor

By default, WooCommerce restricts cart and order modifications to admin users only. To allow customers to securely update their own carts and orders via the REST API, we developed a custom plugin called **Customer Cart Editor**.

This plugin:
- Provides custom REST API endpoints scoped to authenticated users
- Enables customers to add, update, or remove cart items without admin privileges

If deploying your own WooCommerce backend, include this plugin to enable full cart functionality from the headless frontend.

---

## Environment Variables

Sensitive keys are not committed to the repo. Use the `.env.example` file as a template.

Create a `.env` file in your project root with:

```env
WOOCOMMERCE_API_URL=https://api.zephyraeroleather.com
WOOCOMMERCE_API_KEY=your_consumer_key_here
WOOCOMMERCE_API_SECRET=your_consumer_secret_here

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

RESEND_API_KEY=your_resend_api_key_here
```

---

## Running Locally

Start the development server with:

```sh
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

---

## Deployment on AWS EC2

1. **SSH into your EC2 instance:**

   ```bash
ssh -i "path/to/zephyr_key.pem" ec2-user@your-ec2-ip-address
```

2. **Navigate to your project directory and pull updates:**

   ```bash
cd zephyr-aero-leather
git pull origin main
npm install
```

3. **Upload your `.env` file** to the root of the project on EC2.

4. **Build the app with increased memory allocation:**

   ```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

5. **Sync updated static assets to your S3 bucket:**

   ```bash
aws s3 sync ./public s3://cdn.zephyraeroleather.com/public --acl public-read
```

6. **Restart the app using PM2:**

   ```bash
pm2 restart zephyr
```

---

## Image Hosting & CDN

Images are stored in **AWS S3** and delivered globally via **CloudFront CDN** for fast, reliable load times.

---

## Payment Processing

All payments are securely processed using **Stripe API**.

---

## Email Service

Transactional emails are sent through **Resend API** for reliable delivery.

---

## SSL Setup

- For **LocalWP**, trust your local development site's HTTPS certificate.
- For **Amazon Lightsail**, install Certbot to enable HTTPS:

  ```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

---

## License

MIT License

---

## Contact

**Evan Perry** — [eperry2688@gmail.com]

- GitHub: [https://github.com/PROJXON/zephyr-aero-leather](https://github.com/PROJXON/zephyr-aero-leather)
- Website: [https://zephyraeroleather.com](https://zephyraeroleather.com)