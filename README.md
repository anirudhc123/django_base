# Mini JIRA Clone

## Setup
1. Backend: `cd backend`, `pip install -r requirements.txt`, update DB creds in settings.py, `python manage.py migrate`, `python manage.py runserver`.
2. Frontend: `cd frontend`, `npm install`, `npm start`.
3. Database: Create PostgreSQL DB `mini_jira`.
4. DB Schema: View on dbdiagram.io (import schema.sql).

## Features
- Auth: Login/Register with roles.
- User: CRUD tasks.
- Admin: View stats and table.

## Notes
- Time tracked via Clockify (attach report).
- Extra: Task due date.