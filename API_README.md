# Bookspicker Backend

This is the backend server for the Bookspicker project, a book recommendation service.

## Project Structure
*   **bookspicker/**: Django project settings and configuration.
*   **api/**: Core API application for books, viewer, and main features.
*   **accounts/**: User management and cold-start features.
*   **db.sqlite3**: SQLite database file.
*   **manage.py**: Django command-line utility.

## Prerequisites
*   Python 3.8 or higher
*   pip (Python package installer)

## Local Installation & Execution

### 1. Clone the Repository
If you haven't already, clone the repository to your local machine.

### 2. Install Dependencies
Navigate to the project root directory and install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Database Setup
Initialize the database (SQLite) by applying migrations:

```bash
python manage.py migrate
```

### 4. Create Superuser (Optional)
If you want to access the Django Admin interface (`/admin/`), create a superuser:

```bash
python manage.py createsuperuser
```

### 5. Run the Server
Start the development server:

```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`.

## API Documentation
Detailed API documentation can be found in [API_REFERENCE.md](API_REFERENCE.md).

## Usage
*   **Admin Panel**: `http://127.0.0.1:8000/admin/`
*   **API Root**: `http://127.0.0.1:8000/api/` (may vary depending on endpoint)
