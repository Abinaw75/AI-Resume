
from sqlalchemy import text
from app.db.session import engine

try:
    with engine.connect() as connection:

        result = connection.execute(
            text("SELECT COUNT(*) FROM public.users")
        )

        count = result.scalar()

        print("Users table connected successfully!")
        print("Total registered users:", count)

except Exception as error:
    print("Users table connection failed!")
    print("Error:", error)
