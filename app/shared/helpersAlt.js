import { flow, set, reduce, values, sortBy, reverse } from 'lodash/fp';

//this code doesnt quite work.
export const calculateStandings = (matches) => {
  const initialStandings = reduce(
    (result, match) => {
      const teamData = {
        team: match.homeTeam,
        crest: '',
        gp: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        pointsArray: [],
        form: [],
      };
      return flow(
        set([match.homeTeam], teamData),
        set([match.awayTeam], { ...teamData, team: match.awayTeam })
      )(result);
    },
    {},
    matches
  );

  const updatedStandings = reduce(
    (result, match) => {
      const homeTeam = result[match.homeTeam];
      const awayTeam = result[match.awayTeam];

      const updateTeamData = (team, points, outcome, form) => {
        team.crest = match[`crest${outcome === 'HOME_TEAM' ? 'Home' : 'Away'}`];
        team.points += points;
        team.pointsArray.push(team.points);
        team.form.push(form);
      };

      if (match.outcome === 'HOME_TEAM') {
        updateTeamData(homeTeam, 3, 'Home', 'w');
        updateTeamData(awayTeam, 0, 'Away', 'l');
      } else if (match.outcome === 'DRAW') {
        updateTeamData(homeTeam, 1, 'Home', 'd');
        updateTeamData(awayTeam, 1, 'Away', 'd');
      } else if (match.outcome === 'AWAY_TEAM') {
        updateTeamData(homeTeam, 0, 'Home', 'l');
        updateTeamData(awayTeam, 3, 'Away', 'w');
      }

      homeTeam.goalsFor += match.homeScore;
      homeTeam.goalsAgainst += match.awayScore;
      homeTeam.gp += 1;
      awayTeam.goalsFor += match.awayScore;
      awayTeam.goalsAgainst += match.homeScore;
      awayTeam.gp += 1;

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