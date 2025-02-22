# zephyr
Zephry Aero Leathers repo

Frontend built with NextJS, Tailwind, and uses Flowbite components. The backend is a headless woocommerce API. You can use Lightsail or localWP.

npm install from zephyr folder, and use npm run dev for development. 

Set up a woocommerce wordpress and install & activate:
JWT Authentication for WP REST API and then edit the wp-config.php and add 
define('JWT_AUTH_SECRET_KEY', 'SECRET STRING HERE');
define('JWT_AUTH_CORS_ENABLE', true);

Woocommerce. Go to Settings, Advanced, Rest API and add Key and add the variables to the .env.local:

Create a .env.local in root with the following:
WOOCOMMERCE_API_URL=...
WOOCOMMERCE_API_KEY=ck_..........
WOOCOMMERCE_API_SECRET=cs_........

Install certbot on Lightsail, or trust the site on LocalWP for https.
For Lightsail:
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx


Connect to the Li