// "use client";

// import Head from "next/head";
// import dynamic from "next/dynamic";
// import { flipTileData } from "@/src/data/games/flip-tile-data";
// import GameComponent from "@/src/games/game-template/GameComponent";

// const gameData = flipTileData;

// const GameTemplate = () => {
//   return (
//     <>
//       <Head>
//         <title>{gameData.title}</title>
//         <meta name="description" content={gameData.description} />
//         <meta property="og:title" content={gameData.title} />
//         <meta property="og:description" content={gameData.description} />
//         <meta property="og:image" content={gameData.imageUrl} />
//         <meta property="og:image:alt" content={gameData.imageAlt} />
//       </Head>
//       <GameComponent />
//     </>
//   );
// };

// export default dynamic(() => Promise.resolve(GameTemplate), { ssr: false });
