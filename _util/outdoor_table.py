import csv
import requests

url = "https://api.yelp.com/v3/businesses/search?location=manhattan&attributes=outdoor_seating"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer 0qoy3mq05cupHngWmZUNXCuOPchh7wq8UshKeU0hEzaCi3gKy8T1XK5pFZ9FqKeuJRIyf8jhB-UgG07Y82pKNiMmGJRRDjgMhuMST2VLk8BnSJrnZK3MpGINPquuZHYx"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    businesses = data.get("businesses", [])

    csv_file = "outdoor_businesses.csv"

    fieldnames = ["business_id", "name"]
    rows = []
    for business in businesses:
        business_id = business.get("id", "")
        name = business.get("name", "")

        row = {
            "business_id": business_id,
            "name": name
        }
        rows.append(row)
    with open(csv_file, mode="w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Results saved to '{csv_file}' file.")
else:
    print(f"Request failed with status code: {response.status_code}")