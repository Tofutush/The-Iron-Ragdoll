---
title: Coastline Middle School
eleventyNavigation:
  parent: Coastline
tags:
  - coastline-middle-school
titlezh: 沿海十一中
categories:
  - Schools
---

A shitty middle school in a shitty city.

## Characters

<link rel="stylesheet" href="/css/characterspage.css">
{% assign filteredChs = characters | filterChByTag: 'Coastline Middle School' %}
{% include 'chs', chs: filteredChs %}
