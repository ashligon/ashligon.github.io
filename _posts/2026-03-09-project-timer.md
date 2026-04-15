---
layout: default
title: project timer
tags: tools
---

<head>
    <meta charset="UTF-8">
    <title>project timer</title>
    <link rel="stylesheet" href="https://unpkg.com/98.css">
    <link rel="stylesheet" href="/assets/css/project-timer.css">
</head>
<body>
    <img src="/assets/img/background/border.jpeg" alt="filet crochet border" width="775"/>
    <div id='timer-wrapper'>
        <div id='timer'>00:00:00</div>
        <!-- TODO: bring back once you have time to fix spacing -->
        <!--<div id='labels'>
            <span id='hh'>hours</span>
            <span id='mm'>minutes</span>
            <span id='ss'>seconds</span>
        </div>-->
        <div id='controls'>
            <button id='start-btn'>start</button>
            <button id='stop-btn'>stop</button>
            <button id='clear-btn'>clear</button>
        </div>
    </div>
    <script src="/assets/js/project-timer.js"></script>
</body>