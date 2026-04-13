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
            
            <button class="btn-buy" onclick="showOrderForm()">ĐẶT MUA NGAY</button>
        </div>
    `;
}

// Hàm hiển thị form đặt hàng
function showOrderForm() {

    // 1. GỌI BẢO VỆ RA KIỂM TRA SỔ TAY
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Nếu chưa đăng ký -> Hiện thông báo và đá sang trang Đăng ký
        alert("Bạn cần đăng ký tài khoản trước khi đặt hàng nhé!");
        window.location.href = 'register.html';
        return; // Lệnh return này sẽ dừng hàm lại ngay lập tức, form sẽ không được hiện ra.
    }

    const orderSection = document.getElementById('orderSection');
    orderSection.style.display = 'flex'; // Hiện form lên
    
    // Tự động cuộn trang web xuống chỗ form cho mượt
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Lắng nghe sự kiện khi người dùng bấm "Xác nhận đặt hàng"
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn trình duyệt tải lại trang

    // 1. Thu thập dữ liệu từ Form
    const address = document.getElementById('shippingAddress').value;
    const method = document.getElementById('paymentMethod').value;
    const messageEl = document.getElementById('orderMessage');

    messageEl.style.color = 'blue';
    messageEl.innerText = 'Đang xử lý đơn hàng...';

    /* 2. Đóng gói dữ liệu chuẩn JSON gửi cho Backend
       Lưu ý: Vì dự án chưa làm tính năng Đăng nhập để lấy ID người dùng thực tế, 
       chúng ta sẽ mặc định lấy userId = 1 (Tài khoản bạn đã tạo thử nghiệm) để test.
    */
    const orderData = {
        userId: localStorage.getItem('userId'), 
        shippingAddress: address,
        paymentMethod: method,
        items: [
            {
                productId: productId, // Lấy từ biến productId trên thanh URL ở đầu file
                quantity: 1 // Mặc định mua 1 cái cho Use Case này
            }
        ]
    };

    // 3. Gọi API POST đến Spring Boot
    fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Backend trả về chữ "Đặt hàng thành công..."
        } else {
            return response.text().then(err => { throw new Error(err); });
        }
    })
    .then(text => {
        // Nếu thành công: Báo xanh, ẩn nút Đặt hàng để tránh bấm 2 lần
        messageEl.style.color = 'green';
        messageEl.innerText = text; // In ra chuỗi "Đặt hàng thành công! Mã đơn hàng của bạn là: X"
        document.querySelector('.btn-buy').style.display = 'none'; 
    })
    .catch(error => {
        // Nếu lỗi (ví dụ hết hàng): Báo đỏ
        messageEl.style.color = 'red';
        messageEl.innerText = error.message;
    });
});

