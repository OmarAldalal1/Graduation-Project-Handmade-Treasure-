document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");

    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener("input", async (e) => {
        const query = e.target.value.trim();

        if (query.length > 2) {
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                resultsContainer.innerHTML = '';

                if (data.products && data.products.length > 0) {
                    data.products.forEach(product => {
                        const div = document.createElement("div");
                        div.classList.add("search-card");

                        const firstImage = product.images && product.images.length > 0 
                            ? product.images[0] 
                            : "https://via.placeholder.com/100x100?text=No+Image";

                        div.innerHTML = `
                            <a href="/products/${product._id}" class="search-card-link">
                                <img src="${firstImage}" alt="${product.title}" class="search-card-image" />
                                <div class="search-card-details">
                                    <h4>${product.title}</h4>
                                    <p>${product.price} EGP</p>
                                </div>
                            </a>
                        `;

                        resultsContainer.appendChild(div);
                    });

                    resultsContainer.style.display = 'block';
                } else {
                    resultsContainer.innerHTML = "<p class='no-result'>nothing with this name</p>";
                    resultsContainer.style.display = 'block';
                }

            } catch (err) {
                console.error("Search error:", err);
                resultsContainer.innerHTML = "<p class='no-result'>error while searching</p>";
                resultsContainer.style.display = 'block';
            }
        } else {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
        }
    });
});



