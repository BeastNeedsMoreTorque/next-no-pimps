/* eslint-disable react/jsx-key */
const _ = require('lodash/fp');
import { revalidatePath } from 'next/cache';

import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

import pimps from './shared/pimps_long.json';
import { calculateStandings } from './shared/helpersFP';
import { data } from 'autoprefixer'


const apiKey = process.env.REACT_APP_FOOTBAL_API_KEY;

const options = {
  method: 'GET',
  headers: {
    'X-Auth-Token': apiKey,
  },
};
const BASE_URL = 'https://api.football-data.org/v4/';

async function fetchData() {
  "use server";
  // Fetch matches from the API
  const res = await fetch(`${BASE_URL}competitions/2021/matches`, options);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
  //to refresh page automatically
  revalidatePath("/");
}

export default async function Home() {
  const data = await fetchData();
  const results = data.matches.filter(
    (p) => !pimps.includes(p.homeTeam.name) && !pimps.includes(p.awayTeam.name)
  );

  function gameStatus(x) {
    return x === 'FINISHED';
  }

  //format results data for processing/calculating
  const finishedGames = results
    .filter((r) => gameStatus(r.status))
    .map((m) =>
      //let dataDayCommon = m.utcDate.split('T');
      //let dataDay = dataDayCommon[0].split('-').reverse().join('-');
      //let time = dataDayCommon[1].slice(0, -4);
      ({
        d: m.id,
        name: m.stage,
        awayTeam: m.awayTeam.name,
        homeTeam: m.homeTeam.name,
        status: m.status,
        outcome: m.score.winner,
        //dataDay: dataDay,
        //time: time,
        // awayScore: m.score.fullTime.awayTeam,
        awayScore: m.score.fullTime.away,
        // awayScore: m.score.fullTime.homeTeam,
        homeScore: m.score.fullTime.home,
      })
    );

  // console.log('finishedGames: ', finishedGames);
      const tableStandings = calculateStandings(finishedGames);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
        {/* <h5 className='"text-2xl w-full" px-2 pt-8 pb-8 text-center font-extrabold md:text-4xl lg:text-5xl'>
          EPL - English Pimp-Less League
        </h5> */}
        <table className='w-full text-base'>
          <thead className='border-b'>
            <tr className='text-left'>
              <th>Position</th>
              <th className='team-header'>Team</th>
              <th className='p-1 pb-2 text-center'>GP</th>
              <th className='p-1 pb-2 text-center'>W</th>
              <th className='p-1 pb-2 text-center'>D</th>
              <th className='p-1 pb-2 text-center'>L</th>
              <th className='p-1 pb-2 text-center'>F</th>
              <th className='p-1 pb-2 text-center'>A</th>
              <th className='p-1 pb-2 text-center'>GD</th>
              <th className='p-1 pb-2 text-center'>Pts</th>
              <th className='hidden p-1 pb-2 text-center md:table-cell'>
                FORM
              </th>
            </tr>
          </thead>
          <tbody>
            {tableStandings.map((match, index) => (
              <tr
                className='border-b bg-blue text-left transition duration-300 ease-in-out hover:bg-gray-500'
                key={index}>
                <td className='border-b bg-blue p-1 text-left'>
                  {index + 1}
                </td>
                {index + 1 === 1 ? (
                  <td className='border-b bg-blue p-1 text-left font-bold text-green-400'>
                    {match.team}
                  </td>
                ) : index + 1 === 12 || index + 1 === 13 || index + 1 === 14 ? (
                  <td className='border-b bg-blue p-1 text-left font-semibold text-red-500'>
                    {match.team}
                  </td>
                ) : match.team === 'West Ham United FC' ? (
                  <td className='border-b bg-blue p-1 text-left text-xl font-extrabold text-burgundy'>
                    {match.team}
                  </td>
                ) : (
                  <td className='border-b bg-blue p-1 text-left'>
                    {match.team}
                  </td>
                )}
                <td className='p-1 text-center'>{match.gp}</td>
                <td className='p-1 text-center'>{match.wins}</td>
                <td className='p-1 text-center'>{match.draws}</td>
                <td className='p-1 text-center'>{match.losses}</td>
                <td className='p-1 text-center'>{match.goalsFor}</td>
                <td className='p-1 text-center'>{match.goalsAgainst}</td>
                <td className='p-1 text-center'>
                  {match.goalsFor - match.goalsAgainst}
                </td>
                <td className='p-1 text-center'>{match.points}</td>
                <td className='hidden p-1 text-center md:table-cell'>
                  <div className='flex w-full items-center justify-center'>
                    {_.takeRight(match.form, 5).map((f) =>
                      f === 'w' ? (
                        <div className='mx-0.5 mb-2 h-3 w-1 rounded bg-green-500'></div>
                      ) : f === 'l' ? (
                        <div className='mx-0.5 mt-2 h-3 w-1 rounded bg-red-500'></div>
                      ) : (
                        <div className='mx-0.5 mb-1 h-1 w-1 rounded bg-gray-500'></div>
                      )
                    )}
                  </div>
                  {/* <td className='p-1 text-center'>
                  {_.takeRight(match.form, 5)}
                </td> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-blue before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
          src='/next.svg'
          alt='Next.js Logo'
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}
