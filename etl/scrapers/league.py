import cloudscraper
import os
from google.cloud import storage
from pathlib import Path
from dotenv import load_dotenv
from scrapers.fbref_utils import fetch_league_html

def upload_league_html(html=None):
    env_path = Path(__file__).resolve().parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)

    STANDINGS_BUCKET_NAME = os.environ.get("STANDINGS_BUCKET_NAME")
    PROJECT_ID = os.environ.get("PROJECT_ID")
    if not STANDINGS_BUCKET_NAME:
        raise ValueError("STANDINGS_BUCKET_NAME environment variable not set")
    if not PROJECT_ID:
        raise ValueError("PROJECT_ID environment variable not set")

    url = "https://fbref.com/en/comps/9/Premier-League-Stats"
    if html is None:
        html = fetch_league_html(url)

    object_path = "bronze/fbref/premier_league_stats.html"
    client = storage.Client(project=PROJECT_ID)
    bucket = client.bucket(STANDINGS_BUCKET_NAME)
    blob = bucket.blob(object_path)
    blob.upload_from_string(data=html, content_type="text/html")
    print(f"Uploaded: gs://{STANDINGS_BUCKET_NAME}/{object_path}")

if __name__ == "__main__":
    html = fetch_league_html("https://fbref.com/en/comps/9/Premier-League-Stats")
    upload_league_html(html)