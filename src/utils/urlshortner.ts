import shortid from "shortid";
export const shortenUrl = (url: string) => {
  const base = `http://localhost:4000`;
  const urlId = shortid.generate();
  const shortUrl = `${base}/${urlId}`;

  return [shortUrl, urlId];
};
