const googleSearchService = require("../services/GoogleSearchService");
class HomeController {
	HomeController() {

	}
	async search(req, res) {
		let query = req.query.q;
		let result = await googleSearchService.googleSearch({ "query" : query, options: {} });
		console.log(query)
		res.send(result);
	}
	async searchWithoutFilter(req, res) {
		let query = req.query.q;
		let result = await googleSearchService.searchWithoutFilter({ "query" : query, options: {} });
		console.log(query)
		res.send(result);
	}
	show() {

	}
}






module.exports = new HomeController()