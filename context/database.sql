-- Script SQL para la creación de la base de datos del proyecto Microblading
-- Compatible con PostgreSQL y SQLite

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_tokens (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    plataforma VARCHAR(50) NOT NULL,
    token_acceso TEXT NOT NULL,
    fecha_expiracion TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    es_curso BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    servicio_id INTEGER NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
);

CREATE TABLE inscripciones_curso (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_pago VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES servicios(id) ON DELETE CASCADE
);

CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    autor_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE portfolio_items (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255) NOT NULL,
    tecnica VARCHAR(50) NOT NULL
);
