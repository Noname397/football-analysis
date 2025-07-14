from lib.helper import beautifulSoupFromUrl
from lib.constants import fbref_domain
from bs4 import BeautifulSoup

def getPlayerURLs(season_stats_url):
    season_soup = beautifulSoupFromUrl(season_stats_url)
    # Remove HTML comments from the soup to access commented content
    html_content = str(season_soup)
    # Remove comment start and end tags
    removed_comment_characters_html_content = html_content.replace('<!--', '').replace('-->', '')

    # Create new soup from the uncommented HTML
    season_soup = BeautifulSoup(removed_comment_characters_html_content, 'html.parser')
    div_stats_standard = season_soup.find('div', id='all_stats_standard')
    print(f"Found div with id 'all_stats_standard': {div_stats_standard is not None}")

    table = div_stats_standard.find('table')
    print(table)
    tbody = table.find('tbody')
    player_links = []
    for tr in tbody.find_all('tr'):
        a_tag = tr.find('a')
        if a_tag and a_tag.has_attr('href'):
            player_links.append(fbref_domain + a_tag['href'])
    print(f"There are {len(player_links)} player links found")
    return player_links