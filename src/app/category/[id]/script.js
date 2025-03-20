export default function setupGiftIdeas() {
    setTimeout(() => {
      const productItems = document.querySelectorAll(".group.relative"); 
      const modal = document.getElementById("quick-view-modal");
      const closeModal = document.getElementById("close-btn");
      const quantityDisplay = document.getElementById("quantity");
      const decreaseQty = document.getElementById("decrease-qty");
      const increaseQty = document.getElementById("increase-qty");
      const navLinks = document.querySelectorAll("nav a"); 
  
      let quantity = 1;
  
      productItems.forEach((item) => {
        item.addEventListener("click", () => {
          const name = item.getAttribute("data-name") || "Product";
          const price = item.getAttribute("data-price") || "N/A";
          const image = item.getAttribute("data-image") || "";
          const description = item.getAttribute("data-description") || "No description available.";
  
          document.getElementById("modal-image").src = image;
          document.getElementById("modal-title").textContent = name;
          document.getElementById("modal-description").textContent = description;
          document.getElementById("modal-price").textContent = `$${price}`;
  
          quantity = 1;
          quantityDisplay.textContent = quantity;
          modal.classList.remove("hidden"); 
        });
      });
  
      if (closeModal) {
        closeModal.addEventListener("click", () => modal.classList.add("hidden"));
        window.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.add("hidden");
        });
      }
  
      increaseQty?.addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
      });
  
      decreaseQty?.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantityDisplay.textContent = quantity;
        }
      });
  
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          modal.classList.add("hidden"); 
          modal.style.display = "none"; 
        });
      });
  
    }, 500);
  }
  