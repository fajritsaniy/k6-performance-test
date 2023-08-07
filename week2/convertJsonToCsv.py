import json
import pandas as pd

# JSON data
json_data = '''
{
    "users": [
        { "username": "admin", "password": "password" },
        { "username": "user1", "password": "password" },
        { "username": "user2", "password": "password" },
        { "username": "user3", "password": "password" },
        { "username": "user4", "password": "password" },
        { "username": "user5", "password": "password" },
        { "username": "user6", "password": "password" },
        { "username": "user7", "password": "password" },
        { "username": "user8", "password": "password" },
        { "username": "user9", "password": "password" }
    ]
}
'''

# Parse JSON data
data = json.loads(json_data)

# Convert JSON to DataFrame
df = pd.DataFrame(data["users"])

# Save DataFrame to CSV file using Papa Parse
csv_file_path = "users.csv"
df.to_csv(csv_file_path, index=False)

print(f"CSV file '{csv_file_path}' created successfully.")
