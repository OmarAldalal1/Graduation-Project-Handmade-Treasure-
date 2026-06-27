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

// ✅ تسجيل مستخدم جديد
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const signUpForm = document.getElementById('signUpForm');

// Toggle between forms
// ✅ تأكد إن الزرار موجود قبل إضافة الـ Event Listener
if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
} else {
    console.warn("⚠️ registerBtn, loginBtn, or container not found in the document.");
}

// ✅ تسجيل مستخدم جديد
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;
    const age = document.getElementById('signUpAge').value;
    const role = document.getElementById('signUpRole').value;

    if (name === "") {
        alert("Name is required");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    if (age === "") {
        alert("Please select your age");
        return;
    }

    if (role === "") {
        alert("Please select your role");
        return;
    }

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("username", name); // تخزين الاسم
            localStorage.setItem("role", role); // تخزين الدور
            alert("Sign Up Successful!");
            signUpForm.reset();
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while signing up.");
    }
});

// ✅ تسجيل الدخول
const signInForm = document.getElementById("signInForm");
if (signInForm) {
    signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("signInEmail").value.trim();
        const password = document.getElementById("signInPassword").value;

        if (!validateEmail(email) || password.length < 6) {
            alert("⚠️ Invalid email or password.");
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token); // تخزين الـ token
                localStorage.setItem("username", data.user.name);
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("role", data.user.role); // تخزين الـ role
                alert("✅ Login Successful!");
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 500);
            } else {
                alert("❌ " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
}

// ✅ التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ✅ إرسال طلب إضافة منتج (مع التحقق من الـ role)
const addProductForm = document.getElementById("addProductForm");
if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to add a product.");
            return;
        }

        const title = document.getElementById("productTitle").value;
        const description = document.getElementById("productDescription").value;
        const price = document.getElementById("productPrice").value;
        const category = document.getElementById("productCategory").value;
        const images = document.getElementById("productImages").files;

        if (!title || !description || !price || !category || images.length === 0) {
            alert("Please fill in all fields.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // إرسال الـ token في الـ headers
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert("Product added successfully!");
                addProductForm.reset();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
}





// productssssss











