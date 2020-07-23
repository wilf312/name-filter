const {getNameLink, buildNameUrl, fetchNameUrl, loadHtml, getLuckList, get陰陽配列, get三才配置, getName} = require('./domain').default


const nameLog = async (name) => {

  const namePage = await fetchNameUrl(name)
  const $ = loadHtml(namePage)

  const text = $.text()

  // console.log(text)

  const nameObj = getName(text)
  const luck = getLuckList(text)
  const posi = get陰陽配列(text)
  const 三才 = get三才配置(text)

  if (process.env.OPS !== 三才.list[2])  {
    return
  }

  console.log(`名前: ${nameObj.name}(${nameObj.read})
`)
  
  luck.map(d => {
    console.log(`${d.name}${d.num}画: ${d.luck}`)
    console.log(`キーワード: ${d.keywords}`)
    console.log(``)
  })

  console.log(`陰陽配列: ${posi}`)
  console.log(`三才配置:
天格が「${三才.list[0]}」
人格が「${三才.list[1]}」
地格が「${三才.list[2]}」`)
  console.log(三才.luck)
  console.log()
  console.log(`
------------  
`)
}


const action = async () => {
  // 名前のリンクの取得
  const data = await getNameLink()

  // console.log(data)
  // /姓名判断/f/岡田__%E5%BD%A9%E6%84%9B?id=3
  
  const nameUrlList = data.linkList.map(d => buildNameUrl(d))

//   const namePage = await fetchNameUrl(nameUrlList[0])
//   const $ = loadHtml(namePage)

//   const text = $.text()

  
//   const luck = getLuckList(text)
//   luck.map(d => {
//     console.log(`${d.name}${d.num}画: ${d.luck}`)
//     console.log(`キーワード: ${d.keywords}`)
//     console.log(``)
//   })

//   const posi = get陰陽配列(text)
//   console.log(`陰陽配列: ${posi}`)
//   const 三才 = get三才配置(text)
//   console.log(`三才配置: ${三才.list.join('->')}: ${三才.luck}`)
//   console.log(`
// ------------  
// `)
  

  
  // 陰陽配列は「バランスの悪い配列」となっています。よい配列例を参考に名前を選んでいくとよいでしょう。また、姓と名のつなぎ目は「陰・陽」もしくは「陽・陰」となるのが吉とされます。

  // 三才配置は『火⇒土⇒火』で『大吉』

  // 名前の響きの五行は「土」で、「人の和を大切にする人」


  // await nameLog(nameUrlList[0])

  // 名前のデータを取得
  nameUrlList.map(async (d) => {
    await nameLog(d)
  })

}

action()
