package jar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jar.dto.OrderRequestDto;
import jar.entity.Order;
import jar.service.OrderService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/orders")

public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDto request) {
        try {
            Order newOrder = orderService.createOrder(request);
            return ResponseEntity.ok("Đặt hàng thành công! Mã đơn hàng của bạn là: " + newOrder.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi đặt hàng: " + e.getMessage());
        }
    }

    // Thêm API mới: POST http://localhost:8080/api/orders/1/refund
    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundOrder(@PathVariable Long id, @RequestParam String refundMethod) {
        try {
            Order updatedOrder = orderService.requestRefund(id, refundMethod);
            
            // Theo Use case: Trả về thông tin cơ bản cho hệ thống hiển thị
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Yêu cầu hoàn trả đã được ghi nhận!",
                "orderId", updatedOrder.getId(),
                "shippingAddress", updatedOrder.getShippingAddress(),
                "originalPaymentMethod", updatedOrder.getPaymentMethod(),
                "refundPaymentMethod", refundMethod,
                "status", updatedOrder.getStatus(),
                "totalAmount", updatedOrder.getTotalAmount()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
    return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
}
}