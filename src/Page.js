import React, { useState, useEffect, useMemo } from "react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { createTransferInstruction, getMint } from "@solana/spl-token";
import { connection } from "./services/web3";
import { getOrCreateAssociatedTokenAccount } from "./utils/getOrCreateAssociatedTokenAccount";
import { confirmTransaction } from "./utils/confirmTransaction";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "./App.css";
require("@solana/wallet-adapter-react-ui/styles.css");

function Page() {
  const [selectedMessageKeys, setSelectedMessageKeys] = useState(new Set());
  const [finalMessage, setFinalMessage] = useState("");
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showInstructionText, setShowInstructionText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showControlButtons, setShowControlButtons] = useState(false);

  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const messages = {
    sad: {
      title: "Mental Health Break",
      message:
        "The journey has been tougher than expected, leaving me deeply saddened. This sadness is a reflection of the unexpected challenges we've encountered. I'm in need of a mental health break.",
    },
    funds: {
      title: "Mint Funds",
      message:
        "I used funds from the mint, thinking it was necessary for growth. The decision to allocate mint funds elsewhere has complicated our situation.",
    },
    work: {
      title: "It's too much work",
      message:
        "The workload has surpassed my expectations, feeling almost insurmountable. I underestimated the sheer volume of work involved in this project.",
    },
    pressure: {
      title: "The pressure is overwhelming",
      message:
        "Facing immense pressure, both internally and externally, has become a daily challenge. The weight of expectations is overwhelming and harder to bear than I imagined.",
    },
    regret: {
      title: "Regretting my decisions",
      message:
        "Looking back, I realize that some choices were not in our project's best interest. I regret certain decisions that seemed right at the time but have led to unforeseen issues.",
    },
    disappointed: {
      title: "Disappointed in the outcome",
      message:
        "The outcome of our efforts has been disappointing, falling short of our aspirations. There's a profound sense of disappointment in not achieving what we set out to do.",
    },
    misunderstood: {
      title: "Feeling misunderstood",
      message:
        "My intentions and vision for the project seem to be misunderstood by many. There's a disconnect between my efforts and how they are perceived, leaving me feeling misunderstood.",
    },
    investors: {
      title: "Investors are unhappy",
      message:
        "The feedback from investors has been clear; they are unhappy with the current direction. Dealing with unhappy investors has added a layer of complexity to our challenges.",
    },
    missed: {
      title: "Missed our goals",
      message:
        "We've fallen short of the ambitious goals we set, which is disheartening. Missing our targeted milestones has been a significant setback for the team.",
    },
    morale: {
      title: "Team morale is low",
      message:
        "The team's spirit has been affected, with morale hitting an all-time low. Low morale within the team is reflecting in our productivity and collaboration.",
    },
    struggling: {
      title: "Struggling with expectations",
      message:
        "The expectations set for us, and by us, have become a struggle to meet. Balancing what is expected against what is feasible has been a constant struggle.",
    },
    offtrack: {
      title: "Project is off track",
      message:
        "Our project has deviated from its intended path, facing unexpected detours. Staying on track has been challenging, and we've veered off course significantly.",
    },
    communication: {
      title: "Communication issues",
      message:
        "Effective communication has been a hurdle, leading to misunderstandings and delays. Our project is suffering due to gaps and issues in our communication strategies.",
    },
    financial: {
      title: "Financial challenges",
      message:
        "We are facing significant financial challenges that are impacting our progress. The financial aspect of this project has proven to be more complex than anticipated.",
    },
    tech: {
      title: "Tech is more complex than expected",
      message:
        "The technological side of the project is far more complex than we initially planned for. We've hit several technical roadblocks that were not part of our original estimates.",
    },
    legal: {
      title: "Legal hurdles are daunting",
      message:
        "Navigating the legal aspects of our project has been more daunting than we foresaw. We're facing a series of legal hurdles that are complicating our progress.",
    },
    burntout: {
      title: "Burnt out and exhausted",
      message:
        "The continuous grind has left me burnt out and mentally exhausted. This exhaustion is a testament to the relentless pace and pressure we've been under.",
    },
    lostpassion: {
      title: "Lost passion for the project",
      message:
        "Somewhere along the way, the passion I had for this project has diminished. Losing my initial passion has made it increasingly difficult to drive the project forward.",
    },
    mistakes: {
      title: "Mistakes were made in a wallet that I control",
      message:
        "I've made errors in managing the wallet under my control, affecting our financial stability. Mistakes in handling the project's wallet have led to significant setbacks.",
    },
    robbed: {
      title: "My partner/dev robbed me",
      message:
        "I've faced a major betrayal; my partner/developer has taken funds, leaving the project in jeopardy. This act of being robbed by someone I trusted has shaken the foundation of our project.",
    },
    solana: {
      title: "Solana is dead",
      message:
        "The ecosystem I believed in, Solana, seems to be losing its vitality and relevance in the market. Facing the reality that Solana is not what it once was, has been a tough pill to swallow for our project.",
    },
    solup: {
      title: "Be careful SOL still up from seed",
      message: "Do not forget SOL is still up 69420% from seed round.",
    },
  };

  const start = () => {
    setShowInstructionText(true);
    setShowButtons(true);
    setShowControlButtons(true);
  };

  const selectButton = (buttonId) => {
    setSelectedMessageKeys((prevSelectedKeys) => {
      const newSelectedKeys = new Set(prevSelectedKeys);
      newSelectedKeys.has(buttonId)
        ? newSelectedKeys.delete(buttonId)
        : newSelectedKeys.add(buttonId);
      return newSelectedKeys;
    });
  };

  const next = async () => {
    console.log("Next button clicked");
    if (selectedMessageKeys.size < 2 || selectedMessageKeys.size > 5) {
      alert("Please select between 2 to 5 options.");
    }
    const transaction = new Transaction();
    const mint = new PublicKey("CPxE3TB2fjoxf3ip2DkepUMje8eCAucHHavS17g3VER1");
    const mintInfo = await getMint(connection, mint);

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      publicKey,
      mint,
      publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      publicKey,
      mint,
      new PublicKey("2teX5HkK3zk93sh7BxGNM3n2bqPqGA6qeVvq2uR3DD5m")
    );

    if (toTokenAccount.instruction) {
      transaction.add(toTokenAccount.instruction);
    }

    transaction.add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        publicKey,
        1000 * Math.pow(10, mintInfo.decimals)
      )
    );

    transaction.feePayer = publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const tx = await sendTransaction(transaction, connection);
    console.log(tx)
    const isConfirmed = await confirmTransaction({tx, connection});

    if (!isConfirmed) {
      alert("Transaction error");
      return;
    }
    generateFinalMessage();
    setShowFinalMessage(true);
    setShowButtons(false);
    setShowControlButtons(false);
    console.log("Next button clicked2");
  };

  const generateFinalMessage = () => {
    const intros = [
      "I have news for you. It's been an enlightening experience to see how external factors have shaped our journey. While adjustments were made, the unpredictability of certain elements brought unforeseen challenges.",
      "An important update is due. The path we embarked on has revealed more complexities than we initially foresaw, challenging us in ways we didn't expect.",
      "It's time for a candid reflection. This journey has been both rewarding and demanding, testing our limits and forcing us to adapt in unexpected ways.",
    ];
    const outros = [
      " Giving back the rest of the treasury would not make a difference. Thank you to everyone for your support. Despite these challenges, I'm proud of our resilience and what we've managed to achieve. 😢",
      "In the end, our efforts have brought us to a crucial point. Your support has been invaluable, and I stand by the progress we've made together. 🙏",
      "As we look forward, let's not forget the lessons learned. I appreciate every bit of support and faith you've placed in us. Together, we've weathered the storm. 💪",
    ];

    const intro = intros[Math.floor(Math.random() * intros.length)];
    const outro = outros[Math.floor(Math.random() * outros.length)];
    const selectedMessages = Array.from(selectedMessageKeys).map(
      (key) => messages[key].message
    );

    const fullMessage = [intro, ...selectedMessages, outro].join("");
    setFinalMessage(fullMessage);
    setShowFinalMessage(true);
  };

  const tweetApology = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      finalMessage
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(finalMessage)
      .then(() => {
        alert("Copied. Go and apologize to everyone now!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const goBack = () => {
    setShowInstructionText(true);
    setShowButtons(true);
    setShowControlButtons(true);
    setShowFinalMessage(false);
    setSelectedMessageKeys(new Set());
  };

  const randomize = () => {
    const keys = Object.keys(messages);
    const randomCount = Math.floor(Math.random() * 4) + 2; // Random number between 2 and 5
    const randomKeys = new Set();

    while (randomKeys.size < randomCount) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      randomKeys.add(keys[randomIndex]);
    }

    setSelectedMessageKeys(randomKeys);
  };

  useEffect(() => {
    if (selectedMessageKeys.size >= 20 && selectedMessageKeys.size <= 5) {
      generateFinalMessage();
    }
  }, [selectedMessageKeys]); // Only call generateFinalMessage if the number of selected keys is within the valid range

  return (
    <div>
      <img src="norugw.png" alt="Logo" id="siteLogo" />
      <WalletMultiButton />

      <main>
        {/* Start Button and Instruction Text */}
        {!showFinalMessage && !showInstructionText && (
          <button id="startButton" onClick={start}>
            Start
          </button>
        )}

        {showInstructionText && !showFinalMessage && (
          <p id="instructionText">
            Please select between 2 to 5 statements that best reflect your
            emotions. Click 'Next' when you're done. Remember, be convincing.
            The reasons you choose will then become a beautiful text. You're
            welcome.
          </p>
        )}

        {/* Message Selection Buttons */}
        {!showFinalMessage && showButtons && (
          <div id="buttons">
            {Object.keys(messages).map((key) => (
              <button
                key={key}
                onClick={() => selectButton(key)}
                className={selectedMessageKeys.has(key) ? "selected" : ""}
              >
                {messages[key].title}
              </button>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        {!showFinalMessage && showControlButtons && publicKey && (
          <div id="controlButtons">
            <button id="randomizeButton" onClick={randomize}>
              Randomize
            </button>
            <button id="nextButton" onClick={next}>
              Next
            </button>
          </div>
        )}

        {/* Final Message Display */}
        {showFinalMessage && (
          <div id="messageDisplay">
            <p id="finalMessage">{finalMessage}</p>
          </div>
        )}

        {/* Final Message Display */}
        {showFinalMessage && (
          <div id="finalMessage">
            <button id="tweetButton" onClick={tweetApology}>
              <img src="x.svg" alt="Twitter" /> Post Apology
            </button>

            <button id="copyButton" onClick={copyToClipboard}>
              Copy
            </button>
            <button id="backButton" onClick={goBack}>
              Back
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
