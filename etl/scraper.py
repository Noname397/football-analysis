from scrapers.league import upload_league_html
from scrapers.team import fetch_all_team_htmls, upload_all_team_htmls
from scrapers.fbref_utils import fetch_league_html, fetch_all_players_htmls
from lib.constants import fbref_domain

def scraper():
    # Fetch league HTML once
    league_url = "https://fbref.com/en/comps/9/Premier-League-Stats"
    league_html = fetch_league_html(league_url)
    # Upload league HTML to bucket
    # upload_league_html(league_html)

    # fetch all team HTMLs
    all_team_htmls = fetch_all_team_htmls(league_html)
    # upload all team HTMLs to bucket
    # upload_all_team_htmls(all_team_htmls)

    # Fetch and print player HTMLs for each team
    for team_name, team_html in all_team_htmls:
        print(f"Processing team: {team_name}")
        try:
            player_htmls = fetch_all_players_htmls(team_html)
            print(f"Fetched {len(player_htmls)} players")
        except Exception as e:
            print(f"Error fetching players: {e}")

    # # ...existing logic for player stats scraping...
    # example_league_url = league_url
    # most_recent_season = getSeasonsURL(league_url=example_league_url, num_seasons=1)
    # player_stats_link = getLeagueStats(season_url=most_recent_season)
    # player_urls = getPlayerURLs(season_stats_url=player_stats_link)
    # for player_url in player_urls[:5]:
    #     print(f"Player URL: {player_url}")
    #     player_last_365days_link = player_last_365_url(player_url)
    #     # print(f"Player last 365 days stats link: {player_last_365days_link}")
    #     detailed_stats = detailed_player_stats(player_url)
    #     print(f"Detailed stats for {player_url}: {detailed_stats}")

scraper()