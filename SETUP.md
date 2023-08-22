# Setup Instructions

Follow these steps to set up the CodeVerse project on your local machine.

## Server Setup

1. **Environment Variables**:

   - In the `server` folder, create a `.env` file.
   - Inside the `.env` file, add the following variables:
   
     ```
     MONGO_DB_USERNAME=your_mongo_db_username
     MONGO_DB_PASSWORD=your_mongo_db_password
     ```

   Replace `your_mongo_db_username` and `your_mongo_db_password` with your actual MongoDB username and password.

2. **Install Dependencies**:

   - Open a terminal and navigate to the `server` directory using `cd server`.
   - Run `npm install` to install the required dependencies.

3. **Run the Server**:

   - After installing dependencies, run the server using `npm run dev`.

## Client Setup

1. **Environment Variables**:

   - In the `client` folder, create a `.env` file.
   - Inside the `.env` file, add the following variable:
   
     ```
     VITE_RAPID_API_KEY=your_rapid_api_key
     ```
     
   Replace `your_rapid_api_key` with your actual Rapid API key.

2. **Install Dependencies**:

   - Open a new terminal and navigate to the `client` directory using `cd client`.
   - Run `npm install` to install the required dependencies.

3. **Run the Client**:

   - After installing dependencies, run the client using `npm start`.

4. **Access CodeVerse**:

   - Open your browser and go to `http://localhost:5173` to start using CodeVerse!

---
