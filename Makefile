# Install all required dependencies
install:
	# Create a virtual environment if it doesn't exist and activate it
	python3 -m venv venv
	# Install dependencies from requirements.txt
	venv/bin/pip install -r requirements.txt

# Run the application on localhost:3000
run:
	# Activate the virtual environment and run the Flask application
	venv/bin/python3 app.py

# Remove the virtual environment and all its dependencies
clean:
	rm -rf venv
