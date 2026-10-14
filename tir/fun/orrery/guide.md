---
layout: article.liquid
title: Live wallpaper guide
desc: Make this your live wallpaper on your phone!
parent: Orrery
---

I figured out how to make the [digital orrery](/fun/orrery/) the lockscreen wallpaper on my phone! So I'm here to teach you how too!

## Disclaimers

- This only works on Android and is only tested on Vivo OriginOS 6. It has worked well in the 10 minutes since I've set it up.
	- I tested it on OriginOS 5 too yesterday, but without the CSS/JS and image embeds so I cannot verify whether the JS works. On version 5, you cannot set it to lockscreen-only, but you can on version 6.
- The app I used, [Loomview](https://github.com/arclant/Loomview), is a 3rd party open-source app. So it's up to you to trust it or not! At least it didn't blow up *my* phone.
	- The app renders webpages with Chromium, so watch out for resource usage.
- Internet connection is not required. Any connection to Github or Neocities should not be there because I embedded all the assets into a single file.

## Instructions

- Download this <a href="/fun/orrery/wall/index.html" download="islandwallpaper.html">HTML file</a>.
- Download and install [Loomview](https://github.com/arclant/Loomview/releases/tag/v0.1.0) (click "Loomview_app-release_v0.1.0.apk").
- Open Loomview, and in the app add the HTML file you downloaded to it.
- In the preview, click the three dots on the top right and click "set as wallpaper."
	- You will receive a dialog that tells you the interactive elements might conflict with touch events on your homepage. This is fine because the orrery does not accept any touch events.
- You'll be taken to your phone's native dialog where it prompts you to set the wallpaper to either homepage, lockscreen, or both. The lockscreen-only option might not be there depending on your Android's OS.
- Hope that works! Feel free to [ask me questions](https://tofutush.leprd.space/guestbook/) if you have trouble, and make sure to include your OS and version, but I cannot guarantee I can solve it!
