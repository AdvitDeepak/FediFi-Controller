import sqlite3

# Connect to the SQLite database (create a new one if it doesn't exist)
conn = sqlite3.connect('db.sqlite')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create a table
cursor.execute('''
    SELECT ID_advertisement FROM Relations WHERE ID_creator = 'satva'
''')
res = cursor.fetchall()

for row in res:
    print(row)

# Close the cursor and connection
cursor.close()
conn.close()
