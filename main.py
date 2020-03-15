import download_history
import subprocess

def main():
	# Download Chrome history
	download_history.downloadHistory()

	# Predict into future
	bashCommand = "Rscript wiki_ts.R"
	process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
	output, error = process.communicate()


	#start_new_thread(start_server.startServer(),())
	#start_server.openBrowser()

main()