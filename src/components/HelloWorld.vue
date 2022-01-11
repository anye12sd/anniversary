<template>
  <div class="hello">
    <div class="header-text another-cursor">n551w1</div>
    <div class="header-text2 another-cursor">n551w1</div>
    <div class="project-list flex">
      <div class="project-list__col flex-1 flex">
        <template v-for="(item, index) in leftList">
          <div :key="index" class="project-preview project-preview--vertical"
               :class="{'project-preview--right-aligned': index%2 == 1}">
            <img :src="item.img" alt="" class="project-list__col-left-img" @click="toScroll(index)">
            <div class="change-color"></div>
            <div class="project-preview__text">{{ item.title }}</div>
          </div>
        </template>
      </div>
      <div class="project-list__col flex-1 flex">
        <template v-for="(item, index) in rightList">
          <div :key="index" class="project-preview project-preview--vertical"
               :class="{'project-preview--right-aligned': index%2 == 0}">
            <img :src="item.img" alt="" class="project-list__col-right-img">
            <div class="change-color"></div>
            <div class="project-preview__text">{{ item.title }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="time another-cursor">{{ time }}</div>
  </div>
</template>

<script>
let json = [
  {id: 1, img: require('../assets/img/1.jpg'), title: '标题'},
  {id: 2, img: require('../assets/img/2.jpg'), title: '标1'},
  {id: 3, img: require('../assets/img/3.jpg'), title: '标题2'},
  {id: 4, img: require('../assets/img/8.jpg'), title: '标题3'},
  {id: 5, img: require('../assets/img/5.jpg'), title: '标题4'},
  {id: 6, img: require('../assets/img/6.jpg'), title: '标题5'},
  {id: 6, img: require('../assets/img/7.jpg'), title: '标题5'},
  {id: 6, img: require('../assets/img/4.jpg'), title: '标题5'},
]
export default {
  name: 'HelloWorld',
  data() {
    return {
      json,
      leftList: [],
      rightList: [],
      time: '1314'
    }
  },
  mounted() {
    this.fetch()
    this.getPastTime()
  },
  methods: {
    fetch() {
      for (let i = 0; i < this.json.length; i++) {
        if (i % 2 == 1) {
          this.rightList.push(json[i])
        } else {
          this.leftList.push(json[i])
        }
      }
      this.$api.getList().then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    getPastTime() {
      let timeNow = new Date().getTime()
      let timeBefore = new Date('2021/12/20 23:59:59').getTime()
      this.time = Math.ceil((timeNow - timeBefore) * 0.001 / 3600 / 24)
    }
    ,
    toScroll() {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
