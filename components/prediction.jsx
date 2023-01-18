import { useState } from "react";
import { getRandomPrompt } from "../lib/prompt";
import styles from "../styles/Home.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Prediction() {
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

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
        <input type="text" name="prompt" placeholder={prompt} />
        <button type="reset"><FontAwesomeIcon icon={faRefresh}>Refresh</FontAwesomeIcon></button>
        <button type="submit">Go!</button>
      </form>

      {error && <div>{error}</div>}

      {
        prediction && (
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
        )
      }

      {
        !prediction && (
          <p>Press Go to Start</p>
        )
      }
    </>

  );
};