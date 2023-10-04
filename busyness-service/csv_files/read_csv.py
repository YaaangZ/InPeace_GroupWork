
def read_csv():
    range_data = pd.read_csv('csv_files/custom_ranges_whole.csv')
    busyness_ranges = [(row[0], row[1], row[2]) for _, row in range_data.iterrows()]
    return busyness_ranges

read_csv()