import { generateSlug, RandomWordOptions, totalUniqueSlugs } from "random-word-slugs";

const options = {
    format: "lower",
    categories: {
        noun: ["animals", "food", "people", "thing"],
    },
};

//https://www.npmjs.com/package/random-word-slugs
export function getRandomPrompt() {
    return generateSlug(3, options).replace("-", " ");
};