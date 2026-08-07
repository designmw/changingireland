UPDATE posts SET content = REPLACE(content, 'https://changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET image_url = REPLACE(image_url, 'https://changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET content = REPLACE(content, 'https://www.changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET image_url = REPLACE(image_url, 'https://www.changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET content = REPLACE(content, 'http://changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET image_url = REPLACE(image_url, 'http://changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET content = REPLACE(content, 'http://www.changingireland.ie/wp-content/uploads/', '/files/uploads/');
UPDATE posts SET image_url = REPLACE(image_url, 'http://www.changingireland.ie/wp-content/uploads/', '/files/uploads/');