suppressMessages(library(lubridate))
library(forecast)

views <- read.csv('views_per_day.csv')

start_day <- decimal_date(as.Date(views['date'][[1]][1]))

# Create time series object
views_ts <- ts(views['total'], start=start_day, freq=365)

# Use auto.arima to choose ARIMA terms
fit <- auto.arima(views_ts, seasonal=FALSE)

# Forecast for next 15 days
fore <- forecast(fit, h = 15)

# Write to csv 
write.csv(fore, 'forecast.csv')
