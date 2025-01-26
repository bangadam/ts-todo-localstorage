Bun.serve({
	port: 3000,
	async fetch(req: Request) {
		const path = new URL(req.url).pathname;

		if (path === "/") {
			return new Response(Bun.file("public/index.html"));
		}

		const file = Bun.file(`public${path}`);
		if (await file.exists()) {
			return new Response(file);
		}

		return new Response("Not found", { status: 404 });
	},
});

console.log("Server running at http://localhost:3000");
