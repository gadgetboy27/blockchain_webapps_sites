const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

async function getPriceFeed(){
    try {
        // const primaryUrl = 'https://coinmarketcap.com'
        const primaryUrl = 'https://trade.swyftx.com.au/trade/BTC/buy/'

        const { data } = await axios({
            method: "GET",
            url: primaryUrl,
            // url: secondaryUrl,

        })
        const $ = cheerio.load(data)
        console.log($)
        const elementSelector = 
        '#buy > div.hide-xs > div.tab-rate > span.md-display-1.display-rate.animate-rate-change.ng-binding.animate-rate-increased'
        // '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'
        // '#tabContainer > div.css-72ldqd > div.css-qbmpwo > div > div.css-1vuj9rf > div'
        // 'body > div.container > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr'
        

        const keys = [
            "rank",
            'name',
            // "symbol",
            'price',
            'volume_24h',
            // '24hVolume',
            'market_cap',
            'circulating_supply',
            'percentage_change_24h'
        ]
        // const keys2 = [
        //     '#',
        //     'coin',
        //     'price',
        //     '1h',	
        //     '24h',
        //     '7d',
        //     '24h',
        //     'volume',   	
        //     'Mkt Cap',	
        //     'Last 7 Days'
        // ]
        const coinArr = []

        $(elementSelector).each((parentIdx, parentElem) =>{
            let keyIdx = 0
            const coinObj = {}

            if (parentIdx <= 9){
                $(parentElem).children().each((childIdx, childElem)=>{
                    let tdValue = $(childElem).text()

                    if (keyIdx === 1 || keyIdx === 6){
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if (tdValue){
                        coinObj[keys[keyIdx]] = tdValue

                        keyIdx++
                    } 
                })

                coinArr.push(coinObj)
            }
        })
        // console.table(coinArr)
        return coinArr
    } catch (err) {
        console.error(err)
    }
}
// getPriceFeed()



const app = express()

app.get('/api/price-feed/', async (req, res)=>{
    try {
        const priceFeed = await getPriceFeed()

        return res.status(200).json({
            result: priceFeed,
        })
    } catch (err){
        return res.status(500).json({
        err: err.toString(),
        })
    }
})

app.listen(3000, ()=> {
    console.log('Hi you made it! ....were running on port 3000')
})

// const PORT = process.env.PORT || 3000
// const app = express();
// const server = http.createServer(app).listen(PORT, () => console.log(`I'm Listening on ${ PORT }`))
