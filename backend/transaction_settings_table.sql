-- Create transaction_settings table
CREATE TABLE IF NOT EXISTS `transaction_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `daily_limit` int(11) NOT NULL DEFAULT 0,
  `minimum_redeem_limit` int(11) NOT NULL DEFAULT 0,
  `maximum_redeem_limit` int(11) NOT NULL DEFAULT 0,
  `transaction_charges` int(11) NOT NULL DEFAULT 0,
  `transaction_expiry_time` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default values
-- INSERT INTO `transaction_settings` (`daily_limit`, `minimum_redeem_limit`, `maximum_redeem_limit`, `transaction_charges`, `transaction_expiry_time`) 
-- VALUES (1000, 50, 5000, 2, 30); 