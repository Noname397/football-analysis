from lib.helper import beautifulSoupFromUrl
from lib.constants import fbref_domain
def getLeagueStats(season_url):
    season_soup = beautifulSoupFromUrl(season_url)
    bottom_nav_div = season_soup.find('div', id='bottom_nav_container')

    # then find the ul tag here
    ul_tag = bottom_nav_div.find('ul')

    # return the first li
    first_li = ul_tag.find('li')

    first_li_a_tag = first_li.find('a')

    player_recent_season_stats_link = fbref_domain + first_li_a_tag.get('href')
    return player_recent_season_stats_link