---
layout: article.liquid
title: Goals
desc: Goals for me. Dreams are worth having.
templateEngineOverride: liquid,md
eleventyNavigation:
  key: Goals
  parent: Root
---

A list of "stuff I wanna do" so I won't forget about them. I will never finish all of them — or even just some of them — in my entire life, and I know that perfectly well. It's called self-awareness.

## To-do

- The Iron Ragdoll
	- Originally planned as a comic; is now a paracosm after I learnt the word. What this entire site is dedicated to. Though it would probably never reach a "finished" state, I do wanna refine everything I have at the moment.
- Havoc 101
	- Originally planned as a kinda-open-world point and click game where you wreak havoc around the school. See its planning site [here](https://tofutush.github.io/havoc101).
	- Would probably never actually get even started. But in the rare case that it does, it would be made in Adventure Game Studio.
- [Spy School](/stories/spy-school/) the comic
	- Templating for Homestuck-style dialog and narration (Done!)
	- Archive pages with little image thumbnails
		- Man I used to wanted to do this back when I didn't use 11ty and I couldn't bother to export little thumbs all the time. Now I can just *do* it
- New About page that's written like a dossier because yes.
- Idle Forced Labor Camp
	- An idle game! In limbo due to the amount of artwork it requires. Has a basic playable version [here](https://tofutush.github.io/idlegame).
	- it currently requires:
		- A bunch of artwork
		- Maths refining
		- A story written in the form of a diary with 50 entries, or fewer perhaps
	- I think I might have set the scope too big. 50 characters (150 pieces of art) and 50 levels (50 diary entries) sound like hell, both to me and the player. I should cut things down a bit.
- Animations
	- My arch-nemisis.
	- "Redemption" animation meme
		- It looks relatively simple, and I have my character choices ready. I'll probably start this after finishing the previous one.
	- Trypophobia
		- It also looks simple and I have chosen my characters.
- Footers
	- Draw some lineless art for the website footer! As many as possible! There couldn't possibly be too many!
	- {% assign footers = gallery | filterGalleryByKind: 'footer' %}
	- Current: {{ footers.size }}.
- Favorite picker
	- Coding done, but requires artwork and a logic for including alternative art for characters that haven't a fav picker image drawn
- Family of Secrets
	- An interactive story made in Twine featuring Frosting, Entity, and Harmony. Canon and planning.
- The Bauhinian Archives
	- A set of files that you read through and figure out what happened to [Koala](/characters/koala/) and [Kangaroo](/characters/kangaroo/). Canon, though unlikely to be finished.
- Character art
	- Each character needs the following images:
		- 500px lineless thumb
		- 500px profile image
		- reference image
		- Favorite picker image
	- That's like {{ characters.size | times: 4 }} pictures! What have I done to myself!
- Progress can be tracked [here](/characters/list/).

## Done

- [Scavenger hunt game](/fun/hunt/).

*You found a puzzle piece: **tc**! Next clue: the tale of a 3rd gen immigrant. ([What is this?](/fun/hunt/))*
