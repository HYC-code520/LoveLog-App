from app import app, db
from models import Event, User  # Import User to assign user_id

def seed_events():
    with app.app_context():  # ✅ Ensures the script runs within the Flask application context
        # Fetch an existing user (first user in the database)
        test_user = User.query.first()

        if not test_user:
            print("❌ No users found! Please create a user before running seed.py.")
            return

        test_events = [
            Event(user_id=test_user.id, title="First Ice Cream Date 🍦", date="2025-02-02", 
                  start_time="14:00", end_time="15:30",
                  details="Tried 5 different flavors, but we both loved the matcha one the most. Ended with a playful spoon fight! 💚"),

            Event(user_id=test_user.id, title="Weekend Cabin Getaway 🏕️", date="2025-02-03", 
                  start_time="17:00", end_time="11:00",  
                  details="Cozy fireplace, homemade hot cocoa, and stargazing at night. Best weekend ever. 🔥✨", 
                  range_start="2025-02-03", range_end="2025-02-05"), 

            Event(user_id=test_user.id, title="Sunset Picnic at the Park 🌅", date="2025-02-06", 
                  start_time="17:30", end_time="19:00",
                  details="Made cute sandwiches together, fed the ducks, and watched the sun dip below the lake. Magical. ✨"),

            Event(user_id=test_user.id, title="Rainy Coffee Shop Date ☕", date="2025-02-08", 
                  start_time="13:00", end_time="15:00",
                  details="Shared an oversized sweater and listened to lo-fi while sipping caramel lattes. Best rainy day ever. 🌧️"),

            Event(user_id=test_user.id, title="Valentine's Day Special 💖", date="2025-02-13", 
                  start_time="18:00", end_time="22:00",
                  details="Surprised each other with handwritten love letters and heart-shaped chocolates. Teary-eyed moment. 🥹🍫", 
                  range_start="2025-02-13", range_end="2025-02-14"), 

            Event(user_id=test_user.id, title="Late-Night Drive & Stargazing 🚗", date="2025-02-15", 
                  start_time="22:00", end_time="00:30",
                  details="Drove with no destination, ended up at a quiet hilltop. Held hands and counted shooting stars. 🌠"),

            Event(user_id=test_user.id, title="DIY Pizza Night 🍕", date="2025-02-18", 
                  start_time="19:00", end_time="21:30",
                  details="Tried to make heart-shaped pizzas. His looked perfect, mine looked like a potato. Laughed until we cried. 😂"),

            Event(user_id=test_user.id, title="Cherry Blossom Walk 🌸", date="2025-02-20", 
                  start_time="16:00", end_time="18:30",
                  details="Held hands under a tunnel of pink blossoms. Took way too many photos but every moment felt like a dream. 📸💕"),

            Event(user_id=test_user.id, title="Build-A-Bear Date 🧸", date="2025-02-22", 
                  start_time="14:00", end_time="16:00",
                  details="Made matching teddy bears with little love notes inside. Mine has his voice recorded inside. 😭❤️"),

            Event(user_id=test_user.id, title="Surprise Staycation at a Fancy Hotel 🏨", date="2025-02-23", 
                  start_time="15:00", end_time="11:00",
                  details="Ordered room service in fluffy robes and had a bubble bath together. Felt like a honeymoon. 🛁💕", 
                  range_start="2025-02-23", range_end="2025-02-24"), 

            Event(user_id=test_user.id, title="Arcade Battle Date 🎮", date="2025-02-25", 
                  start_time="17:00", end_time="20:00",
                  details="Competed in every game. I won at racing, he won at claw machines. Left with matching plushies. 🏆🐻"),

            Event(user_id=test_user.id, title="Matching Pajama Day 🛏️", date="2025-02-26", 
                  start_time="12:00", end_time="23:59",
                  details="Wore matching cat pajamas, made a blanket fort, played Switch until we fell asleep. 💤🐱"),

            Event(user_id=test_user.id, title="Baking Together 🍪", date="2025-02-27", 
                  start_time="15:00", end_time="18:00",
                  details="Flour fight. Cookie dough taste test (a lot). Burnt the first batch but laughed so much. 🍪💖"),
        ]

        db.session.add_all(test_events)
        db.session.commit()
        print("✅ Cute test events with user_id added to the database!")

if __name__ == "__main__":
    seed_events()
