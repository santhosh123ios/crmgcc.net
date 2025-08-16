-- Add expire_on field to transaction table
ALTER TABLE `transaction` ADD COLUMN `expire_on` DATE NULL AFTER `transaction_created_at`;

-- Add index for better performance on expiry queries
CREATE INDEX `idx_transaction_expire_on` ON `transaction` (`expire_on`);
