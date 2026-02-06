  # Restaurant Management System

  This is a code bundle for Restaurant Management System. The original project is available at https://www.figma.com/design/IAmEduVOtSx6CRr4Y3eLvI/Restaurant-Management-System.

  ## Final-year project MVP scope

  This repository currently contains a front-end prototype. To make it a fully functional final-year project, implement the MVP features below in order, then add the Phase 2/3 enhancements if time allows.

  ### Phase 1: MVP (must-have)

  **User roles**
  - Restaurant Admin
  - Customer
  - System Admin (optional for later)

  **Restaurant registration flow**
  - Collect: restaurant name, address + location, contact details, opening hours, login credentials.
  - Generate a unique restaurant ID and a QR code pointing to:
    `https://yourapp.com/menu/{restaurantId}`

  **Menu & dish management**
  Each restaurant can add multiple dishes with:
  - Dish name, dish image (mandatory), ingredients, cooking methodology, calories.
  - Category (starter/main/dessert).
  - Recommended for: diabetic, gym/fitness, kids, vegan.
  - Price and availability (yes/no).
  - Store images in Cloudinary (or S3).

  **Customer (QR-based access)**
  - Scan QR → open menu → view dish details (images, ingredients, calories, recommendations).
  - Add to cart → place order / pre-order.
  - Login required only for booking, reviews, or payment.

  **Customer registration**
  - Name
  - Email / phone
  - Food preference (veg/non-veg/vegan)
  - Allergies (optional)

  **Table booking (basic)**
  - Restaurant sets number of tables and seats per table.
  - Customer selects date/time/party size.
  - System checks availability and confirms.

  **Payment**
  - Simple option first (COD / pay at restaurant) or Razorpay.

  **Reviews & ratings**
  - 1–5 star rating + comments after order.

  ### Phase 2: AI (one feature)
  - Food image recognition with a small, curated dataset (20–30 dishes).
  - Use a pre-trained CNN (e.g., MobileNet/ResNet).
  - If not recognized, show similar dishes.

  ### Phase 3: Analytics
  - Most ordered dish
  - Peak hours
  - Average rating
  - Revenue per day
  - Use Chart.js or Recharts

  ## Suggested tech stack

  **Frontend**
  - React.js + Tailwind CSS
  - QR scanning: `html5-qrcode`

  **Backend**
  - Node.js + Express
  - JWT authentication

  **Database**
  - MongoDB

  **Image storage**
  - Cloudinary

  ## Simplified database structure

  **Restaurant**
  ```json
  {
    "_id": "restaurantId",
    "name": "",
    "location": "",
    "menu": [dishId],
    "qrCode": ""
  }
  ```

  **Dish**
  ```json
  {
    "name": "",
    "image": "",
    "ingredients": [],
    "calories": 250,
    "recommendedFor": ["diabetic", "fitness"]
  }
  ```

  **User**
  ```json
  {
    "name": "",
    "email": "",
    "preferences": []
  }
  ```

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
