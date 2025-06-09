-- =====================================================
-- SCRIPT PARA RESETEAR TODA LA BASE DE DATOS - POSTGRESQL
-- =====================================================
-- Este script elimina todos los datos y resetea los auto-incrementos
-- Ejecutar con precaución - BORRARÁ TODOS LOS DATOS

-- =====================================================
-- ELIMINAR TODOS LOS DATOS
-- =====================================================

-- Eliminar relaciones muchos a muchos (si existen)
-- Tabla de usuarios-roles (si existe)
DELETE FROM user_roles;

-- Eliminar productos
DELETE FROM products;

-- Eliminar categorías
DELETE FROM categories;

-- Eliminar roles
DELETE FROM roles;

-- Eliminar usuarios
DELETE FROM users;

-- =====================================================
-- RESETEAR SECUENCIAS (AUTO-INCREMENT en PostgreSQL)
-- =====================================================

-- Resetear secuencia de usuarios
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Resetear secuencia de roles
ALTER SEQUENCE roles_id_seq RESTART WITH 1;

-- Resetear secuencia de categorías
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Resetear secuencia de productos
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Mostrar conteos para verificar que todo está vacío
SELECT 'TABLAS DESPUÉS DEL RESET:' as status;

SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_roles FROM roles;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;

-- Verificar que las secuencias se resetearon
SELECT 'SECUENCIAS RESETEADAS:' as status;
SELECT last_value as next_user_id FROM users_id_seq;
SELECT last_value as next_role_id FROM roles_id_seq;
SELECT last_value as next_category_id FROM categories_id_seq;
SELECT last_value as next_product_id FROM products_id_seq;

SELECT 'BASE DE DATOS RESETEADA - TODAS LAS TABLAS VACÍAS!' as message;