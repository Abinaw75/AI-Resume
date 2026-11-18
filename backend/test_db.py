
from sqlalchemy import text
from app.db.session import engine

try:
    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    current_database(),
                    current_user,
                    version()
            """)
        )

        database, user, version = result.fetchone()

        print("Supabase connection successful!")
        print("Database:", database)
        print("User:", user)
        print("Version:", version)

except Exception as error:

    print("Database connection failed!")
    print("Error:", error)
