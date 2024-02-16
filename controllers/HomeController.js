const googleSearchService = require("../services/GoogleSearchService");
class HomeController {
	HomeController() {

	}
	async index(req, res) {
		let query = req.query.q;
		let result = await googleSearchService.googleSearch({ "query" : query, options: {} });
		console.log(query)
		res.send(result);
	}
	show() {

	}
}






module.exports = new HomeController()