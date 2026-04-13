document.addEventListener("DOMContentLoaded", function () {
  // Nếu chưa đăng nhập mà cố tình mò vào trang này thì đá về trang chủ
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
    return;
  }

  // Lấy dữ liệu từ sổ tay ra
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPhone = localStorage.getItem("userPhone");

  // In dữ liệu ra màn hình
  document.getElementById("profileName").innerText = userName;
  document.getElementById("profileEmail").innerText = userEmail;
  document.getElementById("profilePhone").innerText = userPhone;
  document.getElementById("profileAvatar").src =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=ee4d2d&color=ffffff&size=128`;
});

// Hàm xử lý Đăng xuất
function logout() {
  // Hỏi lại cho chắc chắn
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    // Đốt sạch cuốn sổ tay!
    localStorage.clear();

    // Chuyển về trang chủ
    window.location.href = "index.html";
  }
}
