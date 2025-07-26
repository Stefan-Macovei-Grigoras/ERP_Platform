use ERP;
select* from Product_Material
-- Create table Product(
-- 	productId int primary key auto_increment,
--     productName varchar(100) not null
--     );

-- create table Materials(
-- 	materialId int primary key auto_increment,
--     materialName varchar(200) not null,
--     materialQuantity int not null default 0,
--     materialType varchar(200)
-- );

create table Product_Material(
	productId int,
    materialId int,
    Primary key(productId, materialId),
    foreign key (productId) references Product(productId) on delete cascade,
    foreign key (materialId) references Materials(materialId) on delete cascade
);
Show tables;