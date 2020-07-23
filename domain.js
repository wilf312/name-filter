const cheerio = require('cheerio')
const fetch = require('node-fetch')

const domain = new URL('https://b-name.jp')
const gender = 'f'
const nameEncode = encodeURI('岡田')
const dec = encodeURI('赤ちゃん名前辞典')
const check = encodeURI('姓名判断')
const host = `${domain.protocol}//${domain.host}`

const loadHtml = (html) => {
  return cheerio.load(html)
}

const luckNameList = [
  '天格（祖運）',
  '人格（主運）',
  '地格（初運）',
  '外格（助運）',
  '総格（総運）',
]

const getLuckList = text => {
  return luckNameList.map(name => {
    return getLuck(text, name)
  })
}
const getLuck = (text, type) => {
  const re = new RegExp(`${type}は(\\d*)画で『(\.\{1,2\})』キーワードは『(\.\{1,15\})』`, 'i')
  const match = text.match(re)

  if (match) {
    const [_, num, luck, keywords] = match
    return {
      num,
      luck,
      keywords,
      name: type
    }
  } else {
    return null
  }
}
const get陰陽配列 = (text) => {
  const match = text.match(/陰陽配列は「(.{1,15})」/)

  if (match) {
    const [_, positiveAndNegative] = match
    return positiveAndNegative
  } else {
    return null
  }
}
const get三才配置 = (text) => {
  const match = text.match(/三才配置は『(.{1})⇒(.{1})⇒(.{1})』で『(.{1,2})』/)

  if (match) {
    const [_, one, two, three, luck] = match
    return {
      list: [one, two, three],
      luck
    }
  } else {
    return null
  }
}
const getName = (text) => {
  const match = text.match(/(.{1,20})の診断結果/)
  const match2 = text.match(/（(.{1,20})）という姓名の/)

  if (match && match2) {
    const [_, name] = match
    const [__, read] = match2
    return {
      name,
      read
    }
  } else {
    return null
  }
}

/**
 * 名前のリストを取得する
 */
const getNameLink = async () => {

  const fetchNameList = async () => {
    const url = `${host}/${dec}/${gender}/${nameEncode}/?p=1`
    return await fetch(url)
      .then(res => {
        return res.text()
      })
  }
  try {
    const data  = await fetchNameList()
    const $ = loadHtml(data)

    // 「岡田」姓と相性の良い字画の女の子の名前例
    const domList = $('.namelist tbody tr .cell-name a')
    let linkList = []
    domList.each(function (i, elem) {
      const a = JSON.parse(JSON.stringify(elem.attribs))
      // console.log(a.href)
      
      linkList.push(a.href)
    });
    
    // console.log(linkList)
    const pageNum = parseInt($('.lastlink').text(), 10)
    // console.log(pageNum)

    return {
      linkList,
      host,
      domain,
      pageNum
    }

    // `https://b-name.jp/%E5%A7%93%E5%90%8D%E5%88%A4%E6%96%AD/f/%E5%B2%A1%E7%94%B0__${}?id=3`
    
  } catch(e) {
    console.log(e)
  }
}

/**
 * 単一の名前のURLの生成
 * @param {string} link 
 */
const buildNameUrl = (link) => {
  const one = new URL(`${host}${link}`)

  const [_, __, gender, name, id] = one.pathname.split('/')

  return `${host}/${check}/${gender}/${nameEncode}__${name}?id=${id}`
}

/**
 * 単一の姓名のページの取得
 * @param {string} url 
 */
const fetchNameUrl = async (url) => {
  return await fetch(url)
    .then(res => {
      // console.log(res.json())
      return res.text()
    })
}

exports.default = {
  domain,
  gender,
  nameEncode,
  dec,
  check,
  getNameLink,
  buildNameUrl,
  fetchNameUrl,
  loadHtml,
  getName,
  getLuckList,
  get陰陽配列,
  get三才配置,
}