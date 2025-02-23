# Zephyr

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

Zephyr is a headless e-commerce solution powered by **Next.js** and **WooCommerce**, designed for seamless performance and flexibility.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Next.js](https://nextjs.org/) (Installed with project dependencies)
- [LocalWP](https://localwp.com/) (For local WordPress development)
- WooCommerce plugin (Installed and activated in WordPress)
- WooCommerce REST API Key (Created from **WooCommerce > Settings > Advanced > REST API**)

## Installation

Clone the repository and navigate to the project directory:

```sh
git clone https://github.com/projxon/zephyr.git
cd zephyr
```

### Ignore the `./frontend/` folder.

### Install Dependencies

```sh
npm install next@latest
```

### Start the Development Server

```sh
npm run dev
```

The application should now be running locally.

## Features

- **Headless WooCommerce** integration with Next.js
- **Optimized API calls** for fast product retrieval
- **Scalable and customizable** e-commerce setup

## Usage

1. Set up **LocalWP** and install WordPress.
2. Activate the **WooCommerce** plugin.
3. Create a WooCommerce REST API key:
   - Go to **WooCommerce > Settings > Advanced > REST API**
   - Click **Add Key**, provide a name, and set permissions to **Read/Write**
   - Copy the **Consumer Key** and **Consumer Secret**
4. Configure your `.env.local` file in the root of the project:

```sh
WOOCOMMERCE_API_URL=http://your-local-wp-site.com/wp-json/wc/v3
WOOCOMMERCE_API_KEY=your_consumer_key
WOOCOMMERCE_API_SECRET=your_consumer_secret
```

5. Restart the development server:

```sh
npm run dev
```
