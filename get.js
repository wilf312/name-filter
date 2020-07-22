const cheerio = require('cheerio')
const fetch = require('node-fetch')

const domain = new URL('https://b-name.jp')
const gender = 'f'
const nameEncode = encodeURI('岡田')
const dec = encodeURI('赤ちゃん名前辞典')
const check = encodeURI('姓名判断')

const getNameLink = async () => {
  const host = `${domain.protocol}//${domain.host}`

  const fetchNameList = async () => {
    const url = `${domain.protocol}//${domain.hostname}/${dec}/${gender}/${nameEncode}/?p=1`
    console.log(url)

    // console.log(url)
    return await fetch(url)
      .then(res => {
        // console.log(res.json())
        return res.text()
      })
  }
  try {
    const data  = await fetchNameList()
    const $ = cheerio.load(data)

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

const action = async () => {
  // 名前のリンクの取得
  const data = await getNameLink()

  // console.log(data)
  // /姓名判断/f/岡田__%E5%BD%A9%E6%84%9B?id=3
  
  
  const buildNameUrl = link => {
    const one = new URL(`${data.host}${link}`)

    const [_, __, gender, name, id] = one.pathname.split('/')

    const url = `${data.domain.protocol}//${data.domain.hostname}/${check}/${gender}/${nameEncode}__${name}?id=${id}`

    return url
  }

  
  const nameUrlList = data.linkList.map(d => buildNameUrl(d))

  console.log(nameUrlList)


  const fetchNameUrl = async (url) => {
    return await fetch(url)
      .then(res => {
        // console.log(res.json())
        return res.text()
      })
  }
  const namePage = await fetchNameUrl(nameUrlList[0])
  console.log(namePage)

  // 天格（祖運）は13画で『大吉』
  // 人格（主運）は16画で『大吉』
  // 地格（初運）は24画で『大吉』
  // 外格（助運）は21画で『吉』
  // 総格（総運）は37画で『吉』
  // 陰陽配列は「バランスの悪い配列」となっています。よい配列例を参考に名前を選んでいくとよいでしょう。また、姓と名のつなぎ目は「陰・陽」もしくは「陽・陰」となるのが吉とされます。

  // 三才配置は『火⇒土⇒火』で『大吉』

  // 名前の響きの五行は「土」で、「人の和を大切にする人」



  // 名前のデータを取得
  // nameUrlList.map(async (d) => {
  //   const data = await fetchNameUrl(d)

  //   console.log(data)
  // })

}

action()
