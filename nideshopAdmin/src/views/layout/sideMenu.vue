<template>
  <aside class="main-sidebar animated" :class="{ showSlide: sidebar.show, hideSlide: !sidebar.show, expandSide:(!sidebar.collapsed||device.isMobile)}">
    <el-scrollbar tag="div" wrapClass="vue-scrollbar" v-if="(!sidebar.collapsed||device.isMobile)">
      <div class="sidebar">
        <el-menu :default-active="onRoutes"
                 :default-openeds="onRouteKeys"
                 class="el-menu-style"
                 :unique-opened="true"
                  router :collapse="sidebar.collapsed&&!device.isMobile" @select="handleSelect">
            <sub-menu :param="item" v-for="item in menuList" :key="item.id"></sub-menu>
        </el-menu>
      </div>
    </el-scrollbar>
    <div class="sidebar" v-else>
      <el-menu :default-active="onRoutes"
               class="el-menu-style"
                router :collapse="sidebar.collapsed&&!device.isMobile" @select="handleSelect">
          <sub-menu :param="item" v-for="item in menuList" :key="item.id"></sub-menu>
      </el-menu>
    </div>
  </aside>
</template>
<script>
import subMenu from './subMenu.vue'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  props: {
    show: Boolean
  },
  data () {
    return {}
  },
  components: {
    subMenu
  },
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      device: 'device'
    }),
    onRoutes () {
      return this.$route.path
    },
    onRouteKeys () {
      const getParentArray = (path, ms, kas = []) => {
        if (ms && ms.length > 0) {
          for (let k = 0, length = ms.length; k < length; k++) {
            if (path === ms[k].href) {
              kas.push(ms[k].href)
              break
            }
            let i = kas.length
            if (ms[k].children && ms[k].children.length > 0) {
              getParentArray(path, ms[k].children, kas)
            }
            if (i < kas.length) {
              kas.push(ms[k].href)
            }
          }
        }
        return kas.reverse()
      }
      return getParentArray(this.$route.path, this.menuList)
    },
    ...mapGetters([
      'menuList'
    ])
  },
  mounted () {

  },
  created: function () {
    this.loadMenuList().then(() => {
      // this.changeCurrentMenu(this.$router.currentRoute)
    })
  },
  methods: {
    handleSelect () {
      if (this.device.isMobile) {
        this.toggleSidebarShow(false)
      }
    },
    ...mapMutations({
      toggleSidebarShow: 'TOGGLE_SIDEBAR_SHOW'
    }),
    ...mapActions({
      loadMenuList: 'loadMenuList',
      changeCurrentMenu: 'changeCurrentMenu'
    })
  }
}
</script>
<style>
  .showSlide {
    animation-duration: .2s;
    animation-name: slideInLeft;
  }

  .hideSlide {
    animation-duration: .2s;
    animation-name: slideOutLeft;
  }

  .main-sidebar {
    background-color: #ffffff;
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    height: calc(100vh - 50px);
    width: 55px;
    z-index: 810;
    -webkit-transition: -webkit-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  }

  .expandSide {
    width: 230px;
  }

  .el-menu-style,
  .el-menu-style .el-menu{
    background-color: #ffffff;
  }
  .el-menu-style .el-menu-item:hover,
  .el-menu-style .el-submenu__title:hover{
    background-color: #eeeeee !important;
  }

  .el-menu-style .el-submenu .el-menu-item {
    height: 45px;
    line-height: 45px;
  }

  .el-menu-style .el-menu-item,
  .el-menu-style .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }

  .main-sidebar .el-menu--collapse {
    width: 55px;
  }

/*  .main-sidebar .el-menu--collapse>.el-menu-item,
  .main-sidebar .el-menu--collapse>.el-submenu>.el-submenu__title {
    padding-left: 13px !important;
  }*/

  .vue-scrollbar{
    background-color: #ffffff !important;
    height: calc(100vh - 50px)
  }

  .main-sidebar .el-scrollbar__bar.is-vertical{
    display: none;
  }

  .sidebar{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: scroll;
  }

  .el-menu {
    min-height: 100%;
    border-right: unset;
  }

  .el-menu-item i {
    color: unset;
  }
  .el-submenu__title i {
    color: unset;
  }
</style>
