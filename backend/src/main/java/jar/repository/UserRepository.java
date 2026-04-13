package jar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import jar.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailOrPhone(String email, String phone);
    User findByEmail(String email);
}
