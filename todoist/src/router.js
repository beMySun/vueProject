import Vue from 'vue'
import VueRouter from 'vue-router'
import InBox from './pages/InBox'
import NextDay from './pages/NextDay'
import NextWeek from './pages/NextWeek'

Vue.use(VueRouter)

let router = new VueRouter()

router.map({
  '/inbox': {
    component: InBox
  },
  '/nextday': {
    component: NextDay
  },
  '/nextweek': {
    component: NextWeek
  }
})

export default router
