PYTHON=python3.11

install:
	$(PYTHON) -m pip install -r requirements.txt

run:
	$(PYTHON) -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

run-prod:
	$(PYTHON) -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2

.PHONY: install run run-prod
