const ch = require('./characters.json');
const rel = require('./relationships.json');

let data = {
    ch: ch.map(c => ({
        name: c.name,
        color: c.color
    })),
    rel: []
}

rel.forEach(r => {
    data.rel.push({
        from: r.ch[0][0],
        to: r.ch[1][0],
        rel: r.ch[0][1] || ''
    });
    data.rel.push({
        from: r.ch[1][0],
        to: r.ch[0][0],
        rel: r.ch[1][1] || ''
    })
})

module.exports = data;