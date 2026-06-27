document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");
  const productsContainer = document.getElementById("products-container");
  const favKey = "favouriteProducts";

  if (!productsContainer) {
    console.warn("⚠️ No products container found. Skipping product loading.");
    return;
  }

  // تحديد الفئة حسب الصفحة
  const currentPage = window.location.pathname;
  let pageCategory = "";
  if (currentPage.includes("pottery.html")) pageCategory = "pottery";
  if (currentPage.includes("accessories.html")) pageCategory = "accessories";
  if (currentPage.includes("corchet.html")) pageCategory = "crochet";
  if (currentPage.includes("artwork.html")) pageCategory = "artwork";

  console.log("📌 Loading products for category:", pageCategory);

  function getFavourites() {
    return JSON.parse(localStorage.getItem(favKey)) || [];
  }

  function saveFavourites(favs) {
    localStorage.setItem(favKey, JSON.stringify(favs));
  }

  function toggleFavourite(id, button) {
    let favs = getFavourites();
    if (favs.includes(id)) {
      favs = favs.filter((favId) => favId !== id);
      button.classList.remove("active");
    } else {
      favs.push(id);
      button.classList.add("active");
    }
    saveFavourites(favs);
  }

  async function loadProducts() {
    try {
      const response = await fetch(`/api/products?category=${pageCategory}`);
      const products = await response.json();

      productsContainer.innerHTML = "";

      if (!products.length) {
        productsContainer.innerHTML = "<p>No products available.</p>";
        return;
      }

      products.forEach((product) => {
        const isOwner = product.seller._id === userId;
        const isFavourite = getFavourites().includes(product._id);

        const productElement = document.createElement("div");
        productElement.classList.add("product-card");
        productElement.dataset.id = product._id;

        productElement.innerHTML = `
          <img src="${
            product.images[0] || "https://via.placeholder.com/150"
          }" style="width: 100px;">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p class="price">$${product.price}</p>
          <button onclick="orderNow('${product._id}')">Order Now</button>
          <button class="fav-btn ${isFavourite ? "active" : ""}">❤️</button>
          ${
            isOwner
              ? `
              <button class="update-btn" onclick="updateProduct('${product._id}', '${product.title}', '${product.description}', '${product.price}', '${product.images[0]}')">Update</button>
              <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
            `
              : ""
          }
        `;

        productsContainer.appendChild(productElement);

        // ربط زر المفضلة بالوظيفة
        const favBtn = productElement.querySelector(".fav-btn");
        favBtn.addEventListener("click", () =>
          toggleFavourite(product._id, favBtn)
        );
      });
    } catch (error) {
      console.error("❌ Error loading products:", error);
    }
  }

  loadProducts();

  // حذف منتج
  window.deleteProduct = async function (productId) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        alert("✅ Product deleted!");
        loadProducts();
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
    }
  };

  // تحديث منتج
  window.updateProduct = function (
    productId,
    title,
    description,
    price,
    image
  ) {
    const newTitle = prompt("Enter new title:", title);
    const newDescription = prompt("Enter new description:", description);
    const newPrice = prompt("Enter new price:", price);
    const newImage = prompt("Enter new image URL:", image);

    if (!newTitle || !newDescription || !newPrice || !newImage) {
      alert("⚠️ All fields are required!");
      return;
    }

    fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        price: newPrice,
        images: [newImage],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert("✅ Product updated successfully!");
          loadProducts();
        } else {
          alert("❌ Failed to update product!");
        }
      })
      .catch((error) => console.error("❌ Error updating product:", error));
  };
});

// 🔎 البحث
function performSearch() {
  const category = document.getElementById("categorySearch").value;
  const product = document.getElementById("searchInput").value;

  const url = new URL("http://localhost:5000/api/products/search");
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (product) params.append("product", product);

  url.search = params.toString();

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayProducts(data))
    .catch((error) => console.error("Error fetching products:", error));
}

function displayProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = "<p>لا توجد نتائج.</p>";
    return;
  }

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>السعر: ${product.price} جنيه</p>
    `;
    productList.appendChild(productElement);
  });
}
