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
        document.getElementById('message').innerText = text;
    })
    .catch(error => {
        // Hiện thông báo lỗi
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerText = error.message;
    });
});