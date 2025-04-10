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
        'They are %nat% %race%. They are %adj|1-3%. They %rel% %ch%.',
        'They are %nat% %race%.',
        'They are %nat% %race% living in %count%.',
        'They are %nat% %race% living in %count%. They are %adj|1-3%.',
        'They are %nat% %race% living in %count%. They are %adj|1-3%. They %rel% %ch%.'
    ]
);
let soulGenerator = new Generator(
    [
        new GeneratorPlaceholder('form', ['gas', 'liquid', 'solid']),
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
    [
        'They have a %form% soul that is %desc%.'
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
    let color = randomColor();
    let soul = soulGenerator.generate();
    let li = document.createElement('li');
    li.innerHTML = `${basics} ${soul} Their soul color is <span style="color:${color}">${color.toUpperCase()}</span>.`;
    document.querySelector('#generated').appendChild(li);
}