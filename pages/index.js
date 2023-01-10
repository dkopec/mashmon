import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import LoginButton from "../components/login-btn";
import { generateSlug, RandomWordOptions, totalUniqueSlugs } from "random-word-slugs";
import NavBar from "../components/navbar"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

//https://www.npmjs.com/package/random-word-slugs
function getRandomPrompt() {  
  const options = {
    format: "lower",
    categories: {
      noun: ["animals", "food", "people", "thing"],
    },
  };
  return generateSlug(3, options).replace("-", " ");
};

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState(getRandomPrompt());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction })
      setPrediction(prediction);
    }
  };

  const handleReset = e => {
    setPrompt(getRandomPrompt());
  };

  function handleHamburgerClick() {
    var navLink = document.querySelector('.nav__link');
    navLink.classList.toggle('hide');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Mashmon the Game</title>
      </Head>

      <NavBar></NavBar>

      <p>
        Mash your Mosters, powered by {" "}
        <Link href="https://replicate.com/lambdal/text-to-pokemon/">lambdal/text-to-pokemon</Link>
      </p>

      <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
        <input type="text" name="prompt" placeholder={prompt} />
        <button type="reset"><FontAwesomeIcon icon={faRefresh}>Refresh</FontAwesomeIcon></button>
        <button type="submit">Go!</button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className={styles.imageWrapper}>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes='100vw'
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
