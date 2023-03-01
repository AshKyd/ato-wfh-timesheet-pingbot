Apparently the ATO requires an hourly timesheet to prove you were working from home at any given time.

Anyway I thought I'd automate it: ping my work laptop from my home server and if it's online then I'm working from home. Easy!

# Caveats

- Macbooks respond to pings [even when they're asleep](http://cweiske.de/tagebuch/osx-sleep-ping.htm). Disable this in System Preferences > Energy Saver > Power Adapter > Wake for Wi-Fi network access. This will shut down the network interface ~1 minute after the Mac sleeps.
- I'm running this on my Docker host because it's simple enough, however I can't resolve local names from inside
