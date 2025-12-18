import requests
import os
from datetime import datetime, date, timedelta
from google.cloud import storage
from pathlib import Path
from dotenv import load_dotenv

def main():
    # Load .env from the same directory as this script (so local .env is respected)
    env_path = Path(__file__).resolve().parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)

    FOOTBALL_API_KEY = os.environ.get("FOOTBALL_API_KEY")
    PROJECT_ID = os.environ.get("PROJECT_ID")
    BUCKET_NAME = os.environ.get("BUCKET_NAME")
    if not FOOTBALL_API_KEY:
        raise ValueError("FOOTBALL_API_KEY environment variable not set")
    if not PROJECT_ID:
        raise ValueError("PROJECT_ID environment variable not set")
    if not BUCKET_NAME:
        raise ValueError("BUCKET_NAME environment variable not set")

    run_date = datetime.now().strftime("%Y-%m-%d")
    date_from = (date.today()).isoformat()
    date_to = (date.today() + timedelta(days=7)).isoformat()

    url = "http://api.football-data.org/v4/competitions/2021/matches"

    headers = {
        "X-Auth-Token": FOOTBALL_API_KEY
    }

    params = {
        "dateFrom": date_from,
        "dateTo": date_to
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    data = response.json()

    object_path = (
        f"bronze/football_api/fixtures/"
        f"dt={run_date}/"
        f"epl_fixtures_from_{date_from}_to_{date_to}.json"
    )

    client = storage.Client(project=PROJECT_ID)
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(object_path)

    # upload json data as json
    blob.upload_from_string(data=str(data), content_type="application/json")

    print(f"Uploaded: gs://{BUCKET_NAME}/{object_path}")

if __name__ == "__main__":
    main()
