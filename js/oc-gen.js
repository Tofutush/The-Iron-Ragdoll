let basicGenerator = new Generator(
    [
        new GeneratorPlaceholder('count', [
            '<a href="/world/bauhinia/">Bauhinia</a>',
            '<a href="/world/fanton/">Fanton</a>',
            '<a href="/world/atlasia/">Atlasia</a>',
            '<a href="/world/westavia/">Westavia</a>',
            '<a href="/world/moreland/">Moreland</a>',
            '<a href="/world/sylvandia/">Sylvandia</a>'
        ]),
        new GeneratorPlaceholder('nat', [
            'a <a href="/world/bauhinia/">Bauhinian</a>',
            'a <a href="/world/fanton/">Fantoni</a>',
            'an <a href="/world/atlasia/">Atlasian</a>',
            'a <a href="/world/westavia/">Westavian</a>',
            'a <a href="/world/moreland/">Moose</a>',
            'a <a href="/world/sylvandia/">Sylvandian</a>'
        ]),
        new GeneratorPlaceholder('race', [
            'aurian',
            'unicorn',
            'bicorn'
        ]),
        new GeneratorPlaceholder('adj', corporaAdjectives),
        new GeneratorPlaceholder('ch', [
            ...characters,
            'someone in the <a href="/world/bauhinia/mss/">MSS</a>',
            'someone in <a href="/world/bauhinia/starcorp/">Starcorp</a>',
            'someone in the <a href="/world/moreland/guardian-moose/mic/">MIC</a>',
            'someone in the <a href="/world/westavia/spf/">SPF</a>'
        ]),
        new GeneratorPlaceholder('rel', [
            'are in love with',
            'are great friends with',
            'are friends with',
            'are the arch nemesis of',
            'love',
            'hate',
            'would like to kill',
            'want a kid that\'s just like',
            'want a parent that\'s just like',
            'have a crush on'
        ])
    ],
    [
        'They are %nat% %race%.',
        'They are %nat% %race%. They are %adj|1-3%.',
        'They are %nat% %race%. They are %adj|1-3%. They %rel% %ch%.',
        ['They are %nat% %race% living in %count%.', 0.1],
        ['They are %nat% %race% living in %count%. They are %adj|1-3%.', 0.1],
        ['They are %nat% %race% living in %count%. They are %adj|1-3%. They %rel% %ch%.', 0.1]
    ]
);
let soulGenerator = new Generator(
    [
        new GeneratorPlaceholder('form', ['gas', 'liquid', 'solid']),
    ],
    [
        'They have a %form% soul'
    ]
);
function randomColor() {
    let rgb = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ];
    return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
}
function generate() {
    let basics = basicGenerator.generate();
    // get rolled race
    let race = basicGenerator.lastRolled.results[1].results[0];
    let headGenerator;
    if (race === 'aurian') {
        headGenerator = new Generator(
            [
                new GeneratorPlaceholder('size', ['big', 'average-sized', 'small']),
                new GeneratorPlaceholder('shape', ['bunny', 'fox', 'mouse', 'cow', 'pair of wings'])
            ],
            [
                'Their ears are %size%.',
                'Their ears are %size% and shaped like a %shape%.'
            ]
        )
    } else if (race === 'unicorn') {
        headGenerator = new Generator(
            [
                new GeneratorPlaceholder('size', ['big', 'average-sized', 'small']),
                new GeneratorPlaceholder('shape', ['curvy', 'straight', 'twirly', 'jagged', 'riddled with holes'])
            ],
            [
                'Their horn is %size%.',
                'Their horn is %size% and %shape%.',
            ]
        )
    } else { // bicorn
        headGenerator = new Generator(
            [
                new GeneratorPlaceholder('size', ['big', 'average-sized', 'small']),
                new GeneratorPlaceholder('shape', ['curvy', 'straight', 'twirly', 'jagged', 'riddled with holes'])
            ],
            [
                'Their horns are %size%.',
                'Their horns are %size% and %shape%.',
                ['Their left horn is %size%, and their right horn is %size%.', 0.05],
                ['Their left horn is %size% and %shape%, and their right horn is %size% and %shape%.', 0.05],
                ['Their left horn is %size%, and their right horn is %size% and %shape%.', 0.05],
                ['Their left horn is %size% and %shape%, and their right horn is %size%.', 0.05],
            ]
        )
    }
    let head = headGenerator.generate();
    let color = randomColor();
    let soul = soulGenerator.generate();
    let soulShapeGenerator;
    if (soulGenerator.lastRolled.results[0].results[0] === 'liquid') {
        soulShapeGenerator = new Generator(
            [
                new GeneratorPlaceholder('desc', [
                    'gooey',
                    'sticky',
                    'watery',
                    'slimy',
                    'muddy',
                    'mercury-like',
                    'bubbly',
                    ['non-Newtonian', 0.01]
                ])
            ],
            ['%desc%']
        )
    } else {
        soulShapeGenerator = new Generator(
            [
                new GeneratorPlaceholder('desc', [
                    'a sphere',
                    'a cube',
                    'a star',
                    'a hexagon',
                    'a pentagon',
                    'a lightning bolt',
                    'an incomprehensible mess',
                    'very bouncy',
                    'a bird',
                    'a tangle of barbed wire'
                ])
            ],
            ['%desc%']
        )
    }
    let soulShape = soulShapeGenerator.generate();
    let li = document.createElement('li');
    li.innerHTML = `${basics} ${head} ${soul} that is ${soulShape} and colored <span style="color:${color}">${color.toUpperCase()}</span>.`;
    document.querySelector('#generated').prepend(li);
}