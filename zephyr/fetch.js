import https from "https";
import fetch from "node-fetch"; // Make sure to install: npm install node-fetch

const url = "https://zephyr.local/wp-json/wc/v3/products?consumer_key=ck_a18c3985d68572523626d44b44a5d886ee11b48a&consumer_secret=cs_d7a3f18df7ea215dd9079d0d8ef445da561238b0";

async function testFetch() {
  try {
    console.log("Fetching from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      agent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL issues
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Response Error:", errorData);
      return;
    }

    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

testFetch();
