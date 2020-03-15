import download_history
import start_server
import _thread

def main():
	download_history.downloadHistory()

	#start_new_thread(start_server.startServer(),())
	#start_server.openBrowser()

main()