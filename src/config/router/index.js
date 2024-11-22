const authRoutes = require("./auth")
module.exports = (app) => {
    try {
      // Testing Routes
      app.get("/", async (req, res) => {
        return res.status(200).json({
          status: "success",
          message: "API service is run properly",
        });
      });
      // login routes
      app.use("/", authRoutes);
      // handle unknown routing
      app.get("*", (req, res) => {
        res.status(404).json({
          status: "error",
          message: "Route not found",
        });
      });
    } catch (error) {
      console.log("[INFO-SERVER]: Server error => ", error);
    }
  };
  