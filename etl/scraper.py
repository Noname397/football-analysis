from scrapers.player_urls import getPlayerURLs
from scrapers.league_stats import getLeagueStats
from scrapers.leagues import getTierOneCompetitionUrls
from scrapers.seasons import getSeasonsURL
from scrapers.player_stats import player_last_365_url
from scrapers.player_stats import detailed_player_stats
from lib.constants import fbref_domain

def scraper():
    example_league_url = "https://fbref.com/en/comps/9/Premier-League-Stats"
    most_recent_season = getSeasonsURL(league_url=example_league_url, num_seasons=1)
    player_stats_link = getLeagueStats(season_url=most_recent_season)
    player_urls = getPlayerURLs(season_stats_url=player_stats_link)
    for player_url in player_urls[:5]:
        print(f"Player URL: {player_url}")
        player_last_365days_link = player_last_365_url(player_url)
        # print(f"Player last 365 days stats link: {player_last_365days_link}")
        detailed_stats = detailed_player_stats(player_url)
        print(f"Detailed stats for {player_url}: {detailed_stats}")

scraper()