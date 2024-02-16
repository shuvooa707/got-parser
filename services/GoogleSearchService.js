const { gotScraping } = require("got-scraping");
const { JSDOM } = require("jsdom");
const { HeaderGenerator } = require("header-generator");

const getHeaders = () => {
	const header = new HeaderGenerator().getHeaders({
		browsers: ["chrome"],
		devices: ["desktop"],
		operatingSystems: ["windows"],
	});

	return {
		accept: "*/*",
		"sec-ch-ua-mobile": header["sec-ch-ua-mobile"],
		"sec-ch-ua-platform": header["sec-ch-ua-platform"],
		"sec-ch-ua": header["sec-ch-ua"],
		"user-agent": header["user-agent"],
	};
};
const formatTime = (time) => {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time - hours * 3600) / 60);
	const seconds = Math.floor(time - hours * 3600 - minutes * 60);
	if (hours === 0 && minutes === 0) return `${seconds}s`;
	if (hours === 0) return `${minutes}m ${seconds}s`;
	return `${hours}h ${minutes}m ${seconds}s`;
};

function GoogleSearchService() {
	return {
		googleSearch : async ({ query, options }) => {
			const start = performance.now();
			const headers = options?.headers || getHeaders();
			const sendHtml = options?.html || "false";

			delete options?.html;

			const response = await gotScraping({
				url: "https://www.google.com/search",
				searchParams: {
					q: query,
					num: 100,
				},
				headers,
				...options,
				responseType: "text",
			});

			if ( sendHtml === "true" ) {
				return {
					code: 200,
					status: "success",
					message: "HTML response",
					query,
					body: response.body,
				};
			}

			if ( response.statusCode !== 200 ) {
				return {
					code: response.statusCode,
					status: "error",
					message: "Captcha or too many requests.",
					query,
					body: response.body,
				};
			}

			const dom = new JSDOM(response.body);
			const document = dom.window.document;

			const searchResults = dom.window.document.querySelectorAll(".g");

			const results = [];

			searchResults.forEach((result) => {
				const title = result.querySelector("h3");
				const url = result.querySelector("a");
				const description = result.querySelector(".VwiC3b");

				if (title && url && description) {
					results.push({
						title: title.textContent,
						url: url.href,
						description: description.textContent,
					});
				}
			});

			let snippet = {
				title:
					document.querySelector(".co8aDb")?.textContent ||
					document.querySelector(".LC20lb")?.textContent,
				description:
					document.querySelector(".hgKElc")?.textContent.trim() ||
					document
						.querySelector(".i8Z77e")
						?.innerHTML.split("</li>")
						.filter((item) => item !== "")
						.map((item) => item.slice(item.indexOf(">") + 1))
						.join("\n") ||
					document
						.querySelector(".X5LH0c")
						?.innerHTML.split("</li>")
						.filter((item) => item !== "")
						.map(
							(item, index) => index + 1 + ". " + item.slice(item.indexOf(">") + 1)
						)
						.join("\n"),
			};

			if (!snippet.description) snippet = null;

			return {
				code: 200,
				status: "success",
				message: `Found ${results.length} results in ${formatTime(
					(performance.now() - start) / 1000
				)}`,
				query,
				data: { snippet, results },
			};
		}
	}
}


module.exports = GoogleSearchService();