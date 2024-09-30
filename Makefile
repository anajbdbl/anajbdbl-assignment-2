# Install all required dependencies
# Makefile

install:
	pip install -r requirements.txt

run:
	flask run --host=0.0.0.0 --port=3000

# install:
# 	python3.10 -m venv venv  # Create virtual environment
# 	. venv/bin/activate && pip install -r requirements.txt 

clean:
	rm -rf venv
