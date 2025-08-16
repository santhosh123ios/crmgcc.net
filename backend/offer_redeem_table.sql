-- Create offer_redeem table to track offer usage
CREATE TABLE IF NOT EXISTS `offer_redeem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `redeemed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `redeem_status` enum('0','1','2','3') NOT NULL DEFAULT '0' COMMENT '0=active, 1=used, 2=expired, 3=cancelled',
  `vendor_id` int(11) NOT NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_offer_user` (`offer_id`, `user_id`),
  KEY `idx_offer_id` (`offer_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_vendor_id` (`vendor_id`),
  KEY `idx_redeem_status` (`redeem_status`),
  CONSTRAINT `fk_offer_redeem_offer` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_redeem_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_offer_redeem_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional - for testing)
-- INSERT INTO `offer_redeem` (`offer_id`, `user_id`, `vendor_id`, `redeem_status`, `notes`) 
-- VALUES (1, 1, 1, 'used', 'Sample offer redemption');
