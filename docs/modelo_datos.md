# Modelo de Datos - FitTrack

## Objetivo

Definir todas las entidades y relaciones de la aplicación antes de crear la base de datos.

---

# Entidades

## Usuario

Representa a una persona registrada en la aplicación.

### Atributos

- id
- nombre
- email
- contraseña
- fechaRegistro

---

## Ejercicio

Representa un ejercicio que puede utilizarse en una o varias rutinas.

### Atributos

- id
- nombre
- grupoMuscular
- descripcion

---

## Rutina

Representa un conjunto de ejercicios creado por un usuario.

### Atributos

- id
- nombre
- descripcion
- fecha_Creacion
- usuario_Id
## RutinaEjercicio

Relaciona una rutina con sus ejercicios.

### Atributos

- id
- rutina_id
- ejercicio_id
- orden
- series_objetivo
- repeticiones_objetivo
- descanso_segundos

---

## Entrenamiento

Representa una sesión realizada por un usuario.

### Atributos

- id
- usuario_id
- rutina_id
- fecha
- duracion_minutos
- observaciones
# Modelo de Datos - FitTrack

## Objetivo

Definir las entidades y relaciones de la aplicación antes de comenzar el desarrollo.

---

# 1. Usuarios

## Usuario

Representa a una persona registrada en la aplicación.

### Atributos

- id
- nombre
- email
- contraseña
- fecha_registro

---

# 2. Entrenamientos

## Rutina

Representa un conjunto de ejercicios creado por un usuario.

### Atributos

- id
- nombre
- descripcion
- fecha_creacion
- usuario_id

---

## Ejercicio

Representa un ejercicio que puede utilizarse en una o varias rutinas.

### Atributos

- id
- nombre
- grupo_muscular
- descripcion

---

## RutinaEjercicio

Relaciona una rutina con sus ejercicios.

### Atributos

- id
- rutina_id
- ejercicio_id
- orden
- series_objetivo
- repeticiones_objetivo
- descanso_segundos

---

## Entrenamiento

Representa una sesión de entrenamiento realizada por el usuario.

### Atributos

- id
- usuario_id
- rutina_id
- fecha
- duracion_minutos
- observaciones

---

## EjercicioRealizado

Representa un ejercicio realizado durante un entrenamiento.

### Atributos

- id
- entrenamiento_id
- ejercicio_id

---

## Serie

Representa una serie realizada en un ejercicio.

### Atributos

- id
- ejercicio_realizado_id
- numero_serie
- peso
- repeticiones
- rir
- descanso_segundos

---

# 3. Nutrición

## Comida

Representa una comida realizada por el usuario.

### Atributos

- id
- usuario_id
- fecha
- tipo
- observaciones

---

## Alimento

Representa un alimento disponible para registrar.

### Atributos

- id
- nombre
- calorias
- proteinas
- carbohidratos
- grasas
- fibra
- alergenos

---

## ComidaAlimento

Relaciona los alimentos consumidos en una comida.

### Atributos

- id
- comida_id
- alimento_id
- cantidad_gramos

---

# 4. Progreso

## RegistroPeso

Registra el peso corporal del usuario.

### Atributos

- id
- usuario_id
- fecha
- peso

---

## Medicion

Registra medidas corporales.

### Atributos

- id
- usuario_id
- fecha
- pecho
- cintura
- cadera
- brazo
- antebrazo
- muslo
- gemelo

---

## Objetivo

Representa un objetivo del usuario.

### Atributos

- id
- usuario_id
- tipo
- valor_objetivo
- fecha_inicio
- fecha_fin
- estado