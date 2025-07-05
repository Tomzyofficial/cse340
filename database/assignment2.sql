-- Insert structure for the table `account` 
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );
-- Alter structure for the column of `account_type` of the table `account`
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Delete structure for the record in table `account`
DELETE FROM public.account
WHERE account_id = 1;
-- Modify the `GM Hummer` record from the table `inventory`
UPDATE public.inventory
SET inv_description = REPLACE(
    inv_description,
    'small interiors',
    'a huge interior'
  )
WHERE inv_description LIKE '%small interiors%';
-- Inner Join structure to select records from `inventory` and `classification` tables
SELECT inv_make,
  inv_model,
  classification_name
FROM inventory
  INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
-- Modify the table `inventory` and add /vehicles to the middle of 
-- the file path in the inv_image and inv_thumbnail columns
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');