const fs = require('fs')
const path = require('path')

const db = require('./db')

let _dir = './../../RUMAJI_DATA_MIGRATION_GDRS'
let _path = _dir+'/pages-1-goodreads.json'
const _output = './output'


const TYPE = 'goodreads' //should use on data handler and data name

// output should be the format that can use on database
/*

    generate book data

    generate author data

    generate publisher data

*/

// check if _path folder not exist 
if(!fs.existsSync(_output)) {
    fs.mkdirSync(_output)
}

let fn = require('./'+TYPE+'.js')

// read dir 
fs.readdir(_dir, function (err, data) {
    
    const conversion = data.map(function (name) {

        let [
            _name,
            format
        ] = name.split('.')

        _name = _name.split('-')

        const [
            pages,
            number,
            source
        ] = _name

        return {
            source,
            number,
            filename: name
        }

    }).filter(function (item) {
        if(item.source = TYPE) return true
        return false
    })

    let outputPromise = []

    conversion.map(function (item) {
        const out = new Promise((res, rej) => {
            let o = _dir + '/' + item.filename
            fs.readFile(o, 'utf8', (err, data) => {
                if(err) return rej(err)
                data = fn(data)
                res(data)
            })
        })
        outputPromise.push(out)
    })

    Promise
        .all(outputPromise)
        .then(values => {
            return values.map((value, index) => {
                let p = _output+'/'+TYPE+'-'+(index+1)+'.json'
                // fs.writeFile(p, value, (err) => {
                //     console.log('done write to >> '+p)
                // })
                // insert to database
                db.insert(value)
            })
        })

})