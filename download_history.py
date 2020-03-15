import datetime
import pandas as pd
import sqlite3
import os
import getpass

pd.options.mode.chained_assignment = None

def getChromeHistoryPath():

	try:
		path = '/Users/' + getpass.getuser() + '/Library/Application Support/Google/Chrome/Default/History'
		if not os.path.isfile(path):
			raise Exception('invalid path')
	except:
		# Get user's path to Chrome History folder
		path = input('Provide path to Chrome History folder.\ne.g., /Users/maxalfaro/Library/Application Support/Google/Chrome/Default/History\nPath: ')

	return(path)

def getHistory(path):

	# Create a connection that represents the database
	conn = sqlite3.connect(path)

	# Select all URLs with '- Wikipedia' in the title
	query = "SELECT title, last_visit_time AS date, url \
	    FROM urls \
	    WHERE title LIKE '%- Wikipedia%'"

	# Pipe query results into dataframe
	wiki_history = pd.read_sql_query(query, conn)

	return(wiki_history)


def clean(wiki_history):

	# Remove entries with missing dates
	wiki_history = wiki_history[wiki_history['date'] != 0]

	# Convert 'last_visit_time' from miliseconds-since-1601 to datetime
	wiki_history['date'] = wiki_history['date'].apply(lambda microsecs : (datetime.datetime(1601, 1, 1) + datetime.timedelta(microseconds=microsecs)).replace(microsecond=0))

	# Remove the '- Wikipedia' part from the titles
	wiki_history['title'] = wiki_history['title'].apply(lambda x : x.replace(' - Wikipedia', ''))

	# Sort by date 
	wiki_history.sort_values('date', inplace=True)

	# Add running sum of total visits
	wiki_history['totalVisits'] = list(range(1, len(wiki_history)+1))

	return(wiki_history)

def writeOut(df, path='wiki_history.csv'):
	# Write to csv
	df.to_csv(path)


def downloadHistory():
	path = getChromeHistoryPath()
	df = clean(getHistory(path))
	writeOut(df)
