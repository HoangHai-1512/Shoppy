// 1. Dùng công cụ của trình duyệt để soi thanh URL xem có chữ "?id=..." không
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // Lấy ra con số ID

const container = document.getElementById('detailContainer');

// 2. Nếu không có ID trên URL, báo lỗi
if (!productId) {
    container.innerHTML = '<h2 style="color:red; text-align:center;">Lỗi: Không tìm thấy mã sản phẩm!</h2>';
} else {
    // 3. Nếu có ID, gọi API của Spring Boot (Use Case 3)
    fetch(`http://localhost:8080/api/products/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error("Sản phẩm không tồn tại trên hệ thống!");
            return response.json();
        })
        .then(product => {
            // Lấy được dữ liệu rồi thì gọi hàm vẽ giao diện
            renderDetail(product);
        })
        .catch(error => {
            container.innerHTML = `<h2 style="color:red; text-align:center;">Lỗi: ${error.message}</h2>`;
        });
}

// 4. Hàm vẽ giao diện chi tiết
function renderDetail(product) {
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price);
    const productImage = product.imageUrl ? product.imageUrl : 'https://via.placeholder.com/400x400?text=Chua+Co+Anh';

    // Thay thế chữ "Đang tải dữ liệu..." bằng toàn bộ khối HTML này
    container.innerHTML = `
        <img src="${productImage}" alt="${product.name}" class="product-image">
        
        <div class="product-info">
            <a href="index.html" class="back-link">← Quay lại trang chủ</a>
            
            <h1 class="product-title">${product.name}</h1>
            <div class="product-price">${formattedPrice} đ</div>
            
            <div class="product-meta">
                <p><strong>Thương hiệu:</strong> ${product.brand}</p>
                <p><strong>Tình trạng:</strong> Còn ${product.stock} sản phẩm trong kho</p>
                <p><strong>Mô tả chi tiết:</strong><br> 
                   ${product.description ? product.description : 'Đang cập nhật mô tả cho sản phẩm này...'}
                </p>
            </div>
            
            <button class="btn-buy" onclick="buyProduct(${product.id})">ĐẶT MUA NGAY</button>
        </div>
    `;
}

// Hàm xử lý khi bấm nút Đặt mua (Chuẩn bị cho Use Case 4)
function buyProduct(id) {
    alert("Chức năng Đặt hàng đang được xây dựng! Mã sản phẩm bạn muốn mua là: " + id);
    // Sắp tới chúng ta sẽ code logic hiển thị form điền địa chỉ giao hàng ở đây
}