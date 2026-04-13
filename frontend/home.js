// URL API của Backend
const API_URL = 'http://localhost:8080/api/products/search';

// Lắng nghe sự kiện: Ngay khi trang web vừa tải xong, tự động gọi hàm lấy tất cả sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    checkLoginState(); // Gọi hàm kiểm tra đăng nhập
    fetchProducts(""); // Chuỗi rỗng = lấy tất cả
});

function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const registerLink = document.getElementById('registerLink');
    const userProfileLink = document.getElementById('userProfileLink');
    
    if (isLoggedIn === 'true') {
        // Ẩn nút đăng ký, hiện avatar
        registerLink.style.display = 'none';
        userProfileLink.style.display = 'flex';

        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('registerLink').style.display = 'none';
        document.getElementById('userProfileLink').style.display = 'flex';

        document.getElementById('orderHistoryLink').style.display = 'block';
        
        // Lấy tên người dùng từ bộ nhớ
        const userName = localStorage.getItem('userName') || 'Thành viên';
        document.getElementById('headerUserName').innerText = userName;
        
        // Tự động tạo avatar xịn sò từ tên của người dùng
        document.getElementById('userAvatarImg').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=ffffff&color=ee4d2d`;
    }
}

// Lắng nghe sự kiện: Khi bấm nút Tìm kiếm
document.getElementById('searchBtn').addEventListener('click', function() {
    const keyword = document.getElementById('searchInput').value;
    fetchProducts(keyword);
});

// Lắng nghe sự kiện: Bấm Enter trong ô tìm kiếm cũng chạy tìm kiếm
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const keyword = document.getElementById('searchInput').value;
        fetchProducts(keyword);
    }
});

// HÀM CHÍNH: Gọi API và vẽ HTML
function fetchProducts(keyword) {
    // Nếu có từ khóa thì nối thêm đuôi ?keyword=..., không thì gọi URL gốc
    let url = API_URL;
    if (keyword && keyword.trim() !== "") {
        url += `?keyword=${encodeURIComponent(keyword.trim())}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Không thể kết nối đến Backend");
            return response.json(); // Biến dữ liệu thô thành mảng JSON
        })
        .then(products => {
            renderProducts(products); // Gửi mảng dữ liệu vào hàm vẽ
        })
        .catch(error => {
            console.error("Lỗi:", error);
            document.getElementById('productGrid').innerHTML = `<p style="color:red;">Lỗi tải dữ liệu. Hãy chắc chắn Server Spring Boot đang chạy!</p>`;
        });
}

// HÀM VẼ GIAO DIỆN: Biến mảng JSON thành các thẻ HTML
function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; // Xóa trắng dữ liệu cũ trước khi vẽ cái mới

    if (products.length === 0) {
        grid.innerHTML = '<p>Không tìm thấy sản phẩm nào phù hợp.</p>';
        return;
    }

    // Duyệt qua từng sản phẩm trong mảng và tạo thẻ HTML
    products.forEach(product => {
        // Dùng số tiền định dạng chuẩn VN (VD: 1000000 -> 1.000.000)
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price);

        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Xử lý ảnh: Nếu trong DB sản phẩm không có link ảnh (null hoặc rỗng), thì dùng ảnh mặc định (placeholder)
        const productImage = product.imageUrl ? product.imageUrl : 'https://via.placeholder.com/200x150?text=Chua+Co+Anh';

        card.innerHTML = `
            <img src="${productImage}" alt="Ảnh ${product.name}">
            
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${formattedPrice} đ</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Kho: ${product.stock} | Hãng: ${product.brand}</p>
            <button class="btn-view" onclick="viewDetail(${product.id})">Xem chi tiết</button>
        `;
        
        grid.appendChild(card); // Nhét thẻ vừa tạo vào lưới
    });
}

// Hàm chuyển trang khi bấm "Xem chi tiết"
function viewDetail(id) {
    // Chuyển hướng trình duyệt sang trang chi tiết và truyền ID lên URL
    window.location.href = `product-detail.html?id=${id}`;
}