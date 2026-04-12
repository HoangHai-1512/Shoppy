package jar.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import jar.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
}