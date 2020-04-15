const variantsAPI = 'https://cfw-takehome.developers.workers.dev/api/variants'
let index = null

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle a request
 * @param {Request} request
 */

async function handleRequest(request) {
  
  const urlArray = await fetch(variantsAPI)
  
  if (!urlArray.ok) {
    throw Error("Error in URL response")
  }

  data = await urlArray.json();

  // check if variant cookie exists, finds variant index
  const cookie = request.headers.get('cookie')

  if (cookie) {
    cookieArr = cookie.split(';');
    for (var i = 0; i < cookieArr.length; i++) {
      var name = cookieArr[i].split('=')
      if (name[0] == 'variant') {
        index = parseInt(name[1])
      }
    }
  }
  
  // if variant index was not found, randomly select from length of variants 
  if (index == null) {
    index = Math.floor(Math.random() * data.variants.length)
  }
  
  // get chosen URL and fetch 
  variantURL = data.variants[index]
  variantRes = await fetch(variantURL)

  // calls ElementHandler class to change page
  response = new HTMLRewriter().on('*', new ElementHandler()).transform(variantRes)
  
  // append cookie to header
  response.headers.append('Set-Cookie', 'variant=' + index + '; path=/')

  return response
}

class ElementHandler {

  // all incoming elements handled here
  element(element) {
    
    if (element.tagName == 'title') {
      element.setInnerContent("Dhvani Mistry : Project Submission")
    }

    if (element.tagName == 'h1' && element.getAttribute('id') == 'title') {
      element.setInnerContent("Hello from Dhvani Mistry")  
      element.after('<i>(This is variant ' + (index+1) + ')</i>', {html : true})
    }

    if (element.tagName == 'p' && element.getAttribute('id') == 'description') {
      element.setInnerContent("I'm a junior at NJIT looking to learn more about the CS industry. Thank you for the opportunity, I really appreciate it! :-)")
    }

    if (element.tagName == 'a' && element.getAttribute('id') == 'url') {
      element.setInnerContent("LinkedIn Profile")
      element.setAttribute('href', 'https://www.linkedin.com/in/dhvanimistry/')
    }
  }
}
