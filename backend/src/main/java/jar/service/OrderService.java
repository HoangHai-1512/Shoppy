package jar.service;

import jar.dto.OrderItemDto;
import jar.dto.OrderRequestDto;
import jar.entity.Order;
import jar.entity.OrderDetail;
import jar.entity.Product;
import jar.repository.OrderDetailRepository;
import jar.repository.OrderRepository;
import jar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private ProductRepository productRepository;

    // @Transactional đảm bảo: Nếu có lỗi xảy ra giữa chừng, toàn bộ DB sẽ được rollback (hủy bỏ) để không bị sai lệch dữ liệu.
    @Transactional 
    public Order createOrder(OrderRequestDto request) {
        double totalAmount = 0;

        // 1. Tạo đơn hàng mới (Order) để lấy ID
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("PENDING"); // Đang chờ xử lý
        order.setOrderDate(LocalDateTime.now());
        
        // Lưu tạm order vào DB để nó sinh ra ID
        Order savedOrder = orderRepository.save(order);

        // 2. Duyệt qua từng sản phẩm khách mua để kiểm tra và lưu vào OrderDetail
        for (OrderItemDto item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + item.getProductId()));

            // Kiểm tra số lượng tồn kho
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng!");
            }

            // Trừ số lượng tồn kho của sản phẩm và lưu lại
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            // Tính tổng tiền đơn hàng
            totalAmount += product.getPrice() * item.getQuantity();

            // Tạo chi tiết đơn hàng
            OrderDetail detail = new OrderDetail();
            detail.setOrderId(savedOrder.getId());
            detail.setProductId(product.getId());
            detail.setQuantity(item.getQuantity());
            detail.setPrice(product.getPrice());
            
            orderDetailRepository.save(detail);
        }

        // 3. Cập nhật lại tổng tiền cho đơn hàng chính
        savedOrder.setTotalAmount(totalAmount);
        return orderRepository.save(savedOrder);
    }
}