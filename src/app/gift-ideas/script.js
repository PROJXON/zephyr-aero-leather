export default function setupGiftIdeas() {
  setTimeout(() => {
    const categoryItems = document.querySelectorAll("[data-filter]");
    const giftItems = document.querySelectorAll(".gift-item");
    const track = document.querySelector("#carousel-track"); 
    const items = document.querySelectorAll(".carousel-item");
    const modal = document.getElementById("quick-view-modal");
    const closeModal = document.querySelector("#close-btn"); 
    const priceSort = document.getElementById("price-sort");
    const quantityDisplay = document.getElementById("quantity");
    const decreaseQty = document.getElementById("decrease-qty");
    const increaseQty = document.getElementById("increase-qty");

    if (!track || !items.length) return; 

    let slideWidth = items[0].offsetWidth + 10; 
    let interval;
    let quantity = 1;

    function startAutoScroll() {
      interval = setInterval(() => {
        if (!track.firstElementChild) return;
        let firstItem = track.firstElementChild;
        track.style.transition = "transform 0.5s ease-in-out";
        track.style.transform = `translateX(-${slideWidth}px)`;

        setTimeout(() => {
          track.style.transition = "none";
          track.appendChild(firstItem);
          track.style.transform = "translateX(0)";
        }, 500);
      }, 3000);
    }
    startAutoScroll();

    giftItems.forEach(item => {
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

    priceSort?.addEventListener("change", function () {
      let giftGrid = document.querySelector("#gift-grid"); 
      let items = Array.from(giftGrid.children);

      if (this.value === "low-high") {
        items.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
      } else if (this.value === "high-low") {
        items.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
      } else {
        items.sort((a, b) => {
          let nameA = a.getAttribute("data-name").toLowerCase();
          let nameB = b.getAttribute("data-name").toLowerCase();
          return nameA.localeCompare(nameB); 
        });
      }
      items.forEach(item => giftGrid.appendChild(item)); 
    });

    categoryItems.forEach(item => {
      item.addEventListener("click", () => {
        let filter = item.getAttribute("data-filter");
        giftItems.forEach(gift => {
          gift.classList.toggle("hidden", !(filter === "all" || gift.getAttribute("data-category") === filter));
        });
      });
    });
  }, 500);
}
