export const onRequestGet = () => {
    const resp = JSON.stringify({ message: "Pong" });
    return new Response(resp);
};
