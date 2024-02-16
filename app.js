const app = require("express")();
require("dotenv").config({ path: "./.env" });


const router = require("./routes/homeRoutes.js");

app.use(router);



app.listen(process.env.PORT, () => {
	console.log(`app listening to port ${process.env.PORT}`);
});
