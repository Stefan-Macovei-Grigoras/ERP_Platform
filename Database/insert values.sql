use ERP;
select * from PRODUCT_MATERIAL;
INSERT INTO PRODUCT (productId, productName) VALUES
    ('111e8400-e29b-41d4-a716-446655440000', 'Telemea de vacă'),
    ('222e8400-e29b-41d4-a716-446655440000', 'Cașcaval');
INSERT INTO MATERIAL (materialId, materialName, materialQuantity, materialType) VALUES
    ('333e8400-e29b-41d4-a716-446655440000', 'Lapte de vacă', 500, 'Raw Materials'),
    ('444e8400-e29b-41d4-a716-446655440000', 'Cheag', 50, 'Raw Materials'),
    ('555e8400-e29b-41d4-a716-446655440000', 'Saramură', 200, 'Raw Materials'),
    ('666e8400-e29b-41d4-a716-446655440000', 'Pachet plastic', 100, 'Packaging'),
    ('777e8400-e29b-41d4-a716-446655440000', 'Folie vidată', 80, 'Packaging');
INSERT INTO PRODUCT_MATERIAL (materialId, productId) VALUES
    -- Telemea de vacă materials
    ('333e8400-e29b-41d4-a716-446655440000', '111e8400-e29b-41d4-a716-446655440000'),  -- Lapte de vacă
    ('444e8400-e29b-41d4-a716-446655440000', '111e8400-e29b-41d4-a716-446655440000'),  -- Cheag
    ('555e8400-e29b-41d4-a716-446655440000', '111e8400-e29b-41d4-a716-446655440000'),  -- Saramură
    ('666e8400-e29b-41d4-a716-446655440000', '111e8400-e29b-41d4-a716-446655440000'),  -- Pachet plastic
    
    -- Cașcaval materials
    ('333e8400-e29b-41d4-a716-446655440000', '222e8400-e29b-41d4-a716-446655440000'),  -- Lapte de vacă
    ('444e8400-e29b-41d4-a716-446655440000', '222e8400-e29b-41d4-a716-446655440000'),  -- Cheag
    ('555e8400-e29b-41d4-a716-446655440000', '222e8400-e29b-41d4-a716-446655440000'),  -- Saramură
    ('777e8400-e29b-41d4-a716-446655440000', '222e8400-e29b-41d4-a716-446655440000');  -- Folie vidată
