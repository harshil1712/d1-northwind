PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "Category";
DROP TABLE IF EXISTS "Customer";
DROP TABLE IF EXISTS "Shipper";
DROP TABLE IF EXISTS "Supplier";
DROP TABLE IF EXISTS "Order";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "OrderDetail";
DROP TABLE IF EXISTS "CustomerCustomerDemo";
DROP TABLE IF EXISTS "CustomerDemographic";
DROP TABLE IF EXISTS "Region";
DROP TABLE IF EXISTS "Territory";
DROP TABLE IF EXISTS "EmployeeTerritory";
DROP VIEW IF EXISTS [ProductDetails_V];
CREATE TABLE IF NOT EXISTS "Category" ( "Id" INTEGER PRIMARY KEY, "CategoryName" VARCHAR(8000) NULL, "Description" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Customer" ( "Id" VARCHAR(8000) PRIMARY KEY, "CompanyName" VARCHAR(8000) NULL, "ContactName" VARCHAR(8000) NULL, "ContactTitle" VARCHAR(8000) NULL, "Address" VARCHAR(8000) NULL, "City" VARCHAR(8000) NULL, "Region" VARCHAR(8000) NULL, "PostalCode" VARCHAR(8000) NULL, "Country" VARCHAR(8000) NULL, "Phone" VARCHAR(8000) NULL, "Fax" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Shipper" ( "Id" INTEGER PRIMARY KEY, "CompanyName" VARCHAR(8000) NULL, "Phone" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Supplier" ( "Id" INTEGER PRIMARY KEY, "CompanyName" VARCHAR(8000) NULL, "ContactName" VARCHAR(8000) NULL, "ContactTitle" VARCHAR(8000) NULL, "Address" VARCHAR(8000) NULL, "City" VARCHAR(8000) NULL, "Region" VARCHAR(8000) NULL, "PostalCode" VARCHAR(8000) NULL, "Country" VARCHAR(8000) NULL, "Phone" VARCHAR(8000) NULL, "Fax" VARCHAR(8000) NULL, "HomePage" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Order" ( "Id" INTEGER PRIMARY KEY, "CustomerId" VARCHAR(8000) NULL, "EmployeeId" INTEGER NOT NULL, "OrderDate" VARCHAR(8000) NULL, "RequiredDate" VARCHAR(8000) NULL, "ShippedDate" VARCHAR(8000) NULL, "ShipVia" INTEGER NULL, "Freight" DECIMAL NOT NULL, "ShipName" VARCHAR(8000) NULL, "ShipAddress" VARCHAR(8000) NULL, "ShipCity" VARCHAR(8000) NULL, "ShipRegion" VARCHAR(8000) NULL, "ShipPostalCode" VARCHAR(8000) NULL, "ShipCountry" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Product" ( "Id" INTEGER PRIMARY KEY, "ProductName" VARCHAR(8000) NULL, "SupplierId" INTEGER NOT NULL, "CategoryId" INTEGER NOT NULL, "QuantityPerUnit" VARCHAR(8000) NULL, "UnitPrice" DECIMAL NOT NULL, "UnitsInStock" INTEGER NOT NULL, "UnitsOnOrder" INTEGER NOT NULL, "ReorderLevel" INTEGER NOT NULL, "Discontinued" INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS "OrderDetail" ( "Id" VARCHAR(8000) PRIMARY KEY, "OrderId" INTEGER NOT NULL, "ProductId" INTEGER NOT NULL, "UnitPrice" DECIMAL NOT NULL, "Quantity" INTEGER NOT NULL, "Discount" DOUBLE NOT NULL);
CREATE TABLE IF NOT EXISTS "CustomerCustomerDemo" ( "Id" VARCHAR(8000) PRIMARY KEY, "CustomerTypeId" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "CustomerDemographic" ( "Id" VARCHAR(8000) PRIMARY KEY, "CustomerDesc" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Region" ( "Id" INTEGER PRIMARY KEY, "RegionDescription" VARCHAR(8000) NULL);
CREATE TABLE IF NOT EXISTS "Territory" ( "Id" VARCHAR(8000) PRIMARY KEY, "TerritoryDescription" VARCHAR(8000) NULL, "RegionId" INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS "EmployeeTerritory" ( "Id" VARCHAR(8000) PRIMARY KEY, "EmployeeId" INTEGER NOT NULL, "TerritoryId" VARCHAR(8000) NULL);
CREATE VIEW [ProductDetails_V] as select p.*, c.CategoryName, c.Description as [CategoryDescription], s.CompanyName as [SupplierName], s.Region as [SupplierRegion] from [Product] p join [Category] c on p.CategoryId = c.id join [Supplier] s on s.id = p.SupplierId;
