<template>
  <div class="about">
    <section class="section">
    <p>目標消費カロリー</p>
    <input type="number" id="targetCal" name="targetCal" required
       minlength="4" maxlength="8" size="10"><b>kcal<b>
    
    <br>
    <br>
    <p>体重</p>
    <input type="number" id="weight" name="weight" required
       minlength="4" maxlength="8" size="10"><b>kg<b>
    <br>
    <br>
    <div>
      <button v-on:click="calStart">移動開始</button>
      <button v-on:click="calStop">休憩</button>
    </div>
    <br>
    <br>
      <div class="container">
        <article class="message is-primary">
          <div class="message-header">
            <p>現在地</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>緯度：{{lat2 | round}} 　 経度：{{lat2 | round}}</p>
          </div>
        </article>

        <article class="message is-info">
          <div class="message-header">
            <p>10秒前</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>緯度：{{lat1 | round}} 　 経度：{{lng1 | round}}</p>
          </div>
        </article>

        <article class="message is-dark">
          <div class="message-header">
            <p>歩いた距離</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>１０秒間で歩いた距離：{{d | round}} km</p>
            <p>合計：{{length | round}} km</p>
          </div>
        </article>
        
        <article class="message is-cal">
          <div class="message-header">
            <p>1分間の消費カロリー</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>合計：{{cal | round}} kcal</p>
          </div>
        </article>
      </div>
    </section>

    <footer class="footer">
      <a></a>
    </footer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,

      lat1: 0,
      lng1: 0,
      lat2: 0,
      lng2: 0,
    
      d: 0,
      length: 0,
      cal:0,
      mincount:0,
      minlength:0,
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          let coords = position.coords;
          // 初期現在位置取得
          this.lat1 = coords.latitude;
          this.lng1 = coords.longitude;

          // thisをselfという変数に代入して固定する
          const self = this;  
        }.bind(this),
        function(error) {
          // エラー処理を書く
          console.log("error");
        }
      );
    } else {
      // エラー処理を書く
      console.log("error");
    }
  },
  methods: {
      calStart: function () {
        //10秒毎にcalcDistance関数を実行する
        const timerId = setInterval(function () {
          calcDistance();
        }, 10000);
      },
      calStop: function () {
        //カロリー計算処理停止


      },
      calcDistance: function () {
        //移動距離取得
        navigator.geolocation.getCurrentPosition(
          function(position) { 
            lf.lat2 = position.coords.latitude;
            elf.lng2 = position.coords.longitude;

            self.d = distance(self.lat1, self.lng1, self.lat2, self.lng2)
            self.length = self.length + self.d

            self.lat1 = self.lat2
            self.lng1 = self.lng2
          }
        );

        //カロリー計算
        const weight = document.getElementById("weight")
        const wei = weight.value //体重           
        self.mincount = self.mincount + 1
        self.minlength = self.minlength + self.length            
        if (self.mincount == 6) {                   
            if (70 <= self.minlength < 100) {
              //ウォーキング
              self.cal = self.cal + (3.5 * wei * 0.01665 * 1.05)
            }
            else if(100 <= self.minlength < 200){
             //ジョギング
             self.cal = self.cal + (9 * wei * 0.01665 * 1.05)
            }
            else if(200 <= self.minlength){
              //ランニング
              self.cal = self.cal + (13 * wei * 0.01665 * 1.05)                
            }
                                
            self.mincount = 0
            self.minlength = 0            
        }
                              
        //終了処理
        const target = document.getElementById("targetCal")
        const value = target.value
        if (value !== "" && value <= self.cal) {
          var result = window.confirm('目標達成！！初期化します。');  
          if( result ) {
            //初期化
            self.lat1 = 0
            self.lng1 = 0
            self.lat2 = 0
            self.lng2 = 0
    
            self.d = 0
            self.length = 0
            self.cal = 0
            self.mincount =0
            self.minlength = 0
               
            const target = document.getElementById("targetCal")
            target.value = ""
            
            const weight = document.getElementById("weight")
            weight.value = ""
          }
          else {
            //キャンセル時そのまま
          }
        }
      },
      distance: function (lat1, lng1, lat2, lng2) {
        //2点間の距離を取得
        lat1 *= Math.PI / 180;
        lng1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        lng2 *= Math.PI / 180;
        return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
      },

  },
  
  filters: {
    // 小数点以下を第3位に丸めるフィルタ
    round: function (val) {
      return Math.round(val * 1000) / 1000
    }
  }
}
</script>
