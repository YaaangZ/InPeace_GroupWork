import json
from tqdm import tqdm



with open('streets_csv\\NYC Street Centerline (CSCL).geojson', 'r') as f:
    data = json.load(f)

    # Get the total number of features
    total_features = 1  # Set to 1 to insert only the first feature

    # Iterate over features with tqdm progress bar
    for feature in tqdm(data['features'][:total_features], total=total_features):

        print(feature)