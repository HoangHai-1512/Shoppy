document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn tải lại trang

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    messageEl.style.color = 'blue';
    messageEl.innerText = "Đang kiểm tra thông tin...";

    // Gửi yêu cầu POST lên API Login
    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Trả về dạng JSON chứa thông tin user
        } else {
            return response.text().then(err => { throw new Error(err); }); // Sai pass/email
        }
    })
    .then(userData => {
        messageEl.style.color = 'green';
        messageEl.innerText = "Đăng nhập thành công! Đang chuyển hướng...";

        // Ghi toàn bộ thông tin Backend trả về vào sổ tay localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userData.id);
        
        // Backend của bạn có thể trả về trường 'fullName' hoặc 'name', hãy điều chỉnh cho khớp với tên biến trong file User.java của bạn nhé
        localStorage.setItem('userName', userData.fullName || userData.name || 'Thành viên'); 
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userPhone', userData.phone || 'Chưa cập nhật');

        // Chuyển về trang chủ sau 1 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    })
    .catch(error => {
        messageEl.style.color = 'red';
        messageEl.innerText = error.message; // Báo lỗi đỏ chót nếu sai pass
    });
});