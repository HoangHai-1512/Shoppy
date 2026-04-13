document.getElementById('refundForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Chặn hành vi tải lại trang

    // Lấy dữ liệu người dùng nhập
    const orderId = document.getElementById('orderId').value;
    const refundMethod = document.getElementById('refundMethod').value;
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = '<p style="color: blue; text-align: center;">Đang kiểm tra đơn hàng...</p>';

    // Gọi API Hoàn trả của Spring Boot
    fetch(`http://localhost:8080/api/orders/${orderId}/refund?refundMethod=${refundMethod}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            // Nếu lỗi (ví dụ: Không tìm thấy đơn, hoặc đơn chưa ở trạng thái COMPLETED)
            return response.text().then(err => { throw new Error(err); });
        }
        return response.json(); // Nếu thành công, lấy dữ liệu JSON
    })
    .then(data => {
        const formattedTotal = new Intl.NumberFormat('vi-VN').format(data.totalAmount);

        // Vẽ cái "Biên lai" xác nhận hoàn tiền bằng HTML
        resultDiv.innerHTML = `
            <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; border: 1px solid #c3e6cb;">
                <h3 style="margin-top: 0; text-align: center;">✅ ${data.message}</h3>
                <hr style="border-top: 1px solid #c3e6cb;">
                <p><strong>Mã đơn hàng:</strong> #${data.orderId}</p>
                <p><strong>Trạng thái mới:</strong> <span style="color: #ee4d2d; font-weight: bold;">${data.status}</span></p>
                <p><strong>Địa chỉ thu hồi:</strong> ${data.shippingAddress}</p>
                <p><strong>Số tiền hoàn lại:</strong> ${formattedTotal} đ</p>
                <p><strong>Phương thức nhận:</strong> ${data.refundPaymentMethod}</p>
            </div>
        `;
    })
    .catch(error => {
        // In ra câu báo lỗi màu đỏ (Ví dụ: "Chỉ có thể yêu cầu hoàn trả cho đơn hàng ĐÃ GIAO THÀNH CÔNG!")
        resultDiv.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">Lỗi: ${error.message}</p>`;
    });
});