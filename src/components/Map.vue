<template>
  <div id="mapid"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: 'Map',
  mounted() {
    // マップオブジェクト生成
    // データソースはOpenStreetMap
    const map = L.map("mapid").addLayer(
      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
      })
    );
    // 位置情報検索
    setInterval(() => {
      map.locate({ setView: true, maxZoom: 20, zoom: 20 });
    }, 5000);
    // map.locate({ setView: true, maxZoom: 10 });
    // 位置情報取得成功処理
    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(map);
      //.bindPopup("You are within " + radius + " meters from this point")
      //.openPopup();
      L.circle(e.latlng, radius).addTo(map);
    }
    map.on("locationfound", onLocationFound);
    // 位置情報取得エラー処理
    function onLocationError(e) {
      alert(e.message);
    }
    map.on("locationerror", onLocationError);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html,
body,
#app,
#mapid {
  height: 600px;
}
body {
  margin: 0;
}
</style>
