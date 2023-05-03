# Uploadie
A nodejs express backend to upload images on Amazon S3 Bucket and shorten its URL

# Technologies/Libraries Used

- Nodejs
- Typescript
- Express
- MongoDB
- AWS SDK
- S3 Bucket

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

