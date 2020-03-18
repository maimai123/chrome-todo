Vue.use(window.VueAwesomeSwiper);
const bg = chrome.extension.getBackgroundPage();
const default_logo = 'https://cdn.wangcaihr.cn/wangcai/20200228174255492.png';

const TODO_TYPE = {
	entry: '<strong>{count}</strong> 将于今日入职',
	arrangeInterview: '有 <strong>{count}</strong> 人待安排面试',
	reject: '<strong>{count}</strong> 拒绝了offer',
	allocating: '有 <strong>{count}</strong> 名名新候选人待分配',
	interview: '有 <strong>{count}</strong> 场面试',
	guide: '来自拉勾的 <strong>{count}</strong> 名新候选人待导入',
	accept: '<strong>{count}</strong> 接受了offer',
	remark: '{text}'
};

var vm = new Vue({
  el:"#app",
  data() {
    let self = this
    return {
      isLogin: true,
      user: {},
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: true,
        slideToClickedSlide:true,
        on: {
          click: () => {
            let index = this.swiper.clickedIndex;
            self.handleChangeCurrent(index)
          }
        }
      },
      list: [],
      datas: []
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  async mounted () {
    this.swiper.slideTo(3, 1000, false);
    try {
      await bg.fetchWeekList().then(data => { this.list = data;});
      await bg.fetchUserInfo().then(data => { this.user = data;});
      await bg.fetchRemindData().then(data => {
        this.datas = this.formatData(data);
      });
    } catch (err) {
      this.isLogin = false;
    }
  },
  beforeDestroy () {
    this.swiper = null;
  },
  methods: {
    formatData (data) {
      const list = {};
      Object.keys(data).filter(item => {
        if ((Array.isArray(data[item]) && data[item].length) || (!Array.isArray(data[item]) && data[item])) {
          list[item] = data[item];
        }
      })
      return list;
    },
    handleChangeCurrent (index) {
      if (index === undefined || index < 0 || index > 6) return;
      bg.fetchRemindData(this.list[index].date).then(data => {
        this.datas = this.formatData(data);
      }).catch(err => {
        this.isLogin = false;
      });
    },
    handleLogin () {
      window.open("https://www.baidu.com");
    },
  }
})
