<template>
  <div>
    <div class="hello">
      <div class="header-text another-cursor">n551w1</div>
      <div class="header-text2 another-cursor" v-if="showLoading">n551w1</div>
      <div class="project-list flex">
        <div class="project-list__col flex-1 flex project-left">
          <template v-for="(item, index) in leftList">
            <div :key="index" class="project-preview project-preview--vertical" @click="goIndex(index, 2 * index)"
                 :class="['project-' + index, {'project-preview--right-aligned': index%2 === 1}]">
              <img :src="item.imgUrl" alt="" class="project-list__col-left-img">
              <div class="change-color"></div>
              <div class="project-preview__text">{{ item.title }}</div>
            </div>
          </template>
        </div>
        <div class="project-list__col flex-1 flex project-right">
          <template v-for="(item, index) in rightList">
            <div :key="index" class="project-preview project-preview--vertical" @click="goRightIndex(index, 2 * index + 1)"
                 :class="{'project-preview--right-aligned': index%2 === 0}">
              <img :src="item.imgUrl" alt="" class="project-list__col-right-img">
              <div class="change-color"></div>
              <div class="project-preview__text">{{ item.title }}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="time another-cursor">{{ time }}</div>
    </div>
    <div class="header" v-if="swiperShow" @click="closeSwiper()">
      <div class="close-icon">
        <img src="../assets/img/close.png" alt="">
      </div>
    </div>
    <div class="swiper-container" v-if="swiperShow">
      <div class="swiper-box">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in json" :key="index">
            <img :src="item.imgUrl" alt="" style="height: 100%"/>
          </div>
        </div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- 如果需要滚动条 -->
        <!--    <div class="swiper-scrollbar"></div>-->
      </div>
    </div>
  </div>

</template>

<script>
import $ from 'jquery'
import Swiper from 'swiper'
export default {
  name: 'HelloWorld',
  data() {
    return {
      json: [],
      leftList: [],
      rightList: [],
      time: '1314',
      showLoading: false,
      page: 0,
      lastPage: 100,
      swiper: "",
      swiperShow: false,
      total: "",
      currentIndex: ""
    }
  },
  mounted() {
    this.fetch()
    this.getPastTime()
    let that = this;
    this.$nextTick(() => {
      // this.initScroll()
      window.onscroll = function () {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight =
            document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight == scrollHeight) {
          //写后台加载数据的函数 一定要用that
          that.fetch()
        }
      };
    })
  },
  methods: {
    fetch() {
      this.page += 1
      if(this.page > this.lastPage){
        this.$message.info("已经到底了")
        return
      }
      let data = {
        page: this.page
      }
      this.showLoading = true
      this.$api.getList(data).then((res) => {
        console.log(res)
        this.showLoading = false
        if(res.code === 200){
          this.lastPage = res.data.lastPage
          this.total = res.data.total
          this.json = this.json.concat(res.data.result)
          this.rightList = []
          this.leftList = []
          for (let i = 0; i < this.json.length; i++) {
            if (i % 2 === 1) {
              this.rightList.push(this.json[i])
            } else {
              this.leftList.push(this.json[i])
            }
          }
        }else{
          this.$message.error("列表获取失败")
        }
      })
    },
    getPastTime() {
      this.showLoading = true
      this.$api.getTime().then((res) => {
        this.showLoading = false
        if(res.code === 200){
          let timeNow = new Date().getTime()
          let timeBefore = new Date(res.msg[0].time).getTime()
          this.time = Math.ceil((timeNow - timeBefore) * 0.001 / 3600 / 24)
        }else{
          this.$message.error("时间获取失败")
        }
      })
    },
    goIndex(index,swiperIndex) {
      if(swiperIndex%10 === 9){
        this.fetch()
      }
      this.swiperShow = true
      let that = this
      this.$nextTick(() => {
        that.swiper = new Swiper ('.swiper-box', {
          loop: false,
          // 如果需要前进后退按钮
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          // 如果需要滚动条
          // scrollbar: '.swiper-scrollbar',
          //如果需要自动切换海报
          // autoplay: {
          //   delay: 1000,//时间 毫秒
          //   disableOnInteraction: false,//用户操作之后是否停止自动轮播默认true
          // },
          onSlideChangeEnd: function(swiper){
            //切换结束时，告诉我现在是第几个slide
            that.currentIndex = swiper.activeIndex
            if(swiper.activeIndex%10 === 9 && Math.ceil(swiper.activeIndex/10) >= that.page){
              that.fetch()
            }
          }
        })
        that.swiper.slideTo(swiperIndex, 0, false);//切换到第一个slide，速度为1秒
      })
      // let navPage = document.querySelectorAll(".project-left .project-preview")
      // let windowHeight = $(window).height()
      // let docHeight = navPage[index].offsetHeight
      // let scrollH = navPage[index].offsetTop - (windowHeight - docHeight)*0.5
      // $("html,body").animate({scrollTop: scrollH}, 500)
    },
    goRightIndex(index,swiperIndex){
      if(swiperIndex%10 === 9){
        this.fetch()
      }
      this.swiperShow = true
      let that = this
      this.$nextTick(() => {
        that.swiper = new Swiper ('.swiper-box', {
          loop: false,
          // 如果需要前进后退按钮
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          // 如果需要滚动条
          // scrollbar: '.swiper-scrollbar',
          //如果需要自动切换海报
          // autoplay: {
          //   delay: 1000,//时间 毫秒
          //   disableOnInteraction: false,//用户操作之后是否停止自动轮播默认true
          // },
          onSlideChangeEnd: function(swiper){
            //切换结束时，告诉我现在是第几个slide
            that.currentIndex === swiper.activeIndex
            if(swiper.activeIndex%10 === 9 && Math.ceil(swiper.activeIndex/10) >= that.page){
              that.fetch()
            }
          }
        })
        that.swiper.slideTo(swiperIndex, 0, false);//切换到第一个slide，速度为1秒
      })
      // let navPage = document.querySelectorAll(".project-right .project-preview")
      // let windowHeight = $(window).height()
      // let docHeight = navPage[index].offsetHeight
      // let scrollH = navPage[index].offsetTop - (windowHeight - docHeight)*0.5
      // $("html,body").animate({scrollTop: scrollH}, 500)
    },
    closeSwiper(){
      this.swiperShow = false
      if(this.currentIndex % 2 == 0){
        let navPage = document.querySelectorAll(".project-left .project-preview")
        let windowHeight = $(window).height()
        let docHeight = navPage[this.currentIndex/2].offsetHeight
        let scrollH = navPage[this.currentIndex/2].offsetTop - (windowHeight - docHeight)*0.5
        $("html,body").animate({scrollTop: scrollH}, 500)
      }else{
        let navPage = document.querySelectorAll(".project-right .project-preview")
        let windowHeight = $(window).height()
        let docHeight = navPage[Math.ceil(this.currentIndex / 2)].offsetHeight
        let scrollH = navPage[Math.ceil(this.currentIndex / 2)].offsetTop - (windowHeight - docHeight)*0.5
        $("html,body").animate({scrollTop: scrollH}, 500)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.swiper-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  transition: .5s ease;
}

.swiper-wrapper .swiper-slide{
  width: 100%;
  height: 100%;
  background-color: #fff;
  text-align: center;
}

.swiper-button-next{
  background-image: none;
  background-color: transparent;
  width: 50%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  margin-top: 0;
  cursor: url(../assets/img/next-cursor.png) 0 0,pointer;
  cursor: -webkit-image-set(url(../assets/img/next-cursor.png) 1x,url(../assets/img/next-cursor.png) 2x) 0 0,pointer;
}
.swiper-button-prev{
  background-image: none;
  background-color: transparent;
  width: 50%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  margin-top: 0;
  cursor: url(../assets/img/prev-cursor.png) 0 0,pointer;
  cursor: -webkit-image-set(url(../assets/img/prev-cursor.png) 1x,url(../assets/img/prev-cursor.png) 2x) 0 0,pointer;
}
.swiper-box{
  overflow: hidden;
}
.header{
  padding-left: 20px;
  padding-top: 20px;
  z-index: 15;
}
</style>
