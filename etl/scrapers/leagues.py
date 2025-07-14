from lib.helper import beautifulSoupFromUrl
from lib.constants import fbref_domain



def getTierOneCompetitionUrls(comp_url):
    all_comps_soup = beautifulSoupFromUrl(comp_url)
    all_comps_tables = all_comps_soup.find_all('table')
    for table in all_comps_tables:
        table_id = table.get('id')
        if table_id.find('1') != -1:
            tier_1_table_id = table_id
            break
    tier_1_leagues_tables = all_comps_soup.select(f"#{tier_1_table_id}")
    assert len(tier_1_leagues_tables) == 1, "Expected exactly one tier 1 leagues table"

    tier_1_leagues_table = tier_1_leagues_tables[0]
    tier_1_league_male_html = tier_1_leagues_table.find_all(class_="gender-m")
    tier_1_league_male_comp = [el.find() for el in tier_1_league_male_html]
    tier_1_league_male_a_tags = [el.find() for el in tier_1_league_male_comp]
    tier_1_league_male_a_href = [el.get('href') for el in tier_1_league_male_a_tags]
    # print(tier_1_league_male_a_href)

    tier_1_league_urls = [fbref_domain + href for href in tier_1_league_male_a_href]
    return tier_1_league_urls
