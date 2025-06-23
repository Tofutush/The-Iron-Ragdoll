---
layout: layout.liquid
title: Root
templateEngineOverride: liquid,md
eleventyNavigation:
  key: Root
---
<link rel="stylesheet" href="/css/home.css"/>
<h1 style="text-align: center;">Welcome to the world of The Iron Ragdoll!</h1>
{% image 'gallery/' 'cms friends lineless.png' 1000 'Coastline Middle School friends' 'max' %}

Hi, I'm Tofutush! Thanks for visiting this little webbed site. I hope you have fun!

The Iron Ragdoll is my paracosm that I adore and want to share with you. It's about a bunch of colorful people with animal ears and horns. They play around, solve mysteries, and spy on each other, living in a borderline-dystopian world with spies, agents, betrayal, and friendship both genuine and fake.

{% assign bdayStars = characters | getBDayStars %}
{% if bdayStars.size > 0 %}
  {% assign dateMonth = 0 | getMMDD %}
  <blockquote><p>Today, {{ dateMonth}}, is {% for ch in bdayStars %}<a href="/characters/{{ ch.name | lowerCase }}/">{{ ch.name }}</a>{% if forloop.index != bdayStars.size %}, {% endif %}{% endfor %}'s birthday!</p></blockquote>
{% endif %}

<div class="grid">
  <a class="big" href="/characters/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'sparky pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'contact-round' 32 %} Characters</p></div>
  </a>
  <a href="/characters/list/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'cosmo pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'table-2' 32 %} Characters list</p></div>
  </a>
  <a href="/characters/relationships/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'tephra pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'git-fork' 32 %} Relationships</p></div>
  </a>
  <a href="/gallery/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'goose pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'images' 32 %} Gallery</p></div>
  </a>
  <a href="/stories/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'pumpkin pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'book-marked' 32 %} Stories</p></div>
  </a>
  <a class="big" href="/world/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'buttercup pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'earth' 32 %} World</p></div>
  </a>
  <a href="/world/overview/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'melody pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'square-chart-gantt' 32 %} Overview</p></div>
  </a>
  <a href="/world/history/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'alaska pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'scroll-text' 32 %} History</p></div>
  </a>
  <a href="/about/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'qibli pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'info' 32 %} About</p></div>
  </a>
  <a href="/fun/">
	<div class="card" style="background-image: url('{% capture url %}{% imageUrl 'gallery/' 'guillotine pop.png' 1000 %}{% endcapture %}{{ url | htmlBaseUrl }}');"><p>{% lucide 'ferris-wheel' 32 %} Fun</p></div>
  </a>
</div>

## Meta

- [{% lucide 'goal' %} Goals](/goals/)
- [{% lucide 'circle-ellipsis' %} Misc](/misc/)
	- [{% lucide 'torus' %} Buttons and webrings](/misc/links/)
	- [{% lucide 'thumbs-up' %} Credits](/misc/credits/)
- [{% lucide 'clock-8' %} Changelog](/changelog/)
- [{% lucide 'code-xml' %} Sitemap](/sitemap/)
- [{% lucide 'notebook-tabs' %} Contact](/contact/): Found a spelling / grammar mistake? Want me to add your button? Ask questions? Put anything here!

## Outgoing

- [{% lucide 'messages-square' %} Discord server](https://discord.gg/XzdA5vKkb2), join the discord!
- [{% lucide 'school' %}Havoc 101](https://tofutush.github.io/havoc101), another cannot-complete-in-my-life project related to TIR
- [Hillslope comic](/stories/hillslope-mysteries/) mirrors (ranked by my personal bias)
	- [{% lucide 'box' %} MSPFA](https://mspfa.com/?s=50350&p=1)
	- [ComicFury](https://the-iron-ragdoll.thecomicseries.com)
	- [{% lucide 'droplet' %} Tapas](https://tapas.io/series/The-Iron-Ragdoll)
	- [Globalcomix](https://globalcomix.com/c/the-iron-ragdoll)
	- [NamiComi](https://namicomi.com/en/title/EGyt8a6z/the-iron-ragdoll/chapters?lang=en)
- Site mirrors
	- [{% lucide 'cat' %}{% lucide 'brush' %} Neocities](https://neocities.org/site/tofutush)
	- [{% lucide 'github' %} Github Pages](https://tofutush.github.io/The-Iron-Ragdoll)
