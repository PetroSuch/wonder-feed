require("dotenv").config();
const fetch = require("node-fetch");

async function generateArticle(
  title,
  keywords,
  category,
  numberTitle,
  numberImageAlt,
  numberDescription,
  toneOfVoice,
  exampleTitle,
  exampleDesc,
  exampleAlt,
  summaryTitle,
  summaryDesc,
  summaryAlt,
  rulesSeo,
  rulesSeoDesc,
  rulesSeoAlt,
) {
  const apiKey = process.env.APIKEY;

  let clue =
    "Article title consists of " +
    title +
    ". Generate a title for the following content that is between " +
    numberTitle +
    " characters long. It is very important. The summary of the title like this : " +
    summaryTitle +
    "." +
    " The summary of the description like this: " +
    summaryDesc +
    ". The summary of the alt text of the image like this: " +
    summaryAlt +
    " Incorporate the following keywords: " +
    keywords +
    ". Category is " +
    category +
    ". Describe the desired tone using adjectives (e.g., " +
    toneOfVoice +
    ")" +
    ". Example for title is '" +
    exampleTitle +
    "'. Example for description is " +
    exampleDesc +
    " Example for alt text of the image is " +
    exampleAlt +
    ". I want to get the title: description: and alt text of the image: I don't need a quote. Remove \", it is very important. " +
    "Generate a " +
    category +
    " article that includes the following text structure:" +
    "Title: [title] " +
    "Description: [description] " +
    "Alt text of the image: [alt_text] " +
    "Please provide the [title](" +
    numberTitle +
    " characters), [description](" +
    numberDescription +
    " characters), and [alt_text](" +
    numberImageAlt +
    " characters) for the given " +
    category +
    " text. " +
    "SEO Rules: " +
    rulesSeo +
    " SEO rules of description is " +
    rulesSeoDesc +
    " SEO rules of alt text of the image is " +
    rulesSeoAlt;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: clue,
          },
        ],
        max_tokens: 4000,
        n: 1,
        stop: null,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    const articleTitles = data.choices;
    // console.log("-------------", articleTitles);
    return articleTitles;
  } catch (error) {
    console.error("Error generating article:", error);
    throw error;
  }
}

module.exports = {
  generateArticle,
};
