<template>
  <div class="about">
    <h1>現在地</h1>
    <p>緯度：{{latitude}}</p>
    <p>経度：{{longitude}}</p>

    <h2>1分前</h2>
    <p>緯度：{{lat1}}</p>
    <p>経度：{{lng1}}</p>

    <h2>歩いた距離</h2>
    <p>1分間で歩いた距離：{{d}} km</p>
    <p>合計：{{length}} km</p>
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
      length: 0
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          let coords = position.coords;
          // 緯度経度だけ取得
          this.latitude = coords.latitude;
          this.longitude = coords.longitude;

          // thisをselfという変数に代入して固定する
          const self = this;  

          //10秒毎にcalcDistance関数を実行する
          setInterval(function () {
            console.log('hi');
            calcDistance();
          }, 5000);

          function calcDistance(){
            navigator.geolocation.getCurrentPosition(
              function(position) { 
                console.log('ho');
                self.lat2 = position.coords.latitude;
                self.lng2 = position.coords.longitude;

                if (self.lat1) {
                  self.d = distance(self.lat1, self.lng1, self.lat2, self.lng2)
                } else {
                  self.lat1 = self.lat2
                  self.lng1 = self.lng2
                }
                self.length = self.length + self.d
                console.log(self.d);

                self.lat1 = self.lat2
                self.lng1 = self.lng2
              }
            );
          }
 
          function distance(lat1, lng1, lat2, lng2) {
            lat1 *= Math.PI / 180;
            lng1 *= Math.PI / 180;
            lat2 *= Math.PI / 180;
            lng2 *= Math.PI / 180;
            return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
          }
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
  }
}
</script>