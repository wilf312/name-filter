const {getNameLink, buildNameUrl, fetchNameUrl, loadHtml, getLuckList, get陰陽配列, get三才配置, getName} = require('./domain').default


const fs = require('fs')


const nameLog = async (name) => {

  let output = ``

  const namePage = await fetchNameUrl(name)
  const $ = loadHtml(namePage)
  const text = $.text()

  // console.log(text)

  const nameObj = getName(text)
  const luck = getLuckList(text)
  const posi = get陰陽配列(text)
  const 三才 = get三才配置(text)

  if (!三才 || process.env.OPS !== 三才.list[2])  {
    return
  }
  output += `名前: ${nameObj.name}(${nameObj.read})
`
  console.log(`名前: ${nameObj.name}(${nameObj.read})
`)
  
  luck.map(d => {
    output += `${d.name}${d.num}画: ${d.luck}
キーワード: ${d.keywords}
`
    console.log(`${d.name}${d.num}画: ${d.luck}
キーワード: ${d.keywords}
`)
  })

  
  output += `
陰陽配列: ${posi}

三才配置:
天格が「${三才.list[0]}」
人格が「${三才.list[1]}」
地格が「${三才.list[2]}」
${三才.luck}

------------

`
  console.log(`
陰陽配列: ${posi}

三才配置:
天格が「${三才.list[0]}」
人格が「${三才.list[1]}」
地格が「${三才.list[2]}」
${三才.luck}

------------

`)
  return output
}


const action = async () => {
  // // 名前のリンクの取得
  // const data = await getNameLink()
  // let linkList = [...data.linkList]

  // let promiseList = []

  // for(var i = 1; i < data.pageNum; i++) {
  //   const pageCount = i+1
  //   promiseList.push(getNameLink(pageCount))
  //   console.log(`page ${pageCount} loading...`)
  // }
  // const res = await Promise.all(promiseList)

  // res.map(aaa => {
  //   linkList = [...linkList, ...aaa.linkList]
  // })


  // fs.writeFileSync('./output.json', JSON.stringify(linkList))

  // return


  // console.log(data)
  // /姓名判断/f/岡田__%E5%BD%A9%E6%84%9B?id=3

  const linkList = require('./output.json')
  
  const nameUrlList = linkList.map(d => buildNameUrl(d))
  // fs.writeFileSync('./nameUrlList.json', JSON.stringify(nameUrlList))
 

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
  for(var i = 1217; i < nameUrlList.length; i++) {
  // for(var i = 1217; i < 1218; i++) {
    console.log(`name data ${i} loading...`)
    const result = await nameLog(nameUrlList[i])
    if (result) {
      fs.writeFileSync(`./result${i}.txt`, result)
    }
  }
}

action()
