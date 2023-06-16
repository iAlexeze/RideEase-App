from flask import Flask, render_template, request, redirect, session, current_app
from models import db, User
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Set the secret key from an environmental variable
app.secret_key = os.environ.get('SECRET_KEY')

# Configure the PostgreSQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the db instance
db.init_app(app)

# Create the database tables if they don't exist
with app.app_context():
    db.create_all()

# Define the PostgreSQL connection details
postgres_host = os.environ.get('POSTGRES_HOST')  # Replace with your PostgreSQL host
postgres_port = os.environ.get('POSTGRES_PORT')  # Replace with your PostgreSQL port

print(f"PostgreSQL connected to {postgres_host}:{postgres_port}")


@app.before_request
def before_request():
    # Establish a database connection before each request
    db.session.rollback()


@app.teardown_request
def teardown_request(exception=None):
    # Close the database connection after each request
    db.session.remove()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/signup', methods=['POST'])
def signup():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    if not name or not email or not password:
        return render_template('index.html', signup_error='Please fill in all fields.')

    # Check if the user already exists in the database
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return render_template('index.html', signup_error='User already exists. Please login.')

    # Create a new User instance
    user = User(name=name, email=email, password=password)

    # Add the user to the database
    db.session.add(user)
    db.session.commit()

    return render_template('index.html', signup_success='Thank you for registering. Login to start riding with ease.')


@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    if not email or not password:
        return render_template('index.html', login_error='Please fill in all fields.')

    # Retrieve the user from the database
    user = User.query.filter_by(email=email).first()

    if not user:
        return render_template('index.html', login_error='User does not exist. Please sign up.')

    if user.password != password:
        return render_template('index.html', login_error='Incorrect password.')

    # Store user session
    session['email'] = email

    return redirect('/dashboard')


@app.route('/dashboard')
def dashboard():
    if 'email' not in session:
        return redirect('/')

    email = session['email']
    user = User.query.filter_by(email=email).first()

    return render_template('dashboard.html', name=user.name)


@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
