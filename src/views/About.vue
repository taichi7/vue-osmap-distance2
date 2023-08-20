<template>
  <div class="about">
    <section class="section">
      <button class="calButton" v-on:click="calStart">消費開始</button>
      <button class="calButton" v-on:click="calStop">休憩</button> 
      <div class="container">               
        <article class="message is-primary" style="border: 1px solid #023a0d">
          <div class="message-header">
            <p>本日の消費カロリー</p>
          </div>
          <div class="message-body">
            <p>{{cal}} kcal / {{targetCal}} kcal</p>
          </div>
        </article>
      </div>
      <br>
      <br>
      <div class="regist-food">
        <label class="my-file-input"><input type="File" id="selectedFile" @change = "imageUpload"/>食べ物を登録</label><br>    
      </div>
      <div class="imageResult">
        <p>[登録された食べ物]<br>名前：「{{foodName}}」 <br> カロリー：{{foodCal}} kcal</p>
      </div>
    </section>
    <br>
      <br>
    <div class="distance-detail">
      -------------移動距離詳細--------------<br>

      ＜現在地＞<br>
      緯度：{{lat2}}   経度：{{lng2}}<br>
      ＜10秒前の地点＞<br>
      緯度：{{lat1}}   経度：{{lng1}}<br>
      ＜歩いた距離＞<br>
      １０秒間：{{dist}} km<br>
      合計：{{totalDist}} km<br>
      ＜username＞<br>
      {{loginUserName}} <br>
      <p>体重</p>
    <input type="number" id="weight" name="weight" required
       minlength="4" maxlength="8" size="10"><b>kg</b><br>
      -----------------------------------------<br>
    </div>

    <footer class="footer">
      <a></a>
    </footer>

  </div>
</template>

<style>
.calButton {
	text-align: center;
	vertical-align: middle;
	text-decoration: none;
	width: 100px;
  height:35px;
	margin: 10px;
	font-weight: bold;
	border-radius: 0.3rem;
	border-bottom: 7px solid #0686b2;
	background: #27acd9;
	color: #fff;
}
.calButton:hover {
	margin-top: 6px;
	border-bottom: 1px solid #0686b2;
	color: #fff;
}

.my-file-input {
  display: inline-block;
  padding: 5px;
  width: 200px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  background-color: rgb(85, 255, 187);
  color: rgb(5, 5, 5);
  box-shadow: #888 2px 2px 1px;
  cursor: pointer;
}
.my-file-input:hover {
  background-color: rgb(136, 255, 213);
}
.my-file-input:hover {
  background-color: rgb(136, 255, 233);
}
.my-file-input:active {
  box-shadow: #888888 1px 1px 1px;
  position: relative;
  top: 1px; left: 1px;
}
.my-file-input input {
  display: none;
}
</style>

<script>
import  axios from 'axios' 
import { Auth } from 'aws-amplify';

export default {
  data() {
    return {
      loginUserName:"",

      targetCal:0,

      selectedImageData:null,

      lat1: 0,
      lng1: 0,
      lat2: 0,
      lng2: 0,
    
      dist: 0,
      totalDist: 0,
      cal:0,

      isExecuteCal:false,

      foodName:"",
      foodCal:0
    }
  },
  mounted() {
      //ユーザー情報取得
      this.currentAuthenticatedUser();

      window.onload = ()=>{
          //目標消費カロリーと現在の消費カロリーを取得
          this.requestServerGetcalinfo()
      }    
  },
  methods: {
    //API実行メソッド
    //--消費カロリー登録
    requestServerRegistburncal: function(){ 
      const path = "https://352c29mrh4.execute-api.us-east-1.amazonaws.com/v1/registburncal"
      const requestbody = 
      {
        username:this.loginUserName,
        cal: this.cal
      }
      return new Promise((resolve, reject) => { 
        axios 
          .post(path, requestbody) 
          .then(response => { 
             resolve(response.data) 
             alert("消費したカロリーを登録しました。")
          }).catch(error => { 
              reject(error) 
              alert("消費したカロリーの登録に失敗しました。[" + error + "]")
          }) 
      }).catch((e) => { 
        throw e 
      }) 
    },
    
    //--カロリー情報取得
    requestServerGetcalinfo: async function(){ 
      const path = "https://352c29mrh4.execute-api.us-east-1.amazonaws.com/v1/getcalinfo" + "?username=" + this.loginUserName
      return new Promise((resolve, reject) => { 
        axios 
          .get(path) 
          .then(response => { 
             resolve(response.data)       
             this.targetCal = Number(response.data.target)
             this.cal = response.data.burn
          }).catch(error => { 
              reject(error) 
              alert("ユーザーのカロリー情報取得に失敗しました。[" + error + "]")
          }) 
      }).catch((e) => { 
        throw e 
      }) 
    },   

    //--画像解析
    requestServerCallComputerVision: async function(){ 
      const path = "https://352c29mrh4.execute-api.us-east-1.amazonaws.com/v1/getfoodcal"
      const requestbody = this.selectedImageData
      return new Promise((resolve, reject) => { 
        axios 
          .post(path, requestbody)
          .then(response => { 
             resolve(response.data)
             this.targetCal += Number(response.data.value)
          }).catch(error => { 
              reject(error) 
              alert("画像解析に失敗しました。[" + error + "]")
          }) 
      }).catch((e) => { 
        throw e 
      }) 
    },
    
        //--食べ物登録
    requestServerRegistFood: async function(id){ 
      const path = "https://352c29mrh4.execute-api.us-east-1.amazonaws.com/v1/registfood"
      const requestbody = 
      {
        username:this.loginUserName,
        foodid: id
      }
      return new Promise((resolve, reject) => { 
        axios 
          .post(path, requestbody) 
          .then(response => { 
             resolve(response.data) 
             alert("本日の食事内容に「" + this.foodName + "」" + "を登録しました。")
          }).catch(error => { 
              reject(error) 
              alert("食べ物の登録に失敗しました。[" + error + "]")
          }) 
      }).catch((e) => { 
        throw e 
      }) 
    },

    //ユーザー情報取得処理
    currentAuthenticatedUser:async function () {
      try {
        const user = await Auth.currentAuthenticatedUser({
          bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        });
        this.loginUserName = user.username
      } catch(err) {
        console.log(err);
      }
    },
   
    //カロリー消費開始処理
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
      var response = await this.requestServerRegistburncal()
      console.log(response)
      alert( "カロリー消費計算を停止します。" )
      this.isExecuteCal = false;
    },

    imageUpload: async function () {
      const self = this;
      let selectedFile = document.getElementById('selectedFile').files[0];
      if (selectedFile) {
        const reader = new FileReader();

        // ファイルの読み込みが完了したときの処理
        reader.onload = async function (e) {
          const arrayBuffer = e.target.result;
          let binaryString = "";
          const bytes = new Uint8Array(arrayBuffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binaryString += String.fromCharCode(bytes[i]);
          }
          const encodedData = btoa(binaryString)
          self.selectedImageData = encodedData;
          var response = await self.requestServerCallComputerVision()
          //解析結果
          self.foodName = response.name
          self.foodCal = Number(response.value)
          const foodID = response.id

          //解析結果の登録
          await self.requestServerRegistFood(foodID)

        };
        reader.readAsArrayBuffer(selectedFile);
      }else{
        alert("画像が選択されていません。")
      }
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
      if (self.targetCal !== "" && self.targetCal <= self.cal) {
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
