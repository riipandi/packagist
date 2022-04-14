async function errorHandler(context) {
    const { data } = context;
    let res;

    try {
        data.timestamp = Date.now();
        res = await context.next();
    } catch (err) {
        // catch and report and errors when running the next function
        console.error(`Error`, err.message);
        const resp = JSON.stringify({ error: `Endpoint not found!` });
        res = new Response(resp, { status: 500 });
    } finally {
        let delta = Date.now() - data.timestamp;
        res.headers.set("x-response-timing", delta);
        res.headers.set("x-data-timestamp", data.timestamp);
        res.headers.set("x-signature", "Aris Ripandi");
        return res;
    }
}

// Attach `errorHandler` to all HTTP requests
export const onRequest = errorHandler;
