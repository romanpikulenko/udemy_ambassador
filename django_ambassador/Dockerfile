FROM python:3.11.3
# Setting PYTHONUNBUFFERED to a non-empty value different from 0 ensures that the python output i.e. the stdout and stderr streams are sent straight to terminal
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . ./

# 0.0.0.0 - is the localhost of a docker container
# CMD python manage.py wait_for_db && python manage.py runserver 0.0.0.0:8000
CMD python manage.py runserver 0.0.0.0:8000