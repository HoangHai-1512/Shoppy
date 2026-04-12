package jar.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jar.entity.Product;
import jar.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> searchProducts(String keyword) {
        // Nếu người dùng không nhập gì, trả về toàn bộ danh sách sản phẩm
        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll(); 
        }
        // Nếu có từ khóa, tìm theo tên
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
}
