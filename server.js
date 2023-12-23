import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;
mongoose.connect(DB_HOST).then(() => {
  app.listen(PORT, () => {
    console.log("Database connection successful");
    console.log(`Server running. Use our API on port: ${PORT}`);
})
}).catch(error => {
  console.log(error)
  process.exit(1);
})