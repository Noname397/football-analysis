import os
from google.cloud import storage
from pathlib import Path
from dotenv import load_dotenv
from scrapers.fbref_utils import fetch_league_html, fetch_all_team_htmls

def upload_team_html(team_name, team_html):
    env_path = Path(__file__).resolve().parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
    TEAMS_BUCKET_NAME = os.environ.get("TEAMS_BUCKET_NAME")
    PROJECT_ID = os.environ.get("PROJECT_ID")
    if not TEAMS_BUCKET_NAME:
        raise ValueError("TEAMS_BUCKET_NAME environment variable not set")
    if not PROJECT_ID:
        raise ValueError("PROJECT_ID environment variable not set")
    object_path = f"bronze/fbref/teams/{team_name}.html"
    client = storage.Client(project=PROJECT_ID)
    bucket = client.bucket(TEAMS_BUCKET_NAME)
    blob = bucket.blob(object_path)
    blob.upload_from_string(data=team_html, content_type="text/html")
    print(f"Uploaded: gs://{TEAMS_BUCKET_NAME}/{object_path}")

def upload_all_team_htmls(team_htmls=None):
    env_path = Path(__file__).resolve().parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
    url = "https://fbref.com/en/comps/9/Premier-League-Stats"
    if team_htmls is None:
        league_html = fetch_league_html(url)
        team_htmls = fetch_all_team_htmls(league_html)
    for team_name, team_html in team_htmls:
        upload_team_html(team_name, team_html)
    print("All team pages uploaded.")

if __name__ == "__main__":
    html = fetch_league_html("https://fbref.com/en/comps/9/Premier-League-Stats")
    upload_all_team_htmls(html)