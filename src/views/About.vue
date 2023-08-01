<template>
  <div class="about">
    <section class="section">
    <p>目標消費カロリー</p>
    <input type="number" id="targetCal" name="targetCal" required
       minlength="4" maxlength="8" size="10"><b>kcal</b>
    
    <br>
    <br>
    <p>体重</p>
    <input type="number" id="weight" name="weight" required
       minlength="4" maxlength="8" size="10"><b>kg</b>
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
            <p>緯度：{{lat2}}   経度：{{lng2}}</p>
          </div>
        </article>

        <article class="message is-info">
          <div class="message-header">
            <p>10秒前</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>緯度：{{lat1}}   経度：{{lng1}}</p>
          </div>
        </article>

        <article class="message is-dark">
          <div class="message-header">
            <p>歩いた距離</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>１０秒間で歩いた距離：{{dist}} km</p>
            <p>合計：{{totalDist}} km</p>
          </div>
        </article>
        
        <article class="message is-cal">
          <div class="message-header">
            <p>消費カロリー</p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">
            <p>合計：{{cal}} kcal</p>
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
import  axios from 'axios' 
import { Auth } from 'aws-amplify';
export default {
  data() {
    return {
      loginUserName:"",

      lat1: 0,
      lng1: 0,
      lat2: 0,
      lng2: 0,
    
      dist: 0,
      totalDist: 0,
      cal:0,

      isExecuteCal:false
    }
  },
  mounted() {
    //起動時処理
    //--ユーザー情報取得
    const userInfo = this.currentAuthenticatedUser();
    this.loginUserName = userInfo.username
   //if (navigator.geolocation) {
      //navigator.geolocation.getCurrentPosition(
        //function(position){
          // 初期現在位置表示
          //this.lat2 = position.coords.latitude;
          //this.lng2 = position.coords.longitude;  
        //}.bind(this),
        //function(error) {
          // エラー処理を書く
          //console.log(error);
        //}
      //);
    //} else {
      // エラー処理を書く
      //console.log("error");
    //}
  },
  methods: {
    currentAuthenticatedUser:async function () {
      try {
        const user = await Auth.currentAuthenticatedUser({
          bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        });
        return user;
      } catch(err) {
        console.log(err);
      }
    },
   
    calStart: function () {
      if (navigator.geolocation) {
        alert( "カロリー消費計算を開始します。" )

        // thisをselfという変数に代入して固定する
        const self = this;
        
        self.isExecuteCal = true;
        navigator.geolocation.getCurrentPosition(
          function(position) { 
            self.lat2 = position.coords.latitude;
            self.lng2 = position.coords.longitude;
          },
          function(error) {
            // エラー処理を書く
            console.log(error);
          }
        );
        //10秒毎にcalcDistance関数を実行する
        const intervalId = setInterval(function () {
          if(self.isExecuteCal == false){
            clearInterval(intervalId);
          }
          self.calcDistance(self);
        }, 10000);
      }else{
        alert( "位置情報が取得出来ません。" )
      }
    },

    calStop: async function () {
      //カロリー計算処理停止
      var response = await this.requestServerPost()
      console.log(response)
      alert( "カロリー消費計算を停止します。" )
      this.isExecuteCal = false;
    },

    requestServerPost: function(){ 
      return new Promise((resolve, reject) => { 
        axios 
          .post( "https://yczy45r8sl.execute-api.us-east-1.amazonaws.com/202307261800", {username:this.loginUserName,cal: this.cal}) 
          .then(response => { 
             resolve(response.data) 
          }).catch(error => { 
              reject(error) 
          }) 
      }).catch((e) => { 
        throw e 
      }) 
    },   

    calcDistance: function (self) {
      //移動距離取得
      navigator.geolocation.getCurrentPosition(
        function(position) { 
          self.lat1 = self.lat2
          self.lng1 = self.lng2

          self.lat2 = position.coords.latitude;
          self.lng2 = position.coords.longitude;

          const dist = self.distance(self.lat1, self.lng1, self.lat2, self.lng2)         
          //5m以下は誤差とみなす
          if (dist > 0.005){
            self.dist = dist
          }else{
            self.dist = 0
          }

          //合計距離
          self.totalDist = self.totalDist + self.dist
        }
      );

      //カロリー計算
      const weight = document.getElementById("weight")
      const wei = weight.value //体重  
      const minSpeed = self.dist * 6000 //速度（分速）           
      if (70 <= minSpeed && minSpeed < 100) { 
        //ウォーキング
        self.cal = self.cal + (3.5 * wei * 0.0028 * 1.05)
      }
      else if(100 <= minSpeed && minSpeed < 200){
        //ジョギング
        self.cal = self.cal + (9 * wei * 0.0028 * 1.05)
      }
      else if(200 <= minSpeed && minSpeed < 600){
        //ランニング
        self.cal = self.cal + (13 * wei * 0.0028 * 1.05)                
      }
                                                                   
      //終了処理
      const target = document.getElementById("targetCal")
      const value = target.value
      if (value !== "" && value <= self.cal) {
        var result = window.confirm('目標達成！初期化しますか？');  
        if( result ) {
          //初期化
          self.lat1 = 0
          self.lng1 = 0
          self.lat2 = 0
          self.lng2 = 0
    
          self.dist = 0
          self.totalDist = 0
          self.cal = 0

          self.isExecuteCal = false;
               
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
