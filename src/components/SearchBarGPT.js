import openai from "../utils/openai";
import React from "react";
import lang from "../utils/langConstants";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { options } from "../utils/constants";
const SearchBarGPT = () => {
  const searchText = useRef(null);
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=true&language=en-US&page=1`,
      options
    );
    const json = await data.json();
    return json.results;
  };
  const handleGPTSearchClick = async () => {
    console.log(searchText.current.value);
    const gptQuery =
      "act as a movie reccomendation system and suggest some movies for the query : " +
      searchText.current.value +
      ". only give me five movies, comma separated like the example given ahead. Example : Gadar , Border , Sholay , Don, Andaz Apna Apna";
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion?.choices?.[0]?.message?.content);
    const gptMovies = completion?.choices?.[0]?.message?.content.split(", ");
    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
    const TMDBResults = await Promise.all(promiseArray);
    console.log(TMDBResults);
  };
  const langKey = useSelector((store) => store.config.lang);
  return (
    <div className="m-4 flex flex-col justify-center">
      <div className="relative  p-12 w-full sm:max-w-2xl sm:mx-auto">
        <div className="overflow-hidden z-0 rounded-full relative p-3">
          <form
            role="form"
            className="relative flex z-50 border-4 bg-white border-black rounded-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              ref={searchText}
              type="text"
              placeholder={lang[langKey].gptSearchPlaceholder}
              className="rounded-full flex-1 px-6 py-4 text-gray-700 focus:outline-none"
            />
            <button
              className="bg-red-700 text-white rounded-full font-semibold px-8 py-4 hover:bg-red-600 focus:bg-red-800 focus:outline-none"
              onClick={handleGPTSearchClick}
            >
              {lang[langKey].search}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SearchBarGPT;
