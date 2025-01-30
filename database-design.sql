CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `avatar` varchar(255),
  `first_name` varchar(255),
  `last_name` varchar(255),
  `username` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255),
  `birth_of_date` date,
  `phone_number` varchar(255),
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `addresses` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `title` varchar(255),
  `address_line_1` varchar(255),
  `address_line_2` varchar(255),
  `country` varchar(255),
  `city` varchar(255),
  `postal_code` varchar(255),
  `landmark` varchar(255),
  `phone_number` varchar(255),
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `categories` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `sub_categories` (
  `id` integer PRIMARY KEY,
  `parent_id` integer,
  `name` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `description` varchar(255),
  `summary` varchar(255),
  `cover` varchar(255),
  `category_id` varchar(255),
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `product_attributes` (
  `id` integer PRIMARY KEY,
  `type` ENUM ('color', 'size'),
  `value` varchar(255),
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `products_skus` (
  `id` integer PRIMARY KEY,
  `product_id` integer,
  `size_attribute_id` integer,
  `color_attribute_id` integer,
  `sku` varchar(255),
  `price` varchar(255),
  `quantity` integer,
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `wishlist` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `product_id` integer,
  `created_at` timestamp,
  `deleted_at` timestamp
);

CREATE TABLE `cart` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `total` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `cart_item` (
  `id` integer PRIMARY KEY,
  `cart_id` integer,
  `product_id` integer,
  `products_sku_id` integer,
  `quantity` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `order_details` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `payment_id` integer,
  `total` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `order_item` (
  `id` integer PRIMARY KEY,
  `order_id` integer,
  `product_id` integer,
  `products_sku_id` integer,
  `quantity` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `payment_details` (
  `id` integer PRIMARY KEY,
  `order_id` integer,
  `amount` integer,
  `provider` varchar(255),
  `status` value,
  `created_at` timestamp,
  `updated_at` timestamp
);

ALTER TABLE `addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `sub_categories` ADD FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`);

CREATE TABLE `products_sub_categories` (
  `products_category_id` varchar,
  `sub_categories_id` integer,
  PRIMARY KEY (`products_category_id`, `sub_categories_id`)
);

ALTER TABLE `products_sub_categories` ADD FOREIGN KEY (`products_category_id`) REFERENCES `products` (`category_id`);

ALTER TABLE `products_sub_categories` ADD FOREIGN KEY (`sub_categories_id`) REFERENCES `sub_categories` (`id`);


CREATE TABLE `product_attributes_products_skus` (
  `product_attributes_id` integer,
  `products_skus_size_attribute_id` integer,
  PRIMARY KEY (`product_attributes_id`, `products_skus_size_attribute_id`)
);

ALTER TABLE `product_attributes_products_skus` ADD FOREIGN KEY (`product_attributes_id`) REFERENCES `product_attributes` (`id`);

ALTER TABLE `product_attributes_products_skus` ADD FOREIGN KEY (`products_skus_size_attribute_id`) REFERENCES `products_skus` (`size_attribute_id`);


CREATE TABLE `product_attributes_products_skus(1)` (
  `product_attributes_id` integer,
  `products_skus_color_attribute_id` integer,
  PRIMARY KEY (`product_attributes_id`, `products_skus_color_attribute_id`)
);

ALTER TABLE `product_attributes_products_skus(1)` ADD FOREIGN KEY (`product_attributes_id`) REFERENCES `product_attributes` (`id`);

ALTER TABLE `product_attributes_products_skus(1)` ADD FOREIGN KEY (`products_skus_color_attribute_id`) REFERENCES `products_skus` (`color_attribute_id`);


ALTER TABLE `products_skus` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

CREATE TABLE `wishlist_users` (
  `wishlist_user_id` integer,
  `users_id` integer,
  PRIMARY KEY (`wishlist_user_id`, `users_id`)
);

ALTER TABLE `wishlist_users` ADD FOREIGN KEY (`wishlist_user_id`) REFERENCES `wishlist` (`user_id`);

ALTER TABLE `wishlist_users` ADD FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);


CREATE TABLE `wishlist_products` (
  `wishlist_product_id` integer,
  `products_id` integer,
  PRIMARY KEY (`wishlist_product_id`, `products_id`)
);

ALTER TABLE `wishlist_products` ADD FOREIGN KEY (`wishlist_product_id`) REFERENCES `wishlist` (`product_id`);

ALTER TABLE `wishlist_products` ADD FOREIGN KEY (`products_id`) REFERENCES `products` (`id`);


ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `cart` (`user_id`);

ALTER TABLE `cart_item` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

CREATE TABLE `cart_item_products` (
  `cart_item_product_id` integer,
  `products_id` integer,
  PRIMARY KEY (`cart_item_product_id`, `products_id`)
);

ALTER TABLE `cart_item_products` ADD FOREIGN KEY (`cart_item_product_id`) REFERENCES `cart_item` (`product_id`);

ALTER TABLE `cart_item_products` ADD FOREIGN KEY (`products_id`) REFERENCES `products` (`id`);


CREATE TABLE `cart_item_products_skus` (
  `cart_item_products_sku_id` integer,
  `products_skus_id` integer,
  PRIMARY KEY (`cart_item_products_sku_id`, `products_skus_id`)
);

ALTER TABLE `cart_item_products_skus` ADD FOREIGN KEY (`cart_item_products_sku_id`) REFERENCES `cart_item` (`products_sku_id`);

ALTER TABLE `cart_item_products_skus` ADD FOREIGN KEY (`products_skus_id`) REFERENCES `products_skus` (`id`);


ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `order_details` (`user_id`);

ALTER TABLE `order_item` ADD FOREIGN KEY (`order_id`) REFERENCES `order_details` (`id`);

CREATE TABLE `order_item_products` (
  `order_item_product_id` integer,
  `products_id` integer,
  PRIMARY KEY (`order_item_product_id`, `products_id`)
);

ALTER TABLE `order_item_products` ADD FOREIGN KEY (`order_item_product_id`) REFERENCES `order_item` (`product_id`);

ALTER TABLE `order_item_products` ADD FOREIGN KEY (`products_id`) REFERENCES `products` (`id`);


CREATE TABLE `order_item_products_skus` (
  `order_item_products_sku_id` integer,
  `products_skus_id` integer,
  PRIMARY KEY (`order_item_products_sku_id`, `products_skus_id`)
);

ALTER TABLE `order_item_products_skus` ADD FOREIGN KEY (`order_item_products_sku_id`) REFERENCES `order_item` (`products_sku_id`);

ALTER TABLE `order_item_products_skus` ADD FOREIGN KEY (`products_skus_id`) REFERENCES `products_skus` (`id`);


ALTER TABLE `order_details` ADD FOREIGN KEY (`id`) REFERENCES `payment_details` (`order_id`);
