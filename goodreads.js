const moment = require('moment')

module.exports = function (datas) 
{
    datas = JSON.parse(datas)

    const fallbackString = '-unknown-'
    const book = []
    const author = []
    const publisher = []
    const temp = null

    const final = datas.map(data => {

        // data 
        /*
            {
                "author": "Seno Gumira Ajidarma",
                "title": "Sepotong Senja untuk Pacarku ",
                "urldetail": "https://www.goodreads.com/book/show/1025836.Sepotong_Senja_untuk_Pacarku",
                "urlimage": "https://images.gr-assets.com/books/1464705936s/1025836.jpg",
                "details": {
                    "title": "Sepotong Senja untuk Pacarku by Seno Gumira Ajidarma",
                    "description": "Kisah cinta Sukab yang mengirimkan sekerat senja dalam amplop untuk Alina, pujaan hatinya, namun baru sampai sepuluh tahun kemudian, menjadi kisah utama dalam kumpulan cerpen tentang senja yang sangat populer ini. Setelah satu dekade berlalu, keindahan senja yang diabadikan Seno ternyata banyak dijadikan bagian dari surat cinta untuk memenangkan hati para gadis di dunia nyata. \n\nDalam cerpen lainnya, senja tampil dalam 16 komposisi, menjadi pengikat kisah-kisah renungan tentang kehidupan. Kumpulan cerpen ini tampil baru dengan bonus tiga cerpen tambahan yang diambil dari buku Seno Gumira Ajidarma yang lain, Linguae. Tak lupa, ada lembaran ‘surat cinta’ yang bisa langsung dikirim untuk kekasih hati. \n\nBerkolaborasi dengan Eddy Suhardy sebagai penulis Bahasa Tempo Dulu dan Mansyur Mas’ud sebagai Pegrafis Cukilan Kayu.",
                    "numberofpages": "220 pages",
                    "detailpub": "Published January 2002 by Gramedia Pustaka Utama",
                    "detaildatabox": [
                        {
                        "key": "Original Title",
                        "value": "Sepotong Senja untuk Pacarku"
                        },
                        {
                        "key": "ISBN",
                        "value": "\n                  9796865009\n                      (ISBN13: 9789796865000)\n                "
                        },
                        {
                        "key": "Edition Language",
                        "value": "Indonesian"
                        }
                    ]
                }
            },
        */

        let {
            author: _author,
            title,
            urldetail,
            urlimage,
            details: {
                title:_title,
                description,
                numberofpages,
                detailpub,
                detaildatabox
            }
        } = data
        if(!detailpub) detailpub = ''
        if(numberofpages) 
            numberofpages = numberofpages.replace(' pages', '')
        else
            numberofpages = '0'

        let [
            _year,
            _published
        ] = detailpub.split(' by ')
        
        _year = _year.replace('Published ', '')

        if(!_published) _published = fallbackString

        /*
            detail data box
        */
       let ISBN = ''
       let ISBN13 = ''
        detaildatabox.map(function (detaildata) {
            switch (detaildata.key) {
                case 'ISBN':
                    ISBN = detaildata.value.trim()
                break;
                case 'ISBN13':
                    ISBN13 = detaildata.value.trim()
                break;
            }
        })

        if(ISBN.indexOf('ISBN13') !== -1) {
            let temp = ISBN.split('(ISBN13: ')
            let temp0 = temp[0]
            let temp1 = temp[1]
            ISBN = temp0.trim()
            temp1 = temp1.replace(')', '')
            ISBN13 = temp1.trim()
        }

        let update = {}

        // generate data author
        /*
            {id: 1, name: 'Amy Bloom'},
        */
        const author = {
            name: _author
        }
        
        // generate data publisher
        /*
            {id: 3, name: 'HarperCollins Publishers'}
        */
       const publisher = {
           name: _published
       }

        // generate data book
        /*
            {
                id: 1, 
                published: '2018-02-01', 
                cover_url: 'https://images-na.ssl-images-amazon.com/images/I/519Sk0QQWVL._SL200_.jpg', 
                title: 'White Houses', 
                subtitle: 'HarperCollins Publishers', 
                isbn: '0525589929', 
                page: 320, 
                genre_id: 1, 
                author_id: 1, 
                publisher_id: 1
            },
        */
        if(!_year) _year = '0000'
        const __published = moment(_year).format('YYYY-MM-DD')
        
        const book = {
            published: __published,
            cover_url: urlimage,
            title: title,
            subtitle: description,
            isbn: ISBN,
            isbn13: ISBN13,
            page: numberofpages,
            genre_id: 1,
            _author_id: author,
            _publisher_id: _published
        }

        update = {
            book,
            publisher,
            author
        }

        return update

    })
   
    return JSON.stringify(final, null, "\t")
}