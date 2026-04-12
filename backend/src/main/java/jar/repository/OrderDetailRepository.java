package jar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import jar.entity.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    
}