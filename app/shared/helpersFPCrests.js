import { flow, set, reduce, values, sortBy, reverse } from 'lodash/fp';

export const calculateStandings = (matches) => {
  const initialStandings = reduce(
    (result, match) => {
      return flow(
        set([match.homeTeam], {
          team: match.homeTeam,
          crest: '', // Set initial value for crest
          gp: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          pointsArray: [],
          form: [],
        }),
        set([match.awayTeam], {
          team: match.awayTeam,
          crest: '', // Set initial value for crest
          gp: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          pointsArray: [],
          form: [],
        })
      )(result);
    },
    {},
    matches
  );

  const updatedStandings = reduce(
    (result, match) => {
      if (match.outcome === 'HOME_TEAM') {
        result[match.homeTeam].crest = match.crestHome; // Set crest value
        result[match.homeTeam].points += 3;
        result[match.homeTeam].pointsArray.push(result[match.homeTeam].points);
        result[match.homeTeam].wins += 1;
        result[match.homeTeam].form.push('w');
        result[match.awayTeam].crest = match.crestAway; // Set crest value
        result[match.awayTeam].points += 0;
        result[match.awayTeam].pointsArray.push(result[match.awayTeam].points);
        result[match.awayTeam].losses += 1;
        result[match.awayTeam].form.push('l');
      } else if (match.outcome === 'DRAW') {
        result[match.homeTeam].crest = match.crestHome; // Set crest value
        result[match.homeTeam].points += 1;
        result[match.homeTeam].pointsArray.push(result[match.homeTeam].points);
        result[match.homeTeam].draws += 1;
        result[match.homeTeam].form.push('d');
        result[match.awayTeam].crest = match.crestAway; // Set crest value
        result[match.awayTeam].points += 1;
        result[match.awayTeam].pointsArray.push(result[match.awayTeam].points);
        result[match.awayTeam].draws += 1;
        result[match.awayTeam].form.push('d');
      } else if (match.outcome === 'AWAY_TEAM') {
        result[match.homeTeam].crest = match.crestHome; // Set crest value
        result[match.homeTeam].points += 0;
        result[match.homeTeam].pointsArray.push(result[match.homeTeam].points);
        result[match.homeTeam].losses += 1;
        result[match.homeTeam].form.push('l');
        result[match.awayTeam].crest = match.crestAway; // Set crest value
        result[match.awayTeam].points += 3;
        result[match.awayTeam].pointsArray.push(result[match.awayTeam].points);
        result[match.awayTeam].wins += 1;
        result[match.awayTeam].form.push('w');
      }
      result[match.homeTeam].goalsFor += match.homeScore;
      result[match.homeTeam].goalsAgainst += match.awayScore;
      result[match.homeTeam].gp += 1;
      result[match.awayTeam].goalsFor += match.awayScore;
      result[match.awayTeam].goalsAgainst += match.homeScore;
      result[match.awayTeam].gp += 1;
      return result;
    },
    initialStandings,
    matches
  );

  const sortedStandings = flow(
    values,
    sortBy('points'),
    reverse
  )(updatedStandings);

  return sortedStandings;
};
