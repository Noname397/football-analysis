import cloudscraper
import time
import re
from bs4 import BeautifulSoup

def fetch_league_html(url):
    scraper = cloudscraper.create_scraper(
        browser={"browser": "chrome", "platform": "windows", "desktop": True}
    )
    resp = scraper.get(url, timeout=30)
    resp.raise_for_status()
    return resp.text

def fetch_all_team_htmls(league_html):
    """
    Given the league HTML, fetch all team detail HTMLs.
    Returns a list of (team_name, team_html) tuples.
    """
    soup = BeautifulSoup(league_html, "html.parser")
    table = soup.find("table", id=lambda x: x and x.startswith("results") and x.endswith("overall"))
    if not table:
        raise Exception("Could not find the teams table.")

    team_links = set()
    for a in table.find_all("a", href=True):
        href = a["href"]
        if "/squads/" in href:
            team_links.add(href)

    print(f"Found {len(team_links)} team links.")

    team_htmls = []
    # Create a single cloudscraper session
    scraper = cloudscraper.create_scraper(
        browser={"browser": "chrome", "platform": "windows", "desktop": True}
    )
    for href in team_links:
        team_url = "https://fbref.com" + href
        print(f"Fetching {team_url}")
        team_resp = scraper.get(team_url, timeout=30)
        team_resp.raise_for_status()
        team_html = team_resp.text
        team_name = href.strip("/").split("/")[-1].replace("-Stats", "")
        team_htmls.append((team_name, team_html))
        time.sleep(5)
    return team_htmls

def fetch_all_players_htmls(team_html):
    """
    Given the team HTML, fetch all player detail HTMLs.
    Returns a list of (player_name, player_html) tuples.
    """
    soup = BeautifulSoup(team_html, "html.parser")
    table = soup.find("table", id=lambda x: x and x.startswith("stats_standard"))
    if not table:
        raise Exception("Could not find the players table.")

    player_links = set()
    player_link_pattern = re.compile(r"^/en/players/([a-zA-Z0-9]+)/[\w\-]+$")
    for a in table.find_all("a", href=True):
        href = a["href"]
        if player_link_pattern.match(href):
            player_links.add(href)

    print(f"Found {len(player_links)} player links.")

    player_htmls = []
    # Create a single cloudscraper session
    scraper = cloudscraper.create_scraper(
        browser={"browser": "chrome", "platform": "windows", "desktop": True}
    )
    for href in player_links:
        player_url = "https://fbref.com" + href
        print(f"Fetching {player_url}")
        player_resp = scraper.get(player_url, timeout=30)
        player_resp.raise_for_status()
        player_html = player_resp.text
        player_name = href.strip("/").split("/")[-1].replace("-Stats", "")
        player_htmls.append((player_name, player_html))
        time.sleep(5)
    return player_htmls