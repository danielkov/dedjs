class DedJS {
  constructor (url, id) {
    if (!url) {
      throw new Error('URL must be defined.')
    }
    this.url = url
    this.appId = id || encode(Date.now())
    this.headers = new Headers()
    this.headers.append('Content-Type', 'application/json')
    this.options = {
      method: 'POST',
      headers: this.headers,
      mode: 'cors'
    }
    let options = Object.assign({}, this.options)
    options.body = JSON.stringify({request: 'Handshake', id: this.appId})
    fetch(this.url, options)
    .then(res => {
      console.log(res.message)
    })
    .then(res => {
      console.log(`%cCheck out your report at: ${this.url}/${this.appId}`, "color: #233042; font-size: 22px")
    })
    .catch(err => {
      console.warn(e.message)
    })
  }
  mark () {
    try {
      throw new Error('Undead code detected.')
    } catch (e) {
      this.sendData(e.stack)
    }
  }
  sendData (data) {
    let options = Object.assign({}, this.options)
    options.body = JSON.stringify({request: 'Mark', data: data, id: this.appId})
    fetch(this.url, options)
    .then(res => {
      console.log(res.message)
    })
    .catch(err => {
      console.warn(e.message)
    })
  }
}

function encode (num) {
  let poss = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  let l = 62;
	let f = true;
	let res = ''
	while (true) {
		res = poss[num % l] + res;
		num = Math.floor(num / l)
		if (num === 0) {
			break;
		}
	}
	return res;
}
