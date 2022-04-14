/** Cloudflare worker to mask Packagist.org and use Worker Cache to quickening the responses
 * ---------------------------------------------------------------------------------------
 * Author: Aris Ripandi <https://github.com/riipandi>
 * ---------------------------------------------------------------------------------------
 * Now we want to handle responses from repo.packagist.org domain as well.
 * We replace both of the urls with our domain and subpath. To distinguish which
 * url points to what cdn, we use fontSubPath variable.
 * */

// Packagist hostname (without protocol)
const packagistHost = "repo.packagist.org";

export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const url = new URL(request.url); // making an url object from the request

    // Serve static from the public directory only for index page.
    if (url.pathname === "/" || url.pathname === "/robots.txt") {
        return env.ASSETS.fetch(request);
    }

    // Otherwise, return forward the requests.
    const paths = params.path.map((el) => el).join("/");
    const endpoint = `https://${packagistHost}/${paths}`;
    const resp = await fetch(endpoint);
    const result = await resp.json();

    return new Response(JSON.stringify(result), null, 2);
}
