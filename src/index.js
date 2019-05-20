let currentQuotes

document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById('new-quote-form')
    submitButton.addEventListener('submit', submitQuote)

    const sortContainer = document.getElementById('sort')
    const sortButton = document.createElement('sort')
    sortButton.innerText = 'Sort Quotes By Author'
    sortButton.classList.add('btn-success')
    sortButton.addEventListener('click', e => sortQuotes(e, 'sort'))
    sortContainer.appendChild(sortButton)

    getQuotes()
})

const getQuotes = () => {
    fetch('http://localhost:3000/quotes')
        .then(response => response.json())
        .then(quotes => {
            currentQuotes = quotes
            quotes.forEach(indexQuote)
        })
        .catch(error => alert(error.message))
}

const sortQuotes = (e, method) => {
    document.getElementById('quote-list').innerHTML = ''
    if (method === 'sort') {
        const sortedQuotes = [...currentQuotes].sort((a, b) => {
            if (a.author > b.author) {
                return 1
            } else if (a.author < b.author) {
                return -1
            } else {
                return 0
            }
        })
        e.target.innerText = 'Unsort Quotes'
        e.target.removeEventListener('click', e => sortQuotes(e, 'sort'))
        e.target.addEventListener('click', e => sortQuotes(e, 'unsort'))
        sortedQuotes.forEach(indexQuote)
    } else {
        e.target.innerText = 'Sort Quotes By Author'
        e.target.removeEventListener('click', e => sortQuotes(e, 'unsort'))
        e.target.addEventListener('click', e => sortQuotes(e, 'sort'))
        currentQuotes.forEach(indexQuote)
    }
}

const indexQuote = quote => {
    const quoteList = document.getElementById('quote-list')


    const quoteCard = document.createElement('li')
    quoteCard.id = 'quote-' + quote.id
    quoteCard.classList.add('quote-card')
    quoteList.appendChild(quoteCard)

    const blockquote = document.createElement('blockquote')
    quoteCard.appendChild(blockquote)

    const quoteText = document.createElement('p')
    quoteText.classList.add('mb-0')
    quoteText.innerText = quote.quote
    blockquote.appendChild(quoteText)

    const footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.innerText = quote.author
    blockquote.appendChild(footer)

    blockquote.appendChild(document.createElement('br'))

    const likeButton = document.createElement('button')
    likeButton.classList.add('btn-success')
    likeButton.innerText = 'Likes: '
    likeButton.addEventListener('click', likeQuote)
    blockquote.appendChild(likeButton)

    const likes = document.createElement('span')
    likes.innerText = quote.likes
    likeButton.appendChild(likes)

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn-danger')
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click', e => deleteQuote(e, quote.id))
    blockquote.appendChild(deleteButton)
}

const likeQuote = e => {
    const quoteId = e.target.parentElement.parentElement.id.split('-')[1]
    const likesNow = parseInt(e.target.children[0].innerText) + 1
    e.target.children[0].innerText = likesNow

    fetch('http://localhost:3000/quotes/' + quoteId, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            likes: likesNow
        })
    })
        .catch(error => alert(error.message + '. Like will not save'))

}

const deleteQuote  = (e, id) => {
    fetch('http://localhost:3000/quotes/' + id , {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(e.target.closest('li').remove())
}

const submitQuote = (e)  => {
    e.preventDefault()
    debugger
    fetch('http://localhost:3000/quotes' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: e.target.querySelector('#new-quote').value,
            author: e.target.querySelector('#author').value,
            likes: 0
        })
    })
        .then(response => response.json())
        .then(quote => indexQuote(quote))
        .catch(error => alert(error.message))
}