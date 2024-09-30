# Install all required dependencies
# Makefile

.PHONY: install run

install:
	python -m venv venv  # Create virtual environment
	. venv/bin/activate && pip install -r requirements.txt  # Install dependencies

run:
	. venv/bin/activate && python app.py  # Run the application

# Remove the virtual environment and all its dependencies
clean:
	rm -rf venv
