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
        ])
    ],
    [
        'They are %nat% %race% living in %count%.'
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
    colorSpan.innerHTML = color;
    colorSpan.style.color = color;
}