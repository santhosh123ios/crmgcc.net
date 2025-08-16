-- Add is_expired field to transaction table
ALTER TABLE `transaction` ADD COLUMN `is_expired` TINYINT(1) DEFAULT 0 AFTER `expire_on`;

-- Create index for better performance when querying expired transactions
CREATE INDEX `idx_transaction_is_expired` ON `transaction` (`is_expired`);

-- Update existing expired transactions to mark them as processed
UPDATE `transaction` 
SET `is_expired` = 1 
WHERE `expire_on` < CURDATE() AND `expire_on` IS NOT NULL;
