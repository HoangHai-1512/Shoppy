document.addEventListener("DOMContentLoaded", function () {
  // Kẻ gian chưa đăng nhập thì đuổi về
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Bạn cần đăng nhập để xem đơn hàng!");
    window.location.href = "index.html";
    return;
  }

  const container = document.getElementById("ordersContainer");

  // Gọi API lấy danh sách đơn hàng của đúng user này
  fetch(`http://localhost:8080/api/orders/user/${userId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi kết nối máy chủ");
      return response.json();
    })
    .then((orders) => {
      container.innerHTML = ""; // Xóa chữ "Đang tải..."

      if (orders.length === 0) {
        container.innerHTML =
          '<p style="text-align: center; color: #666;">Bạn chưa có đơn hàng nào. Hãy mua sắm đi nhé!</p>';
        return;
      }

      // Duyệt qua từng đơn hàng và vẽ giao diện
      orders.forEach((order) => {
        const formattedTotal = new Intl.NumberFormat("vi-VN").format(
          order.totalAmount,
        );

        // Vẽ thẻ HTML cho đơn hàng
        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
                    <div class="order-header">
                        <span class="order-id">Mã đơn: #${order.id}</span>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                    <div class="order-body">
                        <p><strong>Ngày đặt:</strong> ${new Date().toLocaleDateString("vi-VN")} (Tạm tính)</p>
                        <p><strong>Giao đến:</strong> ${order.shippingAddress}</p>
                        <p><strong>Thanh toán:</strong> ${order.paymentMethod}</p>
                        <div class="total-price">Tổng tiền: ${formattedTotal} đ</div>
                    </div>
                `;
        container.appendChild(card);
      });
    })
    .catch((error) => {
      container.innerHTML = `<p style="color: red; text-align: center;">Lỗi tải dữ liệu: ${error.message}</p>`;
    });
});
