package jar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jar.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Phép thuật của Spring Data JPA: Chỉ cần đặt tên hàm đúng quy tắc!
    // Câu lệnh này tương đương: SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%keyword%')
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
