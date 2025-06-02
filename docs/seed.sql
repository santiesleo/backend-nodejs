-- Crea los roles básicos
INSERT INTO roles (name, "createdAt", "updatedAt") VALUES
('superadmin', NOW(), NOW()),
('usuario', NOW(), NOW());

-- (Opcional) Crea un usuario superadmin de prueba
INSERT INTO users (name, email, password, "createdAt", "updatedAt")
VALUES ('Admin', 'admin@ejemplo.com', '$2b$10$j6RYkv8Bn24z27NEUCndnOR7BMfzaswYXS75P0NddG47wY52g4Xgq', NOW(), NOW());
-- La contraseña aquí es un hash bcrypt de "admin123" (puedes cambiarlo si quieres)

-- Asigna el rol superadmin al usuario creado arriba
INSERT INTO user_roles ("createdAt", "updatedAt", "UserId", "RoleId")
SELECT NOW(), NOW(), u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@ejemplo.com' AND r.name = 'superadmin';