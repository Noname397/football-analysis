
from lib.constants import fbref_domain
from lib.helper import beautifulSoupFromUrl

def getSeasonsURL(league_url, num_seasons):
    print(f"Processing league URL: {league_url}")
    league_soup = beautifulSoupFromUrl(league_url)
    first_comp_tables = league_soup.find_all("table") # finding table-elements
    print(f"Found {len(first_comp_tables)} tables on the page")
    
    # print all ids for each table
    for i, table in enumerate(first_comp_tables):
        table_id = table.get("id")
        print(f"Table {i+1} ID: {table_id}")
    
    # Comment out the assertion for now to see what tables exist
    assert len(first_comp_tables) == 1, f"Expected 1 table, found {len(first_comp_tables)}"

    first_comp_table = first_comp_tables[0]
    first_comp_seasons = first_comp_table.find_all('tbody') # Corrected to pass 'tbody' as a string
    assert len(first_comp_seasons) > 0, "No tbody found in the table"

    recent_seasons_hrefs = [el.find('a').get('href') for el in first_comp_seasons[0].find_all('tr') if el.find('a')]
    recent_seasons_urls = [fbref_domain + href for href in recent_seasons_hrefs]
    print(recent_seasons_urls[:num_seasons])
    return recent_seasons_urls[:num_seasons]
