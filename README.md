# Zephyr Aero Leathers

Zephyr Aero Leathers is a headless e-commerce application using **Next.js**, **Tailwind CSS**, and **Flowbite components** for the frontend, with a **WooCommerce API backend**. It supports deployment on **Amazon Lightsail** or **LocalWP** for local development.

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (Latest LTS recommended)
- **Next.js** (Installed with dependencies)
- **LocalWP** (For local development) or **Amazon Lightsail** (For cloud deployment)
- **WordPress with WooCommerce**
- **JWT Authentication for WP REST API** plugin

## Installation

Clone the repository and navigate to the project folder:

```sh
git clone https://github.com/projxon/zephyr-aero-leathers.git
cd zephyr
```

### Install Dependencies

```sh
npm install next@latest
```

### Start Development Server

```sh
npm run dev
```

## WooCommerce Setup

1. Set up **WooCommerce** on your WordPress installation.
2. Install & activate **JWT Authentication for WP REST API**.
3. Edit your `wp-config.php` file and add:

```php
define('JWT_AUTH_SECRET_KEY', 'YOUR_SECRET_STRING_HERE');
define('JWT_AUTH_CORS_ENABLE', true);
```

4. Create a WooCommerce REST API Key:
   - Go to **WooCommerce > Settings > Advanced > REST API**
   - Click **Add Key**, provide a name, and set permissions to **Read/Write**
   - Copy the **Consumer Key** and **Consumer Secret**

5. Create a `.env.local` file in the root of the project and add:

```sh
WOOCOMMERCE_API_URL=http://your-site.com/wp-json/wc/v3
WOOCOMMERCE_API_KEY=ck_...................
WOOCOMMERCE_API_SECRET=cs_.................
```

## SSL Setup

For **LocalWP**, trust the site for HTTPS.

For **Amazon Lightsail**, install **Certbot**:

```sh
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

## License

MIT
