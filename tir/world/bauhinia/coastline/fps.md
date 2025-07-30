---
layout: article.liquid
title: Fancy Private School
desc: A really fancy private school.
titlezh: 有钱人上的私立学校
eleventyNavigation:
  parent: Coastline
tags:
  - fancy-private-school
---

## Characters

<link rel="stylesheet" href="/css/characterspage.css">
{% assign filteredChs = characters | filterChByTag: 'Fancy Private School' %}
{% include 'chs', chs: filteredChs %}
