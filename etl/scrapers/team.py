import cloudscraper
import time
import os
from bs4 import BeautifulSoup
from google.cloud import storage
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the same directory as this script
env_path = Path(__file__).resolve().parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

TEAMS_BUCKET_NAME = os.environ.get("TEAMS_BUCKET_NAME")
PROJECT_ID = os.environ.get("PROJECT_ID")
if not TEAMS_BUCKET_NAME:
    raise ValueError("TEAMS_BUCKET_NAME environment variable not set")
if not PROJECT_ID:
    raise ValueError("PROJECT_ID environment variable not set")

url = "https://fbref.com/en/comps/9/Premier-League-Stats"
scraper = cloudscraper.create_scraper(
    browser={"browser": "chrome", "platform": "windows", "desktop": True}
)
resp = scraper.get(url, timeout=30)
resp.raise_for_status()
html = resp.text

soup = BeautifulSoup(html, "html.parser")
# Find the correct table (adjust id logic if needed)
table = soup.find("table", id=lambda x: x and x.startswith("results") and x.endswith("overall"))
if not table:
    raise Exception("Could not find the teams table.")

# Find all unique team links in the table
team_links = set()
for a in table.find_all("a", href=True):
    href = a["href"]
    if "/squads/" in href:
        team_links.add(href)

print(f"Found {len(team_links)} team links.")

# Set up GCS client
client = storage.Client(project=PROJECT_ID)
bucket = client.bucket(TEAMS_BUCKET_NAME)

for href in team_links:
    team_url = "https://fbref.com" + href
    print(f"Fetching {team_url}")
    team_resp = scraper.get(team_url, timeout=30)
    team_resp.raise_for_status()
    team_html = team_resp.text

    # Use team name from URL for the object path (e.g., Arsenal, Manchester-United)
    team_name = href.strip("/").split("/")[-1].replace("-Stats", "")
    object_path = f"bronze/fbref/teams/{team_name}.html"

    blob = bucket.blob(object_path)
    blob.upload_from_string(data=team_html, content_type="text/html")
    print(f"Uploaded: gs://{TEAMS_BUCKET_NAME}/{object_path}")

    time.sleep(5)  # Be polite and avoid overwhelming the server    

print("All team pages uploaded.")