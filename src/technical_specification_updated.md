
# Техническое задание

#### Технологии проекта:
- **Backend**: Node.js (Express.js)
- **База данных**: PostgreSQL
- **Frontend**: JavaScript (взаимодействие через API)

---

## 1. Структура Базы Данных

### Таблица `settings`

Для хранения данных администратора:

| Поле        | Тип данных | Описание                 |
|-------------|------------|--------------------------|
| id          | SERIAL     | Уникальный идентификатор |
| password    | TEXT       | Пароль администратора    |
| adminName   | TEXT       | Имя администратора       |
| titleSite   | TEXT       | Заголовок сайта          |

**SQL-запрос для создания таблицы:**
```sql
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    password TEXT DEFAULT '6251728',
    adminName TEXT DEFAULT 'admin',
    titleSite TEXT DEFAULT 'My Site'
);
```

### Таблица `sessions`

Для хранения данных о сеансах:

| Поле      | Тип данных       | Описание                                   |
|-----------|------------------|--------------------------------------------|
| id        | VARCHAR(6)       | Уникальный идентификатор (6 цифр)          |
| name      | TEXT             | Название сеанса                            |
| createdAt | TIMESTAMP        | Дата и время создания                      |
| devices   | INTEGER          | Количество устройств, по умолчанию 0       |
| type      | TEXT             | Тип сеанса (передается из JS)              |
| code      | VARCHAR(6)       | Уникальный код сеанса (6 цифр)             |

**SQL-запрос для создания таблицы:**
```sql
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(6) PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    devices INTEGER DEFAULT 0,
    type TEXT NOT NULL,
    code VARCHAR(6) UNIQUE NOT NULL
);
```

### Таблица `data`

Для хранения основных данных:

| Поле      | Тип данных       | Описание                                  |
|-----------|------------------|-------------------------------------------|
| id        | VARCHAR(6)       | Уникальный идентификатор (6 цифр)         |
| name      | TEXT             | Название элемента                         |
| createdAt | TIMESTAMP        | Дата и время создания                     |

**SQL-запрос для создания таблицы:**
```sql
CREATE TABLE IF NOT EXISTS data (
    id VARCHAR(6) PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `candidates`

Для хранения информации о кандидатах:

| Поле       | Тип данных       | Описание                                   |
|------------|------------------|--------------------------------------------|
| id         | VARCHAR(6)       | Уникальный идентификатор (6 цифр)          |
| dataId     | VARCHAR(6)       | Ссылка на id элемента из таблицы `data`    |
| createdAt  | TIMESTAMP        | Дата и время создания                      |
| fullName   | TEXT             | Полное имя кандидата                       |
| class      | TEXT             | Класс кандидата                            |
| photo      | TEXT             | URL фото кандидата                         |
| votes      | INTEGER          | Количество голосов (по умолчанию 0)        |

**SQL-запрос для создания таблицы:**
```sql
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(6) PRIMARY KEY,
    dataId VARCHAR(6) REFERENCES data(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fullName TEXT NOT NULL,
    class TEXT NOT NULL,
    photo TEXT NOT NULL,
    votes INTEGER DEFAULT 0
);
```

---

## 2. API эндпоинты

### 2.1. Управление администратором

1. **Получить информацию администратора**
   - **Метод**: `GET /api/admin`
   - **Ответ**:
     ```json
     {
       "adminName": "admin",
       "password": "6251728",
       "titleSite": "My Site"
     }
     ```

2. **Изменить данные администратора**
   - **Метод**: `PATCH /api/admin`
   - **Тело запроса**:
     ```json
     {
       "adminName": "new_admin",
       "password": "new_password",
       "titleSite": "New Site Title"
     }
     ```
   - **Ответ**:
     ```json
     { "message": "Admin settings updated successfully" }
     ```

### 2.2. Работа с сеансами

1. **Создать новый сеанс**
   - **Метод**: `POST /api/sessions`
   - **Тело запроса**:
     ```json
     {
       "name": "string",
       "type": "string"
     }
     ```

2. **Получить все сеансы**
   - **Метод**: `GET /api/sessions`

3. **Удалить сеанс по ID**
   - **Метод**: `DELETE /api/sessions/:id`

4. **Сменить код сеанса**
   - **Метод**: `PATCH /api/sessions/:id/code`

### 2.3. Работа с данными

1. **Получить все элементы**
   - **Метод**: `GET /api/data`

2. **Создать новый элемент**
   - **Метод**: `POST /api/data`

3. **Изменить имя элемента**
   - **Метод**: `PATCH /api/data/:id`

### 2.4. Управление кандидатами

1. **Добавить кандидата**
   - **Метод**: `POST /api/data/:id/candidates`

2. **Удалить кандидата**
   - **Метод**: `DELETE /api/data/:dataId/candidates/:candidateId`

3. **Изменить информацию кандидата**
   - **Метод**: `PATCH /api/data/:dataId/candidates/:candidateId`

4. **Увеличить количество голосов кандидата**
   - **Метод**: `PATCH /api/data/:dataId/candidates/:candidateId/vote`

---

## Настройка проекта

### Запуск сервера:
```bash
node server.js
```
