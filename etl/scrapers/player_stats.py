from lib.helper import beautifulSoupFromUrl
from lib.constants import fbref_domain

def player_last_365_url(player_url):
    player_soup = beautifulSoupFromUrl(player_url)
    player_365_days_sections = player_soup.find('div', class_='section_heading_text')
    first_ul = player_365_days_sections.find('ul')
    for li in first_ul.find_all('li'):
        a_tag = li.find('a')
        if a_tag and a_tag.has_attr('href'):
            player_last_365_days_link = fbref_domain + a_tag['href']
            return player_last_365_days_link
    

def detailed_player_stats(player_url):
    player_soup = beautifulSoupFromUrl(player_url)
    player_stats_tbodys = player_soup.find_all('tbody')

    player_detailed_stats_table = player_stats_tbodys[-1]
    print(f"Found player detailed stats table: {player_detailed_stats_table is not None}")
    rows = []
    seen = set()

    for tr in player_detailed_stats_table.find_all('tr'):   
        th = tr.find('th')
        tds = tr.find_all('td')
        if th and len(tds) >= 2:
            title = th.text.strip()
            per_90 = tds[0].text.strip()
            percentile_value = tds[1].find('div').text.strip() if tds[1].find('div') else None

            key = (title, per_90, percentile_value)
            if key not in seen:
                seen.add(key)
                rows.append({
                    "title": title,
                    "per_90": per_90,
                    "percentile": percentile_value
                })
    return rows