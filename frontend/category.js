document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname; // معرفة الصفحة الحالية

    // ✅ إذا لم يكن هناك مستخدم مسجل، نعيد التوجيه فقط إذا لم يكن في index.html
    if (!token && currentPage !== "/index.html") {
        console.warn("⚠️ لا يوجد مستخدم مسجل، سيتم تحويله إلى صفحة تسجيل الدخول...");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 500); // ✅ تأخير لمنع اللوب السريع
    }

    // ✅ تعيين اسم المستخدم في الصفحة الرئيسية
    const usernameSpan = document.getElementById("username");
    if (username && usernameSpan) {
        usernameSpan.textContent = username;
        console.log("✅ تم تحديث اسم المستخدم:", username);
    }

    // ✅ زر تسجيل الخروج
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("🚀 تسجيل الخروج بدأ...");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userId");
            console.log("✅ تم مسح البيانات من localStorage");

            setTimeout(() => {
                console.log("🔄 إعادة التوجيه إلى الصفحة الرئيسية...");
                window.location.href = "index.html";
            }, 500);
        });
    } else {
        console.warn("⚠️ زر تسجيل الخروج غير موجود في الصفحة!");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm) {
        addProductForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("✅ Form submission started...");

            const title = document.getElementById("productTitle").value.trim();
            const description = document.getElementById("productDescription").value.trim();
            const price = document.getElementById("productPrice").value.trim();
            const category = document.getElementById("productCategory").value;
            const image = document.getElementById("productImage").value.trim();
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");

            // ✅ التحقق من ملء جميع الحقول
            if (!title || !description || !price || !category || !image) {
                alert("⚠️ Please fill in all fields.");
                return;
            }

            // ✅ التحقق من وجود token وصلاحيته
            if (!token) {
                alert("❌ Please log in to add a product.");
                window.location.href = "index.html"; // إعادة التوجيه إلى صفحة التسجيل أو تسجيل الدخول
                return;
            }

            const productData = { title, description, price, category, images: [image], seller: userId };
            console.log("📦 Sending data to server:", productData);

            try {
                const response = await fetch("/api/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // إضافة الـ token إلى headers
                    },
                    body: JSON.stringify(productData)
                });

                const data = await response.json();
                console.log("🔄 Server response:", data);

                if (response.ok) {
                    alert("✅ Product added successfully!");
                    // ✅ تحويل المستخدم للصفحة المناسبة حسب الفئة
                    window.location.href = "home.html"; // أو أي صفحة تريد الانتقال إليها بعد إضافة المنتج
                } else {
                    alert("❌ Error: " + data.message);
                }
            } catch (error) {
                console.error("❌ Error adding product:", error);
            }
        });
    } else {
        console.warn("⚠️ addProductForm not found. Skipping form event listener.");
    }

    // ✅ التحقق من الـ role عند تحميل الصفحة
    const token = localStorage.getItem("token");
    const role = token ? JSON.parse(atob(token.split('.')[1])).role : null; // استخراج الـ role من الـ JWT

    // إذا كان المستخدم ليس seller، اخفي زر إضافة المنتج
    if (role !== "seller") {
        const toggleProductForm = document.getElementById("toggleProductForm");
        if (toggleProductForm) {
            toggleProductForm.style.display = "none";
        }
    }
});



