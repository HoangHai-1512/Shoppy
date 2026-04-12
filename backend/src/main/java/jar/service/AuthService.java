package jar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jar.entity.User;
import jar.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(User newUser) {
        // 1. Kiểm tra tài khoản đã tồn tại chưa
        if (userRepository.findByEmailOrPhone(newUser.getEmail(), newUser.getPhone()).isPresent()) {
            throw new RuntimeException("Email hoặc số điện thoại đã tồn tại!");
        }
        
        // (Sau này bạn sẽ thêm logic băm mật khẩu - Bcrypt ở đây)

        // 2. Lưu vào database
        userRepository.save(newUser);
        return "Đăng ký thành công!";
    }
}