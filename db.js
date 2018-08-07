const promiseSeries = require('promise.series')
const Promise = require('bluebird')

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
		user : 'root',
		password : '',
		database : 'rumajidb'	
    }
  });

// function getUser () {
//     knex('users')
//         .then(function (res) {
//             console.log('res', res)
//         })
// }

function insertMain (datas) {
    console.log('function insert main >> ')

    // convert to objject
    datas = JSON.parse(datas)

    // coll 
    let output = []

    datas.map(function (data) {

        const {
            publisher,
            author,
            book
        } = data
        
        output.push(() => insertSingleMain(book, author, publisher))

    })

    Promise.mapSeries(output, (fn) => fn())
        .then(function (out) {
        })

}

function insertSingleMain (book, author, publisher) {
   
    const proms = [
        insertAuthor(author),
        insertPublisher(publisher)
    ]

    return Promise
    .all(proms)
    .then(function (resp) {
        const [
            authorID,
            publisherID
        ] = resp

        const [_idAuthor, _idPublisher] = authorID.concat(publisherID)

        return insertBook(book, _idAuthor, _idPublisher)
            .then(function () {
                return authorID.concat(publisherID)
            })

        
    })
}



function insertBook (book, idAuthor, idPublisher) {

    delete book._author_id
    book.author_id = idAuthor
    delete book._publisher_id
    book.publisher_id = idPublisher
    return knex('books').returning(['id']).insert(book)
}
function insertAuthor (author) {
    const name = author.name
    return knex('authors').where('name', name).select('id')
        .then(function (resp) {
            if(resp.length < 1) {
                let out = knex('authors').returning(['id']).insert(author)
                return out
            }
            else {
                if(!resp) return []
                resp = resp[0].id
                return [resp]
            }
        })
}
function insertPublisher (publisher) {
    
    const name = publisher.name
    return knex('publishers').where('name', name).select('id')
        .then(function (resp) {
            if(resp.length < 1) 
                return knex('publishers').returning(['id']).insert(publisher)
            else {
                if(!resp) return []
                resp = resp[0].id
                return [resp]
            }
        })
}

module.exports.insert = insertMain 