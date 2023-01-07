export default async function handler(req, res) {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // Pinned to a specific version of Stable Diffusion
            // See https://replicate.com/lambdal/text-to-pokemon/versions
            version: "3554d9e699e09693d3fa334a79c58be9a405dd021d3e11281256d53185868912",

            // This is the text prompt that will be submitted by a form on the frontend
            input: {
                prompt: req.body.prompt,
                num_outputs: 1,
                num_inference_steps: 50,
                guidance_scale: 7.5
            },
        }),
    });

    if (response.status !== 201) {
        let error = await response.json();
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }

    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
}