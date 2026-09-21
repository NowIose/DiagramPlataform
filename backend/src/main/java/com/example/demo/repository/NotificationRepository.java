package com.example.demo.repository;

import com.example.demo.model.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    Optional<Notification> findByIdAndRecipientId(Long id, Long recipientId);
}
