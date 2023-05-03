# Uploadie
A nodejs express backend to upload images on Amazon S3 Bucket and shorten its URL

# Technologies/Libraries Used

- Nodejs
- Typescript
- Express
- MongoDB
- AWS SDK
- S3 Bucket
- Bcrypt
- 
# Setup

1. Nodejs and Typescript should be installed globally on system.
2. Clone the project
3. Create a .env file and paste the following content

```
DATABASE_NAME='MONGODB DATABASE NAME HERE'
DATABASE_URL='MONGODB DATABASE URL HERE'
AGENDA_DATABASE_URL= 'MONGODB AGENDA DATABASE URL HERE'
PORT = 'PORT NUMBER E.G. 4000'
ENV_NAME='testing/prod'
JWT_SECRET_TOKEN= 'SECRET HERE'
AWS_ACCESS_KEY =AWS ACCESS KEY HERE'
AWS_SECRET_KEY ='AWS SECRET KEY HERE' 

```

4. Run npm install to install all necessary packages required.
5. Run npm run dev to start the app.

# API Endpoints

1. /user/login - Login the user
2. /user/add - Registers a user
3. /user/get-details - Get a user's detail
4. /user/change - Change password
5. /file/add - Adds an image file to the AWS S3 Bucket, shorten its url and return it
6. /file/delete - Delete an image from MongoDB and AWS s3 bucket
7. /file/all - Returns all images af an user
8. /:urlId - takes an id and return the actual URL of the image

# Diagram

![how-url-shortener-work](https://user-images.githubusercontent.com/55250734/235887184-4109be8a-8c44-4883-829c-a7f5aabc3244.jpeg)
