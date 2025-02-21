import wordList from "./words_list.json";
import { Link } from "react-router-dom";
import Card from "./Card";
import "./Game.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WordType } from "types/types";

function RNG(s: number) {
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
}

const Game = () => {
  const { role, roomid } = useParams();
  const [shuffledWords, setShuffledWords] = useState<Array<WordType>>([]);
  const [firstTurn, setFirstTurn] = useState<"red" | "blue">(RNG(Number(roomid)) > 0.5 ? "red" : "blue");

  useEffect(() => {
    const randomWordList: Array<string> = [];
    let i = 0;

    while (randomWordList.length < 25) {
      const randomIndex = Math.floor(RNG(Number(roomid) + i) * wordList.classic.length) % wordList.classic.length;
      i += 1;
      const randomWord = wordList.classic[randomIndex];
      if (randomWordList.includes(randomWord)) {
        continue;
      }
      randomWordList.push(randomWord);
    }

    // Split the words into the different categories
    const endIndex = firstTurn === "red" ? 9 : 8;
    const redWords = randomWordList.slice(0, endIndex);
    const blueWords = randomWordList.slice(endIndex, 16);
    const grayWords = randomWordList.slice(17, 25);
    const blackWord = randomWordList[16];

    const tempWords = [...redWords.map((word, i) => ({ word, type: "red", id: i })), ...blueWords.map((word, i) => ({ word, type: "blue", id: i })), { word: blackWord, type: "black" }, ...grayWords.map((word, i) => ({ word, type: "gray", id: i }))];
    setShuffledWords(tempWords);
    setFirstTurn(RNG(Number(roomid) * 10) > 0.5 ? "red" : "blue");
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--base", `radial-gradient(circle, ${firstTurn == "red" ? "#e48957" : "#8fc0ef"}, ${firstTurn == "red" ? "#461408" : "#113154"})`);
  }, [firstTurn]);

  for (let i = 0; i < shuffledWords.length; i++) {
    const j = Math.floor(RNG(Number(roomid) + i) * 100) % shuffledWords.length;
    const temp = shuffledWords[i];
    shuffledWords[i] = shuffledWords[j];
    shuffledWords[j] = temp;
  }

  return (
    <div className="Game">
      <nav>
        <Link to="/" className="Link">
          <button className="Button">HOME</button>
        </Link>
        <h1 className="Role">{role?.toUpperCase()}</h1>
        <h3 className="Roomid">Room ID: {roomid}</h3>
      </nav>
      <div className="GameContainer">
        <div className="GridHeader">
          <div className="screw">
            <div className="indent" />
          </div>
          <div>
            <h4 className={firstTurn}>
              <span>First Turn:</span>
              {firstTurn.toUpperCase()}{" "}
            </h4>
          </div>
          <div className="screw">
            <div className="indent" />
          </div>
        </div>
        <div className="CardGrid">{shuffledWords.map((card, index) => (role === "spymaster" ? <Card key={index} word={card.word} type={card.type} id={card.id} /> : <Card key={index} id={card.id} word={card.word} type={card.type} clickable={true} />))}</div>
      </div>
    </div>
  );
};

export default Game;
