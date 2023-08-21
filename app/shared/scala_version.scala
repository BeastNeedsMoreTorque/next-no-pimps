import scala.collection.immutable

case class TeamData(
  team: String,
  crest: String = "",
  gp: Int = 0,
  wins: Int = 0,
  draws: Int = 0,
  losses: Int = 0,
  goalsFor: Int = 0,
  goalsAgainst: Int = 0,
  points: Int = 0,
  pointsArray: List[Int] = List(),
  form: List[String] = List()
)

case class Match(
  id: String,
  stage: String,
  crestHome: String,
  crestAway: String,
  awayTeam: String,
  homeTeam: String,
  status: String,
  outcome: String,
  awayGoals: Int,
  homeGoals: Int
)


def calculateStandings(matches: List[Match]): List[TeamData] = {
  val initialStandings: Map[String, TeamData] = matches.flatMap { m =>
    List(
      m.homeTeam -> TeamData(m.homeTeam),
      m.awayTeam -> TeamData(m.awayTeam)
    )
  }.toMap

  def updateTeamData(m: Match, team: TeamData, points: Int, outcome: String, form: String): TeamData = {
    val updatedCrest = if (outcome == "HOME_TEAM") m.crestHome else m.crestAway
    team.copy(
      crest = updatedCrest,
      points = team.points + points,
      pointsArray = team.points +: team.pointsArray,
      form = form +: team.form
    )
  }

  val updatedStandings: Map[String, TeamData] = matches.foldLeft(initialStandings) { (standings, m) =>
    val homeTeam = standings(m.homeTeam)
    val awayTeam = standings(m.awayTeam)

    m.outcome match {
      case "HOME_TEAM" =>
        val updatedHomeTeam = updateTeamData(m, homeTeam, 3, "HOME_TEAM", "w")
        val updatedAwayTeam = updateTeamData(m, awayTeam, 0, "AWAY_TEAM", "l")
        standings + (m.homeTeam -> updatedHomeTeam, m.awayTeam -> updatedAwayTeam)
      case "DRAW" =>
        val updatedHomeTeam = updateTeamData(m, homeTeam, 1, "DRAW", "d")
        val updatedAwayTeam = updateTeamData(m, awayTeam, 1, "DRAW", "d")
        standings + (m.homeTeam -> updatedHomeTeam, m.awayTeam -> updatedAwayTeam)
      case "AWAY_TEAM" =>
        val updatedHomeTeam = updateTeamData(m, homeTeam, 0, "HOME_TEAM", "l")
        val updatedAwayTeam = updateTeamData(m, awayTeam, 3, "AWAY_TEAM", "w")
        standings + (m.homeTeam -> updatedHomeTeam, m.awayTeam -> updatedAwayTeam)
    }
  }

  updatedStandings.values.toList.sortBy(_.points).reverse
}
