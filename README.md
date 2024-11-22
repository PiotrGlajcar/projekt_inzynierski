# Projekt Inzynierski
## Student Grades Project

This project is a Django backend for managing students, courses, and grades with role-based access for teachers and students.

---

## **Setup Instructions**

Follow these steps to set up and run the project on your local machine.

### **1. Clone the Repository**
Clone this project to your computer:
```powershell
git clone (https://github.com/PiotrGlajcar/projekt_inzynierski.git)

cd projekt_inzynierski

cd frontend # to work on frontend part
cd backend # to work on backend part
```

### **2. Set Up a Virtual Environment**

Create and Activate a Virtual Environment:
```powershell
python -m venv venv          # Create a virtual environment
source venv/bin/activate     # Activate it on Linux/Mac
venv\Scripts\activate        # Activate it on Windows
```
Install Django and Other Packages:
```powershell
pip install django                  # django-admin --version should be 5.1.3
pip install djangorestframework     # djangorestframework --version should be 3.15.2
pip install django-stubs djangorestframework-stubs  # for better code control
pip install requests-oauthlib       # oauthlib-3.2.2 requests-oauthlib-2.0.0
```
### **3. Set Up the Database**

Apply migrations to set up the database schema:
```powershell
python manage.py makemigrations
python manage.py migrate
```
### **4. Create a Superuser (Admin Account)**

If no superuser exists in the database, create one to access the admin panel:
```powershell
python manage.py createsuperuser
```
### **5. Run the Development Server**

Start the Django development server:
```powershell
python manage.py runserver
```
### **6. Access the Application**

Open your web browser and go to:

Admin Panel: http://127.0.0.1:8000/admin/

Log in using the credentials for the superuser or any other user you’ve created.

### **7. Troubleshooting**

1. Missing venv Activation: Ensure the virtual environment is activated before running manage.py commands:
```powershell
venv\Scripts\activate      # for Windows
```
2. Database Errors: If the database is missing or corrupted, reset it by deleting the database file (e.g., db.sqlite3) and re-running migrations:
```powershell
python manage.py makemigrations
python manage.py migrate
```
3. After applying any changes make sure to restart the server

### **8. Endpoints**
```powershell
admin/                                      # admin panel   
students/ [name='student-list']             # list of students
students/<int:pk>/ [name='student-detail']  # particular student
courses/ [name='course-list']               # list of courses
courses/<int:pk>/ [name='course-detail']    # particular course
grades/ [name='grade-list']                 # list of grades
grades/<int:pk>/ [name='grade-detail']      # particular grade
grades/create/ [name='create-grade']        
oauth/start                                 # USOS redirection
oauth/callback                              # USOS callback
oauth/logout                                # USOS logout
```

### **9. Request responses (from backend to frontend)**

1. **Success Response Example**
```json
{
    "status": "success",
    "message": "Action performed successfully",
    "data": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

2. **Error Response Example**
```json
{
    "status": "error",
    "message": "An error occurred during the action",
    "error_code": "ERROR_CODE_HERE",
    "data": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

3. **No Additional Data Example**

For actions like deletions or responses with no extra data:
```json
{
    "status": "success",
    "message": "Resource deleted successfully"
}
```
