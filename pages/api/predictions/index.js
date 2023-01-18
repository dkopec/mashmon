import { unstable_getServerSession } from "next-auth/next"
import authOptions from "../auth/[...nextauth]"
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore, collection, setDoc } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app)

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)

    if (session) {
        // Signed in

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

    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}