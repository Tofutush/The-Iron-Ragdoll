---
title: Coastline Middle School
eleventyNavigation:
  parent: Coastline
tags:
  - coastline-middle-school
categories:
  - Schools
desc: A shitty public middle school.
---

A shitty middle school in a shitty city.

## Characters

<link rel="stylesheet" href="/css/characterspage.css">
{% assign filteredChs = characters | filterChByTag: 'Coastline Middle School' %}
{% include 'chs', chs: filteredChs %}
