say price every 15 sec.
```
while true; do ( curl http://hq.sinajs.cn/?list=hf_HSI,hkHSI | node -p "(new Function(require('fs').readFileSync(0).toString()+'return hq_str_hf_HSI.split(\",\")'))()[0]" | say -v Sin-ji && sleep 20) done

while true; do ( curl http://hq.sinajs.cn/?list=hf_HSI,hkHSI | node -p "(new Function(require('fs').readFileSync(0).toString()+'return hq_str_hf_HSI.split(\",\")'))()[0].substr(1,4).split('').join(' ')" | say -v Sin-ji && sleep 20) done

while true; do ( node -e "require('http').get('http://hq.sinajs.cn/?list=hf_HSI,hkHSI',r=>r.pipe(process.stdout))" | node -p "(new Function(require('fs').readFileSync(0).toString()+'return hq_str_hf_HSI.split(\",\")'))()[0].substr(1,4).split('').join(' ')" | say -v Sin-ji && sleep 30) done
 
```

google quick

https://texttospeech.googleapis.com/v1beta1/text:synthesize

{
  "audioConfig": {
    "audioEncoding": "LINEAR16",
    "pitch": "0.00",
    "speakingRate": "1.00"
  },
  "input": {
    "text": "Price 30123"
  },
  "voice": {
    "languageCode": "en-AU",
    "name": "en-AU-Wavenet-A"
  }
}
