let basicGenerator = new Generator(
    [
        new GeneratorPlaceholder('count', [
            'Bauhinia',
            'Fanton',
            'Atlasia',
            'Westavia',
            'Moreland',
            'Sylvandia'
        ]),
        new GeneratorPlaceholder('nat', [
            'a Bauhinian',
            'a Fantoni',
            'an Atlasian',
            'a Westavian',
            'a Moose',
            'a Sylvandian'
        ]),
        new GeneratorPlaceholder('race', [
            'aurian',
            'unicorn',
            'bicorn'
        ]),
        new GeneratorPlaceholder('adj', corporaAdjectives),
    ],
    [
        'They are %nat% %race% living in %count%. They are %adj|1-3%.'
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
    let generated = basicGenerator.generate();
    let basics = document.querySelector('.basics');
    basics.innerHTML = generated;

    let color = randomColor();
    let colorSpan = document.querySelector('.color');
    colorSpan.innerHTML = color.toUpperCase();
    colorSpan.style.color = color;
}