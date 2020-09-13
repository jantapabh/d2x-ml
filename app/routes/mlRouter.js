module.exports = app => {
    const route = require("./../controllers/mlController");
    app.post("/ml", route.create);
    app.post("/running", route.running);
    app.get("/ml", route.get_process);
};
