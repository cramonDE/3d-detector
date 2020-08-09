<template>
  <div class="end-page">
    <div class="end-main">
      <div class="end-logo"></div>
      <div class="end-figure"></div>
      <div class="end-mid">
        <h1 class="end-tit">探索成绩</h1>
        <div class="end-list">
          <div class="end-item">
            <div class="end-item-l">
              <p class="end-item-tit">收集矿石?/30</p>
              <p class="end-item-txt">Count</p>
            </div>
            <div class="end-item-r">{{data.count}}</div>
          </div>
          <div class="end-item">
            <div class="end-item-l">
              <p class="end-item-tit">使用时间?/60</p>
              <p class="end-item-txt">Time</p>
            </div>
            <div class="end-item-r">{{data.time}}</div>
          </div>
        </div>
      </div>
      <div class="end-footer">
        <button class="end-btn-l" @click="handleReplay"></button>
        <button class="end-btn-m"></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'End',

  props: {
    data: {
      type: Object,
      default() {
        return {
          count: 0,
          time: 60,
        }
      }
    }
  },

  mounted() {
   
  },

  methods: {
    handleReplay() {
      this.$emit('onReplay');
    }
  }
}
</script>

<style>
.end-page {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
.end-main {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/end/bg.png');
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
}
.end-logo {
  position: absolute;
  z-index: 2;
  right: 15px;
  top: 14px;
  background-image: url('../assets/images/end/end-logo.png');
  background-size: 100% 100%;
  width: 108px;
  height: 25px;
}
.end-figure {
  margin: 0 auto;
  background-image: url('../assets/images/end/figure.png');
  width: 352px;
  height: 188px;
  background-size: 100% 100%;
}
.end-mid {
}
.end-tit {
  font-size: 23px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  padding-bottom: 12px;
}
.end-list {
  width: 100vw;
  padding: 0 30px;
  box-sizing: border-box;
}
.end-item {
  display: flex;
  align-items: center;
}
.end-item-tit {
  color: #fff;
  font-weight: bold;
  font-size: 17px;
}
.end-item-txt {
  color: rgba(255, 255, 255, .5);
  font-size: 12px;
}
.end-item-l {
  flex: 1;
  min-width: 0;
}
.end-item-r {
  color: #fff;
  font-size: 19px;
  text-align: center;
  width: 24.8%;
  font-weight: bold;
}
.end-item {
  background-image: url('../assets/images/end/data-bg.png');
  width: 100%;
  height: 70px;
  background-size: 100% 100%;
  padding-left: 7%;
  padding-bottom: 8px;
  box-sizing: border-box;
}

.end-footer {
  display: flex;
  background-image: url('../assets/images/end/btn-group.png');
  background-size: 100% 100%;
  width: 322px;
  height: 89px;
  margin: 0 auto;
}
.end-btn-l {
  width: 60%;
  height: 89px;
}
.end-btn-m {
  width: 39%;
  height: 89px;
}
</style>
