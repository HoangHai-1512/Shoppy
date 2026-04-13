// Lắng nghe sự kiện khi người dùng bấm nút Đăng ký
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn trang web bị tải lại

    // 1. Lấy dữ liệu người dùng nhập từ các ô input
    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    };

    // 2. Gửi dữ liệu (POST) lên Spring Boot API
    fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Đăng ký thất bại, email có thể đã tồn tại!');
        }
    })
    .then(text => {
        // Hiện thông báo thành công
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerText = "Đăng ký thành công! Đang chuyển về trang chủ...";

        // 1. LƯU VÀO SỔ TAY (LOCAL STORAGE): Đánh dấu là đã đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        
        /* Ghi chú: Tạm thời lưu userId là 1 để test đặt hàng. 
           (Trong dự án thực tế, API đăng ký/đăng nhập của Spring Boot sẽ trả về đúng ID của người dùng này) */
        localStorage.setItem('userId', '1'); 
        // THÊM 3 DÒNG NÀY: Lấy giá trị từ các ô input và lưu lại
        localStorage.setItem('userName', document.getElementById('fullName').value);
        localStorage.setItem('userEmail', document.getElementById('email').value);
        localStorage.setItem('userPhone', document.getElementById('phone').value);

        // 2. CHUYỂN HƯỚNG: Tự động nhảy sang trang chủ sau 1.5 giây (để người dùng kịp đọc dòng chữ thành công)
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    })
    .catch(error => {
        // Hiện thông báo lỗi
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerText = error.message;
    });
});