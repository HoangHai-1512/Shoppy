package jar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jar.entity.User;
import jar.repository.UserRepository;
import jar.service.AuthService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // BẠN ĐANG THIẾU 2 DÒNG NÀY ĐÂY:
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            String message = authService.registerUser(user);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // THÊM API ĐĂNG NHẬP MỚI
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // 1. Tìm user trong Database theo email
        User existingUser = userRepository.findByEmail(loginRequest.getEmail());

        // 2. Kiểm tra xem user có tồn tại và mật khẩu có khớp không
        if (existingUser == null || !existingUser.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email hoặc mật khẩu không chính xác!");
        }

        // 3. Đăng nhập thành công: Trả về thông tin user (để Frontend lưu vào localStorage)
        return ResponseEntity.ok(existingUser);
    }
}
//test jira